import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  InputAdornment,
  InputBase,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useTheme,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DevicesIcon from '@mui/icons-material/Devices';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import SettingsIcon from '@mui/icons-material/Settings';
import InboxIcon from '@mui/icons-material/Inbox';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import polylogo from '../../assets/poly-logo.webp';
import CartIcon from '../CartIcon';
import { useThemeMode } from '../../theme';

interface AppNavbarProps {
  showSearch?: boolean;
  showCategories?: boolean;
  currentTab?: number;
  onTabChange?: (event: React.SyntheticEvent, newValue: number) => void;
  notificationCount?: number;
  favoriteCount?: number;
}

const categories = [
  { icon: <HomeIcon />, label: 'Home', value: 'All' },
  { icon: <DevicesIcon />, label: 'Electronics', value: 'Electronics' },
  { icon: <MenuBookIcon />, label: 'Textbooks', value: 'Textbooks' },
  { icon: <CheckroomIcon />, label: 'Apparel', value: 'Fashion' },
  { icon: <SportsSoccerIcon />, label: 'Sports Gear', value: 'Sports' },
  { icon: <StorefrontIcon />, label: 'Dorm & Living', value: 'Other' },
  { icon: <StorefrontIcon />, label: 'Collectibles', value: 'Collectibles' },
  { icon: <MiscellaneousServicesIcon />, label: 'Services', value: 'Services' },
];

const AppNavbar: React.FC<AppNavbarProps> = ({
  showSearch = true,
  showCategories = true,
  currentTab = 0,
  onTabChange,
  notificationCount = 0,
  favoriteCount = 0,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const userName = localStorage.getItem('name') || 'User';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onClick={() => navigate('/home')}
          >
            <Box
              component="img"
              src={polylogo}
              alt="PolyMart Logo"
              sx={{ height: 40, width: 40, mr: 1 }}
            />
            {!isMobile && (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  letterSpacing: '-0.02em',
                }}
              >
                PolyMart
              </Typography>
            )}
          </Box>

          {/* Search Bar */}
          {showSearch && !isMobile && (
            <Box sx={{ flexGrow: 1, maxWidth: 600, mx: 3 }}>
              <Paper
                component="form"
                onSubmit={handleSearchSubmit}
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[800],
                  borderRadius: '50px',
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover, &:focus-within': {
                    boxShadow: theme.palette.mode === 'light'
                      ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                      : '0 2px 8px rgba(0, 0, 0, 0.3)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <InputBase
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    flexGrow: 1,
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                    '& input': {
                      '&::placeholder': {
                        color: theme.palette.text.secondary,
                        opacity: 1,
                      },
                    },
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  }
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: 0,
                    px: 3,
                    py: 1.25,
                    height: '100%',
                    minHeight: 44,
                  }}
                >
                  Search
                </Button>
              </Paper>
            </Box>
          )}

          {/* Navigation Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            {/* Theme Toggle */}
            <IconButton
              onClick={toggleTheme}
              sx={{ color: 'text.secondary' }}
              aria-label="toggle theme"
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            {!isMobile && (
              <>
                <IconButton
                  sx={{ color: 'text.secondary' }}
                  onClick={() => navigate('/myselling')}
                  aria-label="favorites"
                >
                  <Badge badgeContent={favoriteCount} color="error">
                    <FavoriteIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  sx={{ color: 'text.secondary' }}
                  onClick={() => navigate('/notifications')}
                  aria-label="notifications"
                >
                  <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  sx={{ color: 'text.secondary' }}
                  onClick={() => navigate('/inbox')}
                  aria-label="messages"
                >
                  <InboxIcon />
                </IconButton>
              </>
            )}

            <CartIcon />

            {!isMobile && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create-listing')}
                sx={{
                  ml: 1,
                  borderRadius: 50,
                  px: 2.5,
                }}
              >
                Sell
              </Button>
            )}

            <Avatar
              sx={{
                width: 36,
                height: 36,
                ml: 1,
                cursor: 'pointer',
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
              onClick={() => navigate('/settings')}
            >
              {userInitials}
            </Avatar>
          </Box>
        </Toolbar>

        {/* Category Tabs */}
        {showCategories && !isMobile && (
          <Box
            sx={{
              backgroundColor: theme.palette.mode === 'light'
                ? theme.palette.grey[50]
                : theme.palette.grey[900],
              px: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Tabs
              value={currentTab}
              onChange={onTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 48,
                '& .MuiTab-root': {
                  minHeight: 48,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              {categories.map((cat) => (
                <Tab key={cat.value} label={cat.label} />
              ))}
            </Tabs>
          </Box>
        )}
      </AppBar>

      {/* Mobile Search Bar - Fixed below AppBar */}
      {showSearch && isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.drawer,
            backgroundColor: theme.palette.background.paper,
            p: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Paper
            component="form"
            onSubmit={handleSearchSubmit}
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[800],
              borderRadius: '50px',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <InputBase
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flexGrow: 1,
                px: 2,
                py: 1,
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              }
            />
          </Paper>
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            pt: 2,
          },
        }}
      >
        <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src={polylogo}
            alt="PolyMart Logo"
            sx={{ height: 36, width: 36 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            PolyMart
          </Typography>
        </Box>

        <Divider />

        <List>
          {categories.map((cat, index) => (
            <ListItemButton
              key={cat.value}
              selected={currentTab === index}
              onClick={() => {
                if (onTabChange) {
                  onTabChange({} as React.SyntheticEvent, index);
                }
                setMobileMenuOpen(false);
              }}
            >
              <ListItemIcon sx={{ color: currentTab === index ? 'primary.main' : 'text.secondary' }}>
                {cat.icon}
              </ListItemIcon>
              <ListItemText primary={cat.label} />
            </ListItemButton>
          ))}
        </List>

        <Divider />

        <List>
          <ListItemButton onClick={() => { navigate('/create-listing'); setMobileMenuOpen(false); }}>
            <ListItemIcon sx={{ color: 'primary.main' }}>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Sell an Item" />
          </ListItemButton>

          <ListItemButton onClick={() => { navigate('/myselling'); setMobileMenuOpen(false); }}>
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="My Listings" />
          </ListItemButton>

          <ListItemButton onClick={() => { navigate('/notifications'); setMobileMenuOpen(false); }}>
            <ListItemIcon>
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItemButton>

          <ListItemButton onClick={() => { navigate('/inbox'); setMobileMenuOpen(false); }}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Messages" />
          </ListItemButton>

          <ListItemButton onClick={() => { navigate('/settings'); setMobileMenuOpen(false); }}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Spacer for fixed AppBar */}
      <Box sx={{ height: showCategories && !isMobile ? 112 : 64 }} />
      {showSearch && isMobile && <Box sx={{ height: 60 }} />}
    </>
  );
};

export default AppNavbar;
