package org.marketplace.marketplace.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing user settings in the system.
 * Contains various preferences and settings for a user.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
@Builder
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
