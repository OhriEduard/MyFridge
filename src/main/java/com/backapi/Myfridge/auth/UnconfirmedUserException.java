package com.backapi.Myfridge.auth;

import javax.naming.AuthenticationException;

public class UnconfirmedUserException extends AuthenticationException {

	public UnconfirmedUserException(String message) {
        super(message);
    }
}
