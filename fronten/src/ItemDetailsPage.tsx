import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Rating,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CategoryIcon from '@mui/icons-material/Category';
import CartIcon from './components/CartIcon';
import axios from 'axios';
import {format, formatDistance} from 'date-fns';

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
    const {itemId} = useParams<{ itemId: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<ItemDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [tabValue, setTabValue] = useState(0);
    const [similarItems, setSimilarItems] = useState<ItemDetails[]>([]);
    const [loadingSimilar, setLoadingSimilar] = useState(false);

    useEffect(() => {
        const fetchItemDetails = async () => {
            if (!itemId) return;
            const userId = localStorage.getItem('userId');
            if (userId === null) return;

            setLoading(true);
            setError(null);

            try {
                // API call to get item details
                const response = await axios.get(`http://localhost:8080/api/v1/item/${itemId}/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (response.data) {
                    setItem(response.data);
                    
                    // Fetch similar items
                    fetchSimilarItems(response.data.category);
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

        fetchItemDetails();

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

        setLoadingSimilar(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/item/getAllListingsByCategory`, {
                params: {category},
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data && Array.isArray(response.data)) {
                // Filter out the current item and limit to 4 items
                const filtered = response.data
                    .filter((item: ItemDetails) => item.id.toString() !== itemId)
                    .slice(0, 4);
                setSimilarItems(filtered);
            }
        } catch (error) {
            console.error("Error fetching similar items:", error);
        } finally {
            setLoadingSimilar(false);
        }
    };

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleContactSeller = () => {
        // Implement contact seller functionality
        alert('Contact seller functionality would go here');
    };

    const handleBuyNow = () => {
        // Implement buy now functionality
        if (!item) return;

        // Navigate to checkout page or show modal
        alert(`Processing purchase for ${quantity} x ${item.title}`);
    };

    const handleAddToCart = async () => {
        // Implement add to cart functionality
        if (!item) return;

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('Please log in to add items to your cart');
                return;
            }

            const response = await axios.post('http://localhost:8080/api/v1/cart/add', null, {
                params: {
                    userId,
                    itemId: item.id,
                    quantity
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                // Show success message
                alert(`Added ${quantity} x ${item.title} to cart`);
                // Optionally navigate to cart
                // navigate('/cart');
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
            return formatDistance(date, new Date(), {addSuffix: true});
        } catch (e) {
            return '';
        }
    };



    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error || !item) {
        return (
            <Container maxWidth="lg" sx={{py: 4}}>
                <Alert severity="error" sx={{mb: 2}}>
                    {error || 'Item not found'}
                </Alert>
                <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{mb: 3}}>
                <MuiLink component="button" color="inherit" onClick={() => navigate('/home')}
                         sx={{textDecoration: 'none'}}>
                    Home
                </MuiLink>
                <MuiLink component="button" color="inherit" onClick={() => navigate('/listings')}
                         sx={{textDecoration: 'none'}}>
                    Listings
                </MuiLink>
                <MuiLink component="button" color="inherit"
                         onClick={() => navigate(`/search?q=${encodeURIComponent(item.category)}`)}
                         sx={{textDecoration: 'none'}}>
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
                            borderRadius: 2,
                            border: '1px solid #e2e8f0',
                            mb: 2,
                            position: 'relative',
                        }}
                    >
                        <Box sx={{position: 'relative'}}>
                            <CardMedia
                                component="img"
                                image={item.imageUrls && item.imageUrls.length > 0
                                    ? item.imageUrls[currentImageIndex]
                                    : '/assets/placeholder.png'}
                                alt={item.title}
                                sx={{
                                    width: '100%',
                                    height: 400,
                                    objectFit: 'contain',
                                    bgcolor: '#f8fafc'
                                }}
                            />

                            {/* Favorite and share buttons overlayed on the image */}
                            <Box sx={{position: 'absolute', top: 10, right: 10, display: 'flex', gap: 1}}>
                                <Tooltip title="Add to favorites">
                                    <IconButton
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.8)',
                                            '&:hover': {bgcolor: 'rgba(255,255,255,0.9)'}
                                        }}
                                    >
                                        <FavoriteIcon sx={{color: '#e53e3e'}}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share this item">
                                    <IconButton
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.8)',
                                            '&:hover': {bgcolor: 'rgba(255,255,255,0.9)'}
                                        }}
                                    >
                                        <ShareIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Thumbnail Images */}
                    {item.imageUrls && item.imageUrls.length > 1 && (
                        <Stack direction="row" spacing={1} sx={{overflowX: 'auto', pb: 1}}>
                            {item.imageUrls.map((url, index) => (
                                <Box
                                    key={index}
                                    onClick={() => handleImageClick(index)}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 1,
                                        border: index === currentImageIndex ? '2px solid #6b46c1' : '1px solid #e2e8f0',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
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

                    {/* Item Description Tabs (for mobile view) */}
                    <Box sx={{mt: 4, display: {md: 'none'}}}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    color: '#4a5568',
                                    '&.Mui-selected': {color: '#6b46c1'}
                                },
                                '& .MuiTabs-indicator': {bgcolor: '#6b46c1'}
                            }}
                        >
                            <Tab label="Description"/>
                            <Tab label="Details"/>
                            <Tab label="Shipping"/>
                        </Tabs>

                        {tabValue === 0 && (
                            <Box sx={{pt: 2}}>
                                <Typography variant="body1" sx={{color: '#4b5563', whiteSpace: 'pre-line'}}>
                                    {item.description}
                                </Typography>
                            </Box>
                        )}

                        {tabValue === 1 && (
                            <Box sx={{pt: 2}}>
                                <List disablePadding>
                                    <ListItem disablePadding sx={{py: 1}}>
                                        <ListItemIcon sx={{minWidth: 40}}>
                                            <CategoryIcon sx={{color: '#6b46c1'}}/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Category"
                                            secondary={item.category}
                                            primaryTypographyProps={{variant: 'body2', color: '#4a5568'}}
                                            secondaryTypographyProps={{
                                                variant: 'body1',
                                                fontWeight: 500,
                                                color: '#2d3748'
                                            }}
                                        />
                                    </ListItem>

                                    <ListItem disablePadding sx={{py: 1}}>
                                        <ListItemIcon sx={{minWidth: 40}}>
                                            <CalendarMonthIcon sx={{color: '#6b46c1'}}/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Posted Date"
                                            secondary={formatDate(item.createdAt)}
                                            primaryTypographyProps={{variant: 'body2', color: '#4a5568'}}
                                            secondaryTypographyProps={{
                                                variant: 'body1',
                                                fontWeight: 500,
                                                color: '#2d3748'
                                            }}
                                        />
                                    </ListItem>

                                    <ListItem disablePadding sx={{py: 1}}>
                                        <ListItemIcon sx={{minWidth: 40}}>
                                            <AccessTimeIcon sx={{color: '#6b46c1'}}/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Listed"
                                            secondary={getTimeSincePosting(item.createdAt)}
                                            primaryTypographyProps={{variant: 'body2', color: '#4a5568'}}
                                            secondaryTypographyProps={{
                                                variant: 'body1',
                                                fontWeight: 500,
                                                color: '#2d3748'
                                            }}
                                        />
                                    </ListItem>
                                </List>
                            </Box>
                        )}

                        {tabValue === 2 && (
                            <Box sx={{pt: 2}}>
                                <List disablePadding>
                                    <ListItem disablePadding sx={{py: 1}}>
                                        <ListItemIcon sx={{minWidth: 40}}>
                                            <LocalShippingIcon sx={{color: '#6b46c1'}}/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Shipping"
                                            secondary="Available for pickup on campus"
                                            primaryTypographyProps={{variant: 'body2', color: '#4a5568'}}
                                            secondaryTypographyProps={{
                                                variant: 'body1',
                                                fontWeight: 500,
                                                color: '#2d3748'
                                            }}
                                        />
                                    </ListItem>

                                    <ListItem disablePadding sx={{py: 1}}>
                                        <ListItemIcon sx={{minWidth: 40}}>
                                            <LocationOnIcon sx={{color: '#6b46c1'}}/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Location"
                                            secondary="Florida Polytechnic University"
                                            primaryTypographyProps={{variant: 'body2', color: '#4a5568'}}
                                            secondaryTypographyProps={{
                                                variant: 'body1',
                                                fontWeight: 500,
                                                color: '#2d3748'
                                            }}
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
                            borderRadius: 2,
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        {/* Category Chip */}
                        <Chip
                            label={item.category}
                            size="small"
                            sx={{
                                mb: 2,
                                bgcolor: '#f3f4f6',
                                color: '#6b46c1',
                                fontWeight: 500
                            }}
                        />

                        {/* Listing Time */}
                        <Typography variant="body2" sx={{color: '#718096', mb: 1}}>
                            Listed {getTimeSincePosting(item.createdAt)}
                        </Typography>

                        {/* Title */}
                        <Typography variant="h4" component="h1" sx={{fontWeight: 700, mb: 2}}>
                            {item.title}
                        </Typography>

                        {/* Price */}
                        <Typography variant="h3" sx={{fontWeight: 700, color: '#6b46c1', mb: 3}}>
                            ${item.price?.toFixed(2)}
                        </Typography>

                        {/* Availability */}
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 3}}>
                            {item.quantity > 0 ? (
                                <>
                                    <CheckCircleIcon sx={{color: '#38a169', mr: 1}}/>
                                    <Typography variant="body1" sx={{color: '#38a169', fontWeight: 500}}>
                                        In Stock
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <AccessTimeIcon sx={{color: '#e53e3e', mr: 1}}/>
                                    <Typography variant="body1" sx={{color: '#e53e3e', fontWeight: 500}}>
                                        Out of Stock
                                    </Typography>
                                </>
                            )}
                        </Box>

                        {/* Quantity */}
                        <Box sx={{mb: 3}}>
                            <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 1}}>
                                Quantity
                            </Typography>
                            <TextField
                                type="number"
                                InputProps={{
                                    inputProps: {
                                        min: 1,
                                        max: item.quantity
                                    }
                                }}
                                value={quantity}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value && value > 0 && value <= item.quantity) {
                                        setQuantity(value);
                                    }
                                }}
                                size="small"
                                sx={{width: 100}}
                            />
                            <Typography variant="body2" sx={{color: '#718096', mt: 1}}>
                                {item.quantity > 0
                                    ? `${item.quantity} available`
                                    : 'Out of stock'}
                            </Typography>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{display: 'flex', gap: 2, mb: 4}}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                startIcon={<ShoppingCartIcon/>}
                                onClick={handleAddToCart}
                                disabled={item.quantity <= 0}
                                sx={{
                                    py: 1.5,
                                    bgcolor: '#6b46c1',
                                    '&:hover': {bgcolor: '#5a32a3'},
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Add to Cart
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                fullWidth
                                onClick={handleBuyNow}
                                disabled={item.quantity <= 0}
                                sx={{
                                    py: 1.5,
                                    borderColor: '#6b46c1',
                                    color: '#6b46c1',
                                    '&:hover': {
                                        borderColor: '#5a32a3',
                                        bgcolor: 'rgba(107, 70, 193, 0.04)'
                                    },
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Buy Now
                            </Button>
                        </Box>

                        {/* Seller Information */}
                        <Box sx={{mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2}}>
                            <Typography variant="h6"
                                        sx={{fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center'}}>
                                <PersonIcon sx={{mr: 1, color: '#6b46c1'}}/>
                                Seller Information
                            </Typography>

                            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                <Avatar sx={{mr: 2, bgcolor: '#6b46c1'}}>
                                    {item.seller?.username?.charAt(0) || 'S'}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                                        {item.seller?.username || 'Florida Poly Student'}
                                    </Typography>
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <Rating value={4.5} precision={0.5} size="small" readOnly sx={{mr: 1}}/>
                                        <Typography variant="body2" sx={{color: '#718096'}}>
                                            4.5 (10 reviews)
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                onClick={handleContactSeller}
                                sx={{
                                    borderColor: '#6b46c1',
                                    color: '#6b46c1',
                                    '&:hover': {
                                        borderColor: '#5a32a3',
                                        bgcolor: 'rgba(107, 70, 193, 0.04)'
                                    },
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Contact Seller
                            </Button>
                        </Box>

                        {/* Detailed Description (for desktop view) */}
                        <Box sx={{display: {xs: 'none', md: 'block'}}}>
                            <Typography variant="h6" sx={{fontWeight: 600, mb: 2}}>
                                Description
                            </Typography>

                            <Typography variant="body1" sx={{color: '#4b5563', whiteSpace: 'pre-line', mb: 3}}>
                                {item.description}
                            </Typography>

                            <Divider sx={{mb: 3}}/>

                            {/* Item Details */}
                            <Typography variant="h6" sx={{fontWeight: 600, mb: 2}}>
                                Item Details
                            </Typography>

                            <Grid container spacing={2} sx={{mb: 3}}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{color: '#718096'}}>
                                        Category
                                    </Typography>
                                    <Typography variant="body1" sx={{fontWeight: 500}}>
                                        {item.category}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{color: '#718096'}}>
                                        Listed
                                    </Typography>
                                    <Typography variant="body1" sx={{fontWeight: 500}}>
                                        {formatDate(item.createdAt)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{color: '#718096'}}>
                                        Item ID
                                    </Typography>
                                    <Typography variant="body1" sx={{fontWeight: 500}}>
                                        {item.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{color: '#718096'}}>
                                        Location
                                    </Typography>
                                    <Typography variant="body1" sx={{fontWeight: 500}}>
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
                <Box sx={{mt: 6}}>
                    <Typography variant="h5" sx={{fontWeight: 700, mb: 3}}>
                        Similar Items
                    </Typography>

                    <Grid container spacing={3}>
                        {similarItems.map((item) => (
                            <Grid item xs={12} sm={6} md={3} key={item.id}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        borderRadius: 2,
                                        transition: 'all 0.2s',
                                        border: '1px solid #e5e7eb',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                                        },
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate(`/item/${item.id}`)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={item.imageUrls && item.imageUrls.length > 0
                                            ? item.imageUrls[0]
                                            : '/assets/placeholder.png'}
                                        alt={item.title}
                                        sx={{objectFit: "cover"}}
                                    />
                                    <Box sx={{p: 2}}>
                                        <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 1, color: '#4a5568'}}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="h6" sx={{fontWeight: 700, color: '#6b46c1'}}>
                                            ${item.price?.toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Container>
    );
};

export default ItemDetailsPage; 