package org.marketplace.marketplace.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

/**
 * Security configuration for WebSocket/STOMP messaging.
 * Disables CSRF for WebSocket (since we use JWT) and permits connections.
 * Authentication is handled by WebSocketAuthChannelInterceptor.
 */
@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

	@Override
	protected void configureInbound( MessageSecurityMetadataSourceRegistry messages ) {

		messages
				// Permit all messages - authentication is handled by our channel interceptor
				.anyMessage().permitAll();
	}

	@Override
	protected boolean sameOriginDisabled() {

		// Disable CSRF for WebSocket since we use JWT tokens
		return true;
	}
}
