import {useNavigate} from "react-router-dom";
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
    Container,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    InputBase,
    Paper,
    Tab,
    Tabs,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";
import {useEffect, useState} from "react";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CategoryIcon from "@mui/icons-material/Category";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import ElectronicsIcon from "@mui/icons-material/Devices";
import FashionIcon from "@mui/icons-material/Checkroom";
import BooksIcon from "@mui/icons-material/MenuBook";
import SportsIcon from "@mui/icons-material/SportsSoccer";
import HomeIcon from "@mui/icons-material/Home";
import CollectiblesIcon from "@mui/icons-material/Storefront";
import CartIcon from "./components/CartIcon";
import axios from "axios";

interface ItemType {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    imageUrls: string[];
}

const HomePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [recentlyViewed, setRecentlyViewed] = useState<ItemType[]>([]);
    const [featuredListings, setFeaturedListings] = useState<ItemType[]>([]);
    const [currentCategory, setCurrentCategory] = useState("Electronics");

    const categories = [
        {icon: <ElectronicsIcon/>, label: "Electronics", color: "#3182ce"},
        {icon: <BooksIcon/>, label: "Books", color: "#38a169"},
        {icon: <FashionIcon/>, label: "Fashion", color: "#d53f8c"},
        {icon: <SportsIcon/>, label: "Sports", color: "#e53e3e"},
        {icon: <HomeIcon/>, label: "Other", color: "#dd6b20"},
        {icon: <CollectiblesIcon/>, label: "Collectibles", color: "#805ad5"},
    ];

    const fetchItemsByCategory = async (category: string) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/item/getAllListingsByCategory`, {
                params: {category},
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data && Array.isArray(response.data)) {
                setFeaturedListings(response.data);
            }
        } catch (error) {
            console.error("Error fetching items by category:", error);
            // Fallback to demo data if API fails
            setFeaturedListings([
                {
                    id: 1,
                    title: "MacBook Pro 2020",
                    description: "Excellent condition MacBook Pro",
                    price: 899.99,
                    category: "Electronics",
                    imageUrls: ["/assets/item1.webp"]
                },
                {
                    id: 2,
                    title: "Engineering Toolkit",
                    description: "Complete engineering toolkit for students",
                    price: 65.00,
                    category: "Other",
                    imageUrls: ["/assets/item2.webp"]
                },
                {
                    id: 3,
                    title: "Graphing Notebook Bundle",
                    description: "Set of graphing notebooks, perfect for engineering classes",
                    price: 12.99,
                    category: "Books",
                    imageUrls: ["/assets/item3.webp"]
                },
                {
                    id: 4,
                    title: "Dorm Essentials Kit",
                    description: "Everything you need for your dorm room",
                    price: 49.50,
                    category: "Other",
                    imageUrls: ["/assets/item4.webp"]
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRecentlyViewed = async () => {
        try {
            // Get the user ID from localStorage
            const userId = localStorage.getItem("userId");

            if (userId) {
                // Try to fetch the user's recently viewed items
                const response = await axios.get(`http://localhost:8080/api/v1/item/getRecentlyViewed`, {
                    params: {userId},
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (response.data && Array.isArray(response.data)) {
                    setRecentlyViewed(response.data);
                    return;
                }
            }
        } catch (error) {
            console.error("Error fetching recently viewed items:", error);
        }

        // Fallback to demo data
        setRecentlyViewed([
            {
                id: 1,
                title: "Calculator TI-84",
                description: "Great calculator for engineering and math classes",
                price: 75.99,
                category: "Electronics",
                imageUrls: ["/assets/item5.webp"]
            },
            {
                id: 2,
                title: "Physics Textbook",
                description: "Physics 101 textbook in good condition",
                price: 45.50,
                category: "Books",
                imageUrls: ["/assets/item6.webp"]
            },
            {
                id: 3,
                title: "Desk Lamp",
                description: "LED desk lamp with adjustable brightness",
                price: 22.99,
                category: "Other",
                imageUrls: ["/assets/item7.webp"]
            },
            {
                id: 4,
                title: "Wireless Mouse",
                description: "Wireless mouse with long battery life",
                price: 18.99,
                category: "Electronics",
                imageUrls: ["/assets/item8.webp"]
            }
        ]);
    };

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const user_id = params.get('userId');
        const name = params.get('name')

        if (token && user_id && name) {
            localStorage.setItem('token', token);
            localStorage.setItem('userId', user_id);
            localStorage.setItem('name', name)
            console.log(token, user_id, name);
        }

        const fetchData = async () => {
            if (isMounted) {
                await fetchItemsByCategory(currentCategory);
                await fetchRecentlyViewed();
            }
        };

        fetchData().finally(() => {
            if (isMounted) {
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [currentCategory]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleCategoryClick = (category: string) => {
        setCurrentCategory(category);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const getDefaultImage = (item: ItemType) => {
        return item.imageUrls && item.imageUrls.length > 0
            ? item.imageUrls[0]
            : "/assets/placeholder.png";
    };

    return (
        <Box sx={{display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f9fafb"}}>
            {/* Navigation Bar */}
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
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                        <IconButton color="primary" onClick={() => navigate("/notifications")}>
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                        <CartIcon/>
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

                {/* Secondary Navigation */}
                <Box sx={{backgroundColor: "#f9f9f9", px: 2, borderBottom: "1px solid #e0e0e0"}}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            minHeight: '48px',
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                minHeight: '48px',
                                color: '#4b5563',
                                '&.Mui-selected': {
                                    color: '#6b46c1',
                                }
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#6b46c1',
                            }
                        }}
                    >
                        <Tab label="Home"/>
                        <Tab label="Electronics"/>
                        <Tab label="Textbooks"/>
                        <Tab label="Apparel"/>
                        <Tab label="Sports Gear"/>
                        <Tab label="Dorm & Living"/>
                        <Tab label="Collectibles"/>
                        <Tab label="Services"/>
                    </Tabs>
                </Box>
            </AppBar>

            {/* Main Content */}
            <Box component="main" sx={{flexGrow: 1, pt: 12}}>
                <Container maxWidth="xl">
                    {/* Banner Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            position: "relative",
                            height: {xs: 180, sm: 240, md: 300},
                            mb: 4,
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb'
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(70deg, rgba(107,70,193,0.95) 0%, rgba(90,103,216,0.8) 100%)",
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        />
                        <Container maxWidth="lg"
                                   sx={{position: 'relative', height: '100%', display: 'flex', alignItems: 'center'}}>
                            <Box sx={{maxWidth: {xs: '100%', md: '50%'}, zIndex: 2, px: {xs: 2, sm: 0}}}>
                                <Typography variant="h3" sx={{
                                    color: "#fff",
                                    fontWeight: 700,
                                    mb: 2,
                                    fontSize: {xs: '1.75rem', sm: '2.5rem', md: '2.75rem'}
                                }}>
                                    Welcome to PolyMart
                                </Typography>
                                <Typography variant="h6" sx={{
                                    color: "#fff",
                                    fontWeight: 500,
                                    mb: 3,
                                    opacity: 0.9,
                                    fontSize: {xs: '1rem', sm: '1.25rem'}
                                }}>
                                    Buy and sell with fellow Florida Poly students on campus
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#fff",
                                        color: "#6b46c1",
                                        borderRadius: 50,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        px: 4,
                                        py: 1.5,
                                        '&:hover': {
                                            backgroundColor: "#f8f9fa"
                                        }
                                    }}
                                    onClick={() => navigate("/create-listing")}
                                >
                                    Start Selling
                                </Button>
                            </Box>
                        </Container>
                    </Paper>

                    {/* Categories Section - Quick Access */}
                    <Box sx={{mb: 4}}>
                        <Grid container spacing={2}>
                            {categories.map((category, index) => (
                                <Grid item xs={6} sm={4} md={2} key={index}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            textAlign: "center",
                                            cursor: "pointer",
                                            transition: "all 0.3s",
                                            borderRadius: 2,
                                            border: '1px solid #e5e7eb',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                            },
                                        }}
                                        onClick={() => handleCategoryClick(category.label)}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: category.color,
                                                width: 56,
                                                height: 56,
                                                mx: 'auto',
                                                mb: 1
                                            }}
                                        >
                                            {category.icon}
                                        </Avatar>
                                        <Typography variant="body1" sx={{fontWeight: 600, color: "#4a5568"}}>
                                            {category.label}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Recently Viewed Listings Section */}
                    {recentlyViewed.length > 0 && (
                        <Box sx={{mb: 4}}>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                                <Typography variant="h5" sx={{fontWeight: 700, color: "#4a5568"}}>
                                    <WatchLaterIcon sx={{verticalAlign: 'middle', mr: 1}}/>
                                    Recently Viewed
                                </Typography>
                                <Button
                                    endIcon={<ArrowForwardIosIcon sx={{fontSize: 14}}/>}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        color: '#6b46c1'
                                    }}
                                >
                                    View all
                                </Button>
                            </Box>

                            <Grid container spacing={2}>
                                {recentlyViewed.map((item) => (
                                    <Grid item xs={12} sm={6} md={3} key={item.id}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                borderRadius: 2,
                                                transition: 'all 0.2s',
                                                border: '1px solid #e5e7eb',
                                                overflow: 'visible',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                                                }
                                            }}
                                        >
                                            <CardActionArea onClick={() => navigate(`/item/${item.id}`)}>
                                                <CardMedia
                                                    component="img"
                                                    height="200"
                                                    image={getDefaultImage(item)}
                                                    alt={item.title}
                                                    sx={{
                                                        objectFit: "cover",
                                                        width: '100%',
                                                        aspectRatio: '1/1',
                                                        bgcolor: '#f8fafc'
                                                    }}
                                                />
                                                <CardContent>
                                                    <Typography variant="subtitle1"
                                                                sx={{fontWeight: 600, color: "#4a5568", mb: 1}}>
                                                        {item.title}
                                                    </Typography>
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
                                                            {item.description}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {/* Featured Listings Section */}
                    <Box sx={{mb: 4}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                            <Typography variant="h5" sx={{fontWeight: 700, color: "#4a5568"}}>
                                <FavoriteIcon sx={{verticalAlign: 'middle', mr: 1, color: '#e53e3e'}}/>
                                Featured Listings
                            </Typography>
                            <Button
                                endIcon={<ArrowForwardIosIcon sx={{fontSize: 14}}/>}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    color: '#6b46c1'
                                }}
                            >
                                View all
                            </Button>
                        </Box>

                        <Grid container spacing={2}>
                            {featuredListings.map((item) => (
                                <Grid item xs={12} sm={6} md={3} key={item.id}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: 2,
                                            transition: 'all 0.2s',
                                            border: '1px solid #e5e7eb',
                                            overflow: 'visible',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                                            }
                                        }}
                                    >
                                        <CardActionArea onClick={() => navigate(`/item/${item.id}`)}>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={getDefaultImage(item)}
                                                alt={item.title}
                                                sx={{
                                                    objectFit: "cover",
                                                    width: '100%',
                                                    aspectRatio: '1/1',
                                                    bgcolor: '#f8fafc'
                                                }}
                                            />
                                            <CardContent>
                                                <Typography variant="subtitle1"
                                                            sx={{fontWeight: 600, color: "#4a5568", mb: 1}}>
                                                    {item.title}
                                                </Typography>
                                                <Typography variant="h6" sx={{fontWeight: 700, color: "#6b46c1"}}>
                                                    ${item.price.toFixed(2)}
                                                </Typography>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    mt: 1
                                                }}>
                                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                        <Typography variant="body2" sx={{color: "#718096", mr: 1}}>
                                                            {item.description}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Daily Deals / Special Campus Offers */}
                    <Box sx={{mb: 4}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                            <Typography variant="h5" sx={{fontWeight: 700, color: "#4a5568"}}>
                                <CategoryIcon sx={{verticalAlign: 'middle', mr: 1, color: '#805ad5'}}/>
                                Campus Deals
                            </Typography>
                            <Button
                                endIcon={<ArrowForwardIosIcon sx={{fontSize: 14}}/>}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    color: '#6b46c1'
                                }}
                            >
                                View all
                            </Button>
                        </Box>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                backgroundImage: 'linear-gradient(135deg, #f6f9fc 0%, #f1f5f9 100%)',
                                border: '1px solid #e5e7eb'
                            }}
                        >
                            <Grid container spacing={3} alignItems="center">
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h4" sx={{fontWeight: 700, color: "#4a5568", mb: 2}}>
                                        End of Semester Sale
                                    </Typography>
                                    <Typography variant="body1" sx={{mb: 3, color: "#718096"}}>
                                        Great deals on textbooks, dorm furniture, and electronics from graduating
                                        students.
                                        Don't miss out on these one-time offers!
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            borderRadius: 50,
                                            textTransform: "none",
                                            fontWeight: 600,
                                            px: 4,
                                            py: 1.5,
                                        }}
                                    >
                                        Browse Deals
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={6} sx={{textAlign: 'center'}}>
                                    <Box
                                        component="img"
                                        src="/assets/banner.jpg"
                                        alt="Campus Deals"
                                        sx={{
                                            maxWidth: '100%',
                                            height: 'auto',
                                            maxHeight: 220,
                                            borderRadius: 2,
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </Container>
            </Box>

            {/* Footer Section */}
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
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{fontWeight: 700, color: "#fff", mb: 2}}>
                                PolyMart
                            </Typography>
                            <Typography variant="body2" sx={{color: "#e9d8fd", mb: 2}}>
                                The official marketplace for Florida Polytechnic University students.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle1" sx={{fontWeight: 700, color: "#fff", mb: 2}}>
                                Quick Links
                            </Typography>
                            <Box component="ul" sx={{listStyle: 'none', p: 0, m: 0}}>
                                {['Home', 'My Listings', 'About', 'Help & Support'].map((item) => (
                                    <Box component="li" key={item} sx={{mb: 1}}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#e9d8fd",
                                                '&:hover': {color: "#fff", textDecoration: 'underline'},
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {item}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle1" sx={{fontWeight: 700, color: "#fff", mb: 2}}>
                                Contact
                            </Typography>
                            <Typography variant="body2" sx={{color: "#e9d8fd", mb: 1}}>
                                Florida Polytechnic University
                            </Typography>
                            <Typography variant="body2" sx={{color: "#e9d8fd"}}>
                                <a href="mailto:info@fpu.edu" style={{textDecoration: "none", color: "#e9d8fd"}}>
                                    info@fpu.edu
                                </a>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{my: 3, borderColor: 'rgba(255,255,255,0.1)'}}/>
                    <Typography variant="body2" sx={{textAlign: "center", color: "#e9d8fd"}}>
                        © {new Date().getFullYear()} Florida Polytechnic University MarketPlace. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;
