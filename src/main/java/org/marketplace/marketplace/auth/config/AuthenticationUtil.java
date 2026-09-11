package org.marketplace.marketplace.auth.config;

import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Utility class for extracting the current authenticated user from SecurityContext.
 * Provides methods to get the current user or user ID without requiring userId as a request parameter.
 */
public final class AuthenticationUtil {

	private AuthenticationUtil() {
		// Utility class - prevent instantiation
	}

	/**
	 * Get the current authenticated user from SecurityContext.
	 *
	 * @return the authenticated User
	 * @throws UnauthorizedException if not authenticated or principal is not a User
	 */
	public static User getCurrentUser() {

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if ( auth != null && auth.getPrincipal() instanceof User ) {
			return (User) auth.getPrincipal();
		}
		throw new UnauthorizedException( "Not authenticated" );
	}

	/**
	 * Get the ID of the current authenticated user.
	 *
	 * @return the user ID
	 * @throws UnauthorizedException if not authenticated
	 */
	public static Long getCurrentUserId() {

		return getCurrentUser().getID();
	}

	/**
	 * Check if there is a currently authenticated user.
	 *
	 * @return true if authenticated, false otherwise
	 */
	public static boolean isAuthenticated() {

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof User;
	}
}
