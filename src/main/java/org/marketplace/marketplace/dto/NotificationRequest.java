package org.marketplace.marketplace.dto;

import org.marketplace.marketplace.entities.NotificationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new notification.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequest {

	@NotNull( message = "User ID is required" )
	private Long userId;

	@NotBlank( message = "Title is required" )
	@Size( min = 1, max = 100, message = "Title must be between 1 and 100 characters" )
	private String title;

	@NotBlank( message = "Message is required" )
	@Size( min = 1, max = 500, message = "Message must be between 1 and 500 characters" )
	private String message;

	@NotNull( message = "Notification type is required" )
	private NotificationType type;

	private String actionUrl; // Optional

	private Long relatedItemId; // Optional
}
