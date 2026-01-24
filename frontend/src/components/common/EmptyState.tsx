import React, { ReactNode } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
} from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import InboxIcon from '@mui/icons-material/Inbox';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';

type EmptyStateType =
  | 'search'
  | 'cart'
  | 'favorites'
  | 'notifications'
  | 'messages'
  | 'history'
  | 'listings'
  | 'custom';

interface EmptyStateProps {
  type?: EmptyStateType;
  icon?: ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

const defaultContent: Record<EmptyStateType, { icon: ReactNode; title: string; description: string }> = {
  search: {
    icon: <SearchOffIcon sx={{ fontSize: 64 }} />,
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
  },
  cart: {
    icon: <ShoppingCartOutlinedIcon sx={{ fontSize: 64 }} />,
    title: 'Your cart is empty',
    description: 'Looks like you haven\'t added any items to your cart yet.',
  },
  favorites: {
    icon: <FavoriteBorderIcon sx={{ fontSize: 64 }} />,
    title: 'No saved items',
    description: 'Save items you like by clicking the heart icon to see them here.',
  },
  notifications: {
    icon: <NotificationsNoneIcon sx={{ fontSize: 64 }} />,
    title: 'No notifications',
    description: 'You\'re all caught up! Check back later for updates.',
  },
  messages: {
    icon: <InboxIcon sx={{ fontSize: 64 }} />,
    title: 'No messages yet',
    description: 'Start a conversation with a seller or buyer to see your messages here.',
  },
  history: {
    icon: <HistoryIcon sx={{ fontSize: 64 }} />,
    title: 'No view history',
    description: 'Items you\'ve viewed will appear here for easy access.',
  },
  listings: {
    icon: <AddIcon sx={{ fontSize: 64 }} />,
    title: 'No listings yet',
    description: 'Create your first listing to start selling to your campus community.',
  },
  custom: {
    icon: <SearchOffIcon sx={{ fontSize: 64 }} />,
    title: 'Nothing here',
    description: 'There\'s nothing to show at the moment.',
  },
};

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'custom',
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  const theme = useTheme();
  const content = defaultContent[type];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 3,
        minHeight: 300,
      }}
    >
      <Box
        sx={{
          color: theme.palette.mode === 'light'
            ? theme.palette.grey[300]
            : theme.palette.grey[700],
          mb: 3,
        }}
      >
        {icon || content.icon}
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 1,
        }}
      >
        {title || content.title}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          maxWidth: 400,
          mb: actionLabel ? 3 : 0,
        }}
      >
        {description || content.description}
      </Typography>

      {(actionLabel || secondaryActionLabel) && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {actionLabel && onAction && (
            <Button
              variant="contained"
              onClick={onAction}
              sx={{
                borderRadius: 50,
                px: 4,
              }}
            >
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              variant="outlined"
              onClick={onSecondaryAction}
              sx={{
                borderRadius: 50,
                px: 4,
              }}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EmptyState;
