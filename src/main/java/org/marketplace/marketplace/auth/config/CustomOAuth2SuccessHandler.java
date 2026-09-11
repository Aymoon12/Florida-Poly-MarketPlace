package org.marketplace.marketplace.auth.config;

import java.io.IOException;

import org.marketplace.marketplace.entities.Role;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Component
@RequiredArgsConstructor
@Log4j2
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

	private final JwtService jwtService;
	private final UserRepository userRepository;

	@Value( "${app.frontend-url:http://localhost:5173}" )
	private String frontendUrl;

	@Override
	public void onAuthenticationSuccess( HttpServletRequest request, HttpServletResponse response,
			Authentication authentication ) throws IOException {

		OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
		String email = oauth2User.getAttribute( "email" );

		// Validate Florida Poly email domain
		if ( email == null || !email.endsWith( "@floridapoly.edu" ) ) {
			log.warn( "Unauthorized login attempt with non-Florida Poly email: {}", email );
			response.sendRedirect( frontendUrl + "/unauthorized?reason=invalid_domain" );
			return;
		}

		String name = oauth2User.getAttribute( "name" );
		if ( name != null && name.contains( "," ) ) {
			String[] last_first = name.split( "," );
			name = last_first[1].trim() + " " + last_first[0].trim();
		}

		User existingUser = userRepository.findUserByEmail( email ).orElse( null );

		if ( existingUser == null ) {
			User user = User.builder().email( email ).name( name ).role( Role.USER ).build();
			userRepository.save( user );
			existingUser = user;
			log.info( "Created new user: {}", email );
		}

		redirectToDashboard( response, existingUser );
	}

	private void redirectToDashboard( HttpServletResponse response, User user ) throws IOException {

		String jwtToken = jwtService.generateToken( user );

		// Set JWT as HTTP-only cookie for security (token is NOT exposed in URL)
		Cookie jwtCookie = new Cookie( "jwt", jwtToken );
		jwtCookie.setHttpOnly( true );
		jwtCookie.setSecure( false ); // Set to true in production with HTTPS
		jwtCookie.setPath( "/" );
		jwtCookie.setMaxAge( 86400 ); // 24 hours
		jwtCookie.setAttribute( "SameSite", "Lax" );
		response.addCookie( jwtCookie );

		// Redirect to home - frontend will fetch user info via /api/v1/auth/me
		log.info( "User {} logged in successfully", user.getEmail() );
		response.sendRedirect( frontendUrl + "/home" );
	}

}
