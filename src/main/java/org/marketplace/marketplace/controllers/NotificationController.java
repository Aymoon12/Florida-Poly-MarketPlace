package org.marketplace.marketplace.controllers;

import java.util.List;

import org.marketplace.marketplace.dto.NotificationDto;
import org.marketplace.marketplace.dto.NotificationRequest;
import org.marketplace.marketplace.entities.NotificationType;
import org.marketplace.marketplace.services.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/**
 * REST controller for managing notifications.
 */
@RestController
@RequestMapping("api/v1/notifications")
@CrossOrigin
@RequiredArgsConstructor
@Log4j2
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Create a new notification.
     *
     * @param request The notification request
     * @return The created notification
     */
    @PostMapping
    public ResponseEntity<NotificationDto> createNotification(@RequestBody NotificationRequest request) {
        log.info("Creating notification: {}", request);
        NotificationDto notification = notificationService.createNotification(request);
        return ResponseEntity.ok(notification);
    }

    /**
     * Get all notifications for a user.
     *
     * @param userId The ID of the user
     * @return List of notifications
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDto>> getUserNotifications(@PathVariable Long userId) {
        log.info("Fetching notifications for user: {}", userId);
        List<NotificationDto> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get paginated notifications for a user.
     *
     * @param userId The ID of the user
     * @param page The page number (0-based)
     * @param size The page size
     * @return List of notifications
     */
    @GetMapping("/user/{userId}/paginated")
    public ResponseEntity<List<NotificationDto>> getUserNotificationsPaginated(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Fetching paginated notifications for user: {}, page: {}, size: {}", userId, page, size);
        List<NotificationDto> notifications = notificationService.getUserNotificationsPaginated(userId, page, size);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notifications for a user.
     *
     * @param userId The ID of the user
     * @return List of unread notifications
     */
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationDto>> getUnreadNotifications(@PathVariable Long userId) {
        log.info("Fetching unread notifications for user: {}", userId);
        List<NotificationDto> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Count unread notifications for a user.
     *
     * @param userId The ID of the user
     * @return Count of unread notifications
     */
    @GetMapping("/user/{userId}/unread/count")
    public ResponseEntity<Long> countUnreadNotifications(@PathVariable Long userId) {
        log.info("Counting unread notifications for user: {}", userId);
        Long count = notificationService.countUnreadNotifications(userId);
        return ResponseEntity.ok(count);
    }

    /**
     * Mark a notification as read.
     *
     * @param notificationId The ID of the notification
     * @return Success status
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Boolean> markAsRead(@PathVariable Long notificationId) {
        log.info("Marking notification as read: {}", notificationId);
        boolean success = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(success);
    }

    /**
     * Mark all notifications as read for a user.
     *
     * @param userId The ID of the user
     * @return Number of notifications marked as read
     */
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Integer> markAllAsRead(@PathVariable Long userId) {
        log.info("Marking all notifications as read for user: {}", userId);
        int count = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(count);
    }

    /**
     * Delete a notification.
     *
     * @param notificationId The ID of the notification
     * @return Success status
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Boolean> deleteNotification(@PathVariable Long notificationId) {
        log.info("Deleting notification: {}", notificationId);
        boolean success = notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok(success);
    }

    /**
     * Get notifications by type for a user.
     *
     * @param userId The ID of the user
     * @param type The notification type
     * @return List of notifications of the specified type
     */
    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<NotificationDto>> getNotificationsByType(
            @PathVariable Long userId,
            @PathVariable NotificationType type) {
        log.info("Fetching notifications of type {} for user: {}", type, userId);
        List<NotificationDto> notifications = notificationService.getNotificationsByType(userId, type);
        return ResponseEntity.ok(notifications);
    }
}
