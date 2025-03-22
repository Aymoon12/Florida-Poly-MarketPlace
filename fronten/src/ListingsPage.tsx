import polylogo from "./assets/poly-logo.webp"
import {useNavigate} from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";
import { useState, useEffect } from 'react';
import axios from 'axios';

interface DashboardStats {
    totalSales: number;
    totalPurchases: number;
    activeListings: number;
}

interface ActivityItem {
    date: string;
    activity: string;
    amount: number;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('User');
    const [stats, setStats] = useState<DashboardStats>({
        totalSales: 0,
        totalPurchases: 0,
        activeListings: 0
    });
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }

            try {
                // These API endpoints are placeholders and should be updated based on your backend
                const statsResponse = await axios.get(`http://localhost:8080/api/v1/user/dashboardStats`, {
                    params: { userId },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                
                if (statsResponse.data) {
                    setStats(statsResponse.data);
                }

                // Fetch recent activity
                const activityResponse = await axios.get(`http://localhost:8080/api/v1/user/recentActivity`, {
                    params: { userId },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                
                if (activityResponse.data && Array.isArray(activityResponse.data)) {
                    setRecentActivity(activityResponse.data);
                }

                // Fetch user info
                const userResponse = await axios.get(`http://localhost:8080/api/v1/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                
                if (userResponse.data && userResponse.data.name) {
                    setUsername(userResponse.data.name);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                // Use default data if API fails
                setStats({
                    totalSales: 2450,
                    totalPurchases: 1780,
                    activeListings: 12
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb"}}>
            {/* Sidebar */}
            <Box
                sx={{
                    width: 256,
                    backgroundColor: "#fff",
                    boxShadow: 2,
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                }}
            >
                <Box component="img" src={polylogo} alt="Logo" sx={{height: 60, width: 60, mb: 2}}/>
                <Typography variant="h4" sx={{fontWeight: "bold", color: "#6b46c1", mb: 2}}>
                    Dashboard
                </Typography>
                <List sx={{flexGrow: 1}}>
                    {[
                        {label: "Home", path: "/home"},
                        {label: "Dashboard", path: "/listings"},
                        {label: "My Selling", path: "/myselling"},
                        {label: "My Buying", path: "/mybuying"},
                        {label: "Notifications", path: "/notifications"},
                        {label: "Settings", path: "/settings"},
                    ].map((item) => (
                        <ListItem key={item.label} disablePadding>
                            <ListItemButton onClick={() => navigate(item.path)}>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        variant: "body1",
                                        sx: {color: "#4a5568", textTransform: "none"},
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Main Content */}
            <Box sx={{flex: 1, p: 3}}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}
                
                {/* Header */}
                <Paper sx={{p: 2, mb: 3, boxShadow: 2}}>
                    <Typography variant="h4" sx={{fontWeight: "bold", color: "#6b46c1"}}>
                        Welcome, {username}
                    </Typography>
                    <Typography variant="body1" sx={{color: "#718096", mt: 1}}>
                        Overview of your account activities.
                    </Typography>
                </Paper>

                {/* Statistic Cards */}
                <Grid container spacing={3} sx={{mb: 3}}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{p: 2}}>
                            <CardContent>
                                <Typography variant="h6" sx={{color: "#4a5568"}}>
                                    Total Sales
                                </Typography>
                                <Typography variant="h4" sx={{fontWeight: "bold", color: "#6b46c1", mt: 1}}>
                                    ${stats.totalSales}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{p: 2}}>
                            <CardContent>
                                <Typography variant="h6" sx={{color: "#4a5568"}}>
                                    Total Purchases
                                </Typography>
                                <Typography variant="h4" sx={{fontWeight: "bold", color: "#6b46c1", mt: 1}}>
                                    ${stats.totalPurchases}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{p: 2}}>
                            <CardContent>
                                <Typography variant="h6" sx={{color: "#4a5568"}}>
                                    Active Listings
                                </Typography>
                                <Typography variant="h4" sx={{fontWeight: "bold", color: "#6b46c1", mt: 1}}>
                                    {stats.activeListings}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Recent Activity Table */}
                <Box sx={{mb: 3}}>
                    <Typography variant="h5" sx={{fontWeight: "bold", color: "#6b46c1", mb: 2}}>
                        Recent Activity
                    </Typography>
                    <Paper>
                        <Table>
                            <TableHead sx={{backgroundColor: "#f3f4f6"}}>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Activity</TableCell>
                                    <TableCell>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentActivity.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.activity}</TableCell>
                                        <TableCell>${item.amount}</TableCell>
                                    </TableRow>
                                ))}
                                {recentActivity.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} sx={{ textAlign: 'center' }}>
                                            No recent activity found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>

                {/* Manage Selling and Buying Panels */}
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={6}>
                        <Typography variant="h5" sx={{fontWeight: "bold", color: "#6b46c1", mb: 2}}>
                            My Selling
                        </Typography>
                        <Paper sx={{p: 2, mb: 2}}>
                            <Box sx={{display: "flex", alignItems: "center"}}>
                                <Box
                                    component="img"
                                    src="/assets/item1.webp"
                                    alt="Item 1"
                                    sx={{width: 80, height: 80, objectFit: "cover", borderRadius: 2}}
                                />
                                <Box sx={{ml: 2, flex: 1}}>
                                    <Typography variant="h6" sx={{fontWeight: "bold", color: "#4a5568"}}>
                                        Vintage Camera
                                    </Typography>
                                    <Typography variant="body1" sx={{color: "#718096"}}>
                                        $120.00
                                    </Typography>
                                </Box>
                                <Box sx={{display: "flex", gap: 1}}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        sx={{borderRadius: "20px", textTransform: "none", fontWeight: "bold"}}
                                        onClick={() => {
                                            /* Edit action */
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        sx={{borderRadius: "20px", textTransform: "none", fontWeight: "bold"}}
                                        onClick={() => {
                                            /* Delete action */
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Typography variant="h5" sx={{fontWeight: "bold", color: "#6b46c1", mb: 2}}>
                            My Buying
                        </Typography>
                        <Paper sx={{p: 2}}>
                            <Box sx={{display: "flex", alignItems: "center"}}>
                                <Box
                                    component="img"
                                    src="/assets/item2.webp"
                                    alt="Item 2"
                                    sx={{width: 80, height: 80, objectFit: "cover", borderRadius: 2}}
                                />
                                <Box sx={{ml: 2, flex: 1}}>
                                    <Typography variant="h6" sx={{fontWeight: "bold", color: "#4a5568"}}>
                                        Old Book Collection
                                    </Typography>
                                    <Typography variant="body1" sx={{color: "#718096"}}>
                                        $60.00
                                    </Typography>
                                </Box>
                                <Box sx={{display: "flex", gap: 1}}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        sx={{borderRadius: "20px", textTransform: "none", fontWeight: "bold"}}
                                        onClick={() => {
                                            /* Details action */
                                        }}
                                    >
                                        Details
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        sx={{borderRadius: "20px", textTransform: "none", fontWeight: "bold"}}
                                        onClick={() => {
                                            /* Track action */
                                        }}
                                    >
                                        Track
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Dashboard;
