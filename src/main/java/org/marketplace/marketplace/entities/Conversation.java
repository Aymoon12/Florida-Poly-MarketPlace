package org.marketplace.marketplace.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table( name = "conversations", indexes = {
		@Index( name = "idx_conversation_buyer_id", columnList = "buyer_id" ),
		@Index( name = "idx_conversation_seller_id", columnList = "seller_id" ),
		@Index( name = "idx_conversation_item_id", columnList = "item_id" )
} )
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Conversation {

	@Id
	@GeneratedValue( strategy = GenerationType.AUTO )
	private Long id;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "item_id", nullable = false )
	private Item item;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "buyer_id", nullable = false )
	private User buyer;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "seller_id", nullable = false )
	private User seller;

	@Column( name = "created_at", nullable = false )
	private LocalDateTime createdAt;

	@Column( name = "updated_at", nullable = false )
	private LocalDateTime updatedAt;

	@Column( name = "last_message" )
	private String lastMessageText;

	@Column( name = "is_read_by_buyer" )
	private boolean isReadByBuyer;

	@Column( name = "is_read_by_seller" )
	private boolean isReadBySeller;

	@OneToMany( mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<Message> messages = new ArrayList<>();

	// Helper method to add a message to this conversation
	public void addMessage( Message message ) {

		messages.add( message );
		message.setConversation( this );
		this.lastMessageText = message.getContent();
		this.updatedAt = LocalDateTime.now();

		// Update read status based on sender
		if ( message.getSender().getID().equals( buyer.getID() ) ) {
			this.isReadByBuyer = true;
			this.isReadBySeller = false;
		} else {
			this.isReadByBuyer = false;
			this.isReadBySeller = true;
		}
	}
}
