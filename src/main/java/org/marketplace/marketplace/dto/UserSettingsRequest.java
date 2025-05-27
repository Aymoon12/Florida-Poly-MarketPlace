package org.marketplace.marketplace.dto;

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
    
    private Long userId;
    
    // Notification preferences
    private Boolean emailNotifications;
    private Boolean pushNotifications;
    private Boolean itemSoldNotifications;
    private Boolean itemPurchasedNotifications;
    private Boolean priceDropNotifications;
    private Boolean messageNotifications;
    
    // Privacy settings
    private Boolean showEmail;
    private Boolean showPurchaseHistory;
    
    // Display preferences
    private Boolean darkMode;
    private Integer itemsPerPage;
    
    // Communication preferences
    private Boolean receiveMarketingEmails;
    private Boolean receiveSurveyRequests;
}
