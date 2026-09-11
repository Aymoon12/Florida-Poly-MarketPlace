import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ReviewForm from './ReviewForm';
import { Sale } from '../../services/SaleService';

interface PostSaleReviewPromptProps {
  sale: Sale;
  userRole: 'buyer' | 'seller';
  onReviewSubmitted: () => void;
}

const PostSaleReviewPrompt: React.FC<PostSaleReviewPromptProps> = ({
  sale,
  userRole,
  onReviewSubmitted,
}) => {
  const theme = useTheme();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewType, setReviewType] = useState<'SELLER' | 'ITEM' | 'BUYER'>('SELLER');

  const handleOpenReviewDialog = (type: 'SELLER' | 'ITEM' | 'BUYER') => {
    setReviewType(type);
    setReviewDialogOpen(true);
  };

  const handleReviewSuccess = () => {
    setReviewDialogOpen(false);
    onReviewSubmitted();
  };

  const getTargetName = () => {
    if (reviewType === 'SELLER') return sale.sellerName;
    if (reviewType === 'BUYER') return sale.buyerName;
    return sale.itemTitle;
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <StarIcon sx={{ color: 'warning.main', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Leave a Review
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Transaction for: <strong>{sale.itemTitle}</strong>
          </Typography>

          {userRole === 'buyer' && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {!sale.sellerReviewed && (
                <Button
                  variant="outlined"
                  onClick={() => handleOpenReviewDialog('SELLER')}
                >
                  Review Seller ({sale.sellerName})
                </Button>
              )}
              {!sale.itemReviewed && (
                <Button
                  variant="outlined"
                  onClick={() => handleOpenReviewDialog('ITEM')}
                >
                  Review Item
                </Button>
              )}
            </Box>
          )}

          {userRole === 'seller' && !sale.buyerReviewed && (
            <Button
              variant="outlined"
              onClick={() => handleOpenReviewDialog('BUYER')}
            >
              Review Buyer ({sale.buyerName})
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <ReviewForm
            saleId={sale.id}
            reviewType={reviewType}
            targetName={getTargetName()}
            onSuccess={handleReviewSuccess}
            onCancel={() => setReviewDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostSaleReviewPrompt;
