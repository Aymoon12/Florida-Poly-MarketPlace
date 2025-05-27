import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, IconButton, Box, Typography, Divider, Popover, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Tooltip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';

interface CartIconProps {
  color?: 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
}

interface CartItem {
  id: number;
  itemId: number;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrls: string[];
}

const CartIcon: React.FC<CartIconProps> = ({ color = 'primary' }) => {
  const navigate = useNavigate();
  const [itemCount, setItemCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchCartItemCount();
  }, []);

  const fetchCartItemCount = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        return;
      }

      const response = await axios.get('http://localhost:8080/api/v1/cart/count', {
        params: { userId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data && response.data.count !== undefined) {
        setItemCount(response.data.count);
      }
    } catch (err) {
      console.error('Error fetching cart item count:', err);
    }
  };

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        return;
      }

      const response = await axios.get('http://localhost:8080/api/v1/cart', {
        params: { userId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setCartItems(response.data);
    } catch (err) {
      console.error('Error fetching cart items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (itemCount > 0) {
      setAnchorEl(event.currentTarget);
      fetchCartItems();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const getImageUrl = (item: CartItem) => {
    return item.imageUrls && item.imageUrls.length > 0
      ? item.imageUrls[0]
      : '/assets/placeholder.png';
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  return (
    <>
      <Box sx={{ display: 'inline-flex', position: 'relative' }}>
        <Tooltip title={itemCount > 0 ? "View cart" : "Your cart is empty"}>
          <IconButton
            color={color}
            onClick={() => navigate('/cart')}
            aria-label="shopping cart"
            onMouseEnter={handleMouseEnter}
            size="medium"
            sx={{ padding: '8px' }}
          >
            <Badge
              badgeContent={itemCount}
              color="error"
              max={99}
              sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: '16px', minWidth: '16px' } }}
            >
              <ShoppingCartIcon fontSize="medium" />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          onMouseLeave: handleClose,
          elevation: 4,
          sx: {
            width: 350,
            maxHeight: 400,
            borderRadius: 2,
            mt: 1,
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ p: 2, bgcolor: '#6b46c1' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
            Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Loading cart items...</Typography>
          </Box>
        ) : cartItems.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Your cart is empty</Typography>
          </Box>
        ) : (
          <>
            <List sx={{ maxHeight: 260, overflow: 'auto', p: 0 }}>
              {cartItems.slice(0, 4).map((item) => (
                <ListItem key={item.id} divider alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      alt={item.title}
                      src={getImageUrl(item)}
                      sx={{ width: 50, height: 50, borderRadius: 1, mr: 1 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#4a5568',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#6b46c1' }}>
                          ${item.subtotal.toFixed(2)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}

              {cartItems.length > 4 && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                        +{cartItems.length - 4} more items
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>

            <Divider />

            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Total:</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#6b46c1' }}>
                  ${calculateTotal().toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    handleClose();
                    navigate('/cart');
                  }}
                  sx={{
                    bgcolor: '#6b46c1',
                    '&:hover': { bgcolor: '#5a32a3' },
                    borderRadius: 1.5,
                    textTransform: 'none',
                    py: 1
                  }}
                >
                  View Cart
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    handleClose();
                    navigate('/checkout');
                  }}
                  sx={{
                    borderColor: '#6b46c1',
                    color: '#6b46c1',
                    '&:hover': { borderColor: '#5a32a3', bgcolor: 'rgba(107, 70, 193, 0.04)' },
                    borderRadius: 1.5,
                    textTransform: 'none',
                    py: 1
                  }}
                >
                  Checkout
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};

export default CartIcon;