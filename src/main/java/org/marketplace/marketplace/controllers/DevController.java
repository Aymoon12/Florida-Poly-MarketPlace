package org.marketplace.marketplace.controllers;

import java.util.HashMap;
import java.util.Map;

import org.marketplace.marketplace.auth.config.JwtService;
import org.marketplace.marketplace.entities.Role;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/**
 * Development-only controller for testing purposes. This controller is only active when the 'dev' profile is enabled.
 * It allows creation of test users without OAuth authentication. To enable: Add 'dev' to spring.profiles.active in
 * application.properties or run with -Dspring.profiles.active=dev
 */
@RestController
@CrossOrigin
@RequestMapping( "api/v1/dev" )
@RequiredArgsConstructor
@Log4j2
//@Profile( "dev" )
public class DevController {

	private final UserRepository userRepository;
	private final JwtService jwtService;

	/**
	 * Create a test user for development purposes. Returns the user ID and a valid JWT token.
	 *
	 * @param name
	 *            The name of the test user
	 * @param email
	 *            The email of the test user (must be unique)
	 * @return User ID and JWT token
	 */
	@PostMapping( "/create-test-user" )
	public ResponseEntity<?> createTestUser( @RequestParam String name,
			@RequestParam( defaultValue = "" ) String email ) {

		try {
			// Generate email if not provided
			if ( email == null || email.isEmpty() ) {
				email = name.toLowerCase().replace( " ", "." ) + "@test.floridapoly.edu";
			}

			// Check if user already exists
			User existingUser = userRepository.findUserByEmail( email ).orElse( null );
			if ( existingUser != null ) {
				String token = jwtService.generateToken( existingUser );
				Map<String, Object> response = new HashMap<>();
				response.put( "message", "User already exists" );
				response.put( "userId", existingUser.getID() );
				response.put( "name", existingUser.getName() );
				response.put( "email", existingUser.getEmail() );
				response.put( "token", token );
				return ResponseEntity.ok( response );
			}

			// Create new test user
			User user = User.builder().name( name ).email( email ).role( Role.USER ).build();
			User savedUser = userRepository.save( user );

			// Generate JWT token
			String token = jwtService.generateToken( savedUser );

			Map<String, Object> response = new HashMap<>();
			response.put( "message", "Test user created successfully" );
			response.put( "userId", savedUser.getID() );
			response.put( "name", savedUser.getName() );
			response.put( "email", savedUser.getEmail() );
			response.put( "token", token );

			log.info( "Created test user: {} ({})", name, email );
			return ResponseEntity.ok( response );

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
	 * Login as a test user and get a new JWT token (API response)
	 *
	 * @param userId
	 *            The user ID to login as
	 * @return User info and JWT token
	 */
	@PostMapping( "/login-as" )
	public ResponseEntity<?> loginAs( @RequestParam Long userId ) {

		try {
			User user = userRepository.findById( userId ).orElse( null );
			if ( user == null ) {
				return ResponseEntity.badRequest().body( Map.of( "error", "User not found" ) );
			}

			String token = jwtService.generateToken( user );

			Map<String, Object> response = new HashMap<>();
			response.put( "userId", user.getID() );
			response.put( "name", user.getName() );
			response.put( "email", user.getEmail() );
			response.put( "token", token );

			log.info( "Dev login as user: {} ({})", user.getName(), user.getID() );
			return ResponseEntity.ok( response );

		} catch ( Exception e ) {
			log.error( "Error logging in as user: {}", e.getMessage(), e );
			return ResponseEntity.badRequest().body( Map.of( "error", e.getMessage() ) );
		}
	}

	/**
	 * Quick login that creates a test user (if needed) and redirects to frontend with auth params.
	 * Usage: Navigate to http://localhost:8080/api/v1/dev/quick-login?name=TestUser in browser
	 *
	 * @param name
	 *            The name for the test user
	 * @param response
	 *            HttpServletResponse for redirect
	 */
	@GetMapping( "/quick-login" )
	public void quickLogin( @RequestParam( defaultValue = "Test User" ) String name,
			jakarta.servlet.http.HttpServletResponse response ) throws java.io.IOException {

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

			// Generate JWT token
			String token = jwtService.generateToken( user );

			// Redirect to frontend with auth params (same as OAuth2 success handler)
			String redirectUrl = org.springframework.web.util.UriComponentsBuilder
					.fromUriString( "http://localhost:5173/home" )
					.queryParam( "userId", user.getID() )
					.queryParam( "token", token )
					.queryParam( "name", user.getName() )
					.build()
					.toUriString();

			log.info( "Quick login redirect for user: {} ({})", user.getName(), user.getID() );
			response.sendRedirect( redirectUrl );

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
