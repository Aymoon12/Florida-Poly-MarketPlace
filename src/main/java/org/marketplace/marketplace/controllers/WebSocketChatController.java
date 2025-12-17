package org.marketplace.marketplace.controllers;

import java.security.Principal;

import org.marketplace.marketplace.dto.MessageDTO;
import org.marketplace.marketplace.dto.SendMessageRequest;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.UserRepository;
import org.marketplace.marketplace.services.ChatService;
import org.marketplace.marketplace.services.WebSocketNotificationService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/**
 * WebSocket controller for real-time chat functionality.
 * Handles STOMP messages for sending chat messages.
 */
@Controller
@RequiredArgsConstructor
@Log4j2
public class WebSocketChatController {

	private final ChatService chatService;
	private final WebSocketNotificationService notificationService;
	private final UserRepository userRepository;

	/**
	 * Handle incoming chat messages via WebSocket.
	 *
	 * @param request
	 *            The message request
	 * @param principal
	 *            The authenticated user
	 * @return The saved message DTO
	 */
	@MessageMapping( "/chat.send" )
	@SendToUser( "/queue/messages" )
	public MessageDTO sendMessage( @Payload SendMessageRequest request, Principal principal ) {

		User sender = extractUser( principal );

		if ( sender == null ) {
			log.error( "Cannot send message: user not authenticated" );
			return null;
		}

		log.debug( "WebSocket message from user {} to conversation {}", sender.getID(), request.getConversationId() );

		// Save message using existing ChatService
		MessageDTO savedMessage = chatService.sendMessage( request, sender.getID() );

		// Notify recipient via WebSocket
		notificationService.notifyNewMessage( savedMessage, request.getConversationId() );

		return savedMessage;
	}

	/**
	 * Handle mark-as-read requests via WebSocket.
	 *
	 * @param conversationId
	 *            The conversation ID
	 * @param principal
	 *            The authenticated user
	 */
	@MessageMapping( "/chat.markRead" )
	public void markAsRead( @Payload Long conversationId, Principal principal ) {

		User user = extractUser( principal );

		if ( user == null ) {
			log.error( "Cannot mark as read: user not authenticated" );
			return;
		}

		log.debug( "Marking conversation {} as read for user {}", conversationId, user.getID() );

		chatService.markConversationAsRead( conversationId, user.getID() );
	}

	/**
	 * Extract the User entity from the Principal.
	 */
	private User extractUser( Principal principal ) {

		if ( principal == null ) {
			return null;
		}

		if ( principal instanceof UsernamePasswordAuthenticationToken authToken ) {
			Object principalObj = authToken.getPrincipal();

			if ( principalObj instanceof User user ) {
				return user;
			}

			// If principal is a UserDetails but not our User entity, look up by email
			if ( principalObj instanceof org.springframework.security.core.userdetails.UserDetails userDetails ) {
				return userRepository.findUserByEmail( userDetails.getUsername() ).orElse( null );
			}
		}

		// Fallback: try to find user by principal name (email)
		return userRepository.findUserByEmail( principal.getName() ).orElse( null );
	}
}
