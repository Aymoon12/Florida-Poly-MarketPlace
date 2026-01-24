import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Card,
    CardMedia,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
    alpha,
} from "@mui/material";
import { useEffect, useState } from 'react';
import api from './services/api';
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import InventoryIcon from "@mui/icons-material/Inventory";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { PageLayout, DashboardSidebar } from "./components/layout";
import { LoadingState, EmptyState } from "./components/common";

interface Sale {
    Id: number;
    salesDate: string;
    salesPrice: number;
    seller: string;
    buyer: string;
}

interface Item {
    id: number;
    title: string;
    description: string;
    price: number;
    status: string;
    category: string;
    seller: string;
    imageUrls: string[];
    createdAt: string;
}

interface DashboardStats {
    totalSales: number;
    totalPurchases: number;
    activeListings: number;
    recentActivity: Sale[];
    mySelling: Item[];
}

interface ActivityItem {
    date: string;
    activity: string;
    amount: number;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [username, setUsername] = useState<string>('User');
    const [stats, setStats] = useState<DashboardStats>({
        totalSales: 0,
        totalPurchases: 0,
        activeListings: 0,
        recentActivity: [],
        mySelling: []
    });
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mySelling, setMySelling] = useState<Item[]>([]);
    const [mySaved, setMySaved] = useState<Item[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const name = localStorage.getItem('name');
            if (!name) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }
            setUsername(name);

            try {
                const statsResponse = await api.get('/api/v1/user/dashboardstats');

                if (statsResponse.data) {
                    setStats(statsResponse.data);
                    setMySelling(statsResponse.data.mySelling);
                }

                const savedListingsResponse = await api.get('/api/v1/saved/last-five');

                if (savedListingsResponse.status === 200) {
                    setMySaved(savedListingsResponse.data);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setStats({
                    totalSales: 2450,
                    totalPurchases: 1780,
                    activeListings: 12,
                    recentActivity: [],
                    mySelling: []
                });

                setRecentActivity([
                    { date: '2025-03-15', activity: 'Sold "Vintage Camera"', amount: 120 },
                    { date: '2025-03-14', activity: 'Purchased "Old Book Collection"', amount: 60 },
                    { date: '2025-03-13', activity: 'Listed "Antique Vase"', amount: 85 }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleRemoveSaved = (itemId: number) => {
        return async () => {
            try {
                const response = await api.delete('/api/v1/saved/unsave', {
                    params: { itemId }
                });
                if (response.status === 200) {
                    setMySaved(mySaved.filter(item => item.id !== itemId));
                }
            } catch (err) {
                console.error('Error removing saved item:', err);
            }
        };
    };

    const getDefaultImage = (item: Item) => {
        return item.imageUrls && item.imageUrls.length > 0
            ? item.imageUrls[0]
            : "/assets/placeholder.png";
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
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            Welcome back, {username}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            Here's an overview of your marketplace activity
                        </Typography>
                    </Box>

                    {loading ? (
                        <LoadingState message="Loading dashboard..." />
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
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
                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <TrendingUpIcon sx={{ color: 'success.main' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                ${stats.totalSales}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Total Sales
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
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
                                            <ShoppingBagIcon sx={{ color: 'info.main' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                ${stats.totalPurchases}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Total Purchases
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
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
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <InventoryIcon sx={{ color: 'primary.main' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                {stats.activeListings}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Active Listings
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
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
                                            <FavoriteIcon sx={{ color: 'error.main' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                {mySaved.length}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Saved Items
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* Recent Activity */}
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 3,
                                    border: `1px solid ${theme.palette.divider}`,
                                    mb: 4,
                                    overflow: 'hidden',
                                }}
                            >
                                <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                        Recent Activity
                                    </Typography>
                                </Box>
                                {recentActivity.length > 0 ? (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Activity</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }} align="right">Amount</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {recentActivity.map((item, index) => (
                                                    <TableRow key={index} hover>
                                                        <TableCell>{item.date}</TableCell>
                                                        <TableCell>{item.activity}</TableCell>
                                                        <TableCell align="right">
                                                            <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                                ${item.amount}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Box sx={{ p: 4 }}>
                                        <EmptyState
                                            type="history"
                                            title="No recent activity"
                                            description="Your recent marketplace activity will appear here"
                                        />
                                    </Box>
                                )}
                            </Paper>

                            {/* My Selling and Saved Grid */}
                            <Grid container spacing={3}>
                                {/* My Selling */}
                                <Grid item xs={12} lg={6}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            borderRadius: 3,
                                            border: `1px solid ${theme.palette.divider}`,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Box sx={{
                                            p: 3,
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                My Listings
                                            </Typography>
                                            <Button
                                                size="small"
                                                onClick={() => navigate("/myselling")}
                                                sx={{ fontWeight: 600 }}
                                            >
                                                View All
                                            </Button>
                                        </Box>
                                        {mySelling.length > 0 ? (
                                            <Box sx={{ p: 2 }}>
                                                {mySelling.slice(0, 3).map((item) => (
                                                    <Box
                                                        key={item.id}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 2,
                                                            p: 2,
                                                            borderRadius: 2,
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                                            },
                                                        }}
                                                        onClick={() => navigate(`/item/${item.id}`)}
                                                    >
                                                        <Card
                                                            elevation={0}
                                                            sx={{
                                                                width: 64,
                                                                height: 64,
                                                                borderRadius: 2,
                                                                overflow: 'hidden',
                                                                border: `1px solid ${theme.palette.divider}`,
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            <CardMedia
                                                                component="img"
                                                                height="64"
                                                                image={getDefaultImage(item)}
                                                                alt={item.title}
                                                                sx={{ objectFit: 'cover' }}
                                                            />
                                                        </Card>
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Typography
                                                                variant="subtitle2"
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
                                                            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                                                ${item.price.toFixed(2)}
                                                            </Typography>
                                                        </Box>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/item/${item.id}`);
                                                            }}
                                                        >
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Box sx={{ p: 4 }}>
                                                <EmptyState
                                                    type="listings"
                                                    title="No listings yet"
                                                    description="Start selling by creating your first listing"
                                                    actionLabel="Create Listing"
                                                    onAction={() => navigate('/create-listing')}
                                                />
                                            </Box>
                                        )}
                                    </Paper>
                                </Grid>

                                {/* My Saved */}
                                <Grid item xs={12} lg={6}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            borderRadius: 3,
                                            border: `1px solid ${theme.palette.divider}`,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Box sx={{
                                            p: 3,
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                Saved Items
                                            </Typography>
                                            <Button
                                                size="small"
                                                onClick={() => navigate("/saved")}
                                                sx={{ fontWeight: 600 }}
                                            >
                                                View All
                                            </Button>
                                        </Box>
                                        {mySaved.length > 0 ? (
                                            <Box sx={{ p: 2 }}>
                                                {mySaved.slice(0, 3).map((item) => (
                                                    <Box
                                                        key={item.id}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 2,
                                                            p: 2,
                                                            borderRadius: 2,
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                                            },
                                                        }}
                                                        onClick={() => navigate(`/item/${item.id}`)}
                                                    >
                                                        <Card
                                                            elevation={0}
                                                            sx={{
                                                                width: 64,
                                                                height: 64,
                                                                borderRadius: 2,
                                                                overflow: 'hidden',
                                                                border: `1px solid ${theme.palette.divider}`,
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            <CardMedia
                                                                component="img"
                                                                height="64"
                                                                image={getDefaultImage(item)}
                                                                alt={item.title}
                                                                sx={{ objectFit: 'cover' }}
                                                            />
                                                        </Card>
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Typography
                                                                variant="subtitle2"
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
                                                            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                                                ${item.price.toFixed(2)}
                                                            </Typography>
                                                        </Box>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveSaved(item.id)();
                                                            }}
                                                        >
                                                            <DeleteOutlineIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Box sx={{ p: 4 }}>
                                                <EmptyState
                                                    type="favorites"
                                                    title="No saved items"
                                                    description="Items you save will appear here"
                                                    actionLabel="Browse Items"
                                                    onAction={() => navigate('/home')}
                                                />
                                            </Box>
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Box>
            </Box>
        </PageLayout>
    );
};

export default Dashboard;
