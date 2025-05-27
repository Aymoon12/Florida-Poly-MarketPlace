package org.marketplace.marketplace.entities;

/**
 * Enum representing different types of notifications in the system.
 */
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
