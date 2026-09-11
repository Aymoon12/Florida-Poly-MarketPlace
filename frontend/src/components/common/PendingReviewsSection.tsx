import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import SaleService, { Sale } from '../../services/SaleService';
import PostSaleReviewPrompt from './PostSaleReviewPrompt';

const PendingReviewsSection: React.FC = () => {
  const theme = useTheme();
  const [pendingReviews, setPendingReviews] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  const fetchPendingReviews = async () => {
    if (!userId) return;

    try {
      const reviews = await SaleService.getPendingReviews();
      setPendingReviews(reviews);
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (pendingReviews.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
        Pending Reviews ({pendingReviews.length})
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {pendingReviews.map((sale) => {
          const isBuyer = sale.buyerId.toString() === userId;
          return (
            <PostSaleReviewPrompt
              key={sale.id}
              sale={sale}
              userRole={isBuyer ? 'buyer' : 'seller'}
              onReviewSubmitted={fetchPendingReviews}
            />
          );
        })}
      </Box>
    </Paper>
  );
};

export default PendingReviewsSection;
