package org.marketplace.marketplace.controllers;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.marketplace.marketplace.entities.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@CrossOrigin(origins = "${app.frontend-url:http://localhost:5173}", allowCredentials = "true")
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

	@GetMapping("/me")
	public ResponseEntity<?> getCurrentUser( @AuthenticationPrincipal User user ) {
		if (user == null) {
			return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
		}

		return ResponseEntity.ok(Map.of(
				"userId", user.getID(),
				"name", user.getName(),
				"email", user.getEmail(),
				"role", user.getRole().name()
		));
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletResponse response) {
		// Clear the JWT cookie
		Cookie jwtCookie = new Cookie("jwt", null);
		jwtCookie.setHttpOnly(true);
		jwtCookie.setSecure(false); // Set to true in production with HTTPS
		jwtCookie.setPath("/");
		jwtCookie.setMaxAge(0); // Expire immediately
		jwtCookie.setAttribute("SameSite", "Lax");
		response.addCookie(jwtCookie);

		log.info("User logged out successfully");
		return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
	}
}
