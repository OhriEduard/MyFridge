package com.backapi.Myfridge.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backapi.Myfridge.alimente.Aliment;
import com.backapi.Myfridge.alimente.AlimentRequest;
import com.backapi.Myfridge.alimente.AlimentService;

@RestController
@RequestMapping("/usertable")
public class UserController {
	private final AlimentService alimentService;
	
	@Autowired
    public UserController(AlimentService alimentService) {
        this.alimentService = alimentService;
    }
	
	@GetMapping("/{email:.+}")
	public List<AlimentRequest> getAlimentByUser(@PathVariable("email") String email) {
	    return alimentService.getAllAlimentsForUser(email);
	}
	
	@PostMapping("/{email}/adauga")
	public ResponseEntity<Integer> adaugaAliment(@RequestBody AlimentRequest alimentRequest) {
		Integer addedID = alimentService.adaugaAliment(alimentRequest);
		return new ResponseEntity<>(addedID, HttpStatus.OK);
	}
	
	@PutMapping("/{email}/update")
	public void actualizeazaAliment(@RequestBody AlimentRequest alimentRequest) {
		alimentService.actualizeazaAliment(alimentRequest);
	}
	
	@DeleteMapping("/{email}/sterge/{id}")
	public void stergeAliment(@PathVariable String email,@PathVariable Integer id ) {
		alimentService.stergeAliment(email, id);
	}
}
