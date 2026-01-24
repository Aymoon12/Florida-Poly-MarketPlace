import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './services/api';
import {
    Alert,
    Box,
    Button,
    Card,
    CardMedia,
    Divider,
    Grid,
    IconButton,
    Paper,
    Snackbar,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { PageLayout } from './components/layout';
import { LoadingState, EmptyState } from './components/common';

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
    const theme = useTheme();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [cartTotals, setCartTotals] = useState<CartTotals>({
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0
    });
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        fetchCartItems();
    }, []);

    useEffect(() => {
        calculateTotals();
    }, [cartItems]);

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/v1/cart');
            setCartItems(response.data);
        } catch (err) {
            console.error('Error fetching cart items:', err);
            setError('Failed to load your cart. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotals = () => {
        const subtotal = cartItems.reduce((total, item) => total + item.subtotal, 0);
        const tax = subtotal * 0.07;
        const shipping = subtotal > 50 ? 0 : 5.99;
        const total = subtotal + tax + shipping;

        setCartTotals({ subtotal, tax, shipping, total });
    };

    const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            const response = await api.put(`/api/v1/cart/${cartItemId}`, null, {
                params: { quantity: newQuantity }
            });

            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === cartItemId ? response.data : item
                )
            );

            showNotification('Quantity updated', 'success');
        } catch (err) {
            console.error('Error updating quantity:', err);
            showNotification('Failed to update quantity', 'error');
        }
    };

    const handleRemoveItem = async (cartItemId: number) => {
        try {
            await api.delete(`/api/v1/cart/${cartItemId}`);

            setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
            showNotification('Item removed from cart', 'success');
        } catch (err) {
            console.error('Error removing item from cart:', err);
            showNotification('Failed to remove item', 'error');
        }
    };

    const handleClearCart = async () => {
        try {
            await api.delete('/api/v1/cart/clear');

            setCartItems([]);
            showNotification('Cart cleared', 'success');
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
        navigate('/checkout');
    };

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const getDefaultImage = (item: CartItem) => {
        return item.imageUrls && item.imageUrls.length > 0
            ? item.imageUrls[0]
            : "/assets/placeholder.png";
    };

    if (loading) {
        return (
            <PageLayout showCategories={false}>
                <LoadingState message="Loading your cart..." />
            </PageLayout>
        );
    }

    return (
        <PageLayout showCategories={false}>
            <Snackbar
                open={!!notification}
                autoHideDuration={3000}
                onClose={() => setNotification(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={notification?.type || 'info'}
                    variant="filled"
                    onClose={() => setNotification(null)}
                >
                    {notification?.message}
                </Alert>
            </Snackbar>

            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{ mr: 2, color: 'primary.main' }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Shopping Cart
                </Typography>
            </Box>

            {error ? (
                <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
            ) : cartItems.length === 0 ? (
                <EmptyState
                    type="cart"
                    actionLabel="Continue Shopping"
                    onAction={() => navigate('/home')}
                />
            ) : (
                <Grid container spacing={4}>
                    {/* Cart Items */}
                    <Grid item xs={12} md={8}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                border: `1px solid ${theme.palette.divider}`
                            }}
                        >
                            <Box sx={{
                                p: 3,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderBottom: `1px solid ${theme.palette.divider}`
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    Cart Items ({cartItems.length})
                                </Typography>
                                <Button
                                    variant="text"
                                    color="error"
                                    startIcon={<DeleteOutlineIcon />}
                                    onClick={handleClearCart}
                                    sx={{ fontWeight: 500 }}
                                >
                                    Clear Cart
                                </Button>
                            </Box>

                            {cartItems.map((item) => (
                                <Box key={item.id} sx={{
                                    px: 3,
                                    py: 3,
                                    borderBottom: `1px solid ${theme.palette.divider}`,
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
                                                    border: `1px solid ${theme.palette.divider}`,
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
                                                        backgroundColor: theme.palette.mode === 'light'
                                                            ? theme.palette.grey[50]
                                                            : theme.palette.grey[900]
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
                                                    color: 'text.primary',
                                                    mb: 1,
                                                    cursor: 'pointer',
                                                    '&:hover': { color: 'primary.main' }
                                                }}
                                                onClick={() => navigate(`/item/${item.itemId}`)}
                                            >
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                                Seller: {item.seller}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                                Category: {item.category}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
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
                                                        border: `1px solid ${theme.palette.divider}`,
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
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    sx={{
                                                        border: `1px solid ${theme.palette.divider}`,
                                                        borderRadius: 1
                                                    }}
                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Grid>

                                        {/* Subtotal and Remove */}
                                        <Grid item xs={6} sm={2} sx={{ textAlign: { xs: 'right', sm: 'center' } }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                                                ${item.subtotal.toFixed(2)}
                                            </Typography>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemoveItem(item.id)}
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
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                position: 'sticky',
                                top: 100,
                                border: `1px solid ${theme.palette.divider}`
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
                                Order Summary
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                        Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                        ${cartTotals.subtotal.toFixed(2)}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                        Estimated Tax (7%)
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                        ${cartTotals.tax.toFixed(2)}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                        Shipping
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        fontWeight: 500,
                                        color: cartTotals.shipping > 0 ? 'text.primary' : 'success.main'
                                    }}>
                                        {cartTotals.shipping > 0 ? `$${cartTotals.shipping.toFixed(2)}` : 'FREE'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    Total
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    ${cartTotals.total.toFixed(2)}
                                </Typography>
                            </Box>

                            {cartTotals.shipping === 0 && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    bgcolor: theme.palette.mode === 'light' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(52, 211, 153, 0.15)',
                                    p: 2,
                                    borderRadius: 2,
                                    mb: 3
                                }}>
                                    <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                                    <Typography variant="body2" sx={{ color: 'success.main' }}>
                                        You've qualified for free shipping!
                                    </Typography>
                                </Box>
                            )}

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleCheckout}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    fontWeight: 600,
                                }}
                            >
                                Proceed to Checkout
                            </Button>

                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => navigate('/home')}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    fontWeight: 600,
                                    mt: 2,
                                }}
                            >
                                Continue Shopping
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </PageLayout>
    );
};

export default CartPage;
