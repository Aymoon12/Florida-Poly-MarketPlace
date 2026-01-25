import { useState } from "react";
import polylogo from "./assets/poly-logo.webp"
import { motion } from "framer-motion";
import {
    Box,
    Button,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    Avatar,
    IconButton,
    Chip,
    Divider,
    TextField,
    InputAdornment,
    List,
    ListItem,
    Link,
    useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DevicesIcon from "@mui/icons-material/Devices";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import SecurityIcon from "@mui/icons-material/Security";
import PeopleIcon from "@mui/icons-material/People";
import SpeedIcon from "@mui/icons-material/Speed";
import ForumIcon from "@mui/icons-material/Forum";
import StarIcon from "@mui/icons-material/Star";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "./theme";

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideIn = {
    hidden: { x: -60, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const LandingPage = () => {
    const theme = useTheme();
    const { mode, toggleTheme } = useThemeMode();
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        { name: "All", icon: <LocalMallIcon /> },
        { name: "Electronics", icon: <DevicesIcon /> },
        { name: "Books", icon: <MenuBookIcon /> },
        { name: "Supplies", icon: <SchoolIcon /> },
        { name: "Furniture", icon: <HomeIcon /> },
        { name: "Services", icon: <AttachMoneyIcon /> },
    ];

    const featuredItems = [
        {
            id: 1,
            title: "MacBook Pro 2023",
            price: 1299.99,
            category: "Electronics",
            image: "/assets/item1.webp",
            seller: "Alex Johnson"
        },
        {
            id: 2,
            title: "Engineering Textbook Bundle",
            price: 89.99,
            category: "Books",
            image: "/assets/item2.webp",
            seller: "Maria Chen"
        },
        {
            id: 3,
            title: "Scientific Calculator",
            price: 49.99,
            category: "Electronics",
            image: "/assets/item3.webp",
            seller: "Raj Patel"
        },
        {
            id: 4,
            title: "Ergonomic Study Desk",
            price: 149.99,
            category: "Supplies",
            image: "/assets/item4.webp",
            seller: "Emma Davis"
        },
        {
            title: "Calculus Textbook",
            price: 45.00,
            category: "Books",
            image: "/assets/item1.webp",
            seller: "Alex Johnson"
        },
        {
            title: "MacBook Pro 2021",
            price: 950.00,
            category: "Electronics",
            image: "/assets/item2.webp",
            seller: "Maya Rodriguez"
        },
        {
            title: "Dorm Desk Lamp",
            price: 25.00,
            category: "Furniture",
            image: "/assets/item3.webp",
            seller: "Jamal Williams"
        },
        {
            title: "Programming Tutoring",
            price: 30.00,
            category: "Services",
            image: "/assets/item4.webp",
            seller: "Sarah Chen"
        }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Computer Science Student",
            image: "/assets/avatar1.webp",
            text: "PolyMart made it super easy to find affordable textbooks for my classes. The campus marketplace concept is brilliant!"
        },
        {
            name: "Michael Rodriguez",
            role: "Engineering Major",
            image: "/assets/avatar2.webp",
            text: "I sold my old laptop and calculator in just two days! The platform is user-friendly and connects you with trustworthy peers."
        },
        {
            name: "Aisha Kumar",
            role: "Data Science Student",
            image: "/assets/avatar3.webp",
            text: "As a student on a budget, PolyMart has been a game-changer for finding affordable equipment and supplies."
        },
        {
            name: "David Parker",
            role: "Computer Science Major",
            image: "/assets/user1.jpg",
            text: "PolyMart has transformed how I buy and sell on campus. I found all my textbooks for this semester at half the bookstore price!"
        },
        {
            name: "Priya Sharma",
            role: "Engineering Student",
            image: "/assets/user2.jpg",
            text: "The platform is so intuitive! I sold my calculator within hours of listing it, and the in-app messaging made coordination super easy."
        },
        {
            name: "Marcus Johnson",
            role: "Data Science Major",
            image: "/assets/user3.jpg",
            text: "As a freshman, this platform helped me furnish my dorm without breaking the bank. Plus, I've made connections with upperclassmen who give great advice!"
        }
    ];

    const handleLogin = () => {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090';
        window.location.href = `${apiBaseUrl}/oauth2/authorization/azure-dev`;
    };

    const features = [
        {
            icon: <SecurityIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
            title: "Secure Transactions",
            description: "Every exchange is protected with university verification and secure payment options.",
            color: theme.palette.mode === 'light' ? '#E9D5FF' : 'rgba(139, 92, 246, 0.2)'
        },
        {
            icon: <PeopleIcon fontSize="large" sx={{ color: theme.palette.info.main }} />,
            title: "Trusted Community",
            description: "Trade exclusively with verified Florida Polytechnic University students and faculty.",
            color: theme.palette.mode === 'light' ? '#DBEAFE' : 'rgba(59, 130, 246, 0.2)'
        },
        {
            icon: <SpeedIcon fontSize="large" sx={{ color: theme.palette.success.main }} />,
            title: "Lightning Fast",
            description: "Our optimized platform ensures quick listings and rapid responses.",
            color: theme.palette.mode === 'light' ? '#D1FAE5' : 'rgba(16, 185, 129, 0.2)'
        },
        {
            icon: <ForumIcon fontSize="large" sx={{ color: theme.palette.warning.main }} />,
            title: "Direct Communication",
            description: "Built-in messaging allows for seamless coordination between buyers and sellers.",
            color: theme.palette.mode === 'light' ? '#FEF3C7' : 'rgba(245, 158, 11, 0.2)'
        }
    ];

    return (
        <Box sx={{ overflowX: "hidden", bgcolor: theme.palette.background.default }}>
            {/* Navbar */}
            <Box
                component="header"
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    bgcolor: theme.palette.mode === 'light'
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(17, 24, 39, 0.9)",
                    backdropFilter: "blur(8px)",
                    boxShadow: theme.palette.mode === 'light'
                        ? "0 2px 10px rgba(0, 0, 0, 0.05)"
                        : "0 2px 10px rgba(0, 0, 0, 0.3)"
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{ py: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <img src={polylogo} alt="Florida Poly Logo" style={{ height: 42, width: 42 }} />
                            </motion.div>
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        ml: 1.5,
                                        fontWeight: 700,
                                        color: theme.palette.primary.main,
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                >
                                    Poly<span style={{ color: theme.palette.text.primary }}>Mart</span>
                                </Typography>
                            </motion.div>
                        </Box>

                        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
                            {["Features", "Marketplace", "Testimonials", "Contact"].map((item) => (
                                <Button
                                    key={item}
                                    variant="text"
                                    href={`#${item.toLowerCase()}`}
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        fontWeight: 600,
                                        "&:hover": { color: theme.palette.primary.main }
                                    }}
                                >
                                    {item}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                                onClick={toggleTheme}
                                sx={{ color: theme.palette.text.secondary }}
                            >
                                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                            </IconButton>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={handleLogin}
                                    sx={{
                                        borderRadius: 50,
                                        px: 3,
                                    }}
                                >
                                    Sign In
                                </Button>
                            </motion.div>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Hero Section */}
            <Box
                sx={{
                    pt: 12,
                    pb: 6,
                    background: theme.palette.mode === 'light'
                        ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
                        : `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
                    color: "white",
                    overflow: "hidden",
                    position: "relative"
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.1,
                        backgroundImage: "url('/assets/pattern.png')",
                        backgroundSize: "cover"
                    }}
                />

                <Container maxWidth="xl" sx={{ position: "relative" }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 800,
                                        mb: 2,
                                        background: "linear-gradient(90deg, #ffffff 0%, #e2e8f0 100%)",
                                        backgroundClip: "text",
                                        textFillColor: "transparent",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent"
                                    }}
                                >
                                    Campus Marketplace <br />Reimagined
                                </Typography>
                            </motion.div>

                            <motion.div initial="hidden" animate="visible" variants={slideIn}>
                                <Typography variant="h6" sx={{ mb: 4, color: "rgba(255,255,255,0.9)", fontWeight: 400, maxWidth: 550 }}>
                                    The premier marketplace platform for Florida Polytechnic University students.
                                    Buy, sell, and exchange items with your campus community.
                                </Typography>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={handleLogin}
                                        sx={{
                                            borderColor: "rgba(255,255,255,0.6)",
                                            color: "white",
                                            fontWeight: 600,
                                            borderRadius: 3,
                                            px: 4,
                                            py: 1.5,
                                            "&:hover": {
                                                borderColor: "white",
                                                bgcolor: "rgba(255,255,255,0.1)"
                                            }
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        href="#features"
                                        sx={{
                                            borderColor: "rgba(255,255,255,0.6)",
                                            color: "white",
                                            fontWeight: 600,
                                            borderRadius: 3,
                                            px: 4,
                                            py: 1.5,
                                            "&:hover": {
                                                borderColor: "white",
                                                bgcolor: "rgba(255,255,255,0.1)"
                                            }
                                        }}
                                    >
                                        Learn More
                                    </Button>
                                </Box>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
                                    <Box sx={{ display: "flex", mr: 2 }}>
                                        {[1, 2, 3].map((i) => (
                                            <Avatar
                                                key={i}
                                                src={`/assets/avatar${i}.webp`}
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    border: "2px solid white",
                                                    ml: i === 1 ? 0 : -1.5
                                                }}
                                            />
                                        ))}
                                    </Box>
                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                                        Join <strong>500+</strong> students already using PolyMart
                                    </Typography>
                                </Box>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                <Box
                                    component="img"
                                    src="/assets/hero-image.webp"
                                    alt="Campus Marketplace"
                                    sx={{
                                        width: "100%",
                                        maxWidth: 560,
                                        borderRadius: 4,
                                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
                                        transform: "perspective(1000px) rotateY(-10deg) rotateX(5deg)",
                                        mx: "auto",
                                        display: "block"
                                    }}
                                />
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Search Bar Section */}
            <Box sx={{ py: 6, bgcolor: theme.palette.background.default }}>
                <Container maxWidth="md">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                bgcolor: theme.palette.background.paper,
                                boxShadow: theme.palette.mode === 'light'
                                    ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                                    : "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: "center",
                                gap: 2
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder="Search for items, textbooks, electronics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: theme.palette.primary.main }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
                                {categories.map((category) => (
                                    <Chip
                                        key={category.name}
                                        label={category.name}
                                        icon={category.icon}
                                        onClick={() => setActiveCategory(category.name)}
                                        sx={{
                                            bgcolor: activeCategory === category.name
                                                ? theme.palette.primary.main
                                                : theme.palette.background.paper,
                                            color: activeCategory === category.name
                                                ? "white"
                                                : theme.palette.text.secondary,
                                            fontWeight: 600,
                                            border: `1px solid ${theme.palette.divider}`,
                                            "& .MuiChip-icon": {
                                                color: activeCategory === category.name
                                                    ? "white"
                                                    : theme.palette.primary.main
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* Features Section */}
            <Box id="features" sx={{ py: 8, bgcolor: theme.palette.background.paper }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: 6 }}>
                        <Chip
                            label="Features"
                            sx={{
                                bgcolor: theme.palette.mode === 'light' ? '#F3E8FF' : 'rgba(139, 92, 246, 0.2)',
                                color: theme.palette.primary.main,
                                fontWeight: 600,
                                mb: 2
                            }}
                        />
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}>
                            Why Choose PolyMart?
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: theme.palette.text.secondary,
                                maxWidth: 660,
                                mx: "auto",
                                fontSize: "1.1rem"
                            }}
                        >
                            Our platform connects the Florida Polytechnic community through
                            a seamless, secure, and intuitive marketplace experience.
                        </Typography>
                    </Box>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={staggerContainer}
                    >
                        <Grid container spacing={4}>
                            {features.map((feature, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <motion.div variants={itemVariant}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                borderRadius: 4,
                                                p: 3,
                                                border: `1px solid ${theme.palette.divider}`,
                                                transition: "all 0.3s",
                                                "&:hover": {
                                                    transform: "translateY(-8px)",
                                                    boxShadow: theme.palette.mode === 'light'
                                                        ? "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                                                        : "0 20px 25px -5px rgba(0, 0, 0, 0.4)"
                                                }
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    bgcolor: feature.color,
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: 2,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    mb: 2
                                                }}
                                            >
                                                {feature.icon}
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, flexGrow: 1 }}>
                                                {feature.description}
                                            </Typography>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>
            </Box>

            {/* Marketplace Preview Section */}
            <Box id="marketplace" sx={{ py: 8, bgcolor: theme.palette.background.default }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: 6 }}>
                        <Chip
                            label="Marketplace"
                            sx={{
                                bgcolor: theme.palette.mode === 'light' ? '#CCFBF1' : 'rgba(20, 184, 166, 0.2)',
                                color: theme.palette.mode === 'light' ? '#0D9488' : '#5EEAD4',
                                fontWeight: 600,
                                mb: 2
                            }}
                        />
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}>
                            Featured Items
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: theme.palette.text.secondary,
                                maxWidth: 660,
                                mx: "auto",
                                fontSize: "1.1rem"
                            }}
                        >
                            Get a glimpse of the quality items available on our platform.
                            From textbooks to tech, find everything you need for campus life.
                        </Typography>
                    </Box>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={staggerContainer}
                    >
                        <Grid container spacing={3}>
                            {featuredItems.map((item, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <motion.div variants={itemVariant}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                borderRadius: 4,
                                                overflow: "hidden",
                                                border: `1px solid ${theme.palette.divider}`,
                                                transition: "all 0.3s",
                                                "&:hover": {
                                                    transform: "translateY(-8px)",
                                                    boxShadow: theme.palette.mode === 'light'
                                                        ? "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                                                        : "0 20px 25px -5px rgba(0, 0, 0, 0.4)"
                                                },
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column"
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: 200,
                                                    position: "relative",
                                                    overflow: "hidden"
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={item.image}
                                                    alt={item.title}
                                                    sx={{
                                                        width: "100%",
                                                        height: "150px",
                                                        objectFit: "cover",
                                                        transition: "transform 0.6s",
                                                        bgcolor: theme.palette.grey[100],
                                                        "&:hover": {
                                                            transform: "scale(1.05)"
                                                        }
                                                    }}
                                                />
                                                <Chip
                                                    label={item.category}
                                                    size="small"
                                                    sx={{
                                                        position: "absolute",
                                                        top: 12,
                                                        right: 12,
                                                        bgcolor: theme.palette.background.paper,
                                                        color: theme.palette.primary.main,
                                                        fontWeight: 600
                                                    }}
                                                />
                                            </Box>
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}>
                                                    {item.title}
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}>
                                                    ${item.price.toFixed(2)}
                                                </Typography>
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: theme.palette.primary.main }}>
                                                        {item.seller.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                        {item.seller}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>

                    <Box sx={{ textAlign: "center", mt: 5 }}>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={handleLogin}
                            sx={{
                                borderRadius: 50,
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                            }}
                        >
                            View All Listings
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Testimonials Section */}
            <Box id="testimonials" sx={{ py: 10, bgcolor: theme.palette.background.paper }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: 6 }}>
                        <Chip
                            label="Testimonials"
                            sx={{
                                bgcolor: theme.palette.mode === 'light' ? '#FEF3C7' : 'rgba(245, 158, 11, 0.2)',
                                color: theme.palette.warning.main,
                                fontWeight: 600,
                                mb: 2
                            }}
                        />
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}>
                            What Students Say
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: theme.palette.text.secondary,
                                maxWidth: 660,
                                mx: "auto",
                                fontSize: "1.1rem"
                            }}
                        >
                            Don't just take our word for it. Here's what fellow students
                            have to say about their PolyMart experience.
                        </Typography>
                    </Box>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={staggerContainer}
                    >
                        <Grid container spacing={4}>
                            {testimonials.map((testimonial, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <motion.div variants={itemVariant}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                borderRadius: 4,
                                                p: 4,
                                                border: `1px solid ${theme.palette.divider}`,
                                                transition: "all 0.3s",
                                                "&:hover": {
                                                    transform: "translateY(-8px)",
                                                    boxShadow: theme.palette.mode === 'light'
                                                        ? "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                                                        : "0 20px 25px -5px rgba(0, 0, 0, 0.4)"
                                                }
                                            }}
                                        >
                                            <Box sx={{ mb: 3, display: "flex" }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        sx={{
                                                            color: theme.palette.warning.main,
                                                            width: 22,
                                                            height: 22
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    mb: 4,
                                                    flexGrow: 1,
                                                    color: theme.palette.text.secondary,
                                                    fontStyle: "italic",
                                                    lineHeight: 1.7
                                                }}
                                            >
                                                "{testimonial.text}"
                                            </Typography>
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <Avatar
                                                    src={testimonial.image}
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        mr: 2,
                                                        border: `2px solid ${theme.palette.primary.light}`
                                                    }}
                                                >
                                                    {testimonial.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                        {testimonial.name}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                        {testimonial.role}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>
            </Box>

            {/* Call to Action */}
            <Box sx={{
                py: 10,
                background: theme.palette.mode === 'light'
                    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                    : `linear-gradient(135deg, ${theme.palette.grey[800]} 0%, ${theme.palette.grey[900]} 100%)`
            }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 2,
                                        color: "white"
                                    }}
                                >
                                    Ready to Start Buying & Selling?
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 400,
                                        mb: 4,
                                        color: "rgba(255,255,255,0.8)"
                                    }}
                                >
                                    Join the Florida Poly community marketplace today and discover
                                    a new way to exchange goods and services on campus.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={handleLogin}
                                    sx={{
                                        borderColor: "rgba(255,255,255,0.6)",
                                        color: "white",
                                        fontWeight: 600,
                                        borderRadius: 3,
                                        px: 4,
                                        py: 1.5,
                                        "&:hover": {
                                            borderColor: "white",
                                            bgcolor: "rgba(255,255,255,0.1)"
                                        }
                                    }}
                                >
                                    Get Started Now
                                </Button>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <Box
                                    component="img"
                                    src="/assets/cta-illustration.svg"
                                    alt="Join now illustration"
                                    sx={{
                                        width: "100%",
                                        maxWidth: 400,
                                        display: "block",
                                        mx: "auto"
                                    }}
                                />
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{
                bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[900] : theme.palette.grey[900],
                color: "white",
                py: 6
            }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                PolyMart
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 3 }}>
                                The premier marketplace exclusively for the Florida Polytechnic University community.
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, i) => (
                                    <IconButton key={i} size="small" sx={{ color: "white", "&:hover": { color: theme.palette.primary.light } }}>
                                        <Icon />
                                    </IconButton>
                                ))}
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                                Quick Links
                            </Typography>
                            <List dense disablePadding>
                                {["Home", "Features", "Marketplace", "Testimonials"].map((item) => (
                                    <ListItem key={item} disablePadding sx={{ mb: 1 }}>
                                        <Link
                                            href={`#${item.toLowerCase()}`}
                                            underline="hover"
                                            sx={{
                                                color: "rgba(255,255,255,0.7)",
                                                "&:hover": { color: "white" }
                                            }}
                                        >
                                            {item}
                                        </Link>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                                Resources
                            </Typography>
                            <List dense disablePadding>
                                {["Help Center", "Community", "Guidelines", "FAQ"].map((item) => (
                                    <ListItem key={item} disablePadding sx={{ mb: 1 }}>
                                        <Link
                                            href="#"
                                            underline="hover"
                                            sx={{
                                                color: "rgba(255,255,255,0.7)",
                                                "&:hover": { color: "white" }
                                            }}
                                        >
                                            {item}
                                        </Link>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                                Stay Updated
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}>
                                Subscribe to our newsletter for updates and new features.
                            </Typography>
                            <Box sx={{ display: "flex" }}>
                                <TextField
                                    size="small"
                                    placeholder="Your email"
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        bgcolor: "rgba(255,255,255,0.05)",
                                        borderRadius: "8px 0 0 8px",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(255,255,255,0.1)",
                                            borderRight: 0
                                        },
                                        "& .MuiInputBase-input": {
                                            color: "white"
                                        }
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    sx={{
                                        borderRadius: "0 8px 8px 0",
                                    }}
                                >
                                    Subscribe
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 4 }} />
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
                        © {new Date().getFullYear()} PolyMart. All rights reserved. Made for Florida Polytechnic University.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;
