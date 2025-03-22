import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Card,
  CardMedia,
  IconButton,
  Avatar,
  Stack,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

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
}

const ItemDetailsPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<ItemDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!itemId) return;

      setLoading(true);
      setError(null);

      try {
        // API call to get item details
        const response = await axios.get(`http://localhost:8080/api/v1/item/${itemId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        if (response.data) {
          setItem(response.data);

          // Also register this as a viewed item
          const userId = localStorage.getItem('userId');
          if (userId) {
            await axios.post(`http://localhost:8080/api/v1/user/viewItem`, null, {
              params: { userId, itemId },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            });
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

    fetchItemDetails();
  }, [itemId]);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleContactSeller = () => {
    // Implement contact seller functionality
    alert('Contact seller functionality would go here');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !item) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Item not found'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <Button 
        startIcon={<ArrowBackIcon />} 
        sx={{ mb: 3 }}
        onClick={() => navigate(-1)}
      >
        Back to listings
      </Button>
      
      <Grid container spacing={4}>
        {/* Item Images */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{ 
              overflow: 'hidden', 
              borderRadius: 2,
              border: '1px solid #e2e8f0',
              mb: 2 
            }}
          >
            <Box sx={{ position: 'relative' }}>
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
                    width: 70, 
                    height: 70, 
                    borderRadius: 1,
                    border: index === currentImageIndex ? '2px solid #6b46c1' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    flexShrink: 0,
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
        </Grid>
        
        {/* Item Details */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{ 
              p: 3, 
              height: '100%', 
              borderRadius: 2,
              border: '1px solid #e2e8f0'
            }}
          >
            {/* Title and Price */}
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              {item.title}
            </Typography>
            
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#6b46c1', mb: 2 }}>
              ${item.price?.toFixed(2)}
            </Typography>
            
            <Chip 
              label={item.category} 
              sx={{ 
                mb: 3, 
                bgcolor: '#f3f4f6', 
                color: '#4b5563',
                fontWeight: 500
              }} 
            />
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Description */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Description
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, color: '#4b5563' }}>
              {item.description}
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Seller Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ mr: 2, bgcolor: '#6b46c1' }}>
                {item.sellerName?.charAt(0) || 'S'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {item.sellerName || 'Florida Poly Student'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#718096' }}>
                  Seller
                </Typography>
              </Box>
            </Box>
            
            {/* Action Buttons */}
            <Button
              variant="contained"
              fullWidth
              sx={{ 
                mb: 2, 
                borderRadius: 50,
                py: 1.5,
                bgcolor: '#6b46c1',
                '&:hover': {
                  bgcolor: '#5a32b0'
                }
              }}
              onClick={handleContactSeller}
            >
              Contact Seller
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FavoriteIcon />}
                sx={{ 
                  borderRadius: 50,
                  py: 1.5,
                  borderColor: '#e2e8f0',
                  color: '#4b5563',
                  '&:hover': {
                    borderColor: '#cbd5e0',
                    bgcolor: 'rgba(0, 0, 0, 0.01)'
                  }
                }}
              >
                Save
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ShareIcon />}
                sx={{ 
                  borderRadius: 50,
                  py: 1.5,
                  borderColor: '#e2e8f0',
                  color: '#4b5563',
                  '&:hover': {
                    borderColor: '#cbd5e0',
                    bgcolor: 'rgba(0, 0, 0, 0.01)'
                  }
                }}
              >
                Share
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ItemDetailsPage; 