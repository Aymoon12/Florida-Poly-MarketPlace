package org.marketplace.marketplace.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating user settings.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserSettingsRequest {

	@NotNull( message = "User ID is required" )
	private Long userId;

	// Notification preferences (all optional - null means no change)
	private Boolean emailNotifications;
	private Boolean pushNotifications;
	private Boolean itemSoldNotifications;
	private Boolean itemPurchasedNotifications;
	private Boolean priceDropNotifications;
	private Boolean messageNotifications;

	// Privacy settings (optional)
	private Boolean showEmail;
	private Boolean showPurchaseHistory;

	// Display preferences
	private Boolean darkMode;

	@Min( value = 5, message = "Items per page must be at least 5" )
	@Max( value = 100, message = "Items per page must be at most 100" )
	private Integer itemsPerPage;

	// Communication preferences (optional)
	private Boolean receiveMarketingEmails;
	private Boolean receiveSurveyRequests;
}
