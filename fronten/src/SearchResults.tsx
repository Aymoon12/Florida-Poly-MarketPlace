import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Chip,
    Drawer,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    Slider,
    Typography,
    useTheme,
    alpha,
    Divider,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { PageLayout } from './components/layout';
import { ItemCard, ItemCardSkeleton, EmptyState } from './components/common';
import type { ItemType } from './components/common';

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

const categories = [
    'All Categories',
    'Electronics',
    'Textbooks',
    'Fashion',
    'Sports',
    'Collectibles',
    'Services',
    'Other'
];

const SearchResults: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const queryFromUrl = queryParams.get("q") || "";
    const categoryFromUrl = queryParams.get("category") || "";

    const [searchQuery, setSearchQuery] = useState(queryFromUrl);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState("newest");
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "All Categories");
    const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    useEffect(() => {
        fetchSearchResults();
    }, [location.search]);

    const fetchSearchResults = async () => {
        setLoading(true);
        try {
            const searchParams = new URLSearchParams(location.search);
            const query = searchParams.get('q');
            const categoryParam = searchParams.get('category');

            setSearchQuery(query || "");
            if (categoryParam) {
                setSelectedCategory(categoryParam);
            }

            let params: Record<string, string> = {};
            if (query) params.query = query;
            if (categoryParam) params.category = categoryParam;

            const response = await axios.get(`http://localhost:8080/api/v1/item/search`, {
                params,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data && Array.isArray(response.data)) {
                setItems(response.data);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (event: SelectChangeEvent) => {
        const newSort = event.target.value;
        setSortOption(newSort);

        let sortedItems = [...items];
        switch (newSort) {
            case "newest":
                sortedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "oldest":
                sortedItems.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case "price_asc":
                sortedItems.sort((a, b) => a.price - b.price);
                break;
            case "price_desc":
                sortedItems.sort((a, b) => b.price - a.price);
                break;
        }
        setItems(sortedItems);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newCategory = event.target.value;
        setSelectedCategory(newCategory);
    };

    const handlePriceChange = (_event: Event, newValue: number | number[]) => {
        setPriceRange(newValue as number[]);
    };

    const applyFilters = () => {
        let filteredItems = [...items];

        if (selectedCategory !== "All Categories") {
            filteredItems = filteredItems.filter(item =>
                item.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        filteredItems = filteredItems.filter(item =>
            item.price >= priceRange[0] && item.price <= priceRange[1]
        );

        setItems(filteredItems);
        setFilterDrawerOpen(false);
    };

    const clearFilters = () => {
        setSelectedCategory("All Categories");
        setPriceRange([0, 500]);
        fetchSearchResults();
        setFilterDrawerOpen(false);
    };

    const mapItemToItemType = (item: Item): ItemType => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        seller: item.seller,
        imageUrls: item.imageUrls,
        status: item.status,
    });

    const getSearchTitle = () => {
        if (searchQuery && selectedCategory !== "All Categories") {
            return `"${searchQuery}" in ${selectedCategory}`;
        }
        if (searchQuery) {
            return `"${searchQuery}"`;
        }
        if (selectedCategory !== "All Categories") {
            return selectedCategory;
        }
        return "All Items";
    };

    const FilterDrawerContent = () => (
        <Box sx={{ width: 320, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Filters
                </Typography>
                <IconButton onClick={() => setFilterDrawerOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Category Filter */}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                Category
            </Typography>
            <RadioGroup value={selectedCategory} onChange={handleCategoryChange}>
                {categories.map((cat) => (
                    <FormControlLabel
                        key={cat}
                        value={cat}
                        control={<Radio size="small" />}
                        label={cat}
                        sx={{
                            '& .MuiFormControlLabel-label': {
                                fontSize: '0.875rem',
                                color: 'text.secondary',
                            }
                        }}
                    />
                ))}
            </RadioGroup>

            <Divider sx={{ my: 3 }} />

            {/* Price Range Filter */}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                Price Range
            </Typography>
            <Box sx={{ px: 1 }}>
                <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={500}
                    valueLabelFormat={(value) => `$${value}`}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        ${priceRange[0]}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        ${priceRange[1]}+
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={clearFilters}
                    sx={{ borderRadius: 2 }}
                >
                    Clear All
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={applyFilters}
                    sx={{ borderRadius: 2 }}
                >
                    Apply
                </Button>
            </Box>
        </Box>
    );

    return (
        <PageLayout showCategories={false}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{ mr: 2, color: 'primary.main' }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Search Results
                </Typography>
            </Box>

            {/* Search Info Bar */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {loading ? 'Searching...' : `${items.length} results for ${getSearchTitle()}`}
                    </Typography>
                    {(selectedCategory !== "All Categories" || priceRange[0] > 0 || priceRange[1] < 500) && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                            {selectedCategory !== "All Categories" && (
                                <Chip
                                    label={selectedCategory}
                                    size="small"
                                    onDelete={() => setSelectedCategory("All Categories")}
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: 'primary.main',
                                        '& .MuiChip-deleteIcon': {
                                            color: 'primary.main',
                                        }
                                    }}
                                />
                            )}
                            {(priceRange[0] > 0 || priceRange[1] < 500) && (
                                <Chip
                                    label={`$${priceRange[0]} - $${priceRange[1]}`}
                                    size="small"
                                    onDelete={() => setPriceRange([0, 500])}
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: 'primary.main',
                                        '& .MuiChip-deleteIcon': {
                                            color: 'primary.main',
                                        }
                                    }}
                                />
                            )}
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sortOption}
                            onChange={handleSortChange}
                            label="Sort By"
                        >
                            <MenuItem value="newest">Newest First</MenuItem>
                            <MenuItem value="oldest">Oldest First</MenuItem>
                            <MenuItem value="price_asc">Price: Low to High</MenuItem>
                            <MenuItem value="price_desc">Price: High to Low</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        startIcon={<TuneIcon />}
                        onClick={() => setFilterDrawerOpen(true)}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 500,
                        }}
                    >
                        Filters
                    </Button>
                </Box>
            </Paper>

            {/* Results Grid */}
            {loading ? (
                <Grid container spacing={3}>
                    {[...Array(8)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <ItemCardSkeleton />
                        </Grid>
                    ))}
                </Grid>
            ) : items.length === 0 ? (
                <EmptyState
                    type="search"
                    title="No results found"
                    description={`We couldn't find any items matching "${searchQuery}". Try different keywords or browse categories.`}
                    actionLabel="Browse All Items"
                    onAction={() => navigate('/home')}
                />
            ) : (
                <Grid container spacing={3}>
                    {items.map((item) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                            <ItemCard
                                item={mapItemToItemType(item)}
                                onClick={() => navigate(`/item/${item.id}`)}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Category Quick Filters */}
            {!loading && items.length > 0 && (
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                        Refine by Category
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {categories.slice(1).map((cat) => (
                            <Chip
                                key={cat}
                                label={cat}
                                clickable
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    navigate(`/search?category=${encodeURIComponent(cat)}`);
                                }}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 500,
                                    bgcolor: selectedCategory === cat
                                        ? 'primary.main'
                                        : theme.palette.mode === 'light'
                                            ? theme.palette.grey[100]
                                            : theme.palette.grey[800],
                                    color: selectedCategory === cat
                                        ? 'white'
                                        : 'text.primary',
                                    '&:hover': {
                                        bgcolor: selectedCategory === cat
                                            ? 'primary.dark'
                                            : theme.palette.mode === 'light'
                                                ? theme.palette.grey[200]
                                                : theme.palette.grey[700],
                                    }
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {/* Filter Drawer */}
            <Drawer
                anchor="right"
                open={filterDrawerOpen}
                onClose={() => setFilterDrawerOpen(false)}
            >
                <FilterDrawerContent />
            </Drawer>
        </PageLayout>
    );
};

export default SearchResults;
