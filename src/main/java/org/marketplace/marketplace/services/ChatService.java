package org.marketplace.marketplace.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.marketplace.marketplace.dto.ConversationDTO;
import org.marketplace.marketplace.dto.CreateConversationRequest;
import org.marketplace.marketplace.dto.MessageDTO;
import org.marketplace.marketplace.dto.SendMessageRequest;
import org.marketplace.marketplace.entities.Conversation;
import org.marketplace.marketplace.entities.Item;
import org.marketplace.marketplace.entities.Message;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.ConversationRepository;
import org.marketplace.marketplace.repository.ItemRepository;
import org.marketplace.marketplace.repository.MessageRepository;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {

	private final ConversationRepository conversationRepository;
	private final MessageRepository messageRepository;
	private final UserRepository userRepository;
	private final ItemRepository itemRepository;
	private final WebSocketNotificationService webSocketNotificationService;

	@Transactional( readOnly = true )
	public List<ConversationDTO> getUserConversations( Long userId ) {

		List<Conversation> conversations = conversationRepository.findAllByUserId( userId );

		return conversations.stream().map( conv -> mapToConversationDTO( conv, userId ) )
				.collect( Collectors.toList() );
	}

	@Transactional( readOnly = true )
	public ConversationDTO getConversation( Long conversationId, Long userId ) {

		Conversation conversation = conversationRepository.findById( conversationId )
				.orElseThrow( () -> new ResponseStatusException( HttpStatus.NOT_FOUND, "Conversation not found" ) );

		// Check if user is a participant in the conversation
		if ( !conversation.getBuyer().getID().equals( userId ) && !conversation.getSeller().getID().equals( userId ) ) {
			throw new ResponseStatusException( HttpStatus.FORBIDDEN, "Not authorized to access this conversation" );
		}

		return mapToConversationDTO( conversation, userId );
	}

	@Transactional( readOnly = true )
	public List<MessageDTO> getConversationMessages( Long conversationId, Long userId ) {

		// Verify user is part of the conversation
		Conversation conversation = conversationRepository.findById( conversationId )
				.orElseThrow( () -> new ResponseStatusException( HttpStatus.NOT_FOUND, "Conversation not found" ) );

		if ( !conversation.getBuyer().getID().equals( userId ) && !conversation.getSeller().getID().equals( userId ) ) {
			throw new ResponseStatusException( HttpStatus.FORBIDDEN, "Not authorized to access this conversation" );
		}

		List<Message> messages = messageRepository.findAllByConversationId( conversationId );

		// Mark messages as read
		markMessagesAsRead( messages, userId );

		// Update read status for conversation
		if ( conversation.getBuyer().getID().equals( userId ) ) {
			conversation.setReadByBuyer( true );
		} else {
			conversation.setReadBySeller( true );
		}

		conversationRepository.save( conversation );

		return messages.stream().map( this::mapToMessageDTO ).collect( Collectors.toList() );
	}

	@Transactional
	public ConversationDTO createConversation( CreateConversationRequest request) {

		Long buyerId = request.getUserId();
		// Get item and verify it exists
		Item item = itemRepository.findById( request.getItemId() )
				.orElseThrow( () -> new ResponseStatusException( HttpStatus.NOT_FOUND, "Item not found" ) );

		// Get seller from item
		User seller = item.getUser();

		// Get buyer
		User buyer = userRepository.findById( request.getUserId() )
				.orElseThrow( () -> new ResponseStatusException( HttpStatus.NOT_FOUND, "User not found" ) );

		// Check if buyer is trying to message themselves
		if ( buyer.getID().equals( seller.getID() ) ) {
			throw new ResponseStatusException( HttpStatus.BAD_REQUEST, "Cannot message yourself" );
		}

		// Check if conversation already exists between buyer and item
		Optional<Conversation> existingConversation =
				conversationRepository.findByBuyerIdAndItemId( buyerId, item.getId() );

		if ( existingConversation.isPresent() ) {
			// Conversation exists, just return it
			return mapToConversationDTO( existingConversation.get(), buyerId );
		}

		// Create new conversation
		LocalDateTime now = LocalDateTime.now();

		Conversation conversation = Conversation.builder().item( item ).buyer( buyer ).seller( seller ).createdAt( now )
				.updatedAt( now ).isReadByBuyer( true ).isReadBySeller( false ).build();

		conversationRepository.save( conversation );

		// Add initial message if provided
		if ( request.getInitialMessage() != null && !request.getInitialMessage().trim().isEmpty() ) {
			Message message = Message.builder().conversation( conversation ).sender( buyer )
					.content( request.getInitialMessage() ).sentAt( now ).isRead( false ).build();

			messageRepository.save( message );

			// Update conversation with last message
			conversation.setLastMessageText( message.getContent() );
			conversationRepository.save( conversation );

			// Notify seller via WebSocket about new conversation/message
			MessageDTO messageDTO = mapToMessageDTO( message );
			webSocketNotificationService.notifyNewMessage( messageDTO, conversation.getId() );
		}

		return mapToConversationDTO( conversation, buyerId );
	}

	@Transactional
	public MessageDTO sendMessage( SendMessageRequest request, Long senderId ) {

		// Verify conversation exists
		Conversation conversation = conversationRepository.findById( request.getConversationId() )
				.orElseThrow( () -> new ResponseStatusException( HttpStatus.NOT_FOUND, "Conversation not found" ) );

		// Verify sender is part of the conversation
		User sender = userRepository.findById( senderId )
				.orElseThrow( () -> new ResponseStatusException( HttpStatus.NOT_FOUND, "User not found" ) );

		if ( !conversation.getBuyer().getID().equals( senderId )
				&& !conversation.getSeller().getID().equals( senderId ) ) {
			throw new ResponseStatusException( HttpStatus.FORBIDDEN,
					"Not authorized to send messages in this conversation" );
		}

		// Create and save message
		Message message =
				Message.builder().conversation( conversation ).sender( sender ).content( request.getContent() )
						.sentAt( LocalDateTime.now() ).isRead( false ).offerPrice( request.getOfferPrice() )
						.meetupLocation( request.getMeetupLocation() ).meetupTime( request.getMeetupTime() ).build();

		messageRepository.save( message );

		// Update conversation
		conversation.setLastMessageText( message.getContent() );
		conversation.setUpdatedAt( message.getSentAt() );

		// Update read status
		if ( conversation.getBuyer().getID().equals( senderId ) ) {
			conversation.setReadByBuyer( true );
			conversation.setReadBySeller( false );
		} else {
			conversation.setReadByBuyer( false );
			conversation.setReadBySeller( true );
		}

		conversationRepository.save( conversation );

		MessageDTO messageDTO = mapToMessageDTO( message );

		// Notify recipient via WebSocket
		webSocketNotificationService.notifyNewMessage( messageDTO, conversation.getId() );

		return messageDTO;
	}

	@Transactional
	public void markConversationAsRead( Long conversationId, Long userId ) {

		Conversation conversation = conversationRepository.findById( conversationId )
				.orElseThrow( () -> new ResponseStatusException( HttpStatus.NOT_FOUND, "Conversation not found" ) );

		if ( conversation.getBuyer().getID().equals( userId ) ) {
			conversation.setReadByBuyer( true );
		} else if ( conversation.getSeller().getID().equals( userId ) ) {
			conversation.setReadBySeller( true );
		} else {
			throw new ResponseStatusException( HttpStatus.FORBIDDEN, "Not authorized to access this conversation" );
		}

		conversationRepository.save( conversation );

		// Also mark all messages as read
		List<Message> messages = messageRepository.findAllByConversationId( conversationId );
		markMessagesAsRead( messages, userId );
	}

	@Transactional( readOnly = true )
	public Long getUnreadCount( Long userId ) {

		return conversationRepository.countUnreadByUserId( userId );
	}

	// Helper methods

	private void markMessagesAsRead( List<Message> messages, Long userId ) {

		List<Message> unreadMessages =
				messages.stream().filter( msg -> !msg.isRead() && !msg.getSender().getID().equals( userId ) )
						.collect( Collectors.toList() );

		if ( !unreadMessages.isEmpty() ) {
			unreadMessages.forEach( msg -> msg.setRead( true ) );
			messageRepository.saveAll( unreadMessages );
		}
	}

	private ConversationDTO mapToConversationDTO( Conversation conversation, Long currentUserId ) {

		boolean isUnread = false;

		if ( conversation.getBuyer().getID().equals( currentUserId ) ) {
			isUnread = !conversation.isReadByBuyer();
		} else if ( conversation.getSeller().getID().equals( currentUserId ) ) {
			isUnread = !conversation.isReadBySeller();
		}

		return ConversationDTO.builder().id( conversation.getId() ).itemId( conversation.getItem().getId() )
				.itemTitle( conversation.getItem().getTitle() ).buyerId( conversation.getBuyer().getID() )
				.buyerName( conversation.getBuyer().getUsername() ).sellerId( conversation.getSeller().getID() )
				.sellerName( conversation.getSeller().getUsername() ).createdAt( conversation.getCreatedAt() )
				.updatedAt( conversation.getUpdatedAt() ).lastMessage( conversation.getLastMessageText() )
				.unread( isUnread ).build();
	}

	private MessageDTO mapToMessageDTO( Message message ) {

		return MessageDTO.builder().id( message.getId() ).conversationId( message.getConversation().getId() )
				.senderId( message.getSender().getID() ).senderName( message.getSender().getUsername() )
				.content( message.getContent() ).sentAt( message.getSentAt() ).isRead( message.isRead() )
				.offerPrice( message.getOfferPrice() ).meetupLocation( message.getMeetupLocation() )
				.meetupTime( message.getMeetupTime() ).build();
	}
}