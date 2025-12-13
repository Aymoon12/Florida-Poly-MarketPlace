import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Typography,
  useTheme,
  Skeleton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { hoverEffects } from '../../theme';

export interface ItemType {
  id: number;
  title: string;
  description?: string;
  price: number;
  category?: string;
  imageUrls?: string[];
  views?: number;
  seller?: {
    name: string;
    avatar?: string;
  };
}

interface ItemCardProps {
  item: ItemType;
  variant?: 'default' | 'compact' | 'horizontal';
  showFavorite?: boolean;
  isFavorite?: boolean;
  onFavoriteClick?: (item: ItemType) => void;
  showViews?: boolean;
  showCategory?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  variant = 'default',
  showFavorite = true,
  isFavorite = false,
  onFavoriteClick,
  showViews = false,
  showCategory = true,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const imageUrl = item.imageUrls && item.imageUrls.length > 0
    ? item.imageUrls[0]
    : '/assets/placeholder.png';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteClick?.(item);
  };

  const categoryColors: Record<string, string> = {
    Electronics: theme.palette.info.main,
    Textbooks: theme.palette.success.main,
    Fashion: '#D53F8C',
    Sports: theme.palette.error.main,
    Other: theme.palette.warning.main,
    Collectibles: theme.palette.primary.main,
    Services: theme.palette.secondary.main,
  };

  if (variant === 'horizontal') {
    return (
      <Card
        elevation={0}
        sx={{
          display: 'flex',
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          ...hoverEffects.liftSmall,
        }}
      >
        <CardActionArea
          onClick={() => navigate(`/item/${item.id}`)}
          sx={{ display: 'flex', alignItems: 'stretch' }}
        >
          <CardMedia
            component="img"
            image={imageUrl}
            alt={item.title}
            sx={{
              width: 160,
              height: 160,
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
          <CardContent
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              py: 2,
            }}
          >
            <Box>
              {showCategory && item.category && (
                <Chip
                  label={item.category}
                  size="small"
                  sx={{
                    mb: 1,
                    height: 22,
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    backgroundColor: `${categoryColors[item.category] || theme.palette.grey[500]}15`,
                    color: categoryColors[item.category] || theme.palette.grey[600],
                  }}
                />
              )}
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {item.title}
              </Typography>
              {item.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {item.description}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                ${item.price.toFixed(2)}
              </Typography>
              {showViews && item.views !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {item.views}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </CardActionArea>
        {showFavorite && (
          <IconButton
            onClick={handleFavoriteClick}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                backgroundColor: 'background.paper',
              },
            }}
            size="small"
          >
            {isFavorite ? (
              <FavoriteIcon sx={{ color: 'error.main', fontSize: 20 }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        )}
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          ...hoverEffects.liftSmall,
        }}
      >
        <CardActionArea onClick={() => navigate(`/item/${item.id}`)}>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={item.title}
            sx={{
              height: 120,
              objectFit: 'cover',
            }}
          />
          <CardContent sx={{ p: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.title}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              ${item.price.toFixed(2)}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      elevation={0}
      sx={{
        position: 'relative',
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'visible',
        ...hoverEffects.lift,
        '& .favorite-button': {
          opacity: 0,
          transition: 'opacity 0.2s ease-in-out',
        },
        '&:hover .favorite-button': {
          opacity: 1,
        },
      }}
    >
      <CardActionArea onClick={() => navigate(`/item/${item.id}`)}>
        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={item.title}
            sx={{
              height: 200,
              objectFit: 'cover',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
          {showCategory && item.category && (
            <Chip
              label={item.category}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'background.paper',
                color: categoryColors[item.category] || 'text.primary',
                boxShadow: 1,
              }}
            />
          )}
        </Box>
        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
            }}
          >
            ${item.price.toFixed(2)}
          </Typography>
          {item.description && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mt: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {item.description}
            </Typography>
          )}
          {showViews && item.views !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              <VisibilityIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {item.views} views
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
      {showFavorite && (
        <IconButton
          onClick={handleFavoriteClick}
          className="favorite-button"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'background.paper',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: 'background.paper',
              transform: 'scale(1.1)',
            },
          }}
          size="small"
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: 'error.main', fontSize: 20 }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          )}
        </IconButton>
      )}
    </Card>
  );
};

// Loading skeleton component
export const ItemCardSkeleton: React.FC<{ variant?: 'default' | 'compact' | 'horizontal' }> = ({
  variant = 'default',
}) => {
  const theme = useTheme();

  if (variant === 'horizontal') {
    return (
      <Card
        elevation={0}
        sx={{
          display: 'flex',
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        }}
      >
        <Skeleton variant="rectangular" width={160} height={160} />
        <CardContent sx={{ flex: 1 }}>
          <Skeleton variant="text" width="30%" height={24} />
          <Skeleton variant="text" width="80%" height={28} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={32} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        }}
      >
        <Skeleton variant="rectangular" height={120} />
        <CardContent sx={{ p: 1.5 }}>
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="40%" height={24} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
      }}
    >
      <Skeleton variant="rectangular" height={200} />
      <CardContent sx={{ p: 2 }}>
        <Skeleton variant="text" width="80%" height={24} />
        <Skeleton variant="text" width="40%" height={28} />
        <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
        <Skeleton variant="text" width="70%" height={20} />
      </CardContent>
    </Card>
  );
};

export default ItemCard;
