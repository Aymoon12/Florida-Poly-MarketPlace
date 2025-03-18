package org.marketplace.marketplace.auth.config;

import java.io.IOException;

import org.marketplace.marketplace.entities.Role;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

	private final JwtService jwtService;
	private final UserRepository userRepository;

	@Override
	public void onAuthenticationSuccess( HttpServletRequest request, HttpServletResponse response,
			Authentication authentication ) throws IOException {

		OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
		String email = oauth2User.getAttribute( "email" ); // Use the email as the username

		System.out.println( email );
		String name = oauth2User.getAttribute( "name" );
		assert name != null;
		String[] lastfirst = name.split( "," );
		System.out.println( lastfirst[0] );
		System.out.println( lastfirst[1].substring( 1 ) );
		name = lastfirst[1].substring( 1 ) + " " + lastfirst[0];

		System.out.println();

		User existingUser = userRepository.findUserByEmail( email ).orElse( null );

		if ( existingUser == null ) {
			User user = User.builder().email( email ).name( name ).role( Role.USER ).build();
			userRepository.save( user );
			existingUser = user;
		}

		redirectToDashboard( response, existingUser );
	}

	private void redirectToDashboard( HttpServletResponse response, User user ) throws IOException {

		String jwtToken = jwtService.generateToken( user );
		String redirectUrl = UriComponentsBuilder.fromUriString( "http://localhost:5173/home" )
				.queryParam( "userId", user.getID() ).queryParam( "token", jwtToken ).build().toUriString();
		response.sendRedirect( redirectUrl );
	}

}
