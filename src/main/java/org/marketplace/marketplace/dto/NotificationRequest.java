package org.marketplace.marketplace.dto;

import org.marketplace.marketplace.entities.NotificationType;

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
    
    private Long userId;
    private String title;
    private String message;
    private NotificationType type;
    private String actionUrl;
    private Long relatedItemId;
}
