package org.marketplace.marketplace.auth.config;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.marketplace.marketplace.entities.Role;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import org.marketplace.marketplace.entities.User;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

	private final JwtService jwtService;
	private final UserRepository userRepository;


	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
		OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
		String email = oauth2User.getAttribute("email"); // Use the email as the username

		System.out.println(email);
		String name =  oauth2User.getAttribute("name");
		assert name != null;
		String[] lastfirst = name.split(",");
		System.out.println(lastfirst[0]);
		System.out.println(lastfirst[1].substring(1));
		name = lastfirst[1].substring(1) + " " + lastfirst[0];



		System.out.println();

		User existingUser = userRepository.findUserByEmail(email).orElse(null);

		if (existingUser == null) {
			User user = User.builder()
					.email(email)
					.name(name)
					.role(Role.USER)
					.build();
			userRepository.save(user);
			existingUser = user;
		}

		redirectToDashboard(response, existingUser);



//
//		String jwtToken = jwtService.generateToken(existingUser);
//
//		// Set the token in an HttpOnly cookie
//		Cookie cookie = new Cookie("jwt", jwtToken);
//		cookie.setHttpOnly(true);
//		cookie.setPath("/");
//		// Optionally, set cookie expiration, secure flag, etc.
//		response.addCookie(cookie);
//
//		// Optionally, you might want to redirect the user with the token as a query parameter:
//		response.sendRedirect("/home?token=" + jwtToken);
	}


	private void redirectToDashboard(HttpServletResponse response, User user) throws IOException {
		String jwtToken = jwtService.generateToken(user);
		String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/home")
				.queryParam("userId", user.getID())
				.queryParam("token", jwtToken)
				.build()
				.toUriString();
		response.sendRedirect(redirectUrl);
	}

}

