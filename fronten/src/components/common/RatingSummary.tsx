import React from 'react';
import { Box, Rating, Typography } from '@mui/material';
import { RatingSummary as RatingSummaryType } from '../../services/ReviewService';

interface RatingSummaryProps {
  summary: RatingSummaryType;
  variant?: 'default' | 'compact';
}

const RatingSummary: React.FC<RatingSummaryProps> = ({ summary, variant = 'default' }) => {
  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Rating value={summary.averageRating} precision={0.5} size="small" readOnly sx={{ mr: 1 }} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {summary.averageRating.toFixed(1)} ({summary.reviewCount} review{summary.reviewCount !== 1 ? 's' : ''})
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
        {summary.averageRating.toFixed(1)}
      </Typography>
      <Rating value={summary.averageRating} precision={0.5} readOnly sx={{ mb: 1 }} />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Based on {summary.reviewCount} review{summary.reviewCount !== 1 ? 's' : ''}
      </Typography>
    </Box>
  );
};

export default RatingSummary;
