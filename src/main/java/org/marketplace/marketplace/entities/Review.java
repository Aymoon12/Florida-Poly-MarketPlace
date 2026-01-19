package org.marketplace.marketplace.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table( uniqueConstraints = { @UniqueConstraint( columnNames = { "sale_id", "review_type" } ) } )
@Builder
public class Review {

	@Id
	@GeneratedValue( strategy = GenerationType.AUTO )
	private Long id;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "sale_id", nullable = false )
	private Sale sale;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "reviewer_id", nullable = false )
	private User reviewer;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "reviewed_seller_id" )
	private User reviewedSeller;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "reviewed_item_id" )
	private Item reviewedItem;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "reviewed_buyer_id" )
	private User reviewedBuyer;

	@Column( name = "review_type", nullable = false )
	@Enumerated( EnumType.STRING )
	private ReviewType reviewType;

	@Column( name = "rating", nullable = false )
	private Integer rating;

	@Column( name = "comment", length = 1000 )
	private String comment;

	@Column( name = "created_at", nullable = false )
	private LocalDateTime createdAt;

}
