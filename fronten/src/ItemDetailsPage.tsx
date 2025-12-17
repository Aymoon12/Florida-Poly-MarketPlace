import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Alert,
    Avatar,
    Box,
    Breadcrumbs,
    Button,
    Chip,
    Divider,
    Grid,
    IconButton,
    Link as MuiLink,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CategoryIcon from '@mui/icons-material/Category';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';
import { format, formatDistance } from 'date-fns';
import ChatService from './services/ChatService';
import ReviewService, { RatingSummary as RatingSummaryType } from './services/ReviewService';
import { PageLayout } from './components/layout';
import { ItemCard, LoadingState, RatingSummary, ReviewsList } from './components/common';

interface ItemDetails {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    imageUrls: string[];
    createdAt?: string;
    sellerName?: string;
    sellerRating?: number;
    quantity: number;
    seller?: {
        id: number;
        username: string;
    };
}

const ItemDetailsPage: React.FC = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const [item, setItem] = useState<ItemDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [tabValue, setTabValue] = useState(0);
    const [similarItems, setSimilarItems] = useState<ItemDetails[]>([]);
    const [isSaved, setIsSaved] = useState(false);
    const [savedText, setSavedText] = useState('Save Listing');
    const [sellerRating, setSellerRating] = useState<RatingSummaryType | null>(null);

    useEffect(() => {
        const fetchItemDetails = async () => {
            if (!itemId) return;
            const userId = localStorage.getItem('userId');
            if (userId === null) return;

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`http://localhost:8080/api/v1/item/${itemId}/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (response.data) {
                    setItem(response.data);
                    fetchSimilarItems(response.data.category);

                    // Fetch seller rating
                    if (response.data.seller?.id) {
                        try {
                            const ratingData = await ReviewService.getSellerRatingSummary(response.data.seller.id);
                            setSellerRating(ratingData);
                        } catch (err) {
                            console.error('Error fetching seller rating:', err);
                        }
                    }
                } else {
                    throw new Error('Item not found');
                }
            } catch (err) {
                console.error('Error fetching item:', err);
                setError('Failed to load item details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        const checkIfSaved = async () => {
            if (!itemId) return;
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            try {
                const response = await axios.get('http://localhost:8080/api/v1/saved/check', {
                    params: { userId, itemId },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (response.status === 200) {
                    setIsSaved(response.data);
                    setSavedText(response.data ? 'Already Saved' : 'Save Listing');
                }
            } catch (error) {
                console.error("Error checking if listing is saved:", error);
                setIsSaved(false);
            }
        };

        fetchItemDetails();
        checkIfSaved();

        return () => {
            removeWatcher();
        };
    }, [itemId]);

    const removeWatcher = async () => {
        try {
            await axios.post(`http://localhost:8080/api/v1/item/decrementWatchers/${itemId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
        } catch (error) {
            console.error('Failed to remove watcher:', error);
        }
    };

    const fetchSimilarItems = async (category: string) => {
        if (!category) return;

        try {
            const response = await axios.get(`http://localhost:8080/api/v1/item/getAllListingsByCategory`, {
                params: { category },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data && Array.isArray(response.data)) {
                const filtered = response.data
                    .filter((item: ItemDetails) => item.id.toString() !== itemId)
                    .slice(0, 4);
                setSimilarItems(filtered);
            }
        } catch (error) {
            console.error("Error fetching similar items:", error);
        }
    };

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleContactSeller = async () => {
        if (!item) return;

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('Please log in to contact the seller');
                navigate('/login');
                return;
            }

            if (item.seller?.id.toString() === userId) {
                alert('You cannot message yourself');
                return;
            }

            const response = await ChatService.startConversation({
                itemId: item.id,
                initialMessage: `Hi, I'm interested in your "${item.title}". Is it still available?`,
                userId: userId
            });

            navigate(`/inbox?conversation=${response.id}`);
        } catch (error) {
            console.error('Error starting conversation:', error);
            alert('Failed to start conversation. Please try again.');
        }
    };

    const handleBuyNow = () => {
        if (!item) return;
        alert(`Processing purchase for ${quantity} x ${item.title}`);
    };

    const handleSaveListing = async () => {
        if (!item) return;

        try {
            const response = await axios.post('http://localhost:8080/api/v1/saved/save', null, {
                params: {
                    userId: localStorage.getItem('userId'),
                    itemId: item.id
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                setIsSaved(true);
                setSavedText('Already Saved');
                alert("Listing saved successfully");
            } else if (response.status === 208) {
                alert("Listing already saved");
            } else {
                alert("Failed to save listing");
            }
        } catch (error) {
            console.error("Error saving listing:", error);
            alert("Failed to save listing");
        }
    };

    const handleAddToCart = async () => {
        if (!item) return;

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('Please log in to add items to your cart');
                return;
            }

            const response = await axios.post('http://localhost:8080/api/v1/cart/add', null, {
                params: { userId, itemId: item.id, quantity },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                alert(`Added ${quantity} x ${item.title} to cart`);
            }
        } catch (err) {
            console.error('Error adding item to cart:', err);
            alert('Failed to add item to cart. Please try again.');
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown date';
        try {
            const date = new Date(dateString);
            return format(date, 'MMMM d, yyyy');
        } catch (e) {
            return dateString;
        }
    };

    const getTimeSincePosting = (dateString?: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return formatDistance(date, new Date(), { addSuffix: true });
        } catch (e) {
            return '';
        }
    };

    if (loading) {
        return (
            <PageLayout showCategories={false}>
                <LoadingState fullPage message="Loading item details..." />
            </PageLayout>
        );
    }

    if (error || !item) {
        return (
            <PageLayout showCategories={false}>
                <Box sx={{ py: 4 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error || 'Item not found'}
                    </Alert>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                </Box>
            </PageLayout>
        );
    }

    return (
        <PageLayout showCategories={false}>
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <MuiLink
                    component="button"
                    color="inherit"
                    onClick={() => navigate('/home')}
                    sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                    Home
                </MuiLink>
                <MuiLink
                    component="button"
                    color="inherit"
                    onClick={() => navigate('/listings')}
                    sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                    Listings
                </MuiLink>
                <MuiLink
                    component="button"
                    color="inherit"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(item.category)}`)}
                    sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                    {item.category}
                </MuiLink>
                <Typography color="text.primary">{item.title}</Typography>
            </Breadcrumbs>

            <Grid container spacing={4}>
                {/* Left Column - Images */}
                <Grid item xs={12} md={6}>
                    {/* Main Image */}
                    <Paper
                        elevation={0}
                        sx={{
                            overflow: 'hidden',
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            mb: 2,
                            position: 'relative',
                        }}
                    >
                        <Box sx={{ position: 'relative' }}>
                            <Box
                                component="img"
                                src={item.imageUrls && item.imageUrls.length > 0
                                    ? item.imageUrls[currentImageIndex]
                                    : '/assets/placeholder.png'}
                                alt={item.title}
                                sx={{
                                    width: '100%',
                                    height: 400,
                                    objectFit: 'contain',
                                    bgcolor: theme.palette.mode === 'light'
                                        ? theme.palette.grey[50]
                                        : theme.palette.grey[900]
                                }}
                            />

                            {/* Favorite and share buttons */}
                            <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
                                <Tooltip title={isSaved ? "Saved" : "Add to favorites"}>
                                    <IconButton
                                        onClick={handleSaveListing}
                                        sx={{
                                            bgcolor: 'background.paper',
                                            boxShadow: 2,
                                            '&:hover': { bgcolor: 'background.paper' }
                                        }}
                                    >
                                        {isSaved ? (
                                            <FavoriteIcon sx={{ color: 'error.main' }} />
                                        ) : (
                                            <FavoriteBorderIcon />
                                        )}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share this item">
                                    <IconButton
                                        sx={{
                                            bgcolor: 'background.paper',
                                            boxShadow: 2,
                                            '&:hover': { bgcolor: 'background.paper' }
                                        }}
                                    >
                                        <ShareIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Thumbnail Images */}
                    {item.imageUrls && item.imageUrls.length > 1 && (
                        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                            {item.imageUrls.map((url, index) => (
                                <Box
                                    key={index}
                                    onClick={() => handleImageClick(index)}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 2,
                                        border: index === currentImageIndex
                                            ? `2px solid ${theme.palette.primary.main}`
                                            : `1px solid ${theme.palette.divider}`,
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: 3
                                        }
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={url}
                                        alt={`Thumbnail ${index + 1}`}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    )}

                    {/* Mobile Tabs */}
                    <Box sx={{ mt: 4, display: { md: 'none' } }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                            }}
                        >
                            <Tab label="Description" />
                            <Tab label="Details" />
                            <Tab label="Shipping" />
                        </Tabs>

                        {tabValue === 0 && (
                            <Box sx={{ pt: 2 }}>
                                <Typography variant="body1" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
                                    {item.description}
                                </Typography>
                            </Box>
                        )}

                        {tabValue === 1 && (
                            <Box sx={{ pt: 2 }}>
                                <List disablePadding>
                                    <ListItem disablePadding sx={{ py: 1 }}>
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <CategoryIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Category"
                                            secondary={item.category}
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                                        />
                                    </ListItem>
                                    <ListItem disablePadding sx={{ py: 1 }}>
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <CalendarMonthIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Posted Date"
                                            secondary={formatDate(item.createdAt)}
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                                        />
                                    </ListItem>
                                    <ListItem disablePadding sx={{ py: 1 }}>
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <AccessTimeIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Listed"
                                            secondary={getTimeSincePosting(item.createdAt)}
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                                        />
                                    </ListItem>
                                </List>
                            </Box>
                        )}

                        {tabValue === 2 && (
                            <Box sx={{ pt: 2 }}>
                                <List disablePadding>
                                    <ListItem disablePadding sx={{ py: 1 }}>
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <LocalShippingIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Shipping"
                                            secondary="Available for pickup on campus"
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                                        />
                                    </ListItem>
                                    <ListItem disablePadding sx={{ py: 1 }}>
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <LocationOnIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Location"
                                            secondary="Florida Polytechnic University"
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                                        />
                                    </ListItem>
                                </List>
                            </Box>
                        )}
                    </Box>
                </Grid>

                {/* Right Column - Item Details */}
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`
                        }}
                    >
                        {/* Category Chip */}
                        <Chip
                            label={item.category}
                            size="small"
                            sx={{
                                mb: 2,
                                bgcolor: theme.palette.mode === 'light'
                                    ? 'rgba(83, 45, 142, 0.1)'
                                    : 'rgba(139, 109, 196, 0.2)',
                                color: 'primary.main',
                                fontWeight: 600
                            }}
                        />

                        {/* Listing Time */}
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                            Listed {getTimeSincePosting(item.createdAt)}
                        </Typography>

                        {/* Title */}
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                            {item.title}
                        </Typography>

                        {/* Price */}
                        <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
                            ${item.price?.toFixed(2)}
                        </Typography>

                        {/* Availability */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            {item.quantity > 0 ? (
                                <>
                                    <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                                    <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 500 }}>
                                        In Stock ({item.quantity} available)
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <AccessTimeIcon sx={{ color: 'error.main', mr: 1 }} />
                                    <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 500 }}>
                                        Out of Stock
                                    </Typography>
                                </>
                            )}
                        </Box>

                        {/* Quantity */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                Quantity
                            </Typography>
                            <TextField
                                type="number"
                                InputProps={{
                                    inputProps: { min: 1, max: item.quantity }
                                }}
                                value={quantity}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value && value > 0 && value <= item.quantity) {
                                        setQuantity(value);
                                    }
                                }}
                                size="small"
                                sx={{ width: 100 }}
                            />
                        </Box>

                        {/* Action Buttons */}
                        <Stack spacing={2} sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={<ShoppingCartIcon />}
                                    onClick={handleAddToCart}
                                    disabled={item.quantity <= 0}
                                    sx={{ py: 1.5, borderRadius: 2 }}
                                >
                                    Add to Cart
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    onClick={handleBuyNow}
                                    disabled={item.quantity <= 0}
                                    sx={{ py: 1.5, borderRadius: 2 }}
                                >
                                    Buy Now
                                </Button>
                            </Box>
                            <Button
                                variant="outlined"
                                size="large"
                                fullWidth
                                startIcon={isSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                onClick={handleSaveListing}
                                disabled={isSaved}
                                sx={{ py: 1.5, borderRadius: 2 }}
                            >
                                {savedText}
                            </Button>
                        </Stack>

                        {/* Seller Information */}
                        <Paper
                            elevation={0}
                            sx={{
                                mb: 3,
                                p: 2.5,
                                bgcolor: theme.palette.mode === 'light'
                                    ? theme.palette.grey[50]
                                    : theme.palette.grey[800],
                                borderRadius: 2
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}
                            >
                                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                Seller Information
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 48, height: 48 }}>
                                    {item.seller?.username?.charAt(0) || 'S'}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {item.seller?.username || 'Florida Poly Student'}
                                    </Typography>
                                    {sellerRating && sellerRating.reviewCount > 0 ? (
                                        <RatingSummary summary={sellerRating} variant="compact" />
                                    ) : (
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            No reviews yet
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<ChatIcon />}
                                onClick={handleContactSeller}
                                sx={{ borderRadius: 2 }}
                            >
                                Contact Seller
                            </Button>
                        </Paper>

                        {/* Description (Desktop) */}
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Description
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', whiteSpace: 'pre-line', mb: 3 }}>
                                {item.description}
                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Item Details
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Category
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {item.category}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Listed
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {formatDate(item.createdAt)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Item ID
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {item.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Location
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        Florida Polytechnic University
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Similar Items Section */}
            {similarItems.length > 0 && (
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                        Similar Items
                    </Typography>

                    <Grid container spacing={3}>
                        {similarItems.map((similarItem) => (
                            <Grid item xs={12} sm={6} md={3} key={similarItem.id}>
                                <ItemCard
                                    item={{
                                        id: similarItem.id,
                                        title: similarItem.title,
                                        price: similarItem.price,
                                        category: similarItem.category,
                                        imageUrls: similarItem.imageUrls
                                    }}
                                    showFavorite={true}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Reviews Section */}
            <Box sx={{ mt: 6 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                        Item Reviews
                    </Typography>
                    <ReviewsList type="item" targetId={item.id} />
                </Paper>
            </Box>
        </PageLayout>
    );
};

export default ItemDetailsPage;
