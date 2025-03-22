import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import polylogo from "./assets/poly-logo.webp";
import {
    Box,
    Button,
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
import axios from "axios";

interface Listing {
    id: number;
    title: string;
    category: string;
    price: number;
    watchers: number;
    views: number;
    status: string;
}

const MySelling = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setError('User not authenticated');
                    setLoading(false);
                    return;
                }
                
                // Fetch user's active listings
                const response = await axios.get(`http://localhost:8080/api/v1/item/getAllActiveListings`, {
                    params: { userId },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                
                if (response.data && Array.isArray(response.data)) {
                    // Transform the response to match the Listing interface
                    const formattedListings = response.data.map(item => ({
                        id: item.id,
                        title: item.title,
                        category: item.category,
                        price: item.price,
                        // These might not be available in the API response
                        watchers: item.watchers || 0,
                        views: item.views || 0,
                        status: item.status || 'Active'
                    }));
                    
                    setListings(formattedListings);
                }
            } catch (err) {
                console.error('Error fetching listings:', err);
                setError('Failed to load your listings. Please try again later.');
                
                // Fallback to dummy data
                const dummyListings: Listing[] = [
                    {
                        id: 1,
                        title: "Vintage Camera",
                        category: "Electronics",
                        price: 120.0,
                        watchers: 5,
                        views: 32,
                        status: "Active",
                    },
                    {
                        id: 2,
                        title: "Old Book Collection",
                        category: "Books",
                        price: 60.0,
                        watchers: 2,
                        views: 19,
                        status: "Active",
                    },
                ];
                setListings(dummyListings);
            } finally {
                setLoading(false);
            }
        };
        
        fetchListings();
    }, []);

    const handleDeleteListing = async (itemId: number) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/item/deleteListing`, {
                params: { itemId },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            
            // Remove the item from the listings
            setListings(listings.filter(listing => listing.id !== itemId));
        } catch (err) {
            console.error('Error deleting listing:', err);
            alert('Failed to delete the listing. Please try again.');
        }
    };

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
                <Box
                    component="img"
                    src={polylogo}
                    alt="Logo"
                    sx={{height: 60, width: 60, mb: 2}}
                />
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
            
                {/* Page Header */}
                <Paper sx={{p: 2, mb: 3, boxShadow: 2}}>
                    <Typography variant="h5" sx={{fontWeight: "bold", color: "#6b46c1"}}>
                        Manage Active Listings
                    </Typography>
                    <Typography variant="body1" sx={{color: "#718096", mt: 1}}>
                        View and manage all of your listings. Adjust prices, edit descriptions, or create new listings.
                    </Typography>
                </Paper>

                {/* Action Bar */}
                <Box sx={{display: "flex", justifyContent: "flex-end", mb: 2}}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/create-listing")}
                        sx={{borderRadius: "20px", textTransform: "none", fontWeight: "bold"}}
                    >
                        + Create Listing
                    </Button>
                </Box>

                {/* Listings Table */}
                <Paper>
                    <Table>
                        <TableHead sx={{backgroundColor: "#f3f4f6"}}>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Views</TableCell>
                                <TableCell>Watchers</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listings.length > 0 ? (
                                listings.map((listing) => (
                                    <TableRow key={listing.id} hover>
                                        <TableCell>{listing.title}</TableCell>
                                        <TableCell>{listing.category}</TableCell>
                                        <TableCell>${listing.price.toFixed(2)}</TableCell>
                                        <TableCell>{listing.views}</TableCell>
                                        <TableCell>{listing.watchers}</TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: "inline-block",
                                                    bgcolor: listing.status === "Active" ? "#ebf8ff" : "#fff5f5",
                                                    color: listing.status === "Active" ? "#3182ce" : "#e53e3e",
                                                    borderRadius: "50px",
                                                    px: 2,
                                                    py: 0.5,
                                                    fontWeight: "medium",
                                                    fontSize: "0.875rem",
                                                }}
                                            >
                                                {listing.status}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{display: "flex", gap: 1}}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        borderRadius: "50px",
                                                        textTransform: "none",
                                                        fontSize: "0.75rem",
                                                    }}
                                                    onClick={() => navigate(`/item/${listing.id}`)}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="error"
                                                    sx={{
                                                        borderRadius: "50px",
                                                        textTransform: "none",
                                                        fontSize: "0.75rem",
                                                    }}
                                                    onClick={() => handleDeleteListing(listing.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography variant="body1" sx={{ py: 2 }}>
                                            No active listings found. Create a new listing to get started!
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>
        </Box>
    );
};

export default MySelling;
