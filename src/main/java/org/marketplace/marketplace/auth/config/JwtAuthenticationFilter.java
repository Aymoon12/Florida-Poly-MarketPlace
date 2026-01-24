package org.marketplace.marketplace.auth.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final String JWT_COOKIE_NAME = "jwt";

	private final JwtService jwtService;
	private final UserDetailsService userDetailsService;

	@Override
	protected void doFilterInternal(@NonNull HttpServletRequest request,
									@NonNull HttpServletResponse response,
									@NonNull FilterChain filterChain)
			throws ServletException, IOException {

		final String jwt = extractJwtFromRequest(request);

		if (jwt == null) {
			filterChain.doFilter(request, response);
			return;
		}

		try {
			String username = jwtService.extractUsername(jwt);
			if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				UserDetails userDetails = userDetailsService.loadUserByUsername(username);
				if (jwtService.validateToken(jwt, userDetails)) {
					UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
							userDetails,
							null,
							userDetails.getAuthorities()
					);

					authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authToken);
				}
			}
		} catch (ExpiredJwtException e) {
			log.debug("JWT token has expired: {}", e.getMessage());
			SecurityContextHolder.clearContext();
			clearJwtCookie(response);
		} catch (JwtException e) {
			log.debug("Invalid JWT token: {}", e.getMessage());
			SecurityContextHolder.clearContext();
			clearJwtCookie(response);
		}

		filterChain.doFilter(request, response);
	}

	private String extractJwtFromRequest(HttpServletRequest request) {
		// First, try to get JWT from cookie (preferred, more secure)
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			return Arrays.stream(cookies)
					.filter(cookie -> JWT_COOKIE_NAME.equals(cookie.getName()))
					.map(Cookie::getValue)
					.findFirst()
					.orElse(null);
		}
		return null;
	}

	private void clearJwtCookie(HttpServletResponse response) {
		Cookie cookie = new Cookie(JWT_COOKIE_NAME, null);
		cookie.setHttpOnly(true);
		cookie.setSecure(true);
		cookie.setPath("/");
		cookie.setMaxAge(0);
		response.addCookie(cookie);
	}
}
