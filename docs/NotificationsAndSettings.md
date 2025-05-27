# Notifications and Settings Features Documentation

This document provides comprehensive documentation for the Notifications and Settings features implemented in the Florida Poly MarketPlace application.

## Table of Contents

1. [Overview](#overview)
2. [Backend Implementation](#backend-implementation)
   - [Entities](#entities)
   - [Repositories](#repositories)
   - [DTOs](#dtos)
   - [Services](#services)
   - [Controllers](#controllers)
3. [Frontend Implementation](#frontend-implementation)
   - [Components](#components)
   - [Pages](#pages)
   - [Integration](#integration)
4. [API Reference](#api-reference)
5. [Usage Examples](#usage-examples)
6. [Troubleshooting](#troubleshooting)

## Overview

The Notifications and Settings features enhance the user experience by providing:

- **Notifications**: A system to inform users about important events such as item sales, purchases, price drops, and system alerts.
- **Settings**: User-configurable preferences for notifications, privacy, display, and communication.

These features are fully integrated with the existing application architecture and follow the same design patterns and coding standards.

## Backend Implementation

### Entities

#### Notification Entity

The `Notification` entity represents a notification in the system:

```java
@Entity
@Table
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "read", nullable = false)
    private boolean read;

    @Column(name = "action_url")
    private String actionUrl;

    @Column(name = "related_item_id")
    private Long relatedItemId;
}
```

#### NotificationType Enum

The `NotificationType` enum defines different types of notifications:

```java
public enum NotificationType {
    ITEM_SOLD,           // When an item is sold
    ITEM_PURCHASED,      // When a user purchases an item
    PRICE_DROP,          // When an item's price is reduced
    NEW_MESSAGE,         // When a user receives a new message
    SYSTEM_ALERT,        // System-wide alerts or announcements
    ITEM_EXPIRING,       // When a listing is about to expire
    PAYMENT_RECEIVED,    // When payment is received
    PAYMENT_SENT,        // When payment is sent
    ITEM_VIEWED,         // When an item gets significant views
    WISHLIST_ITEM_AVAILABLE // When a wishlist item becomes available
}
```

#### UserSettings Entity

The `UserSettings` entity represents user-configurable preferences:

```java
@Entity
@Table
public class UserSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Notification preferences
    @Column(name = "email_notifications", nullable = false)
    private boolean emailNotifications;

    @Column(name = "push_notifications", nullable = false)
    private boolean pushNotifications;

    @Column(name = "item_sold_notifications", nullable = false)
    private boolean itemSoldNotifications;

    @Column(name = "item_purchased_notifications", nullable = false)
    private boolean itemPurchasedNotifications;

    @Column(name = "price_drop_notifications", nullable = false)
    private boolean priceDropNotifications;

    @Column(name = "message_notifications", nullable = false)
    private boolean messageNotifications;

    // Privacy settings
    @Column(name = "show_email", nullable = false)
    private boolean showEmail;

    @Column(name = "show_purchase_history", nullable = false)
    private boolean showPurchaseHistory;

    // Display preferences
    @Column(name = "dark_mode", nullable = false)
    private boolean darkMode;

    @Column(name = "items_per_page", nullable = false)
    private int itemsPerPage;

    // Communication preferences
    @Column(name = "receive_marketing_emails", nullable = false)
    private boolean receiveMarketingEmails;

    @Column(name = "receive_survey_requests", nullable = false)
    private boolean receiveSurveyRequests;
}
```

### Repositories

#### NotificationRepository

The `NotificationRepository` provides methods for accessing and manipulating notifications:

```java
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(@Param("userId") Long userId);
    List<Notification> findByUserId(@Param("userId") Long userId, Pageable pageable);
    List<Notification> findUnreadByUserId(@Param("userId") Long userId);
    Long countUnreadByUserId(@Param("userId") Long userId);
    List<Notification> findByUserIdAndType(@Param("userId") Long userId, @Param("type") NotificationType type);
    int markAllAsRead(@Param("userId") Long userId);
    int markAsRead(@Param("notificationId") Long notificationId);
}
```

#### UserSettingsRepository

The `UserSettingsRepository` provides methods for accessing and manipulating user settings:

```java
@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    Optional<UserSettings> findByUserId(@Param("userId") Long userId);
}
```

### DTOs

#### NotificationDto

The `NotificationDto` is used for transferring notification data:

```java
@Data
@Builder
public class NotificationDto {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private LocalDateTime createdAt;
    private boolean read;
    private String actionUrl;
    private Long relatedItemId;
    private String relativeTime; // "2 hours ago", "5 minutes ago", etc.

    public static NotificationDto from(Notification notification) {
        // Conversion logic
    }
}
```

#### UserSettingsDto

The `UserSettingsDto` is used for transferring user settings data:

```java
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

    public static UserSettingsDto from(UserSettings settings) {
        // Conversion logic
    }
}
```

### Services

#### NotificationService

The `NotificationService` provides business logic for notifications:

```java
@Service
@RequiredArgsConstructor
@Log4j2
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationDto createNotification(NotificationRequest request);
    public List<NotificationDto> getUserNotifications(Long userId);
    public List<NotificationDto> getUserNotificationsPaginated(Long userId, int page, int size);
    public List<NotificationDto> getUnreadNotifications(Long userId);
    public Long countUnreadNotifications(Long userId);
    public boolean markAsRead(Long notificationId);
    public int markAllAsRead(Long userId);
    public boolean deleteNotification(Long notificationId);
    public List<NotificationDto> getNotificationsByType(Long userId, NotificationType type);
}
```

#### UserSettingsService

The `UserSettingsService` provides business logic for user settings:

```java
@Service
@RequiredArgsConstructor
@Log4j2
public class UserSettingsService {
    private final UserSettingsRepository userSettingsRepository;
    private final UserRepository userRepository;

    public UserSettingsDto getUserSettings(Long userId);
    public UserSettingsDto updateUserSettings(UserSettingsRequest request);
    public UserSettings createDefaultSettings(Long userId);
    public UserSettingsDto resetUserSettings(Long userId);
}
```

### Controllers

#### NotificationController

The `NotificationController` exposes REST endpoints for notifications:

```java
@RestController
@RequestMapping("api/v1/notifications")
@CrossOrigin
@RequiredArgsConstructor
@Log4j2
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationDto> createNotification(@RequestBody NotificationRequest request);

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDto>> getUserNotifications(@PathVariable Long userId);

    @GetMapping("/user/{userId}/paginated")
    public ResponseEntity<List<NotificationDto>> getUserNotificationsPaginated(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size);

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationDto>> getUnreadNotifications(@PathVariable Long userId);

    @GetMapping("/user/{userId}/unread/count")
    public ResponseEntity<Long> countUnreadNotifications(@PathVariable Long userId);

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Boolean> markAsRead(@PathVariable Long notificationId);

    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Integer> markAllAsRead(@PathVariable Long userId);

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Boolean> deleteNotification(@PathVariable Long notificationId);

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<NotificationDto>> getNotificationsByType(
            @PathVariable Long userId,
            @PathVariable NotificationType type);
}
```

#### UserSettingsController

The `UserSettingsController` exposes REST endpoints for user settings:

```java
@RestController
@RequestMapping("api/v1/settings")
@CrossOrigin
@RequiredArgsConstructor
@Log4j2
public class UserSettingsController {
    private final UserSettingsService userSettingsService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<UserSettingsDto> getUserSettings(@PathVariable Long userId);

    @PutMapping
    public ResponseEntity<UserSettingsDto> updateUserSettings(@RequestBody UserSettingsRequest request);

    @PostMapping("/user/{userId}/reset")
    public ResponseEntity<UserSettingsDto> resetUserSettings(@PathVariable Long userId);
}
```

## Frontend Implementation

### Components

#### NotificationBadge Component

The `NotificationBadge` component displays a badge with the count of unread notifications:

```tsx
const NotificationBadge: React.FC<NotificationBadgeProps> = ({ color = 'primary' }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnreadCount();
    
    // Set up polling to check for new notifications every minute
    const intervalId = setInterval(fetchUnreadCount, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchUnreadCount = async () => {
    // Implementation
  };

  return (
    <Tooltip title="Notifications">
      <IconButton 
        color={color} 
        onClick={() => navigate('/notifications')}
        aria-label="notifications"
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          max={99}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};
```

### Pages

#### NotificationsPage

The `NotificationsPage` displays and manages user notifications:

Key features:
- View all notifications
- Filter by read/unread status
- Mark notifications as read
- Delete notifications
- Navigate to related items

#### SettingsPage

The `SettingsPage` allows users to configure their preferences:

Key features:
- Notification preferences
- Privacy settings
- Display preferences
- Communication preferences
- Save and reset settings

### Integration

The notifications and settings features are integrated with the existing application through:

1. **Navigation**: Links in the header and sidebar
2. **Notification Badge**: Real-time display of unread notifications
3. **User Profile**: Settings accessible from the user avatar
4. **Event Triggers**: Notifications generated on specific events (item sold, purchased, etc.)

## API Reference

### Notifications API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/notifications` | POST | Create a new notification |
| `/api/v1/notifications/user/{userId}` | GET | Get all notifications for a user |
| `/api/v1/notifications/user/{userId}/paginated` | GET | Get paginated notifications for a user |
| `/api/v1/notifications/user/{userId}/unread` | GET | Get unread notifications for a user |
| `/api/v1/notifications/user/{userId}/unread/count` | GET | Count unread notifications for a user |
| `/api/v1/notifications/{notificationId}/read` | PUT | Mark a notification as read |
| `/api/v1/notifications/user/{userId}/read-all` | PUT | Mark all notifications as read for a user |
| `/api/v1/notifications/{notificationId}` | DELETE | Delete a notification |
| `/api/v1/notifications/user/{userId}/type/{type}` | GET | Get notifications by type for a user |

### Settings API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/settings/user/{userId}` | GET | Get settings for a user |
| `/api/v1/settings` | PUT | Update user settings |
| `/api/v1/settings/user/{userId}/reset` | POST | Reset user settings to default values |

## Usage Examples

### Creating a Notification

When an item is sold, create a notification for the seller:

```java
// In SaleService.java
public Boolean itemSold(final Long itemId, final Long buyerId) {
    try {
        // Existing code...
        
        // Create notification for seller
        notificationService.createNotification(NotificationRequest.builder()
            .userId(item.getUser().getID())
            .title("Item Sold")
            .message("Your item '" + item.getTitle() + "' has been sold.")
            .type(NotificationType.ITEM_SOLD)
            .relatedItemId(itemId)
            .build());
            
        // Create notification for buyer
        notificationService.createNotification(NotificationRequest.builder()
            .userId(buyerId)
            .title("Item Purchased")
            .message("You have purchased '" + item.getTitle() + "'.")
            .type(NotificationType.ITEM_PURCHASED)
            .relatedItemId(itemId)
            .build());
            
        return true;
    } catch (Exception e) {
        log.error(e.getMessage(), e);
    }
    return false;
}
```

### Updating User Settings

Example of updating user settings from the frontend:

```typescript
const handleSaveSettings = async () => {
    if (!settings || !userId) return;
    
    setSaving(true);
    try {
        await axios.put('/api/v1/settings', {
            userId: parseInt(userId),
            emailNotifications: settings.emailNotifications,
            pushNotifications: settings.pushNotifications,
            // Other settings...
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        
        setSnackbarMessage("Settings saved successfully");
        setSnackbarOpen(true);
        setHasChanges(false);
    } catch (err) {
        console.error("Error saving settings:", err);
        setSnackbarMessage("Failed to save settings");
        setSnackbarOpen(true);
    } finally {
        setSaving(false);
    }
};
```

## Troubleshooting

### Common Issues

1. **Notifications not appearing**
   - Check if the user is authenticated
   - Verify that the notification service is properly configured
   - Check for errors in the browser console or server logs

2. **Settings not saving**
   - Ensure the user ID is correctly passed in the request
   - Verify that the request format matches the expected format
   - Check for validation errors in the server logs

3. **Badge count not updating**
   - Ensure the polling interval is working correctly
   - Check for network errors in the browser console
   - Verify that the notification count endpoint is returning the correct data

### Debugging Tips

1. Enable debug logging in the backend:
   ```properties
   logging.level.org.marketplace.marketplace.services=DEBUG
   ```

2. Use browser developer tools to inspect network requests and responses

3. Add console logging in the frontend components to track state changes

4. Check the database directly to verify that notifications and settings are being stored correctly
