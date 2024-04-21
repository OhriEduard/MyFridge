package com.backapi.Myfridge.alimente;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@AllArgsConstructor
public class AlimentRequest {
	
	private String email;
	private Integer id=0;
	private String nume;
	private LocalDate expirationDate;
	private String unitateMasura;
	private Double cantitate;
	private boolean onList;
	
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getNume() {
		return nume;
	}
	public void setNume(String nume) {
		this.nume = nume;
	}
	public LocalDate getExpirationDate() {
		return expirationDate;
	}
	public void setExpirationDate(LocalDate expirationDate) {
		this.expirationDate = expirationDate;
	}
	public String getUnitateMasura() {
		return unitateMasura;
	}
	public void setUnitateMasura(String unitateMasura) {
		this.unitateMasura = unitateMasura;
	}
	public Double getCantitate() {
		return cantitate;
	}
	public void setCantitate(Double cantitate) {
		this.cantitate = cantitate;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public boolean isOnList() {
		return onList;
	}
	public void setOnList(boolean onList) {
		this.onList = onList;
	}
	
	
	
}
