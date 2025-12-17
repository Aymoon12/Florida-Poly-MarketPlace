package org.marketplace.marketplace.controllers;

import java.util.List;

import org.marketplace.marketplace.dto.ConversationDTO;
import org.marketplace.marketplace.dto.CreateConversationRequest;
import org.marketplace.marketplace.dto.MessageDTO;
import org.marketplace.marketplace.dto.SendMessageRequest;
import org.marketplace.marketplace.services.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping( "/api/v1/chat" )
@RequiredArgsConstructor
public class ChatController {

	private final ChatService chatService;

	@GetMapping( "/conversations" )
	public ResponseEntity<List<ConversationDTO>> getUserConversations( @RequestParam Long userId ) {

		return ResponseEntity.ok( chatService.getUserConversations( userId ) );
	}

	@GetMapping( "/conversation/{conversationId}" )
	public ResponseEntity<ConversationDTO> getConversation( @PathVariable Long conversationId,
			@RequestParam Long userId ) {

		return ResponseEntity.ok( chatService.getConversation( conversationId, userId ) );
	}

	@GetMapping( "/messages/{conversationId}" )
	public ResponseEntity<List<MessageDTO>> getConversationMessages( @PathVariable Long conversationId,
			@RequestParam Long userId ) {

		return ResponseEntity.ok( chatService.getConversationMessages( conversationId, userId ) );
	}

	@PostMapping( "/start" )
	public ResponseEntity<ConversationDTO> startConversation( @Valid @RequestBody CreateConversationRequest request ) {

		return ResponseEntity.ok( chatService.createConversation( request ) );
	}

	@PostMapping( "/send" )
	public ResponseEntity<MessageDTO> sendMessage( @Valid @RequestBody SendMessageRequest request,
			@RequestParam Long userId ) {

		return ResponseEntity.ok( chatService.sendMessage( request, userId ) );
	}

	@PostMapping( "/mark-read/{conversationId}" )
	public ResponseEntity<Void> markConversationAsRead( @PathVariable Long conversationId, @RequestParam Long userId ) {

		chatService.markConversationAsRead( conversationId, userId );
		return ResponseEntity.ok().build();
	}

	@GetMapping( "/unread-count" )
	public ResponseEntity<Long> getUnreadCount( @RequestParam Long userId ) {

		return ResponseEntity.ok( chatService.getUnreadCount( userId ) );
	}
}