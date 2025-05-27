package org.marketplace.marketplace.services;

import org.marketplace.marketplace.dto.UserSettingsDto;
import org.marketplace.marketplace.dto.UserSettingsRequest;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.entities.UserSettings;
import org.marketplace.marketplace.repository.UserRepository;
import org.marketplace.marketplace.repository.UserSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/**
 * Service for managing user settings.
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;
    private final UserRepository userRepository;

    /**
     * Get settings for a user. If settings don't exist, create default settings.
     *
     * @param userId The ID of the user
     * @return The user settings DTO
     */
    public UserSettingsDto getUserSettings(Long userId) {
        try {
            return userSettingsRepository.findByUserId(userId)
                    .map(UserSettingsDto::from)
                    .orElseGet(() -> {
                        // Create default settings if none exist
                        UserSettings defaultSettings = createDefaultSettings(userId);
                        return UserSettingsDto.from(defaultSettings);
                    });
        } catch (Exception e) {
            log.error("Error fetching settings for user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch user settings", e);
        }
    }

    /**
     * Update user settings.
     *
     * @param request The settings update request
     * @return The updated user settings DTO
     */
    @Transactional
    public UserSettingsDto updateUserSettings(UserSettingsRequest request) {
        try {
            Long userId = request.getUserId();
            UserSettings settings = userSettingsRepository.findByUserId(userId)
                    .orElseGet(() -> createDefaultSettings(userId));

            // Update only the fields that are provided in the request
            if (request.getEmailNotifications() != null) {
                settings.setEmailNotifications(request.getEmailNotifications());
            }
            if (request.getPushNotifications() != null) {
                settings.setPushNotifications(request.getPushNotifications());
            }
            if (request.getItemSoldNotifications() != null) {
                settings.setItemSoldNotifications(request.getItemSoldNotifications());
            }
            if (request.getItemPurchasedNotifications() != null) {
                settings.setItemPurchasedNotifications(request.getItemPurchasedNotifications());
            }
            if (request.getPriceDropNotifications() != null) {
                settings.setPriceDropNotifications(request.getPriceDropNotifications());
            }
            if (request.getMessageNotifications() != null) {
                settings.setMessageNotifications(request.getMessageNotifications());
            }
            if (request.getShowEmail() != null) {
                settings.setShowEmail(request.getShowEmail());
            }
            if (request.getShowPurchaseHistory() != null) {
                settings.setShowPurchaseHistory(request.getShowPurchaseHistory());
            }
            if (request.getDarkMode() != null) {
                settings.setDarkMode(request.getDarkMode());
            }
            if (request.getItemsPerPage() != null) {
                settings.setItemsPerPage(request.getItemsPerPage());
            }
            if (request.getReceiveMarketingEmails() != null) {
                settings.setReceiveMarketingEmails(request.getReceiveMarketingEmails());
            }
            if (request.getReceiveSurveyRequests() != null) {
                settings.setReceiveSurveyRequests(request.getReceiveSurveyRequests());
            }

            UserSettings savedSettings = userSettingsRepository.save(settings);
            log.info("Settings updated for user {}", userId);
            return UserSettingsDto.from(savedSettings);
        } catch (Exception e) {
            log.error("Error updating settings: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update user settings", e);
        }
    }

    /**
     * Create default settings for a user.
     *
     * @param userId The ID of the user
     * @return The created default user settings
     */
    @Transactional
    public UserSettings createDefaultSettings(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            UserSettings defaultSettings = UserSettings.builder()
                    .user(user)
                    .emailNotifications(true)
                    .pushNotifications(true)
                    .itemSoldNotifications(true)
                    .itemPurchasedNotifications(true)
                    .priceDropNotifications(true)
                    .messageNotifications(true)
                    .showEmail(false)
                    .showPurchaseHistory(false)
                    .darkMode(false)
                    .itemsPerPage(10)
                    .receiveMarketingEmails(true)
                    .receiveSurveyRequests(true)
                    .build();

            UserSettings savedSettings = userSettingsRepository.save(defaultSettings);
            log.info("Default settings created for user {}", userId);
            return savedSettings;
        } catch (Exception e) {
            log.error("Error creating default settings for user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to create default user settings", e);
        }
    }

    /**
     * Reset user settings to default values.
     *
     * @param userId The ID of the user
     * @return The reset user settings DTO
     */
    @Transactional
    public UserSettingsDto resetUserSettings(Long userId) {
        try {
            // Delete existing settings if they exist
            userSettingsRepository.findByUserId(userId).ifPresent(settings -> 
                userSettingsRepository.deleteById(settings.getId())
            );
            
            // Create new default settings
            UserSettings defaultSettings = createDefaultSettings(userId);
            log.info("Settings reset to default for user {}", userId);
            return UserSettingsDto.from(defaultSettings);
        } catch (Exception e) {
            log.error("Error resetting settings for user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to reset user settings", e);
        }
    }
}
