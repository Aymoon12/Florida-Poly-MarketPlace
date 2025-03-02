package org.marketplace.marketplace.auth.authentication;

import lombok.RequiredArgsConstructor;
import org.marketplace.marketplace.auth.email.EmailService;
import org.marketplace.marketplace.auth.config.JwtService;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

	private final JwtService jwtService;
	private final UserRepository userRepository;
	private final EmailService emailService;

	public AuthenticationResponse register(){
		return new AuthenticationResponse();
	}

	public AuthenticationResponse authenticate() {
		return new AuthenticationResponse();
	}
}

