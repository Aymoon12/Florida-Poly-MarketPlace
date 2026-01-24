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
@Table( name = "reports", indexes = {
		@Index( name = "idx_report_reporter_id", columnList = "reporter_id" ),
		@Index( name = "idx_report_reported_user_id", columnList = "reported_user_id" ),
		@Index( name = "idx_report_status", columnList = "status" )
} )
@Builder
public class Report {

	@Id
	@GeneratedValue( strategy = GenerationType.AUTO )
	private Long id;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "reporter_id", nullable = false )
	private User reporter;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "reported_user_id" )
	private User reportedUser;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "reported_item_id" )
	private Item reportedItem;

	@Column( name = "reason", nullable = false )
	@Enumerated( EnumType.STRING )
	private ReportReason reason;

	@Column( name = "description", length = 1000 )
	private String description;

	@Column( name = "status", nullable = false )
	@Enumerated( EnumType.STRING )
	@Builder.Default
	private ReportStatus status = ReportStatus.PENDING;

	@Column( name = "created_at", nullable = false )
	private LocalDateTime createdAt;

	@Column( name = "resolved_at" )
	private LocalDateTime resolvedAt;

}
