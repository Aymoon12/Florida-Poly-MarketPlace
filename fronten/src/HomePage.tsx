import {useNavigate} from "react-router-dom";
import polylogo from "./assets/poly-logo.webp";
import {AppBar, Box, Button, Grid, InputBase, Paper, Toolbar, Typography,} from "@mui/material";
import {useEffect} from "react";

const HomePage = () => {
    const navigate = useNavigate();


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const user_id = params.get('user_id');
        console.log(token)

    }, []);


    return (
        <Box sx={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
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
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <Box
                            component="img"
                            src={polylogo}
                            alt="Logo"
                            sx={{height: 60, width: 60, mr: 1}}
                        />
                        <Typography variant="h6" sx={{fontWeight: 600, color: "#6b46c1"}}>
                            PolyMart
                        </Typography>
                    </Box>
                    <Box sx={{flexGrow: 1, mx: 4}}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "50px",
                                overflow: "hidden",
                            }}
                        >
                            <InputBase
                                placeholder="Search for items..."
                                sx={{flexGrow: 1, px: 2, py: 1, fontWeight: 600}}
                            />
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#6b46c1",
                                    borderRadius: "50px",
                                    textTransform: "none",
                                    mr: 1,
                                    fontWeight: 600,
                                }}
                            >
                                Search
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{display: {xs: "none", md: "flex"}, gap: 2}}>
                        {[
                            {label: "Home", path: "/home"},
                            {label: "My Listings", path: "/myselling"},
                            {label: "Messages", path: "#"},
                            {label: "Profile", path: "#"},
                        ].map((item) => (
                            <Button
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                sx={{color: "#4a5568", textTransform: "none", fontWeight: 600}}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box component="main" sx={{flexGrow: 1, pt: 10}}>
                {/* Banner Section */}
                <Box sx={{position: "relative", height: 256}}>
                    <Box
                        component="img"
                        src="/assets/banner.jpg"
                        alt="Banner"
                        sx={{width: "100%", height: "100%", objectFit: "cover"}}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="h3" sx={{color: "#fff", fontWeight: 600}}>
                            Discover Great Deals
                        </Typography>
                    </Box>
                </Box>

                {/* Categories Section */}
                <Box sx={{py: 4, backgroundColor: "#fff"}}>
                    <Box sx={{mx: {xs: 2, sm: 4, md: 8}}}>
                        <Typography
                            variant="h5"
                            sx={{
                                textAlign: "center",
                                fontWeight: 600,
                                color: "#6b46c1",
                                mb: 2,
                            }}
                        >
                            Shop by Category
                        </Typography>
                        <Grid container spacing={2}>
                            {[
                                {src: "/assets/category-electronics.webp", label: "Electronics"},
                                {src: "/assets/category-fashion.webp", label: "Fashion"},
                                {src: "/assets/category-home.webp", label: "Home & Garden"},
                                {src: "/assets/category-sports.webp", label: "Sports"},
                            ].map((cat) => (
                                <Grid item xs={6} md={3} key={cat.label}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            textAlign: "center",
                                            cursor: "pointer",
                                            transition: "box-shadow 0.3s",
                                            "&:hover": {boxShadow: 4},
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={cat.src}
                                            alt={cat.label}
                                            sx={{height: 64, width: 64, objectFit: "contain", mb: 1}}
                                        />
                                        <Typography variant="body1" sx={{fontWeight: 600, color: "#4a5568"}}>
                                            {cat.label}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>

                {/* Recently Viewed Listings Section */}
                <Box sx={{py: 4, backgroundColor: "#f0f0f0"}}>
                    <Box sx={{mx: {xs: 2, sm: 4, md: 8}}}>
                        <Typography
                            variant="h5"
                            sx={{
                                textAlign: "center",
                                fontWeight: 600,
                                color: "#6b46c1",
                                mb: 2,
                            }}
                        >
                            Recently Viewed Listings
                        </Typography>
                        <Grid container spacing={2}>
                            {[1, 2, 3, 4].map((item) => (
                                <Grid item xs={12} sm={6} md={3} key={item}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            cursor: "pointer",
                                            transition: "box-shadow 0.3s",
                                            "&:hover": {boxShadow: 4},
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={`/assets/item${item + 4}.webp`}
                                            alt={`Recently Viewed ${item}`}
                                            sx={{
                                                width: "100%",
                                                height: 96,
                                                objectFit: "cover",
                                                borderRadius: 1,
                                            }}
                                        />
                                        {/* Text block below image, left aligned */}
                                        <Box sx={{mt: 1, textAlign: "left"}}>
                                            <Typography variant="body1" sx={{fontWeight: 600, color: "#4a5568"}}>
                                                Recent Item {item}
                                            </Typography>
                                            <Typography variant="body2" sx={{fontWeight: 600, color: "#718096"}}>
                                                ${15 * item + 0.99}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>

                {/* Featured Listings Section */}
                <Box sx={{py: 4, backgroundColor: "#f9fafb"}}>
                    <Box sx={{mx: {xs: 2, sm: 4, md: 8}}}>
                        <Typography
                            variant="h5"
                            sx={{
                                textAlign: "center",
                                fontWeight: 600,
                                color: "#6b46c1",
                                mb: 2,
                            }}
                        >
                            Featured Listings
                        </Typography>
                        <Grid container spacing={2}>
                            {[1, 2, 3, 4].map((item) => (
                                <Grid item xs={12} sm={6} md={3} key={item}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            transition: "box-shadow 0.3s",
                                            "&:hover": {boxShadow: 4},
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={`/assets/item${item}.webp`}
                                            alt={`Item ${item}`}
                                            sx={{
                                                width: "100%",
                                                height: 96,
                                                objectFit: "cover",
                                                borderRadius: 1,
                                            }}
                                        />
                                        {/* Text block below image, left aligned */}
                                        <Box sx={{mt: 1, textAlign: "left"}}>
                                            <Typography variant="body1" sx={{fontWeight: 600, color: "#4a5568"}}>
                                                Item Title {item}
                                            </Typography>
                                            <Typography variant="body2" sx={{fontWeight: 600, color: "#718096"}}>
                                                ${10 * item + 9.99}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Box>

            {/* Footer Section */}
            <Box
                component="footer"
                sx={{
                    width: "100vw",
                    background: "linear-gradient(to right, #6b46c1, #5a67d8)",
                    py: 3,
                    mt: "auto",
                    position: "relative",
                }}
            >
                <Box sx={{mx: {xs: 2, sm: 4, md: 8}, textAlign: "center", color: "#fff"}}>
                    <Typography variant="body2" sx={{mb: 1, fontWeight: 600}}>
                        © {new Date().getFullYear()} Florida Polytechnic University MarketPlace. All rights reserved.
                    </Typography>
                    <Typography variant="body2" sx={{fontWeight: 600}}>
                        <a href="mailto:info@fpu.edu" style={{textDecoration: "underline", color: "#fff"}}>
                            info@fpu.edu
                        </a>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default HomePage;
