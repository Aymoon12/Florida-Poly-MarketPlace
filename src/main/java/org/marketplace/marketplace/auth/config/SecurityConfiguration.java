package org.marketplace.marketplace.auth.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {


	private final UserDetailsService userDetailsService;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;


	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		return http
				.csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(
						req-> {
							req
									.requestMatchers("/api/v1/auth/**").permitAll()
									.requestMatchers("/api/v1/s3/**").permitAll()
									.requestMatchers("/admin_only/**").hasAuthority("ADMIN")
									.requestMatchers("/login/**").permitAll()
									.requestMatchers("/api/v1/oauth/**").permitAll()
									.anyRequest()
									.authenticated();

						})
				.oauth2Login(oauth2 -> {
					oauth2
							.successHandler(customOAuth2SuccessHandler)
							.failureUrl("/login?error=true");

				})
				.userDetailsService(userDetailsService)
				.sessionManagement(session->session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
				.build();



	}
}
