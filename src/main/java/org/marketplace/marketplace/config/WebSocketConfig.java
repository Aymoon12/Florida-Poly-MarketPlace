package org.marketplace.marketplace.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import lombok.RequiredArgsConstructor;

/**
 * WebSocket configuration for real-time chat functionality.
 * Uses STOMP protocol over WebSocket with SockJS fallback.
 */
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	private final WebSocketAuthChannelInterceptor authChannelInterceptor;
	private final WebSocketHandshakeInterceptor handshakeInterceptor;

	@Override
	public void configureMessageBroker( MessageBrokerRegistry config ) {

		// Enable simple broker for topics and queues
		config.enableSimpleBroker( "/topic", "/queue" );

		// Prefix for messages bound for @MessageMapping methods
		config.setApplicationDestinationPrefixes( "/app" );

		// Prefix for user-specific destinations
		config.setUserDestinationPrefix( "/user" );
	}

	@Override
	public void registerStompEndpoints( StompEndpointRegistry registry ) {

		// WebSocket endpoint with SockJS fallback and handshake interceptor for cookie auth
		registry.addEndpoint( "/ws" )
				.setAllowedOrigins( "http://localhost:5173", "http://localhost:3000" )
				.addInterceptors( handshakeInterceptor )
				.withSockJS();
	}

	@Override
	public void configureClientInboundChannel( ChannelRegistration registration ) {

		// Add JWT authentication interceptor
		registration.interceptors( authChannelInterceptor );
	}
}
