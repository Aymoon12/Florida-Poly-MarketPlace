package org.marketplace.marketplace.controllers;

import java.util.List;

import org.marketplace.marketplace.dto.ConversationDTO;
import org.marketplace.marketplace.dto.CreateConversationRequest;
import org.marketplace.marketplace.dto.MessageDTO;
import org.marketplace.marketplace.dto.SendMessageRequest;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.services.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping( "/api/v1/chat" )
@RequiredArgsConstructor
public class ChatController {

	private final ChatService chatService;

	@GetMapping( "/conversations" )
	public ResponseEntity<List<ConversationDTO>> getUserConversations( @AuthenticationPrincipal User user ) {

		return ResponseEntity.ok( chatService.getUserConversations( user.getID() ) );
	}

	@GetMapping( "/conversation/{conversationId}" )
	public ResponseEntity<ConversationDTO> getConversation( @AuthenticationPrincipal User user,
			@PathVariable Long conversationId ) {

		return ResponseEntity.ok( chatService.getConversation( conversationId, user.getID() ) );
	}

	@GetMapping( "/messages/{conversationId}" )
	public ResponseEntity<List<MessageDTO>> getConversationMessages( @AuthenticationPrincipal User user,
			@PathVariable Long conversationId ) {

		return ResponseEntity.ok( chatService.getConversationMessages( conversationId, user.getID() ) );
	}

	@PostMapping( "/start" )
	public ResponseEntity<ConversationDTO> startConversation( @Valid @RequestBody CreateConversationRequest request ) {

		return ResponseEntity.ok( chatService.createConversation( request ) );
	}

	@PostMapping( "/send" )
	public ResponseEntity<MessageDTO> sendMessage( @AuthenticationPrincipal User user,
			@Valid @RequestBody SendMessageRequest request ) {

		return ResponseEntity.ok( chatService.sendMessage( request, user.getID() ) );
	}

	@PostMapping( "/mark-read/{conversationId}" )
	public ResponseEntity<Void> markConversationAsRead( @AuthenticationPrincipal User user,
			@PathVariable Long conversationId ) {

		chatService.markConversationAsRead( conversationId, user.getID() );
		return ResponseEntity.ok().build();
	}

	@GetMapping( "/unread-count" )
	public ResponseEntity<Long> getUnreadCount( @AuthenticationPrincipal User user ) {

		return ResponseEntity.ok( chatService.getUnreadCount( user.getID() ) );
	}
}
