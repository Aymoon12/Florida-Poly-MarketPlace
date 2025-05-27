import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import polylogo from "./assets/poly-logo.webp";
import { useNotifications } from "./services/NotificationContext";

import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  IconButton,
  TextField,
  Avatar,
  AppBar,
  Toolbar,
  InputBase,
  InputAdornment,
  Badge,
  CardMedia,
  Card,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Define types
interface CartItem {
  id: number;
  itemId: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  subtotal: number;
  category: string;
  seller: string;
  sellerId: number;
  imageUrls: string[];
  addedAt: string;
  updatedAt: string;
}

interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cartTotals, setCartTotals] = useState<CartTotals>({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  });
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { unreadCount, fetchUnreadCount } = useNotifications();

  // Fetch cart items
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Calculate totals whenever cart items change
  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get('http://localhost:8080/api/v1/cart', {
        params: { userId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setCartItems(response.data);
      await fetchUnreadCount();
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Failed to load your cart. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.subtotal, 0);
    const tax = subtotal * 0.07; // 7% tax rate
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    setCartTotals({
      subtotal,
      tax,
      shipping,
      total
    });
  };

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const userId = localStorage.getItem('userId');
      
      const response = await axios.put(`http://localhost:8080/api/v1/cart/${cartItemId}`, null, {
        params: { 
          userId,
          quantity: newQuantity 
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local cart state with the updated item
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === cartItemId ? response.data : item
        )
      );

      showNotification('Quantity updated successfully', 'success');
    } catch (err) {
      console.error('Error updating quantity:', err);
      showNotification('Failed to update quantity', 'error');
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      const userId = localStorage.getItem('userId');
      
      await axios.delete(`http://localhost:8080/api/v1/cart/${cartItemId}`, {
        params: { userId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Remove the item from local state
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
      
      showNotification('Item removed from cart', 'success');
    } catch (err) {
      console.error('Error removing item from cart:', err);
      showNotification('Failed to remove item', 'error');
    }
  };

  const handleClearCart = async () => {
    try {
      const userId = localStorage.getItem('userId');
      
      await axios.delete(`http://localhost:8080/api/v1/cart/clear`, {
        params: { userId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Clear local cart state
      setCartItems([]);
      
      showNotification('Cart cleared successfully', 'success');
    } catch (err) {
      console.error('Error clearing cart:', err);
      showNotification('Failed to clear cart', 'error');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showNotification('Your cart is empty', 'info');
      return;
    }
    
    // Redirect to checkout page
    navigate('/checkout');
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getDefaultImage = (item: CartItem) => {
    return item.imageUrls && item.imageUrls.length > 0
      ? item.imageUrls[0]
      : "/assets/placeholder.png";
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f9fafb" }}>
      {/* Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#fff",
          boxShadow: 1,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }} onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
            <Box
              component="img"
              src={polylogo}
              alt="Logo"
              sx={{ height: 46, width: 46, mr: 1 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#6b46c1" }}>
              PolyMart
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box sx={{ flexGrow: 1, mx: 4 }}>
            <Paper
              component="form"
              onSubmit={handleSearchSubmit}
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: "50px",
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                '&:hover': {
                  boxShadow: '0 1px 6px rgba(32, 33, 36, 0.28)'
                }
              }}
            >
              <InputBase
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ flexGrow: 1, px: 2, py: 1, fontWeight: 500 }}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#9ca3af" }} />
                  </InputAdornment>
                }
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#6b46c1",
                  borderRadius: "0",
                  textTransform: "none",
                  px: 3,
                  py: 1.5,
                  height: '100%',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: "#5a32b0"
                  }
                }}
              >
                Search
              </Button>
            </Paper>
          </Box>

          {/* Navigation Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="primary" onClick={() => navigate("/myselling")}>
              <Badge badgeContent={2} color="error">
                <FavoriteIcon />
              </Badge>
            </IconButton>
            <IconButton color="primary">
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="primary" onClick={() => navigate("/cart")}>
              <Badge badgeContent={cartItems.length} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ 
                ml: 1,
                borderRadius: 50,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#6b46c1",
                color: "#6b46c1",
                '&:hover': {
                  borderColor: "#5a32b0",
                  backgroundColor: "rgba(107, 70, 193, 0.04)"
                }
              }}
              onClick={() => navigate("/create-listing")}
            >
              Sell
            </Button>
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                ml: 1, 
                cursor: "pointer",
                bgcolor: "#6b46c1"
              }}
              onClick={() => navigate("/myselling")}
            >
              FP
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, pt: 12, pb: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton 
              onClick={() => navigate(-1)}
              sx={{ mr: 2, color: '#6b46c1' }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "#4a5568" }}>
              Shopping Cart
            </Typography>
          </Box>

          {notification && (
            <Snackbar
              open={!!notification}
              autoHideDuration={3000}
              onClose={() => setNotification(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert 
                severity={notification.type} 
                variant="filled"
                onClose={() => setNotification(null)}
              >
                {notification.message}
              </Alert>
            </Snackbar>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
          ) : cartItems.length === 0 ? (
            <Paper sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid #e5e7eb'
            }}>
              <ShoppingCartIcon sx={{ fontSize: 60, color: '#cbd5e0', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#4a5568', mb: 2 }}>
                Your cart is empty
              </Typography>
              <Typography variant="body1" sx={{ color: '#718096', mb: 3 }}>
                Looks like you haven't added any items to your cart yet.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#6b46c1",
                  borderRadius: 50,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: "#5a32b0"
                  }
                }}
                onClick={() => navigate('/home')}
              >
                Continue Shopping
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={4}>
              {/* Cart Items */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb'
                }}>
                  <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#4a5568' }}>
                      Cart Items ({cartItems.length})
                    </Typography>
                    <Button 
                      variant="text" 
                      color="error"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={handleClearCart}
                      sx={{ textTransform: 'none', fontWeight: 500 }}
                    >
                      Clear Cart
                    </Button>
                  </Box>

                  {cartItems.map((item) => (
                    <Box key={item.id} sx={{ 
                      px: 3, 
                      py: 3, 
                      borderBottom: '1px solid #e5e7eb',
                      '&:last-child': { borderBottom: 'none' }
                    }}>
                      <Grid container spacing={3} alignItems="center">
                        {/* Item Image */}
                        <Grid item xs={12} sm={3}>
                          <Card 
                            elevation={0} 
                            sx={{ 
                              overflow: 'hidden', 
                              borderRadius: 2,
                              cursor: 'pointer',
                              border: '1px solid #e5e7eb',
                            }}
                            onClick={() => navigate(`/item/${item.itemId}`)}
                          >
                            <CardMedia
                              component="img"
                              height="120"
                              image={getDefaultImage(item)}
                              alt={item.title}
                              sx={{ 
                                objectFit: 'cover',
                                backgroundColor: '#f8fafc'
                              }}
                            />
                          </Card>
                        </Grid>

                        {/* Item Details */}
                        <Grid item xs={12} sm={5}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 600, 
                              color: '#4a5568', 
                              mb: 1,
                              cursor: 'pointer',
                              '&:hover': { color: '#6b46c1' }
                            }}
                            onClick={() => navigate(`/item/${item.itemId}`)}
                          >
                            {item.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#718096', mb: 1 }}>
                            Seller: {item.seller}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#718096', mb: 2 }}>
                            Category: {item.category}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#2d3748', fontWeight: 500 }}>
                            ${item.price.toFixed(2)} each
                          </Typography>
                        </Grid>

                        {/* Quantity Controls */}
                        <Grid item xs={6} sm={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              sx={{ 
                                border: '1px solid #e2e8f0',
                                borderRadius: 1
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              size="small"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value > 0) {
                                  handleUpdateQuantity(item.id, value);
                                }
                              }}
                              InputProps={{
                                inputProps: { 
                                  min: 1, 
                                  max: 10,
                                  style: { textAlign: 'center' }
                                }
                              }}
                              sx={{ 
                                width: 60, 
                                mx: 1,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 1
                                }
                              }}
                            />
                            <IconButton 
                              size="small" 
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              sx={{ 
                                border: '1px solid #e2e8f0',
                                borderRadius: 1
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>

                        {/* Subtotal and Remove */}
                        <Grid item xs={6} sm={2} sx={{ textAlign: { xs: 'right', sm: 'center' } }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#6b46c1', mb: 1 }}>
                            ${item.subtotal.toFixed(2)}
                          </Typography>
                          <IconButton 
                            color="error" 
                            onClick={() => handleRemoveItem(item.id)}
                            sx={{ 
                              fontSize: 14,
                              '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.04)' }
                            }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Paper>
              </Grid>

              {/* Order Summary */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  position: 'sticky',
                  top: 100,
                  border: '1px solid #e5e7eb'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#4a5568', mb: 3 }}>
                    Order Summary
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#718096' }}>
                        Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#2d3748' }}>
                        ${cartTotals.subtotal.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#718096' }}>
                        Estimated Tax (7%)
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#2d3748' }}>
                        ${cartTotals.tax.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#718096' }}>
                        Shipping
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: cartTotals.shipping > 0 ? '#2d3748' : '#38a169' }}>
                        {cartTotals.shipping > 0 ? `$${cartTotals.shipping.toFixed(2)}` : 'FREE'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#4a5568' }}>
                      Total
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#6b46c1' }}>
                      ${cartTotals.total.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  {cartTotals.shipping === 0 && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      bgcolor: '#f0fff4', 
                      p: 2, 
                      borderRadius: 1,
                      mb: 3
                    }}>
                      <CheckCircleIcon sx={{ color: '#38a169', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#38a169' }}>
                        You've qualified for free shipping!
                      </Typography>
                    </Box>
                  )}
                  
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#6b46c1",
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: "#5a32b0"
                      }
                    }}
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: "#e2e8f0",
                      color: "#4a5568",
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.5,
                      mt: 2,
                      '&:hover': {
                        borderColor: "#cbd5e0",
                        backgroundColor: "#f7fafc"
                      }
                    }}
                    onClick={() => navigate('/home')}
                  >
                    Continue Shopping
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          width: "100%",
          background: "linear-gradient(to right, #6b46c1, #5a67d8)",
          py: 3,
          mt: "auto",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ textAlign: "center", color: "#e9d8fd" }}>
            © {new Date().getFullYear()} Florida Polytechnic University MarketPlace. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default CartPage; 