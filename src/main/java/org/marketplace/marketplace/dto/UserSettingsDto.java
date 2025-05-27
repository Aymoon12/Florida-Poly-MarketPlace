package org.marketplace.marketplace.dto;

import org.marketplace.marketplace.entities.UserSettings;

import lombok.Builder;
import lombok.Data;

/**
 * Data Transfer Object for UserSettings entity.
 * Used for transferring user settings data between layers.
 */
@Data
@Builder
public class UserSettingsDto {

    private Long id;
    private Long userId;
    
    // Notification preferences
    private boolean emailNotifications;
    private boolean pushNotifications;
    private boolean itemSoldNotifications;
    private boolean itemPurchasedNotifications;
    private boolean priceDropNotifications;
    private boolean messageNotifications;
    
    // Privacy settings
    private boolean showEmail;
    private boolean showPurchaseHistory;
    
    // Display preferences
    private boolean darkMode;
    private int itemsPerPage;
    
    // Communication preferences
    private boolean receiveMarketingEmails;
    private boolean receiveSurveyRequests;

    /**
     * Convert a UserSettings entity to a UserSettingsDto.
     *
     * @param settings The user settings entity to convert
     * @return A UserSettingsDto representing the user settings
     */
    public static UserSettingsDto from(UserSettings settings) {
        return UserSettingsDto.builder()
                .id(settings.getId())
                .userId(settings.getUser().getID())
                .emailNotifications(settings.isEmailNotifications())
                .pushNotifications(settings.isPushNotifications())
                .itemSoldNotifications(settings.isItemSoldNotifications())
                .itemPurchasedNotifications(settings.isItemPurchasedNotifications())
                .priceDropNotifications(settings.isPriceDropNotifications())
                .messageNotifications(settings.isMessageNotifications())
                .showEmail(settings.isShowEmail())
                .showPurchaseHistory(settings.isShowPurchaseHistory())
                .darkMode(settings.isDarkMode())
                .itemsPerPage(settings.getItemsPerPage())
                .receiveMarketingEmails(settings.isReceiveMarketingEmails())
                .receiveSurveyRequests(settings.isReceiveSurveyRequests())
                .build();
    }
}
