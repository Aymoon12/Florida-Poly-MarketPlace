package org.marketplace.marketplace.dto;

import java.time.LocalDateTime;

import org.marketplace.marketplace.entities.Notification;
import org.marketplace.marketplace.entities.NotificationType;

import lombok.Builder;
import lombok.Data;

/**
 * Data Transfer Object for Notification entity.
 * Used for transferring notification data between layers.
 */
@Data
@Builder
public class NotificationDto {

    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private LocalDateTime createdAt;
    private boolean isRead;
    private String actionUrl;
    private Long relatedItemId;
    private String relativeTime; // "2 hours ago", "5 minutes ago", etc.

    /**
     * Convert a Notification entity to a NotificationDto.
     *
     * @param notification The notification entity to convert
     * @return A NotificationDto representing the notification
     */
    public static NotificationDto from(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .createdAt(notification.getCreatedAt())
                .isRead(notification.isRead())
                .actionUrl(notification.getActionUrl())
                .relatedItemId(notification.getRelatedItemId())
                .relativeTime(formatRelativeTime(notification.getCreatedAt()))
                .build();
    }

    /**
     * Format the creation time as a relative time string (e.g., "2 hours ago").
     *
     * @param dateTime The date and time to format
     * @return A string representing the relative time
     */
    private static String formatRelativeTime(LocalDateTime dateTime) {
        LocalDateTime now = LocalDateTime.now();
        long minutesDiff = java.time.Duration.between(dateTime, now).toMinutes();

        if (minutesDiff < 1) {
            return "just now";
        } else if (minutesDiff < 60) {
            return minutesDiff + " minute" + (minutesDiff == 1 ? "" : "s") + " ago";
        } else if (minutesDiff < 24 * 60) {
            long hours = minutesDiff / 60;
            return hours + " hour" + (hours == 1 ? "" : "s") + " ago";
        } else if (minutesDiff < 48 * 60) {
            return "yesterday";
        } else {
            long days = minutesDiff / (24 * 60);
            return days + " day" + (days == 1 ? "" : "s") + " ago";
        }
    }
}
