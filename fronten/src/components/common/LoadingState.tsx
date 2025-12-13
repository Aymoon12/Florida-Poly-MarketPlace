import React from 'react';
import {
  Box,
  CircularProgress,
  LinearProgress,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';

interface LoadingStateProps {
  variant?: 'spinner' | 'linear' | 'skeleton' | 'overlay';
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullPage?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'spinner',
  size = 'medium',
  message,
  fullPage = false,
}) => {
  const theme = useTheme();

  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56,
  };

  const spinnerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        py: fullPage ? 0 : 4,
      }}
    >
      <CircularProgress
        size={sizeMap[size]}
        sx={{
          color: 'primary.main',
        }}
      />
      {message && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullPage) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default,
          zIndex: theme.zIndex.modal + 1,
        }}
      >
        {spinnerContent}
      </Box>
    );
  }

  if (variant === 'linear') {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress
          sx={{
            height: size === 'small' ? 2 : size === 'large' ? 6 : 4,
            borderRadius: 1,
            backgroundColor: theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[700],
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'primary.main',
            },
          }}
        />
        {message && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mt: 1,
              textAlign: 'center',
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  if (variant === 'overlay') {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(2px)',
          zIndex: 1,
          borderRadius: 'inherit',
        }}
      >
        {spinnerContent}
      </Box>
    );
  }

  return spinnerContent;
};

// Skeleton presets for common use cases
export const CardGridSkeleton: React.FC<{ count?: number; columns?: number }> = ({
  count = 4,
  columns = 4,
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: `repeat(${Math.min(columns, 3)}, 1fr)`,
          lg: `repeat(${columns}, 1fr)`,
        },
        gap: 2,
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Skeleton variant="rectangular" height={200} />
          <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="40%" height={28} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="70%" height={20} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Skeleton variant="circular" width={48} height={48} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
          <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
        </Box>
      ))}
    </Box>
  );
};

export const TextSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <Box>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '60%' : '100%'}
          height={20}
          sx={{ mb: 0.5 }}
        />
      ))}
    </Box>
  );
};

export default LoadingState;
