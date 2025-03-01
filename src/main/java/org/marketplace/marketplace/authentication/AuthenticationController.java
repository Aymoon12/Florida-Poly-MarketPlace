package org.marketplace.marketplace.authentication;

import com.nimbusds.openid.connect.sdk.AuthenticationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin
@RequiredArgsConstructor
public class AuthenticationController {

	private final AuthenticationService service;

	@PostMapping("/register")
	public ResponseEntity<AuthenticationResponse> register(@RequestBody
														   SignUpRequest registerRequest){
		return ResponseEntity.ok(service.register(registerRequest));
	}

	@PostMapping("/authenticate")
	public ResponseEntity<AuthenticationResponse> login(@RequestBody
														LoginRequest loginRequest){
		return ResponseEntity.ok(service.authenticate(loginRequest));

	}

	@PostMapping("/verifyOTP")
	public ResponseEntity<AuthenticationResponse> verifyOTP(@RequestBody
															OTPRequest otpRequest){

		return ResponseEntity.ok(service.verifyOTP(otpRequest));

	}

	@PostMapping("/sendPasswordResetLink")
	public ResponseEntity<Boolean> sendPasswordResetLink(@RequestParam String email){
		return ResponseEntity.ok(service.sendPasswordResetLink(email));
	}
	}
