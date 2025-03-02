package org.marketplace.marketplace.auth.config;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Configuration
@RequiredArgsConstructor
@Getter
public class ApplicationConfig {

	private final UserRepository userRepository;

	@Value("${jwt.secret}")
	private String jwtSecret;

	@Value("${jwt.expiration}")
	private long jwtExpirationMs;

	@Bean
	public UserDetailsService userDetailsService(){
		return username -> userRepository.findUserByEmail(username)
				.orElseThrow(() ->
						new UsernameNotFoundException("User not found"));
	}

}
