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
} from "@mui/material";

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
    const navigate = useNavigate();

    useEffect(() => {
        // Dummy data for demonstration
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
    }, []);

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
                            {listings.map((listing) => (
                                <TableRow key={listing.id} hover>
                                    <TableCell>{listing.title}</TableCell>
                                    <TableCell>{listing.category}</TableCell>
                                    <TableCell>${listing.price.toFixed(2)}</TableCell>
                                    <TableCell>{listing.views}</TableCell>
                                    <TableCell>{listing.watchers}</TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: "4px",
                                                fontSize: "0.875rem",
                                                backgroundColor:
                                                    listing.status === "Active"
                                                        ? "#C6F6D5"
                                                        : listing.status === "Draft"
                                                            ? "#FEEBC8"
                                                            : "#EDF2F7",
                                                color:
                                                    listing.status === "Active"
                                                        ? "#2F855A"
                                                        : listing.status === "Draft"
                                                            ? "#975A16"
                                                            : "#4A5568",
                                            }}
                                        >
                                            {listing.status}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{display: "flex", gap: 1}}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                sx={{
                                                    borderRadius: "20px",
                                                    textTransform: "none",
                                                    fontWeight: "bold",
                                                }}
                                                onClick={() => {
                                                    // Edit action
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                sx={{
                                                    borderRadius: "20px",
                                                    textTransform: "none",
                                                    fontWeight: "bold",
                                                }}
                                                onClick={() => {
                                                    // Delete action
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {listings.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{p: 2, color: "#A0AEC0"}}>
                                        No listings found.
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
