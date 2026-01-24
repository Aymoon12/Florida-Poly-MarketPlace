import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Grid,
    Paper,
    Typography,
    useTheme,
    alpha,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import api from "./services/api";
import { PageLayout, DashboardSidebar } from "./components/layout";
import { ItemCard, ItemCardSkeleton, EmptyState } from "./components/common";
import type { ItemType } from "./components/common";

interface HistoryItem {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    imageUrls: string[];
    createdAt: string;
}

const ViewHistory = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await api.get('/api/v1/item/getHistory');

                if (response.data && Array.isArray(response.data)) {
                    setHistory(response.data);
                }
            } catch (err) {
                console.error('Error fetching history:', err);
                setError('Failed to load your viewing history. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const mapToItemType = (item: HistoryItem): ItemType => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        imageUrls: item.imageUrls,
    });

    const handleClearHistory = async () => {
        try {
            await api.delete('/api/v1/item/clearHistory');
            setHistory([]);
        } catch (err) {
            console.error('Error clearing history:', err);
        }
    };

    return (
        <PageLayout variant="dashboard" showCategories={false} showFooter={false}>
            <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
                {/* Sidebar */}
                <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <Box sx={{
                    flex: 1,
                    p: { xs: 2, md: 4 },
                    ml: { xs: 0, md: '260px' },
                    maxWidth: { md: 'calc(100% - 260px)' },
                }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                View History
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                Items you've recently viewed
                            </Typography>
                        </Box>
                        {history.length > 0 && (
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteSweepIcon />}
                                onClick={handleClearHistory}
                                sx={{ borderRadius: 2, fontWeight: 600 }}
                            >
                                Clear History
                            </Button>
                        )}
                    </Box>

                    {/* Stats Card */}
                    {!loading && history.length > 0 && (
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
                                    bgcolor: alpha(theme.palette.info.main, 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <HistoryIcon sx={{ color: 'info.main' }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                    {history.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Items Viewed
                                </Typography>
                            </Box>
                        </Paper>
                    )}

                    {/* History Grid */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
                            Recently Viewed Items
                        </Typography>

                        {loading ? (
                            <Grid container spacing={2}>
                                {[...Array(8)].map((_, index) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                        <ItemCardSkeleton />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : history.length === 0 ? (
                            <EmptyState
                                type="history"
                                title="No viewing history"
                                description="You haven't viewed any items yet. Start browsing to see your history here!"
                                actionLabel="Browse Items"
                                onAction={() => navigate('/home')}
                            />
                        ) : (
                            <Grid container spacing={2}>
                                {history.map((item) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                                        <ItemCard
                                            item={mapToItemType(item)}
                                            showFavorite={true}
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

export default ViewHistory;
