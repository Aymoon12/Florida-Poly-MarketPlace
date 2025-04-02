import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import polylogo from "./assets/poly-logo.webp";
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    CircularProgress,
    Container,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputBase,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Skeleton,
    Toolbar,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import axios from "axios";

// Item interface based on ItemDto from backend
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

const SearchResults: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get query from URL
    const queryParams = new URLSearchParams(location.search);
    const queryFromUrl = queryParams.get("q") || "";

    // State variables
    const [searchQuery, setSearchQuery] = useState(queryFromUrl);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [sortOption, setSortOption] = useState("newest");
    const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

    // Fetch search results
    useEffect(() => {
        let isMounted = true;

        // Only fetch when we have a query
        if (searchQuery && searchQuery.trim().length > 0) {
            // Clear the timer if it's already set
            if (searchTimer) {
                clearTimeout(searchTimer);
            }

            // Set loading to true immediately
            setLoading(true);

            // Reset pagination when query changes
            setPage(0);
            setItems([]);
            setHasMore(true);

            // Debounce search - wait 500ms after typing stops
            const timer = setTimeout(() => {
                if (isMounted) {
                    fetchSearchResults();
                }
            }, 500);

            setSearchTimer(timer);
        }

        // Cleanup function
        return () => {
            isMounted = false;
            if (searchTimer) {
                clearTimeout(searchTimer);
            }
        };
    }, [searchQuery]); // Only depend on query changes, not page

    const fetchSearchResults = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/v1/item/search`, {
                params: {query: searchQuery, page, size: 10},
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const newItems = response.data;

            // If we got less items than requested, there are no more results
            if (newItems.length < 10) {
                setHasMore(false);
            }

            // Append new items to existing ones
            setItems(prevItems => {
                // Avoid duplicates by checking IDs
                const itemIds = new Set(prevItems.map((item: Item) => item.id));
                const uniqueNewItems = newItems.filter((item: Item) => !itemIds.has(item.id));
                return [...prevItems, ...uniqueNewItems];
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('Failed to fetch search results. Please try again.');
            setLoading(false);
            setHasMore(false);
        }
    };

    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        // Reset pagination whenever search query changes
        setPage(0);
        setHasMore(true);
    };

    // Handle search form submission
    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (searchQuery.trim()) {
            // Reset pagination
            setPage(0);
            setHasMore(true);

            // Update URL without reload
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`, {replace: true});

            // Results will be fetched by the useEffect
        }
    };

    // Handle sort change
    const handleSortChange = (event: SelectChangeEvent) => {
        setSortOption(event.target.value as string);

        // Apply sorting logic based on the selected option
        let sortedItems = [...items];

        switch (event.target.value) {
            case "newest":
                sortedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "price_asc":
                sortedItems.sort((a, b) => a.price - b.price);
                break;
            case "price_desc":
                sortedItems.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }

        setItems(sortedItems);
    };

    // Handle load more button click
    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
            fetchSearchResults();
        }
    };

    // Show appropriate messages based on search state
    const renderContent = () => {
        if (loading && items.length === 0) {
            return (
                <Box sx={{py: 4, textAlign: 'center'}}>
                    <CircularProgress/>
                    <Typography variant="body1" sx={{mt: 2}}>
                        Searching for results...
                    </Typography>
                </Box>
            );
        }

        if (error) {
            return (
                <Box sx={{py: 4, textAlign: 'center'}}>
                    <Typography color="error" variant="body1">
                        {error}
                    </Typography>
                </Box>
            );
        }

        if (items.length === 0 && searchQuery.trim() !== '') {
            return (
                <Box sx={{py: 4, textAlign: 'center'}}>
                    <Typography variant="body1">
                        No results found for "{searchQuery}". Try different keywords or filters.
                    </Typography>
                </Box>
            );
        }

        return (
            <Grid container spacing={3}>
                {items.map((item: Item) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                        <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                            <CardActionArea component={Link} to={`/item/${item.id}`}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={item.imageUrls && item.imageUrls.length > 0
                                        ? item.imageUrls[0]
                                        : `/assets/item${(item.id % 8) + 1}.webp`}
                                    alt={item.title}
                                    sx={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        aspectRatio: '1/1',
                                        bgcolor: '#f8fafc'
                                    }}
                                />
                                <CardContent sx={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                                    <Typography variant="subtitle1" sx={{fontWeight: 600, color: "#4a5568", mb: 1}}>
                                        {item.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#718096",
                                            mb: 2,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {item.description}
                                    </Typography>
                                    <Box sx={{mt: 'auto'}}>
                                        <Typography variant="h6" sx={{fontWeight: 700, color: "#6b46c1"}}>
                                            ${item.price.toFixed(2)}
                                        </Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mt: 1
                                        }}>
                                            <Typography variant="body2" sx={{color: "#718096"}}>
                                                {item.seller || "Seller"}
                                            </Typography>
                                            <Chip
                                                label={item.category}
                                                size="small"
                                                sx={{
                                                    fontSize: '0.75rem',
                                                    backgroundColor: "#ebf4ff",
                                                    color: "#3182ce",
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    };

    return (
        <Box sx={{display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f9fafb"}}>
            {/* Navigation Bar - same as HomePage for consistency */}
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: "#fff",
                    boxShadow: 1,
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar sx={{justifyContent: "space-between"}}>
                    {/* Logo */}
                    <Box sx={{display: "flex", alignItems: "center"}} onClick={() => navigate("/home")}
                         style={{cursor: "pointer"}}>
                        <Box
                            component="img"
                            src={polylogo}
                            alt="Logo"
                            sx={{height: 46, width: 46, mr: 1}}
                        />
                        <Typography variant="h6" sx={{fontWeight: 700, color: "#6b46c1"}}>
                            PolyMart
                        </Typography>
                    </Box>

                    {/* Search Bar */}
                    <Box sx={{flexGrow: 1, mx: 4}}>
                        <Paper
                            component="form"
                            onSubmit={handleSearchSubmit}
                            elevation={0}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "50px",
                                overflow: "hidden",
                                border: "1px solid #e0e0e0",
                                '&:hover': {
                                    boxShadow: '0 1px 6px rgba(32, 33, 36, 0.28)'
                                }
                            }}
                        >
                            <InputBase
                                placeholder="Search for items..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                sx={{flexGrow: 1, px: 2, py: 1, fontWeight: 500}}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{color: "#9ca3af"}}/>
                                    </InputAdornment>
                                }
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: "#6b46c1",
                                    borderRadius: "0",
                                    textTransform: "none",
                                    px: 3,
                                    py: 1.5,
                                    height: '100%',
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: "#5a32b0"
                                    }
                                }}
                            >
                                Search
                            </Button>
                        </Paper>
                    </Box>

                    {/* Navigation Icons */}
                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                        <IconButton color="primary" onClick={() => navigate("/myselling")}>
                            <Badge badgeContent={2} color="error">
                                <FavoriteIcon/>
                            </Badge>
                        </IconButton>
                        <IconButton color="primary">
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                        <IconButton color="primary">
                            <Badge badgeContent={1} color="error">
                                <ShoppingCartIcon/>
                            </Badge>
                        </IconButton>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<AddIcon/>}
                            sx={{
                                ml: 1,
                                borderRadius: 50,
                                textTransform: "none",
                                fontWeight: 600,
                                borderColor: "#6b46c1",
                                color: "#6b46c1",
                                '&:hover': {
                                    borderColor: "#5a32b0",
                                    backgroundColor: "rgba(107, 70, 193, 0.04)"
                                }
                            }}
                            onClick={() => navigate("/create-listing")}
                        >
                            Sell
                        </Button>
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                ml: 1,
                                cursor: "pointer",
                                bgcolor: "#6b46c1"
                            }}
                            onClick={() => navigate("/myselling")}
                        >
                            FP
                        </Avatar>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box component="main" sx={{flexGrow: 1, pt: 12}}>
                <Container maxWidth="xl">
                    {/* Search Info & Filters */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            mb: 3
                        }}
                    >
                        <Typography variant="h5" sx={{fontWeight: 700, color: "#4a5568"}}>
                            {loading && page === 0 ? (
                                <Skeleton width={250}/>
                            ) : (
                                `${items.length} results for "${searchQuery}"`
                            )}
                        </Typography>

                        <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                            <FormControl variant="outlined" size="small" sx={{minWidth: 150}}>
                                <InputLabel id="sort-label">Sort By</InputLabel>
                                <Select
                                    labelId="sort-label"
                                    value={sortOption}
                                    onChange={handleSortChange}
                                    label="Sort By"
                                >
                                    <MenuItem value="newest">Newest First</MenuItem>
                                    <MenuItem value="price_asc">Price: Low to High</MenuItem>
                                    <MenuItem value="price_desc">Price: High to Low</MenuItem>
                                </Select>
                            </FormControl>

                            <Button
                                variant="outlined"
                                startIcon={<TuneIcon/>}
                                sx={{
                                    borderRadius: 50,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    color: '#6b46c1',
                                    borderColor: '#e2e8f0',
                                    px: 2
                                }}
                            >
                                Filters
                            </Button>
                        </Box>
                    </Box>

                    {/* Search results */}
                    {renderContent()}

                    {/* Load more button */}
                    {items.length > 0 && hasMore && (
                        <Box sx={{mt: 4, textAlign: 'center'}}>
                            <Button
                                variant="outlined"
                                onClick={handleLoadMore}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20}/> : null}
                            >
                                {loading ? 'Loading more...' : 'Load more results'}
                            </Button>
                        </Box>
                    )}
                </Container>
            </Box>

            {/* Footer - Simplified version */}
            <Box
                component="footer"
                sx={{
                    width: "100%",
                    background: "linear-gradient(to right, #6b46c1, #5a67d8)",
                    py: 3,
                    mt: "auto",
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="body2" sx={{textAlign: "center", color: "#e9d8fd"}}>
                        © {new Date().getFullYear()} Florida Polytechnic University MarketPlace. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default SearchResults; 