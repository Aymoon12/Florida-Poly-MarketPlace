package org.marketplace.marketplace.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

/**
 * Global exception handler for the marketplace application.
 * Handles validation errors and returns consistent error responses.
 */
@RestControllerAdvice
@Log4j2
public class GlobalExceptionHandler {

	/**
	 * Handle validation exceptions from @Valid annotations.
	 * Returns a structured error response with field-specific error messages.
	 *
	 * @param ex
	 *            The validation exception
	 * @return ResponseEntity with validation error details
	 */
	@ExceptionHandler( MethodArgumentNotValidException.class )
	public ResponseEntity<Map<String, Object>> handleValidationExceptions( MethodArgumentNotValidException ex ) {

		Map<String, String> fieldErrors = new HashMap<>();
		ex.getBindingResult().getFieldErrors()
				.forEach( error -> fieldErrors.put( error.getField(), error.getDefaultMessage() ) );

		Map<String, Object> response = new HashMap<>();
		response.put( "success", false );
		response.put( "message", "Validation failed" );
		response.put( "errors", fieldErrors );

		log.warn( "Validation failed: {}", fieldErrors );

		return ResponseEntity.badRequest().body( response );
	}

	/**
	 * Handle unauthorized exceptions (401).
	 */
	@ExceptionHandler( UnauthorizedException.class )
	public ResponseEntity<Map<String, Object>> handleUnauthorizedException( UnauthorizedException ex ) {

		Map<String, Object> response = new HashMap<>();
		response.put( "success", false );
		response.put( "message", ex.getMessage() );
		response.put( "error", "Unauthorized" );

		log.warn( "Unauthorized access attempt: {}", ex.getMessage() );

		return ResponseEntity.status( HttpStatus.UNAUTHORIZED ).body( response );
	}

	/**
	 * Handle access denied exceptions (403).
	 */
	@ExceptionHandler( AccessDeniedException.class )
	public ResponseEntity<Map<String, Object>> handleAccessDeniedException( AccessDeniedException ex ) {

		Map<String, Object> response = new HashMap<>();
		response.put( "success", false );
		response.put( "message", "Access denied" );
		response.put( "error", "Forbidden" );

		log.warn( "Access denied: {}", ex.getMessage() );

		return ResponseEntity.status( HttpStatus.FORBIDDEN ).body( response );
	}

	/**
	 * Handle entity not found exceptions (404).
	 */
	@ExceptionHandler( EntityNotFoundException.class )
	public ResponseEntity<Map<String, Object>> handleEntityNotFoundException( EntityNotFoundException ex ) {

		Map<String, Object> response = new HashMap<>();
		response.put( "success", false );
		response.put( "message", ex.getMessage() );
		response.put( "error", "Not Found" );

		log.warn( "Entity not found: {}", ex.getMessage() );

		return ResponseEntity.status( HttpStatus.NOT_FOUND ).body( response );
	}

	/**
	 * Handle file upload size exceeded exceptions (413).
	 */
	@ExceptionHandler( MaxUploadSizeExceededException.class )
	public ResponseEntity<Map<String, Object>> handleMaxUploadSizeExceededException(
			MaxUploadSizeExceededException ex ) {

		Map<String, Object> response = new HashMap<>();
		response.put( "success", false );
		response.put( "message", "File size exceeds the maximum allowed limit (10MB)" );
		response.put( "error", "Payload Too Large" );

		log.warn( "File upload size exceeded: {}", ex.getMessage() );

		return ResponseEntity.status( HttpStatus.PAYLOAD_TOO_LARGE ).body( response );
	}

	/**
	 * Handle illegal argument exceptions (400).
	 */
	@ExceptionHandler( IllegalArgumentException.class )
	public ResponseEntity<Map<String, Object>> handleIllegalArgumentException( IllegalArgumentException ex ) {

		Map<String, Object> response = new HashMap<>();
		response.put( "success", false );
		response.put( "message", ex.getMessage() );
		response.put( "error", "Bad Request" );

		log.warn( "Illegal argument: {}", ex.getMessage() );

		return ResponseEntity.status( HttpStatus.BAD_REQUEST ).body( response );
	}

	/**
	 * Handle all other unhandled exceptions (500).
	 * Does not expose stack trace for security.
	 */
	@ExceptionHandler( Exception.class )
	public ResponseEntity<Map<String, Object>> handleGenericException( Exception ex ) {

		Map<String, Object> response = new HashMap<>();
		response.put( "success", false );
		response.put( "message", "An internal server error occurred" );
		response.put( "error", "Internal Server Error" );

		// Log full exception for debugging but don't expose to client
		log.error( "Unhandled exception: ", ex );

		return ResponseEntity.status( HttpStatus.INTERNAL_SERVER_ERROR ).body( response );
	}
}
