package org.marketplace.marketplace.controllers;

import org.marketplace.marketplace.dto.UserSettingsDto;
import org.marketplace.marketplace.dto.UserSettingsRequest;
import org.marketplace.marketplace.services.UserSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/**
 * REST controller for managing user settings.
 */
@RestController
@RequestMapping("api/v1/settings")
@CrossOrigin
@RequiredArgsConstructor
@Log4j2
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    /**
     * Get settings for a user.
     *
     * @param userId The ID of the user
     * @return The user settings
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<UserSettingsDto> getUserSettings(@PathVariable Long userId) {
        log.info("Fetching settings for user: {}", userId);
        UserSettingsDto settings = userSettingsService.getUserSettings(userId);
        return ResponseEntity.ok(settings);
    }

    /**
     * Update user settings.
     *
     * @param request The settings update request
     * @return The updated user settings
     */
    @PutMapping
    public ResponseEntity<UserSettingsDto> updateUserSettings(@RequestBody UserSettingsRequest request) {
        log.info("Updating settings for user: {}", request.getUserId());
        UserSettingsDto settings = userSettingsService.updateUserSettings(request);
        return ResponseEntity.ok(settings);
    }

    /**
     * Reset user settings to default values.
     *
     * @param userId The ID of the user
     * @return The reset user settings
     */
    @PostMapping("/user/{userId}/reset")
    public ResponseEntity<UserSettingsDto> resetUserSettings(@PathVariable Long userId) {
        log.info("Resetting settings for user: {}", userId);
        UserSettingsDto settings = userSettingsService.resetUserSettings(userId);
        return ResponseEntity.ok(settings);
    }
}
