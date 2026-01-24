import React, { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react';
import api from './api';

interface Notification {
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

interface NotificationContextType {
    unreadCount: number;
    notifications: Notification[];
    fetchUnreadCount: () => Promise<void>;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const isLoadingRef = useRef(false);
    const lastFetchTimeRef = useRef(0);
    const FETCH_COOLDOWN = 5000; // 5 seconds cooldown between fetches

    const fetchUnreadCount = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            // Don't make another request if one is in progress or if cooldown hasn't expired
            const now = Date.now();
            if (isLoadingRef.current || (now - lastFetchTimeRef.current < FETCH_COOLDOWN)) {
                return;
            }

            isLoadingRef.current = true;
            lastFetchTimeRef.current = now;

            const response = await api.get(`/api/v1/notifications/user/${userId}/unread`);

            if (response.data && Array.isArray(response.data)) {
                setUnreadCount(response.data.length);
            }
        } catch (error) {
            console.error('Error fetching unread notifications count:', error);
            setUnreadCount(0);
        } finally {
            isLoadingRef.current = false;
        }
    };

    const fetchNotifications = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            // Don't make another request if one is in progress or if cooldown hasn't expired
            const now = Date.now();
            if (isLoadingRef.current || (now - lastFetchTimeRef.current < FETCH_COOLDOWN)) {
                return;
            }

            isLoadingRef.current = true;
            lastFetchTimeRef.current = now;

            const response = await api.get(`/api/v1/notifications/user/${userId}`);

            if (response.data && Array.isArray(response.data)) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            // Fall back to empty array or mock data if needed
            setNotifications([]);
        } finally {
            isLoadingRef.current = false;
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await api.put(`/api/v1/notifications/${id}/read`, {});

            // Update local state
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === id ? { ...notification, isRead: true } : notification
                )
            );

            // Update unread count by decrementing instead of refetching
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            await api.put(`/api/v1/notifications/user/${userId}/read-all`, {});

            // Update local state
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, isRead: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const deleteNotification = async (id: number) => {
        try {
            await api.delete(`/api/v1/notifications/${id}`);

            // Update local state
            const wasUnread = notifications.find(n => n.id === id && !n.isRead);
            setNotifications(prev => prev.filter(notification => notification.id !== id));

            // If we deleted an unread notification, decrement the count
            if (wasUnread) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    // Initial fetch when the app loads
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchUnreadCount();
        }
        
        // Set up interval for periodic checking
        const intervalId = setInterval(() => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                fetchUnreadCount();
            }
        }, 60000); // Check every minute
        
        return () => clearInterval(intervalId);
    }, []);

    const value = {
        unreadCount,
        notifications,
        fetchUnreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext; 