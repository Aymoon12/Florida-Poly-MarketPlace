package org.marketplace.marketplace.auth.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

	private final UserDetailsService userDetailsService;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;

	@Value("${app.frontend-url:http://localhost:5173}")
	private String frontendUrl;

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(List.of(frontendUrl));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true); // Important for cookies
		configuration.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	@Bean
	public SecurityFilterChain securityFilterChain( HttpSecurity http ) throws Exception {

		return http.cors( cors -> cors.configurationSource(corsConfigurationSource()) )
				.csrf( AbstractHttpConfigurer::disable )
				.authorizeHttpRequests( req -> {
					req.requestMatchers( "/api/v1/auth/**" ).permitAll()
							.requestMatchers( "/api/v1/s3/**" ).permitAll()
							.requestMatchers( "/ws/**" ).permitAll() // WebSocket endpoint
							.requestMatchers( "/admin_only/**" ).hasAuthority( "ADMIN" )
							.requestMatchers( "/login/**" ).permitAll()
							.requestMatchers( "/api/v1/dev/**" ).permitAll() // Dev endpoints (only active with 'dev' profile)
							.requestMatchers( "/api/v1/oauth/**" ).permitAll()
							.anyRequest().authenticated();

				} )
				// Return 401 for unauthenticated API requests instead of redirecting to OAuth2 login
				.exceptionHandling( exceptions -> {
					exceptions.defaultAuthenticationEntryPointFor(
							new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
							new AntPathRequestMatcher("/api/**")
					);
				} )
				.oauth2Login( oauth2 -> {
					oauth2.successHandler( customOAuth2SuccessHandler ).failureUrl( "/login?error=true" );

				} ).userDetailsService( userDetailsService )
				.sessionManagement( session -> session.sessionCreationPolicy( SessionCreationPolicy.STATELESS ) )
				.addFilterBefore( jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class ).build();

	}
}
