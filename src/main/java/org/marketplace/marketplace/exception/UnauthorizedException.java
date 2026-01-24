package org.marketplace.marketplace.exception;

/**
 * Exception thrown when a user is not authenticated or lacks proper credentials.
 * Results in HTTP 401 Unauthorized response.
 */
public class UnauthorizedException extends RuntimeException {

	public UnauthorizedException( String message ) {

		super( message );
	}

	public UnauthorizedException( String message, Throwable cause ) {

		super( message, cause );
	}
}
