import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Alert, alpha, Box, Grid, Paper, Typography, useTheme,} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import {DashboardSidebar, PageLayout} from "./components/layout";
import type {ItemType} from "./components/common";
import {EmptyState, ItemCard, ItemCardSkeleton} from "./components/common";

interface SavedItem {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    imageUrls: string[];
    createdAt: string;
}

const SavedItemsPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetchSavedItems();
    }, []);

    const fetchSavedItems = async () => {
        setLoading(true);
        setError(null);

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/v1/saved/getAllSaved`, {
                params: {userId},
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data && Array.isArray(response.data)) {
                setSavedItems(response.data);
            }
        } catch (err) {
            console.error('Error fetching saved items:', err);
            setError('Failed to load your saved items. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const mapToItemType = (item: SavedItem): ItemType => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        imageUrls: item.imageUrls,
    });

    const handleUnsave = async (itemId: number) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            await axios.delete(`http://localhost:8080/api/v1/saved/unsave`, {
                params: {userId, itemId},
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setSavedItems(savedItems.filter(item => item.id !== itemId));
        } catch (err) {
            console.error('Error unsaving item:', err);
        }
    };

    return (
        <PageLayout variant="dashboard" showCategories={false} showFooter={false}>
            <Box sx={{display: 'flex', minHeight: 'calc(100vh - 64px)'}}>
                {/* Sidebar */}
                <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}/>

                {/* Main Content */}
                <Box sx={{
                    flex: 1,
                    p: { xs: 2, md: 4 },
                    ml: { xs: 0, md: '260px' },
                    maxWidth: { md: 'calc(100% - 260px)' },
                }}>
                    {error && (
                        <Alert severity="error" sx={{mb: 3, borderRadius: 2}}>
                            {error}
                        </Alert>
                    )}

                    {/* Header */}
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                        <Box>
                            <Typography variant="h4" sx={{fontWeight: 700, color: 'text.primary'}}>
                                Saved Items
                            </Typography>
                            <Typography variant="body1" sx={{color: 'text.secondary', mt: 0.5}}>
                                Items you've saved for later
                            </Typography>
                        </Box>
                    </Box>

                    {/* Stats Card */}
                    {!loading && savedItems.length > 0 && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 4,
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <FavoriteIcon sx={{color: 'error.main'}}/>
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={{fontWeight: 700, color: 'text.primary'}}>
                                    {savedItems.length}
                                </Typography>
                                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                    Saved Items
                                </Typography>
                            </Box>
                        </Paper>
                    )}

                    {/* Saved Items Grid */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Typography variant="h6" sx={{fontWeight: 600, color: 'text.primary', mb: 3}}>
                            Your Favorites
                        </Typography>

                        {loading ? (
                            <Grid container spacing={2}>
                                {[...Array(8)].map((_, index) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                        <ItemCardSkeleton/>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : savedItems.length === 0 ? (
                            <EmptyState
                                type="favorites"
                                title="No saved items"
                                description="You haven't saved any items yet. Browse listings and save items you like!"
                                actionLabel="Browse Items"
                                onAction={() => navigate('/home')}
                            />
                        ) : (
                            <Grid container spacing={2}>
                                {savedItems.map((item) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                                        <ItemCard
                                            item={mapToItemType(item)}
                                            showFavorite={true}
                                            isFavorite={true}
                                            onFavoriteClick={() => handleUnsave(item.id)}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Paper>
                </Box>
            </Box>
        </PageLayout>
    );
};

export default SavedItemsPage;
