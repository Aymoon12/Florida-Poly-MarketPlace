package org.marketplace.marketplace.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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
}
