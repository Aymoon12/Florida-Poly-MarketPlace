package org.marketplace.marketplace.services;

import org.marketplace.marketplace.dto.ConversationDTO;
import org.marketplace.marketplace.dto.MessageDTO;
import org.marketplace.marketplace.entities.Conversation;
import org.marketplace.marketplace.repository.ConversationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/**
 * Service for sending real-time notifications via WebSocket.
 * Uses Spring's SimpMessagingTemplate to send messages to specific users.
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class WebSocketNotificationService {

	private final SimpMessagingTemplate messagingTemplate;
	private final ConversationRepository conversationRepository;

	/**
	 * Notify the recipient of a new message via WebSocket.
	 *
	 * @param message
	 *            The message DTO to send
	 * @param conversationId
	 *            The conversation ID
	 */
	public void notifyNewMessage( MessageDTO message, Long conversationId ) {

		Conversation conversation = conversationRepository.findById( conversationId ).orElse( null );

		if ( conversation == null ) {
			log.warn( "Cannot send notification: conversation {} not found", conversationId );
			return;
		}

		Long buyerId = conversation.getBuyer().getID();
		Long sellerId = conversation.getSeller().getID();
		Long senderId = message.getSenderId();

		// Determine recipient (the other participant)
		String recipientEmail;
		Long recipientId;

		if ( senderId.equals( buyerId ) ) {
			recipientEmail = conversation.getSeller().getEmail();
			recipientId = sellerId;
		} else {
			recipientEmail = conversation.getBuyer().getEmail();
			recipientId = buyerId;
		}

		// Send message to recipient's personal queue
		messagingTemplate.convertAndSendToUser( recipientEmail, "/queue/messages", message );

		log.debug( "Sent WebSocket message notification to user {} for conversation {}", recipientId, conversationId );

		// Also send conversation update for inbox refresh
		ConversationDTO conversationUpdate = buildConversationUpdate( conversation, message, recipientId );

		messagingTemplate.convertAndSendToUser( recipientEmail, "/queue/conversations", conversationUpdate );

		log.debug( "Sent WebSocket conversation update to user {} for conversation {}", recipientId, conversationId );
	}

	/**
	 * Build a conversation update DTO for notifying the recipient.
	 */
	private ConversationDTO buildConversationUpdate( Conversation conversation, MessageDTO lastMessage,
			Long recipientId ) {

		return ConversationDTO.builder()
				.id( conversation.getId() )
				.itemId( conversation.getItem().getId() )
				.itemTitle( conversation.getItem().getTitle() )
				.buyerId( conversation.getBuyer().getID() )
				.buyerName( conversation.getBuyer().getUsername() )
				.sellerId( conversation.getSeller().getID() )
				.sellerName( conversation.getSeller().getUsername() )
				.lastMessage( lastMessage.getContent() )
				.updatedAt( lastMessage.getSentAt() )
				.unread( true )
				.build();
	}
}
