package org.marketplace.marketplace.controllers;

import java.util.HashMap;
import java.util.Map;

import org.marketplace.marketplace.auth.config.JwtService;
import org.marketplace.marketplace.entities.Role;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Profile;

/**
 * Development-only controller for testing purposes. This controller is only active when the 'dev' profile is enabled.
 * It allows creation of test users without OAuth authentication. To enable: Add 'dev' to spring.profiles.active in
 * application.properties or run with -Dspring.profiles.active=dev
 */
@RestController
@CrossOrigin( origins = { "http://localhost:5173", "http://localhost:3000" }, allowCredentials = "true" )
@RequestMapping( "api/v1/dev" )
@RequiredArgsConstructor
@Log4j2
@Profile( "dev" )
public class DevController {

	private final UserRepository userRepository;
	private final JwtService jwtService;

	@Value( "${app.frontend-url:http://localhost:5173}" )
	private String frontendUrl;

	/**
	 * Sets JWT as an HTTP-only cookie (same pattern as OAuth2 success handler)
	 */
	private void setJwtCookie( HttpServletResponse response, String token ) {

		Cookie jwtCookie = new Cookie( "jwt", token );
		jwtCookie.setHttpOnly( true );
		jwtCookie.setSecure( false ); // Set to true in production with HTTPS
		jwtCookie.setPath( "/" );
		jwtCookie.setMaxAge( 86400 ); // 24 hours
		jwtCookie.setAttribute( "SameSite", "Lax" );
		response.addCookie( jwtCookie );
	}

	/**
	 * Create a test user for development purposes. Sets JWT as HTTP-only cookie.
	 *
	 * @param name
	 *            The name of the test user
	 * @param email
	 *            The email of the test user (must be unique)
	 * @param response
	 *            HttpServletResponse to set cookie
	 * @return User ID and info
	 */
	@PostMapping( "/create-test-user" )
	public ResponseEntity<?> createTestUser( @RequestParam String name,
			@RequestParam( defaultValue = "" ) String email, HttpServletResponse response ) {

		try {
			// Generate email if not provided
			if ( email == null || email.isEmpty() ) {
				email = name.toLowerCase().replace( " ", "." ) + "@test.floridapoly.edu";
			}

			// Check if user already exists
			User existingUser = userRepository.findUserByEmail( email ).orElse( null );
			if ( existingUser != null ) {
				String token = jwtService.generateToken( existingUser );
				setJwtCookie( response, token );

				Map<String, Object> responseBody = new HashMap<>();
				responseBody.put( "message", "User already exists, JWT cookie set" );
				responseBody.put( "userId", existingUser.getID() );
				responseBody.put( "name", existingUser.getName() );
				responseBody.put( "email", existingUser.getEmail() );
				return ResponseEntity.ok( responseBody );
			}

			// Create new test user
			User user = User.builder().name( name ).email( email ).role( Role.USER ).build();
			User savedUser = userRepository.save( user );

			// Generate JWT token and set as cookie
			String token = jwtService.generateToken( savedUser );
			setJwtCookie( response, token );

			Map<String, Object> responseBody = new HashMap<>();
			responseBody.put( "message", "Test user created successfully, JWT cookie set" );
			responseBody.put( "userId", savedUser.getID() );
			responseBody.put( "name", savedUser.getName() );
			responseBody.put( "email", savedUser.getEmail() );

			log.info( "Created test user: {} ({})", name, email );
			return ResponseEntity.ok( responseBody );

		} catch ( Exception e ) {
			log.error( "Error creating test user: {}", e.getMessage(), e );
			return ResponseEntity.badRequest().body( Map.of( "error", e.getMessage() ) );
		}
	}

	/**
	 * Get a list of all test users (users with @test.floridapoly.edu emails)
	 *
	 * @return List of test users
	 */
	@GetMapping( "/test-users" )
	public ResponseEntity<?> getTestUsers() {

		try {
			var testUsers = userRepository.findAll().stream()
					.filter( u -> u.getEmail() != null && u.getEmail().contains( "@test.floridapoly.edu" ) )
					.map( u -> Map.of( "userId", u.getID(), "name", u.getName(), "email", u.getEmail() ) ).toList();

			return ResponseEntity.ok( testUsers );
		} catch ( Exception e ) {
			log.error( "Error fetching test users: {}", e.getMessage(), e );
			return ResponseEntity.badRequest().body( Map.of( "error", e.getMessage() ) );
		}
	}

	/**
	 * Login as a test user and set JWT as HTTP-only cookie
	 *
	 * @param userId
	 *            The user ID to login as
	 * @param response
	 *            HttpServletResponse to set cookie
	 * @return User info
	 */
	@PostMapping( "/login-as" )
	public ResponseEntity<?> loginAs( @RequestParam Long userId, HttpServletResponse response ) {

		try {
			User user = userRepository.findById( userId ).orElse( null );
			if ( user == null ) {
				return ResponseEntity.badRequest().body( Map.of( "error", "User not found" ) );
			}

			String token = jwtService.generateToken( user );
			setJwtCookie( response, token );

			Map<String, Object> responseBody = new HashMap<>();
			responseBody.put( "message", "Logged in successfully, JWT cookie set" );
			responseBody.put( "userId", user.getID() );
			responseBody.put( "name", user.getName() );
			responseBody.put( "email", user.getEmail() );

			log.info( "Dev login as user: {} ({})", user.getName(), user.getID() );
			return ResponseEntity.ok( responseBody );

		} catch ( Exception e ) {
			log.error( "Error logging in as user: {}", e.getMessage(), e );
			return ResponseEntity.badRequest().body( Map.of( "error", e.getMessage() ) );
		}
	}

	/**
	 * Quick login that creates a test user (if needed) and redirects to frontend with JWT cookie set.
	 * Usage: Navigate to http://localhost:9090/api/v1/dev/quick-login?name=TestUser in browser
	 *
	 * @param name
	 *            The name for the test user
	 * @param response
	 *            HttpServletResponse for cookie and redirect
	 */
	@GetMapping( "/quick-login" )
	public void quickLogin( @RequestParam( defaultValue = "Test User" ) String name, HttpServletResponse response )
			throws java.io.IOException {

		try {
			// Generate email from name
			String email = name.toLowerCase().replace( " ", "." ) + "@test.floridapoly.edu";

			// Find or create user
			User user = userRepository.findUserByEmail( email ).orElse( null );
			if ( user == null ) {
				user = User.builder().name( name ).email( email ).role( Role.USER ).build();
				user = userRepository.save( user );
				log.info( "Created test user: {} ({})", name, email );
			}

			// Generate JWT token and set as HTTP-only cookie
			String token = jwtService.generateToken( user );
			setJwtCookie( response, token );

			// Redirect to frontend - no token in URL (matches OAuth2 success handler pattern)
			log.info( "Quick login redirect for user: {} ({})", user.getName(), user.getID() );
			response.sendRedirect( frontendUrl + "/home" );

		} catch ( Exception e ) {
			log.error( "Error in quick login: {}", e.getMessage(), e );
			response.sendError( 500, "Quick login failed: " + e.getMessage() );
		}
	}

	/**
	 * Health check endpoint to verify dev mode is enabled
	 *
	 * @return Status message
	 */
	@GetMapping( "/status" )
	public ResponseEntity<?> status() {

		return ResponseEntity.ok( Map.of( "status", "Development mode enabled", "warning",
				"This endpoint should not be available in production!" ) );
	}
}
