package org.marketplace.marketplace.auth.config;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

/**
 * Rate limiting filter using Bucket4j token bucket algorithm.
 * Implements per-IP rate limiting with different limits for various endpoint types.
 */
@Component
@Log4j2
public class RateLimitFilter extends OncePerRequestFilter {

	// Store buckets per IP address
	private final Map<String, Bucket> generalBuckets = new ConcurrentHashMap<>();
	private final Map<String, Bucket> uploadBuckets = new ConcurrentHashMap<>();
	private final Map<String, Bucket> chatBuckets = new ConcurrentHashMap<>();

	// Rate limits
	private static final int GENERAL_REQUESTS_PER_MINUTE = 100;
	private static final int UPLOAD_REQUESTS_PER_MINUTE = 10;
	private static final int CHAT_MESSAGES_PER_MINUTE = 20;

	@Override
	protected void doFilterInternal( HttpServletRequest request, HttpServletResponse response, FilterChain filterChain )
			throws ServletException, IOException {

		String clientIp = getClientIP( request );
		String path = request.getRequestURI();

		Bucket bucket = resolveBucket( clientIp, path );

		if ( bucket.tryConsume( 1 ) ) {
			filterChain.doFilter( request, response );
		} else {
			log.warn( "Rate limit exceeded for IP: {} on path: {}", clientIp, path );
			response.setStatus( HttpStatus.TOO_MANY_REQUESTS.value() );
			response.setContentType( "application/json" );
			response.getWriter().write( "{\"success\":false,\"message\":\"Rate limit exceeded. Please try again later.\",\"error\":\"Too Many Requests\"}" );
		}
	}

	private Bucket resolveBucket( String clientIp, String path ) {

		if ( isUploadEndpoint( path ) ) {
			return uploadBuckets.computeIfAbsent( clientIp, this::createUploadBucket );
		} else if ( isChatEndpoint( path ) ) {
			return chatBuckets.computeIfAbsent( clientIp, this::createChatBucket );
		} else {
			return generalBuckets.computeIfAbsent( clientIp, this::createGeneralBucket );
		}
	}

	private boolean isUploadEndpoint( String path ) {

		return path.contains( "/images/upload" ) || path.contains( "/images/upload-url" );
	}

	private boolean isChatEndpoint( String path ) {

		return path.contains( "/chat/send" ) || path.contains( "/ws" );
	}

	private Bucket createGeneralBucket( String key ) {

		Bandwidth limit = Bandwidth.classic( GENERAL_REQUESTS_PER_MINUTE,
				Refill.greedy( GENERAL_REQUESTS_PER_MINUTE, Duration.ofMinutes( 1 ) ) );
		return Bucket.builder().addLimit( limit ).build();
	}

	private Bucket createUploadBucket( String key ) {

		Bandwidth limit = Bandwidth.classic( UPLOAD_REQUESTS_PER_MINUTE,
				Refill.greedy( UPLOAD_REQUESTS_PER_MINUTE, Duration.ofMinutes( 1 ) ) );
		return Bucket.builder().addLimit( limit ).build();
	}

	private Bucket createChatBucket( String key ) {

		Bandwidth limit = Bandwidth.classic( CHAT_MESSAGES_PER_MINUTE,
				Refill.greedy( CHAT_MESSAGES_PER_MINUTE, Duration.ofMinutes( 1 ) ) );
		return Bucket.builder().addLimit( limit ).build();
	}

	private String getClientIP( HttpServletRequest request ) {

		// Check for proxy headers first
		String xForwardedFor = request.getHeader( "X-Forwarded-For" );
		if ( xForwardedFor != null && !xForwardedFor.isEmpty() ) {
			// Take the first IP if there are multiple (original client IP)
			return xForwardedFor.split( "," )[0].trim();
		}

		String xRealIp = request.getHeader( "X-Real-IP" );
		if ( xRealIp != null && !xRealIp.isEmpty() ) {
			return xRealIp;
		}

		return request.getRemoteAddr();
	}

	@Override
	protected boolean shouldNotFilter( HttpServletRequest request ) {

		String path = request.getRequestURI();
		// Don't rate limit static resources or health checks
		return path.startsWith( "/static" ) ||
				path.startsWith( "/actuator" ) ||
				path.equals( "/favicon.ico" );
	}
}
