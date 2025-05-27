import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import polylogo from "./assets/poly-logo.webp";
import {
    Alert,
    Avatar,
    Badge,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Paper,
    Snackbar,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EmailIcon from "@mui/icons-material/Email";
import WarningIcon from "@mui/icons-material/Warning";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import { useNotifications } from "./services/NotificationContext";

// Define the notification interface
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

// Mock notifications for fallback when API fails
const mockNotifications: Notification[] = [
    {
        id: 1,
        title: "Item Sold",
        message: "Your item 'MacBook Pro' has been sold.",
        type: "ITEM_SOLD",
        createdAt: "2023-04-05T10:30:00",
        isRead: false,
        actionUrl: "/listings",
        relatedItemId: 123,
        relativeTime: "2 hours ago"
    },
    {
        id: 2,
        title: "New Message",
        message: "You have a new message from John regarding 'iPhone 13'.",
        type: "NEW_MESSAGE",
        createdAt: "2023-04-05T09:15:00",
        isRead: true,
        actionUrl: "/messages/45",
        relatedItemId: 456,
        relativeTime: "3 hours ago"
    },
    {
        id: 3,
        title: "Price Drop Alert",
        message: "A MacBook Air on your watchlist has dropped in price.",
        type: "PRICE_DROP",
        createdAt: "2023-04-04T18:45:00",
        isRead: false,
        actionUrl: "/item/789",
        relatedItemId: 789,
        relativeTime: "1 day ago"
    }
];

// Define the notification type to icon mapping
const notificationTypeIcons: Record<string, React.ReactNode> = {
    ITEM_SOLD: <ShoppingBagIcon sx={{color: "#4caf50"}}/>,
    ITEM_PURCHASED: <ShoppingBagIcon sx={{color: "#2196f3"}}/>,
    PRICE_DROP: <LocalOfferIcon sx={{color: "#ff9800"}}/>,
    NEW_MESSAGE: <EmailIcon sx={{color: "#9c27b0"}}/>,
    SYSTEM_ALERT: <WarningIcon sx={{color: "#f44336"}}/>,
    ITEM_EXPIRING: <AccessTimeIcon sx={{color: "#795548"}}/>,
    PAYMENT_RECEIVED: <ShoppingBagIcon sx={{color: "#4caf50"}}/>,
    PAYMENT_SENT: <ShoppingBagIcon sx={{color: "#f44336"}}/>,
    ITEM_VIEWED: <VisibilityIcon sx={{color: "#607d8b"}}/>,
    WISHLIST_ITEM_AVAILABLE: <FavoriteIcon sx={{color: "#e91e63"}}/>,
};

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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
        <Box sx={{display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc"}}>
            {/* Sidebar */}
            <Box
                sx={{
                    width: 280,
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                    position: "fixed",
                    height: "100vh",
                    zIndex: 1,
                    overflowY: "auto"
                }}
            >
                <Box
                    component="img"
                    src={polylogo}
                    alt="Logo"
                    sx={{height: 60, width: 60, mb: 3}}
                    onClick={() => navigate("/home")}
                    style={{cursor: "pointer"}}
                />
                <Typography variant="h4" sx={{
                    fontWeight: "bold",
                    background: "linear-gradient(45deg, #6b46c1 30%, #805ad5 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 3
                }}>
                    Dashboard
                </Typography>
                <List sx={{flexGrow: 1}}>
                    {[
                        {label: "Home", path: "/home"},
                        {label: "Dashboard", path: "/listings"},
                        {label: "My Selling", path: "/myselling"},
                        {label: "My Buying", path: "/mybuying"},
                        {label: "Notifications", path: "/notifications"},
                        {label: "Settings", path: "/settings"},
                    ].map((item) => (
                        <ListItem key={item.label} disablePadding sx={{mb: 1}}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: item.label === "Notifications" ? "rgba(107, 70, 193, 0.08)" : "transparent",
                                    '&:hover': {
                                        backgroundColor: 'rgba(107, 70, 193, 0.08)',
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        variant: "body1",
                                        sx: {
                                            color: item.label === "Notifications" ? "#6b46c1" : "#4a5568",
                                            textTransform: "none",
                                            fontWeight: item.label === "Notifications" ? 600 : 500
                                        },
                                    }}
                                />
                                {item.label === "Notifications" && (
                                    <Badge
                                        badgeContent={unreadCount}
                                        color="error"
                                        sx={{ml: 1}}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Main Content */}
            <Box sx={{flex: 1, p: 4, ml: "280px", maxWidth: "calc(100% - 280px)"}}>
                {error && (
                    <Alert severity="warning" sx={{mb: 3, borderRadius: 2}}>
                        {error}
                    </Alert>
                )}

                {/* Header */}
                <Box sx={{display: 'flex', alignItems: 'center', mb: 4}}>
                    <Button
                        startIcon={<ArrowBackIcon/>}
                        onClick={() => navigate(-1)}
                        sx={{
                            color: "#6b46c1",
                            textTransform: "none",
                            fontWeight: 600,
                            mr: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(107, 70, 193, 0.08)',
                            }
                        }}
                    >
                        Back
                    </Button>
                    <Typography variant="h4" sx={{
                        fontWeight: "bold",
                        background: "linear-gradient(45deg, #6b46c1 30%, #805ad5 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        Notifications
                    </Typography>
                    <Badge
                        badgeContent={unreadCount}
                        color="error"
                        sx={{ml: 2}}
                    >
                        <NotificationsIcon sx={{fontSize: 28, color: "#6b46c1"}}/>
                    </Badge>
                </Box>

                {/* Tabs and Actions */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexDirection: {xs: 'column', sm: 'row'},
                    gap: {xs: 2, sm: 0}
                }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                color: '#4b5563',
                                '&.Mui-selected': {
                                    color: '#6b46c1',
                                }
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#6b46c1',
                            },
                            width: {xs: '100%', sm: 'auto'}
                        }}
                    >
                        <Tab label="All Notifications"/>
                        <Tab label={
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                Unread
                                <Badge
                                    badgeContent={unreadCount}
                                    color="error"
                                    sx={{ml: 1}}
                                />
                            </Box>
                        }/>
                    </Tabs>

                    <Box sx={{
                        display: 'flex',
                        width: {xs: '100%', sm: 'auto'},
                        justifyContent: {xs: 'center', sm: 'flex-end'}
                    }}>
                        <Button
                            startIcon={<MarkEmailReadIcon/>}
                            onClick={handleMarkAllAsReadWrapper}
                            sx={{
                                color: "#6b46c1",
                                textTransform: "none",
                                fontWeight: 600,
                                mr: 1,
                                '&:hover': {
                                    backgroundColor: 'rgba(107, 70, 193, 0.08)',
                                }
                            }}
                            disabled={unreadCount === 0}
                        >
                            Mark All as Read
                        </Button>
                        <Button
                            startIcon={<FilterListIcon/>}
                            sx={{
                                color: "#6b46c1",
                                textTransform: "none",
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: 'rgba(107, 70, 193, 0.08)',
                                }
                            }}
                        >
                            Filter
                        </Button>
                    </Box>
                </Box>

                {/* Notifications List */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid #e5e7eb',
                        mb: 4
                    }}
                >
                    {loading ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8}}>
                            <CircularProgress sx={{color: "#6b46c1"}}/>
                        </Box>
                    ) : displayedNotifications.length === 0 ? (
                        <Box sx={{py: 8, textAlign: 'center'}}>
                            <NotificationsIcon sx={{fontSize: 48, color: "#a0aec0", mb: 2}}/>
                            <Typography variant="h6" sx={{color: "#4a5568", mb: 1}}>
                                No notifications
                            </Typography>
                            <Typography variant="body1" sx={{color: "#718096"}}>
                                {tabValue === 0 ? "You don't have any notifications yet." : "You don't have any unread notifications."}
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{p: 0}}>
                            {displayedNotifications.map((notification, index) => (
                                <React.Fragment key={notification.id}>
                                    <ListItem
                                        alignItems="flex-start"
                                        sx={{
                                            py: 2,
                                            px: 3,
                                            backgroundColor: notification.isRead ? 'transparent' : 'rgba(107, 70, 193, 0.04)',
                                            transition: 'background-color 0.2s',
                                            '&:hover': {
                                                backgroundColor: 'rgba(107, 70, 193, 0.08)',
                                            },
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    bgcolor: notification.isRead ? '#e2e8f0' : '#e9d8fd',
                                                    color: notification.isRead ? '#718096' : '#6b46c1'
                                                }}
                                            >
                                                {notificationTypeIcons[notification.type] || <NotificationsIcon/>}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            fontWeight: notification.isRead ? 500 : 600,
                                                            color: "#4a5568"
                                                        }}
                                                    >
                                                        {notification.title}
                                                    </Typography>
                                                    {!notification.isRead && (
                                                        <Chip
                                                            label="New"
                                                            size="small"
                                                            sx={{
                                                                ml: 1,
                                                                height: 20,
                                                                fontSize: '0.625rem',
                                                                backgroundColor: "#6b46c1",
                                                                color: "white",
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
                                                        sx={{color: "#718096", mb: 1, display: 'block'}}
                                                    >
                                                        {notification.message}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{color: "#a0aec0"}}
                                                    >
                                                        {notification.relativeTime}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <Box sx={{display: 'flex', alignItems: 'center', ml: 2}}>
                                            {!notification.isRead && (
                                                <IconButton
                                                    aria-label="mark as read"
                                                    onClick={(e) => handleMarkAsReadWrapper(notification.id, e)}
                                                    sx={{
                                                        mr: 1,
                                                        color: "#6b46c1"
                                                    }}
                                                    size="small"
                                                >
                                                    <MarkEmailReadIcon/>
                                                </IconButton>
                                            )}
                                            <IconButton
                                                aria-label="delete"
                                                onClick={(e) => handleDeleteNotificationWrapper(notification.id, e)}
                                                sx={{
                                                    color: "#f56565"
                                                }}
                                                size="small"
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Box>
                                    </ListItem>
                                    {index < displayedNotifications.length - 1 && <Divider component="li"/>}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Paper>
            </Box>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            />
        </Box>
    );
};

export default NotificationsPage;
