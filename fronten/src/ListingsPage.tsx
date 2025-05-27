import polylogo from "./assets/poly-logo.webp"
import {useNavigate} from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
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
} from "@mui/material";
import {useEffect, useState} from 'react';
import axios from 'axios';


const Dashboard = () => {

    interface Sale {
        Id: number,
        salesDate: string,
        salesPrice: number,
        seller: string,
        buyer: string
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
        recentActivity: Sale[]
        mySelling: Item[]
    }


    interface ActivityItem {
        date: string;
        activity: string;
        amount: number;
    }


    const navigate = useNavigate();
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
    const [mySelling, setMySelling] = useState<Item[]>([])

    useEffect(() => {
        const fetchDashboardData = async () => {
            const userId = localStorage.getItem('userId');
            const name = localStorage.getItem('name')
            if (!userId || !name) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }
            setUsername(name)

            try {

                const statsResponse = await axios.get(`http://localhost:8080/api/v1/user/dashboardstats`, {
                    params: {userId},
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (statsResponse.data) {
                    setStats(statsResponse.data);
                    setMySelling(statsResponse.data.mySelling)
                }

                // // Fetch recent activity
                // const activityResponse = await axios.get(`http://localhost:8080/api/v1/user/recentActivity`, {
                //     params: {userId},
                //     headers: {
                //         Authorization: `Bearer ${localStorage.getItem("token")}`
                //     }
                // });
                //
                // if (activityResponse.data && Array.isArray(activityResponse.data)) {
                //     setRecentActivity(activityResponse.data);
                // }
                //
                // // Fetch user info
                // const userResponse = await axios.get(`http://localhost:8080/api/v1/user/${userId}`, {
                //     headers: {
                //         Authorization: `Bearer ${localStorage.getItem("token")}`
                //     }
                // });
                //
                // if (userResponse.data && userResponse.data.name) {
                //     setUsername(userResponse.data.name);
                // }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                // Use default data if API fails
                setStats({
                    totalSales: 2450,
                    totalPurchases: 1780,
                    activeListings: 12,
                    recentActivity: [],
                    mySelling: []
                });

                setRecentActivity([
                    {date: '2025-03-15', activity: 'Sold "Vintage Camera"', amount: 120},
                    {date: '2025-03-14', activity: 'Purchased "Old Book Collection"', amount: 60},
                    {date: '2025-03-13', activity: 'Listed "Antique Vase"', amount: 85}
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Box sx={{display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc"}}>
            {/* Sidebar */}
            <Box
                sx={{
                    width: 280,
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                    position: "fixed",
                    height: "100vh",
                    zIndex: 1,
                }}
            >
                <Box component="img" src={polylogo} alt="Logo" sx={{height: 60, width: 60, mb: 3}}/>
                <Typography variant="h4" sx={{
                    fontWeight: "bold",
                    background: "linear-gradient(45deg, #6b46c1 30%, #805ad5 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 3
                }}>
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
                        <ListItem key={item.label} disablePadding sx={{mb: 1}}>
                            <ListItemButton 
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: 'rgba(107, 70, 193, 0.08)',
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        variant: "body1",
                                        sx: {
                                            color: "#4a5568",
                                            textTransform: "none",
                                            fontWeight: 500
                                        },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Main Content */}
            <Box sx={{flex: 1, p: 4, ml: "280px"}}>
                {error && (
                    <Alert severity="error" sx={{mb: 3, borderRadius: 2}}>
                        {error}
                    </Alert>
                )}

                {/* Header */}
                <Paper 
                    sx={{
                        p: 3,
                        mb: 4,
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        borderRadius: 3,
                        background: "linear-gradient(45deg, #ffffff 30%, #f8fafc 90%)",
                    }}
                >
                    <Typography variant="h4" sx={{
                        fontWeight: "bold",
                        background: "linear-gradient(45deg, #6b46c1 30%, #805ad5 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        Welcome, {username}
                    </Typography>
                    <Typography variant="body1" sx={{color: "#718096", mt: 1}}>
                        Overview of your account activities.
                    </Typography>
                </Paper>

                {/* Statistic Cards */}
                <Grid container spacing={3} sx={{mb: 4}}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            p: 3,
                            borderRadius: 3,
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            background: "linear-gradient(45deg, #ffffff 30%, #f8fafc 90%)",
                            transition: "transform 0.2s",
                            '&:hover': {
                                transform: "translateY(-4px)",
                            }
                        }}>
                            <CardContent>
                                <Typography variant="h6" sx={{color: "#4a5568", mb: 2}}>
                                    Total Sales
                                </Typography>
                                <Typography variant="h4" sx={{
                                    fontWeight: "bold",
                                    background: "linear-gradient(45deg, #6b46c1 30%, #805ad5 90%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}>
                                    ${stats.totalSales}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            p: 3,
                            borderRadius: 3,
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            background: "linear-gradient(45deg, #ffffff 30%, #f8fafc 90%)",
                            transition: "transform 0.2s",
                            '&:hover': {
                                transform: "translateY(-4px)",
                            }
                        }}>
                            <CardContent>
                                <Typography variant="h6" sx={{color: "#4a5568", mb: 2}}>
                                    Total Purchases
                                </Typography>
                                <Typography variant="h4" sx={{
                                    fontWeight: "bold",
                                    background: "linear-gradient(45deg, #6b46c1 30%, #805ad5 90%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}>
                                    ${stats.totalPurchases}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            p: 3,
                            borderRadius: 3,
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            background: "linear-gradient(45deg, #ffffff 30%, #f8fafc 90%)",
                            transition: "transform 0.2s",
                            '&:hover': {
                                transform: "translateY(-4px)",
                            }
                        }}>
                            <CardContent>
                                <Typography variant="h6" sx={{color: "#4a5568", mb: 2}}>
                                    Active Listings
                                </Typography>
                                <Typography variant="h4" sx={{
                                    fontWeight: "bold",
                                    background: "linear-gradient(45deg, #6b46c1 30%, #805ad5 90%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}>
                                    {stats.activeListings}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Recent Activity Table */}
                <Box sx={{mb: 4}}>
                    <Typography variant="h5" sx={{
                        fontWeight: "bold",
                        color: "#6b46c1",
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                    }}>
                        Recent Activity
                    </Typography>
                    <Paper sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}>
                        <Table>
                            <TableHead sx={{backgroundColor: "#f8fafc"}}>
                                <TableRow>
                                    <TableCell sx={{fontWeight: "bold", color: "#4a5568"}}>Date</TableCell>
                                    <TableCell sx={{fontWeight: "bold", color: "#4a5568"}}>Activity</TableCell>
                                    <TableCell sx={{fontWeight: "bold", color: "#4a5568"}}>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentActivity.map((item, index) => (
                                    <TableRow 
                                        key={index}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(107, 70, 193, 0.04)',
                                            }
                                        }}
                                    >
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.activity}</TableCell>
                                        <TableCell>${item.amount}</TableCell>
                                    </TableRow>
                                ))}
                                {recentActivity.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} sx={{textAlign: 'center', py: 3}}>
                                            <Typography variant="body1" sx={{color: "#718096"}}>
                                                No recent activity found
                                            </Typography>
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
                        <Typography variant="h5" sx={{
                            fontWeight: "bold",
                            color: "#6b46c1",
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                        }}>
                            My Selling
                        </Typography>
                        <Paper sx={{
                            p: 3,
                            mb: 2,
                            borderRadius: 3,
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        }}>
                            {mySelling.length > 0 ? (
                                <>
                                    {mySelling.map((item) => (
                                        <Box 
                                            key={item.id} 
                                            sx={{
                                                display: "flex", 
                                                alignItems: "center", 
                                                mb: 2, 
                                                p: 2,
                                                borderRadius: 2,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(107, 70, 193, 0.04)',
                                                },
                                                "&:last-child": { mb: 0 }
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={item.imageUrls[0]}
                                                alt={item.title}
                                                sx={{
                                                    width: 80, 
                                                    height: 80, 
                                                    objectFit: "cover", 
                                                    borderRadius: 2,
                                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                                }}
                                            />
                                            <Box sx={{ml: 2, flex: 1}}>
                                                <Typography variant="h6" sx={{fontWeight: "bold", color: "#4a5568"}}>
                                                    {item.title}
                                                </Typography>
                                                <Typography variant="body1" sx={{color: "#718096"}}>
                                                    ${item.price.toFixed(2)}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                sx={{
                                                    borderRadius: "20px",
                                                    textTransform: "none",
                                                    fontWeight: "bold",
                                                    borderColor: "#6b46c1",
                                                    color: "#6b46c1",
                                                    '&:hover': {
                                                        borderColor: "#5a32b0",
                                                        backgroundColor: "rgba(107, 70, 193, 0.04)"
                                                    }
                                                }}
                                                onClick={() => navigate(`/item/${item.id}`)}
                                            >
                                                Edit
                                            </Button>
                                        </Box>
                                    ))}
                                    <Box sx={{display: "flex", justifyContent: "center", mt: 3}}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                borderRadius: "20px",
                                                textTransform: "none",
                                                fontWeight: "bold",
                                                backgroundColor: "#6b46c1",
                                                px: 4,
                                                py: 1,
                                                '&:hover': {
                                                    backgroundColor: "#5a32b0"
                                                }
                                            }}
                                            onClick={() => navigate("/myselling")}
                                        >
                                            View All Listings
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <Typography variant="body1" sx={{color: "#718096", textAlign: "center", py: 3}}>
                                    No items for sale yet
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Typography variant="h5" sx={{
                            fontWeight: "bold",
                            color: "#6b46c1",
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                        }}>
                            My Buying
                        </Typography>
                        <Paper sx={{
                            p: 3,
                            borderRadius: 3,
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        }}>
                            <Box sx={{
                                display: "flex", 
                                alignItems: "center",
                                p: 2,
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(107, 70, 193, 0.04)',
                                }
                            }}>
                                <Box
                                    component="img"
                                    src="/assets/item2.webp"
                                    alt="Item 2"
                                    sx={{
                                        width: 80, 
                                        height: 80, 
                                        objectFit: "cover", 
                                        borderRadius: 2,
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    }}
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
                                        sx={{
                                            borderRadius: "20px",
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            backgroundColor: "#6b46c1",
                                            '&:hover': {
                                                backgroundColor: "#5a32b0"
                                            }
                                        }}
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
                                        sx={{
                                            borderRadius: "20px",
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            '&:hover': {
                                                backgroundColor: "#2f855a"
                                            }
                                        }}
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
