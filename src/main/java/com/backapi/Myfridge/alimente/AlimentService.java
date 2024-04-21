package com.backapi.Myfridge.alimente;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.backapi.Myfridge.user.User;
import com.backapi.Myfridge.user.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Service
public class AlimentService {
	
	@PersistenceContext
	private EntityManager entityManager;
	private AlimentRepository alimentRepository;
	private UserRepository userRepository;
	private final JdbcTemplate jdbcTemplate;
	
	@Autowired
	public AlimentService(AlimentRepository alimentRepository, UserRepository userRepository, JdbcTemplate jdbcTemplate) {
		this.alimentRepository = alimentRepository;
		this.userRepository = userRepository;
		this.jdbcTemplate = jdbcTemplate;
	}
	
	@Transactional
	public void createTableForUser(String userEmail) {
		String tableName = userEmail.replaceAll("[^a-zA-Z0-9]", "_");
        String createTableQuery = "CREATE TABLE IF NOT EXISTS " + tableName +
                " (id INT AUTO_INCREMENT PRIMARY KEY, " +
                "nume VARCHAR(255), expiration_date DATE, unitate_masura VARCHAR(255), cantitate DOUBLE);";

        entityManager.createNativeQuery(createTableQuery).executeUpdate();
	}
	
	@Transactional
	public List<AlimentRequest> getAllAlimentsForUser(String userEmail) {
		return alimentRepository.findAllByUserEmail(userEmail);
	}
	
	
	@Transactional
	public Integer adaugaAliment(AlimentRequest alimentRequest)
	{
		Aliment aliment = mapToAliment(alimentRequest);
		Aliment savedAliment = alimentRepository.save(aliment);
		return savedAliment.getId();
	}
	
	@Transactional
	public void actualizeazaAliment(AlimentRequest alimentRequest) {
		Aliment existingAliment = alimentRepository.findById(alimentRequest.getId())
                .orElseThrow(() -> new EntityNotFoundException("Aliment not found"));
		updateAlimentFromRequest(existingAliment, alimentRequest);
        alimentRepository.save(existingAliment);
	}
	
	@Transactional
	public void stergeAliment(String userEmail, Integer id) {
	    try {
	        Optional<Aliment> alimentOptional = alimentRepository.findById(id);
	        
	        if (alimentOptional.isPresent()) {
	            Aliment aliment = alimentOptional.get();
	            
	            // Remove the Aliment from the associated User's list if there is a User relationship
	            User user = aliment.getUser();
	            if (user != null) {
	                user.getAliments().remove(aliment);
	            }

	            alimentRepository.deleteById(id);
	        } else {
	            throw new EntityNotFoundException("Aliment not found with ID: " + id);
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        throw new RuntimeException("Error deleting aliment.");
	    }
	}
	
	private Aliment mapToAliment(AlimentRequest alimentRequest) {
		Aliment aliment = new Aliment();
		aliment.setNume(alimentRequest.getNume());
		aliment.setCantitate(alimentRequest.getCantitate());
		aliment.setExpirationDate(alimentRequest.getExpirationDate());
		aliment.setUnitateMasura(alimentRequest.getUnitateMasura());
		aliment.setUser(userRepository.findByEmail(alimentRequest.getEmail()).get());
		aliment.setOnList(alimentRequest.isOnList());
		
		return aliment;
	}
	
	private void updateAlimentFromRequest(Aliment aliment, AlimentRequest alimentRequest) {
        aliment.setNume(alimentRequest.getNume());
        aliment.setExpirationDate(alimentRequest.getExpirationDate());
        aliment.setUnitateMasura(alimentRequest.getUnitateMasura());
        aliment.setCantitate(alimentRequest.getCantitate());
        aliment.setOnList(alimentRequest.isOnList());
        
    }
	
}
