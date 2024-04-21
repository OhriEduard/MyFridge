package com.backapi.Myfridge.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.backapi.Myfridge.emailmodel.MailService;
import com.backapi.Myfridge.emailmodel.MailStructure;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
	
	private final AuthenticationService service;
	private final MailService mailService;
	
	@Autowired
    public AuthenticationController(AuthenticationService service, MailService mailService) {
        this.service = service;
        this.mailService = mailService;
    }
	
	@PostMapping("/register")
	public ResponseEntity<String> register(
			@RequestBody RegisterRequest request){
		return ResponseEntity.ok().body("{\"message\": \""
				+ service.register(request)
				+ "\"}");
	}
	
	@GetMapping("/confirm")
    public RedirectView confirmEmail(@RequestParam("token") String jwtToken) {
        service.confirm(jwtToken);
        
        RedirectView redirectView = new RedirectView();
        redirectView.setUrl("http://127.0.0.1:5500/src/main/resources/static/index.html");

        return redirectView;
    }
	
	@PostMapping("/authenticate")
	public ResponseEntity<AuthenticationResponse> register(
			@RequestBody AuthenticationRequest request) throws UnconfirmedUserException{
			return ResponseEntity.ok(service.authenticate(request));
	}
}
