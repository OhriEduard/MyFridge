package com.backapi.Myfridge.emailmodel;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MailStructure {
	
	private String subject;
	
	private String message;
}
