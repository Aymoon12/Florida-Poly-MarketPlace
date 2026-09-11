import React from 'react';
import { Chip, ChipProps, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ScheduleIcon from '@mui/icons-material/Schedule';
import VerifiedIcon from '@mui/icons-material/Verified';

type StatusType =
  | 'active'
  | 'inactive'
  | 'sold'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'shipped'
  | 'verified'
  | 'new'
  | 'featured';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'small' | 'medium';
  showIcon?: boolean;
  variant?: 'filled' | 'outlined';
}

const statusConfig: Record<StatusType, { color: string; bgColor: string; icon: React.ReactNode; label: string }> = {
  active: {
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
    label: 'Active',
  },
  inactive: {
    color: '#6B7280',
    bgColor: 'rgba(107, 114, 128, 0.1)',
    icon: <PendingIcon sx={{ fontSize: 16 }} />,
    label: 'Inactive',
  },
  sold: {
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
    label: 'Sold',
  },
  pending: {
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    icon: <ScheduleIcon sx={{ fontSize: 16 }} />,
    label: 'Pending',
  },
  completed: {
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
    label: 'Completed',
  },
  cancelled: {
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    icon: <CancelIcon sx={{ fontSize: 16 }} />,
    label: 'Cancelled',
  },
  shipped: {
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    icon: <LocalShippingIcon sx={{ fontSize: 16 }} />,
    label: 'Shipped',
  },
  verified: {
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    icon: <VerifiedIcon sx={{ fontSize: 16 }} />,
    label: 'Verified',
  },
  new: {
    color: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.1)',
    icon: null,
    label: 'New',
  },
  featured: {
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    icon: null,
    label: 'Featured',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'small',
  showIcon = true,
  variant = 'filled',
}) => {
  const theme = useTheme();

  // Normalize status to lowercase for matching
  const normalizedStatus = status.toLowerCase() as StatusType;
  const config = statusConfig[normalizedStatus] || {
    color: theme.palette.grey[600],
    bgColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
    icon: null,
    label: status,
  };

  const chipProps: ChipProps = {
    label: config.label,
    size: size,
    icon: showIcon && config.icon ? (config.icon as React.ReactElement) : undefined,
    sx: {
      fontWeight: 600,
      fontSize: size === 'small' ? '0.6875rem' : '0.75rem',
      height: size === 'small' ? 22 : 28,
      borderRadius: 50,
      ...(variant === 'filled'
        ? {
            backgroundColor: config.bgColor,
            color: config.color,
            '& .MuiChip-icon': {
              color: config.color,
            },
          }
        : {
            backgroundColor: 'transparent',
            border: `1.5px solid ${config.color}`,
            color: config.color,
            '& .MuiChip-icon': {
              color: config.color,
            },
          }),
    },
  };

  return <Chip {...chipProps} />;
};

export default StatusBadge;
