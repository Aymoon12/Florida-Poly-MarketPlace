package org.marketplace.marketplace.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.marketplace.marketplace.dto.NotificationDto;
import org.marketplace.marketplace.dto.NotificationRequest;
import org.marketplace.marketplace.entities.Notification;
import org.marketplace.marketplace.entities.NotificationType;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.NotificationRepository;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/**
 * Service for managing notifications.
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class NotificationService {

	private final NotificationRepository notificationRepository;
	private final UserRepository userRepository;

	/**
	 * Create a new notification.
	 *
	 * @param request
	 *            The notification request
	 * @return The created notification DTO
	 */
	@Transactional
	public NotificationDto createNotification( NotificationRequest request ) {

		try {
			User user = userRepository.findById( request.getUserId() )
					.orElseThrow( () -> new RuntimeException( "User not found with ID: " + request.getUserId() ) );

			Notification notification =
					Notification.builder().user( user ).title( request.getTitle() ).message( request.getMessage() )
							.type( request.getType() ).createdAt( LocalDateTime.now() ).isRead( false )
							.actionUrl( request.getActionUrl() ).relatedItemId( request.getRelatedItemId() ).build();

			Notification savedNotification = notificationRepository.save( notification );
			log.info( "Notification created for user {}: {}", user.getID(), request.getTitle() );
			return NotificationDto.from( savedNotification );
		} catch ( Exception e ) {
			log.error( "Error creating notification: {}", e.getMessage(), e );
			throw new RuntimeException( "Failed to create notification", e );
		}
	}

	/**
	 * Get all notifications for a user.
	 *
	 * @param userId
	 *            The ID of the user
	 * @return List of notification DTOs
	 */
	public List<NotificationDto> getUserNotifications( Long userId ) {

		try {
			List<Notification> notifications = notificationRepository.findByUserId( userId );
			return notifications.stream().map( NotificationDto::from ).collect( Collectors.toList() );
		} catch ( Exception e ) {
			log.error( "Error fetching notifications for user {}: {}", userId, e.getMessage(), e );
			throw new RuntimeException( "Failed to fetch notifications", e );
		}
	}

	/**
	 * Get paginated notifications for a user.
	 *
	 * @param userId
	 *            The ID of the user
	 * @param page
	 *            The page number
	 * @param size
	 *            The page size
	 * @return List of notification DTOs
	 */
	public List<NotificationDto> getUserNotificationsPaginated( Long userId, int page, int size ) {

		try {
			Pageable pageable = PageRequest.of( page, size );
			List<Notification> notifications = notificationRepository.findByUserId( userId, pageable );
			return notifications.stream().map( NotificationDto::from ).collect( Collectors.toList() );
		} catch ( Exception e ) {
			log.error( "Error fetching paginated notifications for user {}: {}", userId, e.getMessage(), e );
			throw new RuntimeException( "Failed to fetch paginated notifications", e );
		}
	}

	/**
	 * Get unread notifications for a user.
	 *
	 * @param userId
	 *            The ID of the user
	 * @return List of unread notification DTOs
	 */
	public List<NotificationDto> getUnreadNotifications( Long userId ) {

		try {
			List<Notification> notifications = notificationRepository.findUnreadByUserId( userId );
			return notifications.stream().map( NotificationDto::from ).collect( Collectors.toList() );
		} catch ( Exception e ) {
			log.error( "Error fetching unread notifications for user {}: {}", userId, e.getMessage(), e );
			throw new RuntimeException( "Failed to fetch unread notifications", e );
		}
	}

	/**
	 * Count unread notifications for a user.
	 *
	 * @param userId
	 *            The ID of the user
	 * @return Count of unread notifications
	 */
	public Long countUnreadNotifications( Long userId ) {

		try {
			return notificationRepository.countUnreadByUserId( userId );
		} catch ( Exception e ) {
			log.error( "Error counting unread notifications for user {}: {}", userId, e.getMessage(), e );
			throw new RuntimeException( "Failed to count unread notifications", e );
		}
	}

	/**
	 * Mark a notification as read.
	 *
	 * @param notificationId
	 *            The ID of the notification
	 * @return True if successful, false otherwise
	 */
	@Transactional
	public boolean markAsRead( Long notificationId ) {

		try {
			int updated = notificationRepository.markAsRead( notificationId );
			return updated > 0;
		} catch ( Exception e ) {
			log.error( "Error marking notification {} as read: {}", notificationId, e.getMessage(), e );
			throw new RuntimeException( "Failed to mark notification as read", e );
		}
	}

	/**
	 * Mark all notifications as read for a user.
	 *
	 * @param userId
	 *            The ID of the user
	 * @return Number of notifications marked as read
	 */
	@Transactional
	public int markAllAsRead( Long userId ) {

		try {
			int updated = notificationRepository.markAllAsRead( userId );
			log.info( "Marked {} notifications as read for user {}", updated, userId );
			return updated;
		} catch ( Exception e ) {
			log.error( "Error marking all notifications as read for user {}: {}", userId, e.getMessage(), e );
			throw new RuntimeException( "Failed to mark all notifications as read", e );
		}
	}

	/**
	 * Delete a notification.
	 *
	 * @param notificationId
	 *            The ID of the notification
	 * @return True if successful, false otherwise
	 */
	@Transactional
	public boolean deleteNotification( Long notificationId ) {

		try {
			notificationRepository.deleteById( notificationId );
			log.info( "Notification deleted: {}", notificationId );
			return true;
		} catch ( Exception e ) {
			log.error( "Error deleting notification {}: {}", notificationId, e.getMessage(), e );
			throw new RuntimeException( "Failed to delete notification", e );
		}
	}

	/**
	 * Count all notifications for a user.
	 *
	 * @param userId
	 *            The ID of the user
	 * @return Count of all notifications
	 */
	public Long countUserNotifications( Long userId ) {

		try {
			return notificationRepository.countByUserId( userId );
		} catch ( Exception e ) {
			log.error( "Error counting notifications for user {}: {}", userId, e.getMessage(), e );
			return 0L;
		}
	}

	/**
	 * Get notifications by type for a user.
	 *
	 * @param userId
	 *            The ID of the user
	 * @param type
	 *            The notification type
	 * @return List of notification DTOs of the specified type
	 */
	public List<NotificationDto> getNotificationsByType( Long userId, NotificationType type ) {

		try {
			List<Notification> notifications = notificationRepository.findByUserIdAndType( userId, type );
			return notifications.stream().map( NotificationDto::from ).collect( Collectors.toList() );
		} catch ( Exception e ) {
			log.error( "Error fetching notifications of type {} for user {}: {}", type, userId, e.getMessage(), e );
			throw new RuntimeException( "Failed to fetch notifications by type", e );
		}
	}
}
