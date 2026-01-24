import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import api from './services/api';
import { PageLayout } from './components/layout';
import { LoadingState, RatingSummary, ReviewCard } from './components/common';
import ReviewService, { RatingSummary as RatingSummaryType, Review } from './services/ReviewService';

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const theme = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [sellerRating, setSellerRating] = useState<RatingSummaryType | null>(null);
  const [buyerRating, setBuyerRating] = useState<RatingSummaryType | null>(null);
  const [sellerReviews, setSellerReviews] = useState<Review[]>([]);
  const [buyerReviews, setBuyerReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const userResponse = await api.get(`/api/v1/user/${userId}`);
        setUser(userResponse.data);

        const [sellerRatingData, buyerRatingData] = await Promise.all([
          ReviewService.getSellerRatingSummary(parseInt(userId)),
          ReviewService.getBuyerRatingSummary(parseInt(userId)),
        ]);
        setSellerRating(sellerRatingData);
        setBuyerRating(buyerRatingData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!userId) return;
      setReviewsLoading(true);

      try {
        if (tabValue === 0) {
          const reviews = await ReviewService.getSellerReviews(parseInt(userId));
          setSellerReviews(reviews);
        } else {
          const reviews = await ReviewService.getBuyerReviews(parseInt(userId));
          setBuyerReviews(reviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [userId, tabValue]);

  if (loading) {
    return (
      <PageLayout showCategories={false}>
        <LoadingState fullPage message="Loading profile..." />
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout showCategories={false}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5">User not found</Typography>
        </Box>
      </PageLayout>
    );
  }

  const currentReviews = tabValue === 0 ? sellerReviews : buyerReviews;

  return (
    <PageLayout showCategories={false}>
      <Grid container spacing={4}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
                {user.name?.charAt(0).toUpperCase() || <PersonIcon />}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {user.name}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Florida Polytechnic University
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Rating Summaries */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  As a Seller
                </Typography>
                {sellerRating && sellerRating.reviewCount > 0 ? (
                  <RatingSummary summary={sellerRating} />
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No seller reviews yet
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  As a Buyer
                </Typography>
                {buyerRating && buyerRating.reviewCount > 0 ? (
                  <RatingSummary summary={buyerRating} />
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No buyer reviews yet
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Reviews Tabs */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden',
            }}
          >
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab label={`Seller Reviews (${sellerRating?.reviewCount || 0})`} />
              <Tab label={`Buyer Reviews (${buyerRating?.reviewCount || 0})`} />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {reviewsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : currentReviews.length === 0 ? (
                <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                  No {tabValue === 0 ? 'seller' : 'buyer'} reviews yet
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {currentReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default UserProfilePage;
