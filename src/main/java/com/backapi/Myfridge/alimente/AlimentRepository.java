package com.backapi.Myfridge.alimente;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backapi.Myfridge.user.User;

public interface AlimentRepository extends JpaRepository<Aliment, Integer> {
	 @Query("SELECT new com.backapi.Myfridge.alimente.AlimentRequest(a"
	 + ".user.email, a.id, a.nume, a.expirationDate, a.unitateMasura, a.cantitate, a.onList) "
	 + "FROM Aliment a WHERE a.user.email = :userEmail")
	    List<AlimentRequest> findAllByUserEmail(@Param("userEmail") String userEmail);
}
