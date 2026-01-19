import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Rating,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ReviewService, { CreateReviewRequest } from '../../services/ReviewService';

interface ReviewFormProps {
  saleId: number;
  reviewType: 'SELLER' | 'ITEM' | 'BUYER';
  targetName: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

const labels: { [key: number]: string } = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

const ReviewForm: React.FC<ReviewFormProps> = ({
  saleId,
  reviewType,
  targetName,
  onSuccess,
  onCancel,
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState(-1);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!rating) {
      setError('Please select a rating');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Please log in to submit a review');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: CreateReviewRequest = {
        saleId,
        reviewType,
        rating,
        comment: comment.trim() || undefined,
      };

      await ReviewService.createReview(userId, request);
      onSuccess();
    } catch (err: unknown) {
      console.error('Error submitting review:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit review. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Rate your experience with {reviewType === 'SELLER' ? 'seller' : reviewType === 'ITEM' ? 'item' : 'buyer'}: {targetName}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography component="legend" sx={{ mb: 1, fontWeight: 500 }}>
          Your Rating *
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Rating
            name="review-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            onChangeActive={(_, newHover) => setHover(newHover)}
            size="large"
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          {rating !== null && (
            <Typography sx={{ color: 'text.secondary' }}>
              {labels[hover !== -1 ? hover : rating]}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography component="legend" sx={{ mb: 1, fontWeight: 500 }}>
          Comment (Optional)
        </Typography>
        <TextField
          multiline
          rows={4}
          fullWidth
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          inputProps={{ maxLength: 1000 }}
          helperText={`${comment.length}/1000 characters`}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !rating}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewForm;
