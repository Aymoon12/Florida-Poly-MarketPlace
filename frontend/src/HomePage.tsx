import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Typography,
    useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CategoryIcon from "@mui/icons-material/Category";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import { authApi, itemApi } from "./services/api";
import { PageLayout } from "./components/layout";
import { ItemCard, ItemCardSkeleton, CategoryCard, EmptyState } from "./components/common";
import type { ItemType } from "./components/common";
import type { Category } from "./components/common/CategoryCard";

const categories: Category[] = [
    { id: "electronics", label: "Electronics", color: "#3B82F6" },
    { id: "textbooks", label: "Textbooks", color: "#10B981" },
    { id: "fashion", label: "Fashion", color: "#EC4899" },
    { id: "sports", label: "Sports", color: "#EF4444" },
    { id: "other", label: "Other", color: "#F59E0B" },
    { id: "collectibles", label: "Collectibles", color: "#8B5CF6" },
];

const tabToCategory: Record<number, string> = {
    0: "All",
    1: "Electronics",
    2: "Textbooks",
    3: "Fashion",
    4: "Sports",
    5: "Other",
    6: "Collectibles",
    7: "Services"
};

const HomePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [recentlyViewed, setRecentlyViewed] = useState<ItemType[]>([]);
    const [featuredListings, setFeaturedListings] = useState<ItemType[]>([]);
    const [currentCategory, setCurrentCategory] = useState("All");

    const fetchItemsByCategory = async (category: string) => {
        setIsLoading(true);
        try {
            let response;
            if (category === "All") {
                response = await itemApi.search("", 0, 12);
            } else {
                response = await itemApi.getByCategory(category);
            }

            if (response.data && Array.isArray(response.data)) {
                setFeaturedListings(response.data);
            }
        } catch (error) {
            console.error("Error fetching items by category:", error);
            setFeaturedListings([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRecentlyViewed = async () => {
        try {
            const response = await itemApi.getRecentlyViewed();
            if (response.data && Array.isArray(response.data)) {
                setRecentlyViewed(response.data);
            }
        } catch (error) {
            console.error("Error fetching recently viewed items:", error);
            setRecentlyViewed([]);
        }
    };

    // Fetch current user info on mount (cookie-based auth)
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await authApi.getCurrentUser();
                if (response.data) {
                    localStorage.setItem('userId', response.data.userId.toString());
                    localStorage.setItem('name', response.data.name);
                    localStorage.setItem('email', response.data.email);
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
                // If not authenticated, redirect to login
                navigate('/');
            }
        };

        fetchCurrentUser();
    }, [navigate]);

    // Fetch listings data
    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const fetchData = async () => {
            if (isMounted) {
                await fetchItemsByCategory(currentCategory);
                await fetchRecentlyViewed();
            }
        };

        fetchData().finally(() => {
            if (isMounted) {
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [currentCategory]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        const category = tabToCategory[newValue];
        setCurrentCategory(category);
    };

    const handleCategoryClick = (category: Category) => {
        setCurrentCategory(category.label);
        const tabIndex = Object.entries(tabToCategory).find(([_, cat]) => cat === category.label)?.[0];
        if (tabIndex) {
            setTabValue(parseInt(tabIndex));
        }
    };

    const showBanner = tabValue === 0;
    const showCategoryGrid = tabValue === 0;

    return (
        <PageLayout
            variant="app"
            showCategories={true}
            currentTab={tabValue}
            onTabChange={handleTabChange}
        >
            {/* Category Title - Only shown when not on Home tab */}
            {tabValue !== 0 && (
                <Box sx={{ mb: 4, mt: 2 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <CategoryIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                        {currentCategory} Listings
                    </Typography>
                </Box>
            )}

            {/* Banner Section - Only shown on Home tab */}
            {showBanner && (
                <Paper
                    elevation={0}
                    sx={{
                        position: "relative",
                        height: { xs: 180, sm: 240, md: 280 },
                        mb: 4,
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            background: theme.palette.mode === 'light'
                                ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                                : `linear-gradient(135deg, ${theme.palette.grey[800]} 0%, ${theme.palette.grey[900]} 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    />
                    <Container
                        maxWidth="lg"
                        sx={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                    >
                        <Box sx={{ maxWidth: { xs: '100%', md: '50%' }, zIndex: 2, px: { xs: 2, sm: 0 } }}>
                            <Typography
                                variant="h3"
                                sx={{
                                    color: "#fff",
                                    fontWeight: 700,
                                    mb: 2,
                                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                                }}
                            >
                                Welcome to PolyMart
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "#fff",
                                    fontWeight: 500,
                                    mb: 3,
                                    opacity: 0.9,
                                    fontSize: { xs: '0.9rem', sm: '1.1rem' }
                                }}
                            >
                                Buy and sell with fellow Florida Poly students on campus
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<AddIcon />}
                                onClick={() => navigate("/create-listing")}
                                sx={{
                                    backgroundColor: "#fff",
                                    color: theme.palette.primary.main,
                                    borderRadius: 50,
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: "#f8f9fa"
                                    }
                                }}
                            >
                                Start Selling
                            </Button>
                        </Box>
                    </Container>
                </Paper>
            )}

            {/* Categories Section - Only shown on Home tab */}
            {showCategoryGrid && (
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}
                    >
                        Browse Categories
                    </Typography>
                    <Grid container spacing={2}>
                        {categories.map((category) => (
                            <Grid item xs={6} sm={4} md={2} key={category.id}>
                                <CategoryCard
                                    category={category}
                                    onClick={handleCategoryClick}
                                    selected={currentCategory === category.label}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Recently Viewed Listings Section */}
            {recentlyViewed.length > 0 && tabValue === 0 && (
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center' }}
                        >
                            <WatchLaterIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            Recently Viewed
                        </Typography>
                        <Button
                            endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
                            onClick={() => navigate('/viewHistory')}
                            sx={{ fontWeight: 600 }}
                        >
                            View all
                        </Button>
                    </Box>

                    <Grid container spacing={2}>
                        {recentlyViewed.map((item) => (
                            <Grid item xs={12} sm={6} md={3} key={item.id}>
                                <ItemCard item={item} showFavorite={true} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Featured / Category Listings Section */}
            <Box sx={{ mb: 4 }}>
                {tabValue === 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center' }}
                        >
                            <FavoriteIcon sx={{ mr: 1, color: 'error.main' }} />
                            Featured Listings
                        </Typography>
                        {featuredListings.length > 4 && (
                            <Button
                                endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
                                onClick={() => navigate('/listings')}
                                sx={{ fontWeight: 600 }}
                            >
                                View all
                            </Button>
                        )}
                    </Box>
                )}

                {isLoading ? (
                    <Grid container spacing={2}>
                        {[1, 2, 3, 4].map((i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <ItemCardSkeleton />
                            </Grid>
                        ))}
                    </Grid>
                ) : featuredListings.length === 0 ? (
                    <EmptyState
                        type="listings"
                        title="No listings found"
                        description="There are currently no listings in this category. Be the first to list something!"
                        actionLabel="Create a Listing"
                        onAction={() => navigate('/create-listing')}
                    />
                ) : (
                    <Grid container spacing={2}>
                        {featuredListings.map((item) => (
                            <Grid item xs={12} sm={6} md={3} key={item.id}>
                                <ItemCard item={item} showFavorite={true} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            {/* Campus Deals Section - Only shown on Home tab */}
            {tabValue === 0 && (
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center' }}
                        >
                            <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                            Campus Deals
                        </Typography>
                        <Button
                            endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
                            sx={{ fontWeight: 600 }}
                        >
                            View all
                        </Button>
                    </Box>

                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 3,
                            background: theme.palette.mode === 'light'
                                ? 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)'
                                : `linear-gradient(135deg, ${theme.palette.grey[800]} 0%, ${theme.palette.grey[900]} 100%)`,
                            border: `1px solid ${theme.palette.divider}`
                        }}
                    >
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="h4"
                                    sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}
                                >
                                    End of Semester Sale
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ mb: 3, color: 'text.secondary' }}
                                >
                                    Great deals on textbooks, dorm furniture, and electronics from graduating students.
                                    Don't miss out on these one-time offers!
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        borderRadius: 50,
                                        px: 4,
                                    }}
                                >
                                    Browse Deals
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
                                <Box
                                    component="img"
                                    src="/assets/banner.jpg"
                                    alt="Campus Deals"
                                    sx={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        maxHeight: 200,
                                        borderRadius: 2,
                                        boxShadow: theme.palette.mode === 'light'
                                            ? '0 4px 20px rgba(0,0,0,0.1)'
                                            : '0 4px 20px rgba(0,0,0,0.4)'
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            )}
        </PageLayout>
    );
};

export default HomePage;
