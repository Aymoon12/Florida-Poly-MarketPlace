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
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table( name = "blocked_users",
		uniqueConstraints = {
				@UniqueConstraint( columnNames = { "blocker_id", "blocked_id" } )
		},
		indexes = {
				@Index( name = "idx_blocked_blocker_id", columnList = "blocker_id" ),
				@Index( name = "idx_blocked_blocked_id", columnList = "blocked_id" )
		} )
@Builder
public class BlockedUser {

	@Id
	@GeneratedValue( strategy = GenerationType.AUTO )
	private Long id;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "blocker_id", nullable = false )
	private User blocker;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "blocked_id", nullable = false )
	private User blocked;

	@Column( name = "created_at", nullable = false )
	private LocalDateTime createdAt;

}
