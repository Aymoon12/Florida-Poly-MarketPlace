import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import polylogo from "./assets/poly-logo.webp";
import {
    Alert,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CircularProgress,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import axios from "axios";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ItemType {
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
    const [history, setHistory] = useState<ItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);

            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setError('User not authenticated');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://localhost:8080/api/v1/item/getHistory`, {
                    params: {userId},
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

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

    const getDefaultImage = (item: ItemType) => {
        return item.imageUrls && item.imageUrls.length > 0
            ? item.imageUrls[0]
            : "/assets/placeholder.png";
    };

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
                <Box
                    component="img"
                    src={polylogo}
                    alt="Logo"
                    sx={{height: 60, width: 60, mb: 3}}
                />
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
                <Box sx={{display: 'flex', alignItems: 'center', mb: 4}}>
                    <Button
                        startIcon={<ArrowBackIcon/>}
                        onClick={() => navigate(-1)}
                        sx={{
                            color: "#6b46c1",
                            textTransform: "none",
                            fontWeight: 600,
                            mr: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(107, 70, 193, 0.08)',
                            }
                        }}
                    >
                        Back
                    </Button>
                    <Typography variant="h4" sx={{
                        fontWeight: "bold",
                        background: "linear-gradient(45deg, #6b46c1 30%, #805ad5 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        Viewing History
                    </Typography>
                </Box>

                {/* History Grid */}
                <Grid container spacing={1.5}>
                    {history.length > 0 ? (
                        history.map((item) => (
                            <Grid item xs={6} sm={4} md={3} lg={2.4} key={item.id}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        borderRadius: 2,
                                        transition: 'all 0.2s',
                                        border: '1px solid #e5e7eb',
                                        overflow: 'visible',
                                        height: '100%',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                                        }
                                    }}
                                >
                                    <CardActionArea onClick={() => navigate(`/item/${item.id}`)}>
                                        <CardMedia
                                            component="img"
                                            height="110"
                                            image={getDefaultImage(item)}
                                            alt={item.title}
                                            sx={{
                                                objectFit: "cover",
                                                width: '100%',
                                                aspectRatio: '1/1',
                                                bgcolor: '#f8fafc'
                                            }}
                                        />
                                        <CardContent sx={{ p: 1.2 }}>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: "#4a5568",
                                                    mb: 0.5,
                                                    fontSize: '0.875rem',
                                                    lineHeight: 1.2,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical'
                                                }}
                                            >
                                                {item.title}
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "#6b46c1",
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                ${item.price.toFixed(2)}
                                            </Typography>
                                            <Box sx={{mt: 1, display: 'flex', alignItems: 'center', gap: 0.5}}>
                                                <WatchLaterIcon sx={{color: "#718096", fontSize: 14}}/>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: "#718096",
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Paper sx={{p: 4, textAlign: 'center'}}>
                                <WatchLaterIcon sx={{fontSize: 48, color: "#718096", mb: 2}}/>
                                <Typography variant="h6" sx={{color: "#4a5568", mb: 1}}>
                                    No Viewing History
                                </Typography>
                                <Typography variant="body1" sx={{color: "#718096", mb: 3}}>
                                    You haven't viewed any items yet. Start browsing to see your history here!
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/home')}
                                    sx={{
                                        backgroundColor: "#6b46c1",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        px: 4,
                                        py: 1.5,
                                        '&:hover': {
                                            backgroundColor: "#5a32b0"
                                        }
                                    }}
                                >
                                    Browse Items
                                </Button>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default ViewHistory;