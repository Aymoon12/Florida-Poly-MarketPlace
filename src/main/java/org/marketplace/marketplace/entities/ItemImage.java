package org.marketplace.marketplace.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
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
@Table( name = "item_image", indexes = {
		@Index( name = "idx_item_image_item_id", columnList = "item_id" )
} )
@Builder
public class ItemImage {

	@Id
	@GeneratedValue( strategy = GenerationType.AUTO )
	private Long id;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "item_id", nullable = false )
	private Item item;

	@Column( name = "object_key", nullable = false )
	private String objectKey;

	@Column( name = "content_type" )
	private String contentType;

	@Column( name = "created_at", nullable = false )
	private LocalDateTime createdAt;

}
