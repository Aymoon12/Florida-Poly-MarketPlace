import React, {FormEvent, useState} from "react";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const CreateListing: React.FC = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // In a real app, send form data to your backend via an API call
        console.log({
            title,
            price,
            category,
            description,
        });
        // Then redirect or show a success message
    };

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };

    return (
        <Box sx={{bgcolor: "#f9fafb", minHeight: "100vh", py: 4}}>
            <Container maxWidth="lg">
                {/* Heading */}
                <Box sx={{mb: 3}}>
                    <Typography variant="h4" sx={{fontWeight: "bold", color: "#6b46c1"}}>
                        Complete Your Listing
                    </Typography>
                </Box>

                {/* Photos & Video Section */}
                <Paper
                    variant="outlined"
                    sx={{
                        p: 3,
                        mb: 4,
                        borderColor: "#e2e8f0",
                    }}
                >
                    <Typography variant="h6" sx={{fontWeight: "bold", mb: 1}}>
                        Photos &amp; Video
                    </Typography>
                    <Typography variant="body2" sx={{mb: 2, color: "text.secondary"}}>
                        You can add up to 12 photos and a 1-minute video. Buyers want to see
                        all details and angles.
                    </Typography>
                    <Box
                        sx={{
                            border: "2px dashed #cbd5e0",
                            borderRadius: 2,
                            p: 3,
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="body2" sx={{color: "text.secondary", mb: 1}}>
                            Drag and drop files
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddPhotoAlternateIcon/>}
                            sx={{textTransform: "none", borderRadius: "20px", fontWeight: "bold"}}
                        >
                            Upload from computer
                        </Button>
                    </Box>
                </Paper>

                {/* Listing Details Form */}
                <Paper variant="outlined" sx={{p: 3, borderColor: "#e2e8f0"}}>
                    <Typography
                        variant="h6"
                        sx={{fontWeight: "bold", mb: 1, color: "#6b46c1"}}
                    >
                        Item Details
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <Grid container spacing={3}>
                            {/* Title */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Listing Title"
                                    placeholder="e.g., Vintage Camera"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Grid>
                            {/* Price */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Price"
                                    type="number"
                                    inputProps={{step: "0.01"}}
                                    placeholder="e.g., 120.00"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </Grid>
                            {/* Category */}
                            <Grid item xs={12} sm={6}>
                                <FormControl required fullWidth>
                                    <InputLabel id="category-label">Category</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        id="category"
                                        value={category}
                                        label="Category"
                                        onChange={handleCategoryChange}
                                    >
                                        <MenuItem value="">
                                            <em>Select a Category</em>
                                        </MenuItem>
                                        <MenuItem value="Electronics">Electronics</MenuItem>
                                        <MenuItem value="Books">Books</MenuItem>
                                        <MenuItem value="Collectibles">Collectibles</MenuItem>
                                        <MenuItem value="Fashion">Fashion</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </Select>
                                    <FormHelperText>Please select a category</FormHelperText>
                                </FormControl>
                            </Grid>
                            {/* Description */}
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Description"
                                    placeholder="Provide a clear, detailed description..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        {/* Bottom Buttons (Back on left, Create on right) */}
                        <Stack direction="row" justifyContent="space-between" mt={3}>
                            <Button
                                variant="text"
                                color="primary"
                                onClick={() => navigate(-1)}
                                sx={{textTransform: "none", fontWeight: "bold"}}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{textTransform: "none", borderRadius: "20px", fontWeight: "bold"}}
                            >
                                Create Listing
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default CreateListing;
