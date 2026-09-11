package org.marketplace.marketplace.dto;

import org.marketplace.marketplace.entities.ReportReason;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateReportRequest {

	private Long reportedUserId;

	private Long reportedItemId;

	@NotNull( message = "Reason is required" )
	private ReportReason reason;

	@Size( max = 1000, message = "Description must be less than 1000 characters" )
	private String description;
}
