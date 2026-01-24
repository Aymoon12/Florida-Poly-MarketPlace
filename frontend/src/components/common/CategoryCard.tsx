import React from 'react';
import {
  Avatar,
  Box,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import DevicesIcon from '@mui/icons-material/Devices';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import { hoverEffects } from '../../theme';

export interface Category {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  count?: number;
}

interface CategoryCardProps {
  category: Category;
  onClick?: (category: Category) => void;
  selected?: boolean;
  variant?: 'default' | 'compact' | 'pill';
}

// Default category icons and colors
const defaultCategoryConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  Electronics: { icon: <DevicesIcon />, color: '#3B82F6' },
  Textbooks: { icon: <MenuBookIcon />, color: '#10B981' },
  Fashion: { icon: <CheckroomIcon />, color: '#EC4899' },
  Sports: { icon: <SportsSoccerIcon />, color: '#EF4444' },
  Other: { icon: <HomeIcon />, color: '#F59E0B' },
  Collectibles: { icon: <StorefrontIcon />, color: '#8B5CF6' },
  Services: { icon: <MiscellaneousServicesIcon />, color: '#6366F1' },
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  selected = false,
  variant = 'default',
}) => {
  const theme = useTheme();

  const config = defaultCategoryConfig[category.label] || {
    icon: category.icon || <StorefrontIcon />,
    color: category.color || theme.palette.primary.main,
  };

  const icon = category.icon || config.icon;
  const color = category.color || config.color;

  if (variant === 'pill') {
    return (
      <Box
        onClick={() => onClick?.(category)}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 50,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          backgroundColor: selected
            ? color
            : theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[800],
          color: selected
            ? '#fff'
            : theme.palette.text.primary,
          border: `1.5px solid ${selected ? color : theme.palette.divider}`,
          '&:hover': {
            backgroundColor: selected
              ? color
              : theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[700],
            borderColor: color,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& svg': {
              fontSize: 18,
            },
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {category.label}
        </Typography>
        {category.count !== undefined && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              opacity: 0.7,
            }}
          >
            ({category.count})
          </Typography>
        )}
      </Box>
    );
  }

  if (variant === 'compact') {
    return (
      <Paper
        elevation={0}
        onClick={() => onClick?.(category)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          border: `1px solid ${selected ? color : theme.palette.divider}`,
          backgroundColor: selected
            ? `${color}10`
            : theme.palette.background.paper,
          '&:hover': {
            borderColor: color,
            backgroundColor: `${color}10`,
          },
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            backgroundColor: `${color}20`,
            color: color,
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {category.label}
          </Typography>
          {category.count !== undefined && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {category.count} items
            </Typography>
          )}
        </Box>
      </Paper>
    );
  }

  // Default variant
  return (
    <Paper
      elevation={0}
      onClick={() => onClick?.(category)}
      sx={{
        p: 2.5,
        textAlign: 'center',
        cursor: 'pointer',
        borderRadius: 3,
        border: `1px solid ${selected ? color : theme.palette.divider}`,
        backgroundColor: selected
          ? `${color}10`
          : theme.palette.background.paper,
        ...hoverEffects.lift,
        '&:hover': {
          borderColor: color,
          backgroundColor: `${color}08`,
        },
      }}
    >
      <Avatar
        sx={{
          width: 56,
          height: 56,
          mx: 'auto',
          mb: 1.5,
          backgroundColor: selected ? color : `${color}20`,
          color: selected ? '#fff' : color,
          transition: 'all 0.2s ease-in-out',
          '& svg': {
            fontSize: 28,
          },
        }}
      >
        {icon}
      </Avatar>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
          color: selected ? color : 'text.primary',
        }}
      >
        {category.label}
      </Typography>
      {category.count !== undefined && (
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block',
            mt: 0.5,
          }}
        >
          {category.count} items
        </Typography>
      )}
    </Paper>
  );
};

export default CategoryCard;
