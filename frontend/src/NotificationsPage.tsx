import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Avatar,
    Badge,
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Snackbar,
    Tab,
    Tabs,
    Typography,
    useTheme,
    alpha,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EmailIcon from "@mui/icons-material/Email";
import WarningIcon from "@mui/icons-material/Warning";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { PageLayout, DashboardSidebar } from "./components/layout";
import { LoadingState, EmptyState } from "./components/common";
import { useNotifications } from "./services/NotificationContext";

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

const notificationTypeIcons: Record<string, React.ReactNode> = {
    ITEM_SOLD: <ShoppingBagIcon sx={{ color: "success.main" }} />,
    ITEM_PURCHASED: <ShoppingBagIcon sx={{ color: "info.main" }} />,
    PRICE_DROP: <LocalOfferIcon sx={{ color: "warning.main" }} />,
    NEW_MESSAGE: <EmailIcon sx={{ color: "secondary.main" }} />,
    SYSTEM_ALERT: <WarningIcon sx={{ color: "error.main" }} />,
    ITEM_EXPIRING: <AccessTimeIcon sx={{ color: "text.secondary" }} />,
    PAYMENT_RECEIVED: <ShoppingBagIcon sx={{ color: "success.main" }} />,
    PAYMENT_SENT: <ShoppingBagIcon sx={{ color: "error.main" }} />,
    ITEM_VIEWED: <VisibilityIcon sx={{ color: "text.secondary" }} />,
    WISHLIST_ITEM_AVAILABLE: <FavoriteIcon sx={{ color: "error.main" }} />,
};

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const {
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
    } = useNotifications();

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const loadNotifications = async () => {
            setLoading(true);
            try {
                await fetchNotifications();
                setError(null);
            } catch (err) {
                console.error("Error fetching notifications:", err);
                setError("Could not load notifications. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadNotifications();
        } else {
            setError("User not authenticated");
            setLoading(false);
        }
    }, [userId, fetchNotifications]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleMarkAsReadWrapper = async (notificationId: number, event?: React.MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }

        try {
            await markAsRead(notificationId);
            setSnackbarMessage("Notification marked as read");
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Error marking notification as read:", err);
            setSnackbarMessage("Failed to mark notification as read");
            setSnackbarOpen(true);
        }
    };

    const handleMarkAllAsReadWrapper = async () => {
        try {
            await markAllAsRead();
            setSnackbarMessage("All notifications marked as read");
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Error marking all notifications as read:", err);
            setSnackbarMessage("Failed to mark all notifications as read");
            setSnackbarOpen(true);
        }
    };

    const handleDeleteNotificationWrapper = async (notificationId: number, event?: React.MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }

        try {
            await deleteNotification(notificationId);
            setSnackbarMessage("Notification deleted");
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Error deleting notification:", err);
            setSnackbarMessage("Failed to delete notification");
            setSnackbarOpen(true);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            handleMarkAsReadWrapper(notification.id);
        }

        if (notification.actionUrl) {
            navigate(notification.actionUrl);
        } else if (notification.relatedItemId) {
            navigate(`/item/${notification.relatedItemId}`);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const displayedNotifications = tabValue === 0
        ? notifications
        : notifications.filter(n => !n.isRead);

    return (
        <PageLayout variant="dashboard" showCategories={false} showFooter={false}>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={handleSnackbarClose}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
                {/* Sidebar */}
                <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <Box sx={{
                    flex: 1,
                    p: { xs: 2, md: 4 },
                    ml: { xs: 0, md: '260px' },
                    maxWidth: { md: 'calc(100% - 260px)' },
                }}>
                    {error && (
                        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                    Notifications
                                </Typography>
                                {unreadCount > 0 && (
                                    <Chip
                                        label={`${unreadCount} new`}
                                        size="small"
                                        sx={{
                                            bgcolor: alpha(theme.palette.error.main, 0.1),
                                            color: 'error.main',
                                            fontWeight: 600,
                                        }}
                                    />
                                )}
                            </Box>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                Stay updated with your marketplace activity
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<MarkEmailReadIcon />}
                                onClick={handleMarkAllAsReadWrapper}
                                disabled={unreadCount === 0}
                                sx={{ borderRadius: 2, fontWeight: 600 }}
                            >
                                Mark All Read
                            </Button>
                        </Box>
                    </Box>

                    {/* Tabs */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
                            <Tabs value={tabValue} onChange={handleTabChange}>
                                <Tab label={`All (${notifications.length})`} />
                                <Tab label={`Unread (${unreadCount})`} />
                            </Tabs>
                        </Box>

                        {loading ? (
                            <Box sx={{ p: 4 }}>
                                <LoadingState message="Loading notifications..." />
                            </Box>
                        ) : displayedNotifications.length === 0 ? (
                            <Box sx={{ p: 4 }}>
                                <EmptyState
                                    type="notifications"
                                    title={tabValue === 0 ? "No notifications yet" : "All caught up!"}
                                    description={tabValue === 0
                                        ? "You don't have any notifications yet. When you do, they'll appear here."
                                        : "You have no unread notifications. Great job staying on top of things!"}
                                />
                            </Box>
                        ) : (
                            <List sx={{ p: 0 }}>
                                {displayedNotifications.map((notification, index) => (
                                    <React.Fragment key={notification.id}>
                                        <ListItem
                                            alignItems="flex-start"
                                            sx={{
                                                py: 2.5,
                                                px: 3,
                                                backgroundColor: notification.isRead
                                                    ? 'transparent'
                                                    : alpha(theme.palette.primary.main, 0.04),
                                                transition: 'background-color 0.2s',
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                },
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: notification.isRead
                                                            ? theme.palette.mode === 'light'
                                                                ? theme.palette.grey[100]
                                                                : theme.palette.grey[800]
                                                            : alpha(theme.palette.primary.main, 0.1),
                                                        color: notification.isRead
                                                            ? 'text.secondary'
                                                            : 'primary.main'
                                                    }}
                                                >
                                                    {notificationTypeIcons[notification.type] || <NotificationsNoneIcon />}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                                fontWeight: notification.isRead ? 500 : 600,
                                                                color: 'text.primary'
                                                            }}
                                                        >
                                                            {notification.title}
                                                        </Typography>
                                                        {!notification.isRead && (
                                                            <Chip
                                                                label="New"
                                                                size="small"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: '0.625rem',
                                                                    bgcolor: 'primary.main',
                                                                    color: 'white',
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}
                                                        >
                                                            {notification.message}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{ color: 'text.disabled' }}
                                                        >
                                                            {notification.relativeTime}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                                {!notification.isRead && (
                                                    <IconButton
                                                        aria-label="mark as read"
                                                        onClick={(e) => handleMarkAsReadWrapper(notification.id, e)}
                                                        sx={{
                                                            mr: 1,
                                                            color: 'primary.main'
                                                        }}
                                                        size="small"
                                                    >
                                                        <MarkEmailReadIcon />
                                                    </IconButton>
                                                )}
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={(e) => handleDeleteNotificationWrapper(notification.id, e)}
                                                    sx={{ color: 'error.main' }}
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </ListItem>
                                        {index < displayedNotifications.length - 1 && (
                                            <Divider component="li" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Box>
            </Box>
        </PageLayout>
    );
};

export default NotificationsPage;
