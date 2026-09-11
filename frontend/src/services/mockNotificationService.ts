// Define the notification interface
export interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    createdAt: string;
    isRead: boolean;
    actionUrl: string;
    relatedItemId: number | null;
    relativeTime: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
    {
        id: 1,
        title: "Item Sold",
        message: "Your item 'MacBook Pro 2020' has been sold.",
        type: "ITEM_SOLD",
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isRead: false,
        actionUrl: "/myselling",
        relatedItemId: 1,
        relativeTime: "1 hour ago"
    },
    {
        id: 2,
        title: "Price Drop Alert",
        message: "An item on your wishlist 'Calculator TI-84' has dropped in price.",
        type: "PRICE_DROP",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        isRead: true,
        actionUrl: "/item/5",
        relatedItemId: 5,
        relativeTime: "1 day ago"
    },
    {
        id: 3,
        title: "New Message",
        message: "You have received a new message about 'Engineering Toolkit'.",
        type: "NEW_MESSAGE",
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        isRead: false,
        actionUrl: "/messages",
        relatedItemId: 2,
        relativeTime: "2 days ago"
    },
    {
        id: 4,
        title: "Welcome to PolyMart",
        message: "Welcome to PolyMart! Start browsing items or create your first listing.",
        type: "SYSTEM_ALERT",
        createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
        isRead: true,
        actionUrl: "/home",
        relatedItemId: null,
        relativeTime: "7 days ago"
    }
];

// Mock notification service
export const mockNotificationService = {
    // Get all notifications
    getAllNotifications: (): Promise<Notification[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...mockNotifications]);
            }, 500);
        });
    },

    // Get unread notifications
    getUnreadNotifications: (): Promise<Notification[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockNotifications.filter(notification => !notification.isRead));
            }, 500);
        });
    },

    // Get unread count
    getUnreadCount: (): Promise<number> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockNotifications.filter(notification => !notification.isRead).length);
            }, 300);
        });
    },

    // Get unread count for a specific user
    getUserUnreadCount: (_userId: string): Promise<number> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // In a real implementation, this would filter notifications by userId
                resolve(mockNotifications.filter(notification => !notification.isRead).length);
            }, 300);
        });
    },

    // Mark notification as read
    markAsRead: (id: number): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockNotifications.findIndex(notification => notification.id === id);
                if (index !== -1) {
                    mockNotifications[index].isRead = true;
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 300);
        });
    },

    // Mark all as read
    markAllAsRead: (): Promise<number> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let count = 0;
                mockNotifications.forEach(notification => {
                    if (!notification.isRead) {
                        notification.isRead = true;
                        count++;
                    }
                });
                resolve(count);
            }, 300);
        });
    },

    // Delete notification
    deleteNotification: (id: number): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockNotifications.findIndex(notification => notification.id === id);
                if (index !== -1) {
                    mockNotifications.splice(index, 1);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 300);
        });
    }
};
