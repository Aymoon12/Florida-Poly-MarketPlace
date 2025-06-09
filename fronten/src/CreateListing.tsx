import React, {FormEvent, useState, useRef} from "react";
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
    CircularProgress,
    Alert,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import axios from "axios";

interface UploadedFile extends File {
    preview?: string;
    uploading?: boolean;
    uploaded?: boolean;
    error?: boolean;
}

const CreateListing: React.FC = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{success: boolean; message: string} | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    /**
     * Upload a file to S3 using a presigned URL
     * @param file The file to upload
     * @param itemId The item ID to associate with the file
     * @returns Promise that resolves when upload is complete
     */
    const uploadFileToS3 = async (file: UploadedFile, itemId: number): Promise<void> => {
        try {
            console.log(`Starting upload for file ${file.name} to item ID ${itemId}`);
            
            // Mark file as uploading
            setFiles(prevFiles => 
                prevFiles.map(f => f === file ? {...f, uploading: true} : f)
            );
            
            // Step 1: Get a presigned URL from our backend
            const presignedUrlResponse = await axios.get(
                `http://localhost:8080/api/v1/images/upload-url`, 
                {
                    params: { 
                        itemId: itemId,
                        contentType: file.type 
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            const uploadUrl = presignedUrlResponse.data.uploadUrl;
            console.log(`Got presigned URL for item ${itemId}:`, uploadUrl);
            
            // Step 2: Use the presigned URL to upload directly to S3
            await axios.put(uploadUrl, file, {
                headers: {
                    'Content-Type': file.type,
                }
            });
            
            console.log(`Successfully uploaded file ${file.name} for item ${itemId}`);
            
            // Mark file as uploaded
            setFiles(prevFiles => 
                prevFiles.map(f => f === file ? {...f, uploading: false, uploaded: true} : f)
            );
        } catch (error) {
            console.error(`Error uploading file ${file.name} for item ${itemId}:`, error);
            
            // Mark file as error
            setFiles(prevFiles => 
                prevFiles.map(f => f === file ? {...f, uploading: false, error: true} : f)
            );
            
            throw error; // Re-throw to be handled by the caller
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!title || !price || !category || !description) {
            setUploadStatus({
                success: false,
                message: "Please fill out all required fields"
            });
            return;
        }
        
        setIsSubmitting(true);
        setUploadStatus(null);
        
        try {
            // Get the current user ID from local storage
            const userId = localStorage.getItem('userId') || "1";
            
            if (!userId) {
                setUploadStatus({
                    success: false,
                    message: 'User not authenticated. Please log in.'
                });
                setIsSubmitting(false);
                return;
            }

            // Create the listing first
            const response = await axios.post(
                `http://localhost:8080/api/v1/item/createListing`,
                {
                    userId: userId,
                    name: title,
                    description,
                    price: parseFloat(price),
                    category,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            
            console.log('Listing created:', response.data);
            
            // If we have files to upload and the listing was created successfully
            if (files.length > 0 && response.data.success && response.data.itemId) {
                const itemId = response.data.itemId;
                
                // Upload each file
                const uploadPromises = files.map(file => uploadFileToS3(file, itemId));
                await Promise.all(uploadPromises);
                
                setUploadStatus({
                    success: true,
                    message: "Listing created successfully with images!"
                });
                
                // Navigate after successful upload
                setTimeout(() => {
                    navigate("/home");
                }, 2000);
            } else {
                setUploadStatus({
                    success: true,
                    message: "Listing created successfully!"
                });
                
                // Navigate after successful upload
                setTimeout(() => {
                    navigate("/home");
                }, 2000);
            }
        } catch (error) {
            console.error("Error creating listing:", error);
            setUploadStatus({
                success: false,
                message: "Error creating listing. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => {
                const uploadedFile = file as UploadedFile;
                
                // Create preview URL for images
                if (file.type.startsWith('image/')) {
                    uploadedFile.preview = URL.createObjectURL(file);
                }
                
                return uploadedFile;
            });
            
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    
    const removeFile = (index: number) => {
        setFiles(prevFiles => {
            const newFiles = [...prevFiles];
            
            // Revoke object URL to prevent memory leaks
            if (newFiles[index].preview) {
                URL.revokeObjectURL(newFiles[index].preview!);
            }
            
            newFiles.splice(index, 1);
            return newFiles;
        });
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

                {/* Status Alert */}
                {uploadStatus && (
                    <Alert 
                        severity={uploadStatus.success ? "success" : "error"} 
                        sx={{ mb: 3 }}
                    >
                        {uploadStatus.message}
                    </Alert>
                )}

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
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddPhotoAlternateIcon/>}
                            onClick={handleButtonClick}
                            sx={{textTransform: "none", borderRadius: "20px", fontWeight: "bold"}}
                        >
                            Upload from computer
                        </Button>
                    </Box>
                    {files.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                Selected files ({files.length}):
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                {files.map((file, index) => (
                                    <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                                        <Box 
                                            sx={{ 
                                                p: 1,
                                                border: "1px solid #e2e8f0",
                                                borderRadius: 1,
                                                position: "relative",
                                                height: 140,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center"
                                            }}
                                        >
                                            {file.preview ? (
                                                <Box 
                                                    component="img" 
                                                    src={file.preview}
                                                    sx={{ 
                                                        height: 100, 
                                                        width: "100%", 
                                                        objectFit: "cover",
                                                        borderRadius: 1,
                                                        mb: 1
                                                    }}
                                                />
                                            ) : (
                                                <Box 
                                                    sx={{ 
                                                        height: 100, 
                                                        width: "100%", 
                                                        bgcolor: "#f1f5f9",
                                                        borderRadius: 1,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        mb: 1
                                                    }}
                                                >
                                                    {file.type.includes("video") ? "Video" : "File"}
                                                </Box>
                                            )}
                                            
                                            <Typography variant="caption" noWrap sx={{ width: "100%" }}>
                                                {file.name}
                                            </Typography>
                                            
                                            {file.uploading && (
                                                <CircularProgress 
                                                    size={16} 
                                                    sx={{ 
                                                        position: "absolute", 
                                                        top: 8, 
                                                        right: 8 
                                                    }} 
                                                />
                                            )}
                                            
                                            <Button 
                                                size="small" 
                                                color="error" 
                                                onClick={() => removeFile(index)}
                                                sx={{ 
                                                    position: "absolute", 
                                                    top: 0, 
                                                    right: 0,
                                                    minWidth: 32,
                                                    width: 32,
                                                    height: 32
                                                }}
                                            >
                                                ×
                                            </Button>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
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
                                        <MenuItem value="Textbooks">Textbooks</MenuItem>
                                        <MenuItem value="Fashion">Fashion (Apparel)</MenuItem>
                                        <MenuItem value="Sports">Sports Gear</MenuItem>
                                        <MenuItem value="Collectibles">Collectibles</MenuItem>
                                        <MenuItem value="Services">Services</MenuItem>
                                        <MenuItem value="Other">Other (Dorm & Living)</MenuItem>
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
                                disabled={isSubmitting}
                                sx={{textTransform: "none", fontWeight: "bold"}}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                startIcon={isSubmitting && <CircularProgress size={24} color="inherit" />}
                                sx={{textTransform: "none", borderRadius: "20px", fontWeight: "bold"}}
                            >
                                {isSubmitting ? "Creating..." : "Create Listing"}
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default CreateListing;
