import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {
    Avatar,
    Box,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import InboxIcon from '@mui/icons-material/Inbox';
import HomeIcon from '@mui/icons-material/Home';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    path: string;
    badge?: number;
}

interface DashboardSidebarProps {
    open?: boolean;
    onClose?: () => void;
    activeItem?: string;
}

const menuItems: MenuItem[] = [
    {icon: <DashboardIcon/>, label: 'Dashboard', path: '/listings'},
    {icon: <StorefrontIcon/>, label: 'My Listings', path: '/myselling'},
    {icon: <FavoriteIcon/>, label: 'Saved Items', path: '/saved'},
    {icon: <HistoryIcon/>, label: 'View History', path: '/viewHistory'},
    {icon: <InboxIcon/>, label: 'Messages', path: '/inbox'},
    {icon: <NotificationsIcon/>, label: 'Notifications', path: '/notifications'},
];

const secondaryItems: MenuItem[] = [
    {icon: <HomeIcon/>, label: 'Browse Marketplace', path: '/home'},
    {icon: <SettingsIcon/>, label: 'Settings', path: '/settings'},
];

const DRAWER_WIDTH = 260;

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
                                                               open = true,
                                                               onClose,
                                                           }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const userName = localStorage.getItem('name') || 'User';
    const userEmail = localStorage.getItem('email') || 'user@floridapoly.edu';
    const userInitials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    const handleNavigate = (path: string) => {
        navigate(path);
        if (isMobile && onClose) {
            onClose();
        }
    };

    const sidebarContent = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                pt: isMobile ? 2 : 10, // Account for AppBar height on desktop
            }}
        >
            {/* User Profile Section */}
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'primary.main',
                        fontSize: '1.125rem',
                        fontWeight: 600,
                    }}
                >
                    {userInitials}
                </Avatar>
                <Box sx={{minWidth: 0}}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {userName}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {userEmail}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{my: 1}}/>

            {/* Main Navigation */}
            <Box sx={{px: 1.5, py: 1}}>
                <Typography
                    variant="overline"
                    sx={{
                        px: 1.5,
                        color: 'text.secondary',
                        fontSize: '0.6875rem',
                    }}
                >
                    Dashboard
                </Typography>
                <List disablePadding>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <ListItemButton
                                key={item.path}
                                onClick={() => handleNavigate(item.path)}
                                selected={isActive}
                                sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                    '&.Mui-selected': {
                                        backgroundColor: theme.palette.mode === 'light'
                                            ? 'rgba(83, 45, 142, 0.08)'
                                            : 'rgba(139, 109, 196, 0.12)',
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === 'light'
                                                ? 'rgba(83, 45, 142, 0.12)'
                                                : 'rgba(139, 109, 196, 0.16)',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                        color: isActive ? 'primary.main' : 'text.secondary',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 500,
                                        fontSize: '0.9375rem',
                                        color: isActive ? 'primary.main' : 'text.primary',
                                    }}
                                />
                                {item.badge && (
                                    <Box
                                        sx={{
                                            minWidth: 20,
                                            height: 20,
                                            borderRadius: 10,
                                            backgroundColor: 'error.main',
                                            color: '#fff',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {item.badge}
                                    </Box>
                                )}
                            </ListItemButton>
                        );
                    })}
                </List>
            </Box>

            <Box sx={{flexGrow: 1}}/>

            {/* Secondary Navigation */}
            <Box sx={{px: 1.5, py: 1}}>
                <Divider sx={{mb: 1}}/>
                <List disablePadding>
                    {secondaryItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <ListItemButton
                                key={item.path}
                                onClick={() => handleNavigate(item.path)}
                                selected={isActive}
                                sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                        color: isActive ? 'primary.main' : 'text.secondary',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 500,
                                        fontSize: '0.9375rem',
                                        color: isActive ? 'primary.main' : 'text.primary',
                                    }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Box>

            {/* Footer */}
            <Box sx={{px: 3, py: 2}}>
                <Typography variant="caption" sx={{color: 'text.secondary'}}>
                    PolyMart © {new Date().getFullYear()}
                </Typography>
            </Box>
        </Box>
    );

    if (isMobile) {
        return (
            <Drawer
                anchor="left"
                open={open}
                onClose={onClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        backgroundColor: theme.palette.background.paper,
                    },
                }}
            >
                {sidebarContent}
            </Drawer>
        );
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    backgroundColor: theme.palette.background.paper,
                    borderRight: `1px solid ${theme.palette.divider}`,
                },
            }}
        >
            {sidebarContent}
        </Drawer>
    );
};

export default DashboardSidebar;
