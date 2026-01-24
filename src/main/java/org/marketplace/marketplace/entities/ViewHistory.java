package org.marketplace.marketplace.entities;

import java.time.ZonedDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table( name = "view_history", indexes = {
		@Index( name = "idx_viewhistory_user_item", columnList = "user_id, item_id" ),
		@Index( name = "idx_viewhistory_user_id", columnList = "user_id" ),
		@Index( name = "idx_viewhistory_viewed_at", columnList = "viewedAt" )
} )
@Builder
public class ViewHistory {

	@Id
	@GeneratedValue( strategy = GenerationType.AUTO )
	private Long id;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "user_id" )
	private User user;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "item_id" )
	private Item item;

	private ZonedDateTime viewedAt = ZonedDateTime.now();
}
