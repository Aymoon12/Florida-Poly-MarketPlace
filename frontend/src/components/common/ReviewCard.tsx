import React from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Rating,
  Typography,
  useTheme,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Review } from '../../services/ReviewService';

interface ReviewCardProps {
  review: Review;
  variant?: 'default' | 'compact';
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, variant = 'default' }) => {
  const theme = useTheme();

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1.5 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          {review.reviewerName?.charAt(0) || <PersonIcon />}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {review.reviewerName}
            </Typography>
            <Rating value={review.rating} size="small" readOnly />
          </Box>
          {review.comment && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {review.comment}
            </Typography>
          )}
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            {review.relativeTime}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        mb: 2,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
            {review.reviewerName?.charAt(0) || <PersonIcon />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {review.reviewerName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {review.relativeTime}
                </Typography>
              </Box>
              <Rating value={review.rating} readOnly />
            </Box>
            {review.comment && (
              <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
                {review.comment}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
