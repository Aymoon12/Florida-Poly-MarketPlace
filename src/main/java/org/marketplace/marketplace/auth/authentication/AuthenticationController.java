package org.marketplace.marketplace.auth.authentication;

import com.nimbusds.openid.connect.sdk.AuthenticationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin
@RequiredArgsConstructor
public class AuthenticationController {

	private final AuthenticationService service;

	@PostMapping("/register")
	public ResponseEntity<?> register(){
		return ResponseEntity.ok(service.register());
	}

	@PostMapping("/authenticate")
	public ResponseEntity<?> login(){
		return ResponseEntity.ok(service.authenticate());

	}

}
