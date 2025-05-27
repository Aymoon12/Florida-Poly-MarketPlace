package org.marketplace.marketplace.repository;

import java.util.List;

import org.marketplace.marketplace.entities.Notification;
import org.marketplace.marketplace.entities.NotificationType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository for managing Notification entities.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

	/**
	 * Find all notifications for a specific user, ordered by creation date (newest first).
	 *
	 * @param userId
	 *            The ID of the user
	 * @return List of notifications
	 */
	@Query( "SELECT n FROM Notification n WHERE n.user.ID = :userId ORDER BY n.createdAt DESC" )
	List<Notification> findByUserId( @Param( "userId" ) Long userId );

	/**
	 * Find all notifications for a specific user with pagination, ordered by creation date (newest first).
	 *
	 * @param userId
	 *            The ID of the user
	 * @param pageable
	 *            Pagination information
	 * @return List of notifications
	 */
	@Query( "SELECT n FROM Notification n WHERE n.user.ID = :userId ORDER BY n.createdAt DESC" )
	List<Notification> findByUserId( @Param( "userId" ) Long userId, Pageable pageable );

	/**
	 * Find all unread notifications for a specific user.
	 *
	 * @param userId
	 *            The ID of the user
	 * @return List of unread notifications
	 */
	@Query( "SELECT n FROM Notification n WHERE n.user.ID = :userId AND n.isRead = false ORDER BY n.createdAt DESC" )
	List<Notification> findUnreadByUserId( @Param( "userId" ) Long userId );

	/**
	 * Count unread notifications for a specific user.
	 *
	 * @param userId
	 *            The ID of the user
	 * @return Count of unread notifications
	 */
	@Query( "SELECT COUNT(n) FROM Notification n WHERE n.user.ID = :userId AND n.isRead = false" )
	Long countUnreadByUserId( @Param( "userId" ) Long userId );

	/**
	 * Find notifications by type for a specific user.
	 *
	 * @param userId
	 *            The ID of the user
	 * @param type
	 *            The notification type
	 * @return List of notifications of the specified type
	 */
	@Query( "SELECT n FROM Notification n WHERE n.user.ID = :userId AND n.type = :type ORDER BY n.createdAt DESC" )
	List<Notification> findByUserIdAndType( @Param( "userId" ) Long userId, @Param( "type" ) NotificationType type );

	/**
	 * Count all notifications for a specific user.
	 *
	 * @param userId
	 *            The ID of the user
	 * @return Count of all notifications
	 */
	@Query( "SELECT COUNT(n) FROM Notification n WHERE n.user.ID = :userId" )
	Long countByUserId( @Param( "userId" ) Long userId );

	/**
	 * Mark all notifications as read for a specific user.
	 *
	 * @param userId
	 *            The ID of the user
	 * @return Number of notifications updated
	 */
	@Modifying
	@Query( "UPDATE Notification n SET n.isRead = true WHERE n.user.ID = :userId AND n.isRead = false" )
	int markAllAsRead( @Param( "userId" ) Long userId );

	/**
	 * Mark a specific notification as read.
	 *
	 * @param notificationId
	 *            The ID of the notification
	 * @return Number of notifications updated (should be 1 if successful)
	 */
	@Modifying
	@Query( "UPDATE Notification n SET n.isRead = true WHERE n.id = :notificationId" )
	int markAsRead( @Param( "notificationId" ) Long notificationId );
}
