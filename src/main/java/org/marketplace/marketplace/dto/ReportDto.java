package org.marketplace.marketplace.dto;

import java.time.LocalDateTime;

import org.marketplace.marketplace.entities.Report;
import org.marketplace.marketplace.entities.ReportReason;
import org.marketplace.marketplace.entities.ReportStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReportDto {

	private Long id;
	private Long reporterId;
	private String reporterName;
	private Long reportedUserId;
	private String reportedUserName;
	private Long reportedItemId;
	private String reportedItemTitle;
	private ReportReason reason;
	private String description;
	private ReportStatus status;
	private LocalDateTime createdAt;
	private LocalDateTime resolvedAt;

	public static ReportDto from( Report report ) {

		return ReportDto.builder()
				.id( report.getId() )
				.reporterId( report.getReporter().getID() )
				.reporterName( report.getReporter().getName() )
				.reportedUserId( report.getReportedUser() != null ? report.getReportedUser().getID() : null )
				.reportedUserName( report.getReportedUser() != null ? report.getReportedUser().getName() : null )
				.reportedItemId( report.getReportedItem() != null ? report.getReportedItem().getId() : null )
				.reportedItemTitle( report.getReportedItem() != null ? report.getReportedItem().getTitle() : null )
				.reason( report.getReason() )
				.description( report.getDescription() )
				.status( report.getStatus() )
				.createdAt( report.getCreatedAt() )
				.resolvedAt( report.getResolvedAt() )
				.build();
	}
}
