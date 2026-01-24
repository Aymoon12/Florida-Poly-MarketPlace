import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import SaleService, { BuyerInfo } from '../../services/SaleService';

interface MarkAsSoldDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (saleId: number) => void;
  itemId: number;
  itemTitle: string;
  itemPrice: number;
}

const MarkAsSoldDialog: React.FC<MarkAsSoldDialogProps> = ({
  open,
  onClose,
  onSuccess,
  itemId,
  itemTitle,
  itemPrice,
}) => {
  const [buyers, setBuyers] = useState<BuyerInfo[]>([]);
  const [selectedBuyerId, setSelectedBuyerId] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<string>(itemPrice.toString());
  const [loading, setLoading] = useState(false);
  const [fetchingBuyers, setFetchingBuyers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchPotentialBuyers();
      setSalePrice(itemPrice.toString());
      setSelectedBuyerId('');
      setError(null);
    }
  }, [open, itemId, itemPrice]);

  const fetchPotentialBuyers = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    setFetchingBuyers(true);
    setError(null);

    try {
      const buyersList = await SaleService.getPotentialBuyers(userId, itemId);
      setBuyers(buyersList);
      if (buyersList.length === 0) {
        setError('No potential buyers found. Users who have messaged you about this item will appear here.');
      }
    } catch (err) {
      console.error('Error fetching buyers:', err);
      setError('Failed to load potential buyers');
    } finally {
      setFetchingBuyers(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedBuyerId || !salePrice) {
      setError('Please select a buyer and enter the sale price');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Please log in');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sale = await SaleService.markAsSold(userId, {
        itemId,
        buyerId: selectedBuyerId as number,
        salePrice: parseFloat(salePrice),
      });
      onSuccess(sale.id);
      handleClose();
    } catch (err: unknown) {
      console.error('Error marking as sold:', err);
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to mark item as sold');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedBuyerId('');
    setSalePrice(itemPrice.toString());
    setError(null);
    setBuyers([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Mark as Sold</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3, mt: 1 }}>
          Mark "<strong>{itemTitle}</strong>" as sold
        </Typography>

        {error && (
          <Alert severity={buyers.length === 0 && !fetchingBuyers ? 'info' : 'error'} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {fetchingBuyers ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Buyer</InputLabel>
              <Select
                value={selectedBuyerId}
                onChange={(e) => setSelectedBuyerId(e.target.value as number)}
                label="Select Buyer"
                disabled={buyers.length === 0}
              >
                {buyers.map((buyer) => (
                  <MenuItem key={buyer.id} value={buyer.id}>
                    {buyer.name} ({buyer.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Sale Price"
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ min: 0, step: 0.01 }}
              helperText={`Listed price: $${itemPrice.toFixed(2)}`}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !selectedBuyerId || !salePrice || buyers.length === 0}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Processing...' : 'Confirm Sale'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkAsSoldDialog;
