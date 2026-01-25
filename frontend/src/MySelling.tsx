import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardMedia,
    Chip,
    Grid,
    IconButton,
    Menu,
    MenuItem,
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
    Tabs,
    Tab,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InventoryIcon from "@mui/icons-material/Inventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SellIcon from "@mui/icons-material/Sell";
import api from "./services/api";
import { PageLayout, DashboardSidebar } from './components/layout';
import { LoadingState, EmptyState, StatusBadge, MarkAsSoldDialog } from './components/common';

interface Listing {
    id: number;
    title: string;
    category: string;
    price: number;
    watchers: number;
    views: number;
    status: string;
    imageUrls?: string[];
    createdAt?: string;
}

const MySelling = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [markAsSoldDialogOpen, setMarkAsSoldDialogOpen] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/api/v1/item/getAllActiveListings');

            if (response.data && Array.isArray(response.data)) {
                const formattedListings = response.data.map(item => ({
                    id: item.id,
                    title: item.title,
                    category: item.category,
                    price: item.price,
                    watchers: item.watchers || 0,
                    views: item.views || 0,
                    status: item.status || 'Active',
                    imageUrls: item.imageUrls || [],
                    createdAt: item.createdAt,
                }));
                setListings(formattedListings);
            }
        } catch (err) {
            console.error('Error fetching listings:', err);
            setError('Failed to load your listings. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, listing: Listing) => {
        setAnchorEl(event.currentTarget);
        setSelectedListing(listing);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleMarkAsSoldClick = () => {
        setMarkAsSoldDialogOpen(true);
        handleMenuClose();
    };

    const handleMarkAsSoldSuccess = () => {
        if (selectedListing) {
            setListings(listings.map(listing =>
                listing.id === selectedListing.id
                    ? { ...listing, status: 'SOLD' }
                    : listing
            ));
        }
        setNotification({ message: 'Item marked as sold! You can now leave a review for the buyer.', type: 'success' });
        setMarkAsSoldDialogOpen(false);
        setSelectedListing(null);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedListing) return;

        try {
            await api.delete('/api/v1/item/deleteListing', {
                params: { itemId: selectedListing.id }
            });
            setListings(listings.filter(listing => listing.id !== selectedListing.id));
            setNotification({ message: 'Listing deleted successfully', type: 'success' });
        } catch (err) {
            console.error('Error deleting listing:', err);
            setNotification({ message: 'Failed to delete listing', type: 'error' });
        } finally {
            setDeleteDialogOpen(false);
            setSelectedListing(null);
        }
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const getFilteredListings = () => {
        switch (tabValue) {
            case 0:
                return listings;
            case 1:
                return listings.filter(l => l.status.toLowerCase() === 'active');
            case 2:
                return listings.filter(l => l.status.toLowerCase() === 'sold');
            case 3:
                return listings.filter(l => l.status.toLowerCase() === 'pending');
            default:
                return listings;
        }
    };

    const stats = {
        totalListings: listings.length,
        activeListings: listings.filter(l => l.status.toLowerCase() === 'active').length,
        totalViews: listings.reduce((sum, l) => sum + l.views, 0),
        totalRevenue: listings.filter(l => l.status.toLowerCase() === 'sold').reduce((sum, l) => sum + l.price, 0),
    };

    const filteredListings = getFilteredListings();

    return (
        <PageLayout variant="dashboard" showCategories={false} showFooter={false}>
            <Snackbar
                open={!!notification}
                autoHideDuration={4000}
                onClose={() => setNotification(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={notification?.type || 'info'} variant="filled" onClose={() => setNotification(null)}>
                    {notification?.message}
                </Alert>
            </Snackbar>

            <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
                {/* Sidebar */}
                <DashboardSidebar activeItem="My Selling" />

                {/* Main Content */}
                <Box sx={{
                    flex: 1,
                    p: { xs: 2, md: 4 },
                    ml: { xs: 0, md: '260px' },
                    maxWidth: { md: 'calc(100% - 260px)' },
                }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                My Listings
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                Manage and track your marketplace listings
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate("/create-listing")}
                            sx={{ borderRadius: 2, fontWeight: 600, px: 3 }}
                        >
                            Create Listing
                        </Button>
                    </Box>

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
                                        {stats.totalListings}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Total Listings
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
                                        {stats.activeListings}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Active
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
                                    <RemoveRedEyeIcon sx={{ color: 'info.main' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                        {stats.totalViews}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Total Views
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
                                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AttachMoneyIcon sx={{ color: 'warning.main' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                        ${stats.totalRevenue.toFixed(0)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Revenue
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Tabs and Table */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
                            <Tabs value={tabValue} onChange={handleTabChange}>
                                <Tab label={`All (${listings.length})`} />
                                <Tab label={`Active (${listings.filter(l => l.status.toLowerCase() === 'active').length})`} />
                                <Tab label={`Sold (${listings.filter(l => l.status.toLowerCase() === 'sold').length})`} />
                                <Tab label={`Pending (${listings.filter(l => l.status.toLowerCase() === 'pending').length})`} />
                            </Tabs>
                        </Box>

                        {loading ? (
                            <Box sx={{ p: 4 }}>
                                <LoadingState message="Loading your listings..." />
                            </Box>
                        ) : error ? (
                            <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>
                        ) : filteredListings.length === 0 ? (
                            <Box sx={{ p: 4 }}>
                                <EmptyState
                                    type="listings"
                                    actionLabel="Create Your First Listing"
                                    onAction={() => navigate('/create-listing')}
                                />
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Views</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredListings.map((listing) => (
                                            <TableRow
                                                key={listing.id}
                                                hover
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Card
                                                            elevation={0}
                                                            sx={{
                                                                width: 56,
                                                                height: 56,
                                                                borderRadius: 2,
                                                                overflow: 'hidden',
                                                                border: `1px solid ${theme.palette.divider}`,
                                                            }}
                                                        >
                                                            <CardMedia
                                                                component="img"
                                                                height="56"
                                                                image={listing.imageUrls?.[0] || '/assets/placeholder.png'}
                                                                alt={listing.title}
                                                                sx={{ objectFit: 'cover' }}
                                                            />
                                                        </Card>
                                                        <Box>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    color: 'text.primary',
                                                                    cursor: 'pointer',
                                                                    '&:hover': { color: 'primary.main' }
                                                                }}
                                                                onClick={() => navigate(`/item/${listing.id}`)}
                                                            >
                                                                {listing.title}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={listing.category}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            color: 'primary.main',
                                                            fontWeight: 500,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                        ${listing.price.toFixed(2)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                        {listing.views}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={listing.status} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleMenuOpen(e, listing)}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Box>
            </Box>

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => { navigate(`/item/${selectedListing?.id}`); handleMenuClose(); }}>
                    <VisibilityIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    View
                </MenuItem>
                <MenuItem onClick={() => { navigate(`/edit-listing/${selectedListing?.id}`); handleMenuClose(); }}>
                    <EditIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Edit
                </MenuItem>
                {selectedListing?.status.toLowerCase() === 'active' && (
                    <MenuItem onClick={handleMarkAsSoldClick}>
                        <SellIcon sx={{ mr: 1.5, fontSize: 20, color: 'success.main' }} />
                        Mark as Sold
                    </MenuItem>
                )}
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                    <DeleteIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Delete
                </MenuItem>
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Listing</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete "{selectedListing?.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Mark as Sold Dialog */}
            {selectedListing && (
                <MarkAsSoldDialog
                    open={markAsSoldDialogOpen}
                    onClose={() => {
                        setMarkAsSoldDialogOpen(false);
                        setSelectedListing(null);
                    }}
                    onSuccess={handleMarkAsSoldSuccess}
                    itemId={selectedListing.id}
                    itemTitle={selectedListing.title}
                    itemPrice={selectedListing.price}
                />
            )}
        </PageLayout>
    );
};

export default MySelling;
