import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import ReviewCard from './ReviewCard';
import RatingSummary from './RatingSummary';
import ReviewService, { Review, RatingSummary as RatingSummaryType } from '../../services/ReviewService';

interface ReviewsListProps {
  type: 'seller' | 'item';
  targetId: number;
  showSummary?: boolean;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ type, targetId, showSummary = true }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<RatingSummaryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchReviews = async (pageNum: number) => {
    try {
      const data = type === 'seller'
        ? await ReviewService.getSellerReviews(targetId, pageNum)
        : await ReviewService.getItemReviews(targetId, pageNum);

      if (pageNum === 0) {
        setReviews(data);
      } else {
        setReviews(prev => [...prev, ...data]);
      }

      setHasMore(data.length === 10);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const data = type === 'seller'
        ? await ReviewService.getSellerRatingSummary(targetId)
        : await ReviewService.getItemRatingSummary(targetId);
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchReviews(0), fetchSummary()]);
      setLoading(false);
    };
    fetchData();
  }, [targetId, type]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchReviews(nextPage);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {showSummary && summary && (
        <>
          <RatingSummary summary={summary} />
          <Divider sx={{ my: 3 }} />
        </>
      )}

      {reviews.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
          No reviews yet
        </Typography>
      ) : (
        <>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" onClick={handleLoadMore}>
                Load More Reviews
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ReviewsList;
