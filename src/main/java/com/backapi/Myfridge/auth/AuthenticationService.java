package com.backapi.Myfridge.auth;

import javax.naming.AuthenticationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backapi.Myfridge.alimente.AlimentService;
import com.backapi.Myfridge.config.JwtService;
import com.backapi.Myfridge.emailmodel.MailService;
import com.backapi.Myfridge.emailmodel.MailStructure;
import com.backapi.Myfridge.user.User;
import com.backapi.Myfridge.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
	
	private final UserRepository repository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
	private final AlimentService alimentService;
	private final MailService mailService;
	
	@Autowired
    public AuthenticationService(
            UserRepository repository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            AlimentService alimentService,
            MailService mailService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.alimentService = alimentService;
        this.mailService = mailService;
    }

	public String register(RegisterRequest request) {
		User user = new User();
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAccountConfirmed(false);
		repository.save(user);
		
		var jwtToken = jwtService.generateToken(user);
		
		String confirmationLink = "http://localhost:8080/auth/confirm?token=" + jwtToken;
		String emailBody = mailService.prepareConfirmationEmail(user.getFirstname(), confirmationLink);
		MailStructure mailStructure = new MailStructure("Confirm your MYFridgeAccount", emailBody);
		
		mailService.sendMail(user.getEmail(), mailStructure);
		
		return "Mail succesfully sent !";
	}
	
	public AuthenticationResponse confirm(String jwtToken) {
		String userEmail = jwtService.extractUsername(jwtToken);
		User user = repository.findByEmail(userEmail).orElseThrow();
		if (!user.isConfirmed())
		{
			user.setAccountConfirmed(true);
			repository.save(user);
		}
		
		return AuthenticationResponse.builder().token(jwtToken).build();
	}

	public AuthenticationResponse authenticate(AuthenticationRequest request) throws UnconfirmedUserException {
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
		
		var user = repository.findByEmail(request.getEmail()).orElseThrow();
		
		 if (!user.isAccountConfirmed()) {
		        throw new UnconfirmedUserException("User account is not confirmed.");
		    }
		
		var jwtToken = jwtService.generateToken(user);
		return AuthenticationResponse.builder().token(jwtToken).build();
	}
	
}
