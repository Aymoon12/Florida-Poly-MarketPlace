package org.marketplace.marketplace.config;

import org.marketplace.marketplace.auth.config.JwtService;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/**
 * Channel interceptor that authenticates WebSocket connections using JWT.
 * Validates the JWT token sent in the Authorization header during STOMP CONNECT.
 */
@Component
@RequiredArgsConstructor
@Log4j2
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

	private final JwtService jwtService;
	private final UserDetailsService userDetailsService;

	@Override
	public Message<?> preSend( Message<?> message, MessageChannel channel ) {

		StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor( message, StompHeaderAccessor.class );

		if ( accessor != null && StompCommand.CONNECT.equals( accessor.getCommand() ) ) {
			// Extract JWT token from Authorization header
			String authHeader = accessor.getFirstNativeHeader( "Authorization" );

			if ( authHeader != null && authHeader.startsWith( "Bearer " ) ) {
				String jwt = authHeader.substring( 7 );

				try {
					String username = jwtService.extractUsername( jwt );

					if ( username != null ) {
						UserDetails userDetails = userDetailsService.loadUserByUsername( username );

						if ( jwtService.validateToken( jwt, userDetails ) ) {
							UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
									userDetails, null, userDetails.getAuthorities() );
							accessor.setUser( authToken );
							log.debug( "WebSocket authenticated for user: {}", username );
						} else {
							log.warn( "WebSocket JWT validation failed for user: {}", username );
						}
					}
				} catch ( Exception e ) {
					log.error( "WebSocket authentication error: {}", e.getMessage() );
				}
			} else {
				log.warn( "WebSocket connection attempted without Authorization header" );
			}
		}

		return message;
	}
}
