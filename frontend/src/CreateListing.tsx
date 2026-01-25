import React, { FormEvent, useState, useRef } from "react";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
    CircularProgress,
    Alert,
    Snackbar,
    Stepper,
    Step,
    StepLabel,
    useTheme,
    alpha,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import axios from "axios";
import api from "./services/api";
import { PageLayout } from './components/layout';

interface UploadedFile extends File {
    preview?: string;
    uploading?: boolean;
    uploaded?: boolean;
    error?: boolean;
}

const steps = ['Add Photos', 'Item Details', 'Review & Submit'];

const categories = [
    { value: 'Electronics', label: 'Electronics', icon: '📱' },
    { value: 'Textbooks', label: 'Textbooks', icon: '📚' },
    { value: 'Fashion', label: 'Fashion (Apparel)', icon: '👕' },
    { value: 'Sports', label: 'Sports Gear', icon: '⚽' },
    { value: 'Collectibles', label: 'Collectibles', icon: '🎮' },
    { value: 'Services', label: 'Services', icon: '🔧' },
    { value: 'Other', label: 'Other (Dorm & Living)', icon: '🏠' },
];

const CreateListing: React.FC = () => {
    const theme = useTheme();
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [activeStep] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    const uploadFileToS3 = async (file: UploadedFile, itemId: number): Promise<void> => {
        try {
            setFiles(prevFiles =>
                prevFiles.map(f => f === file ? { ...f, uploading: true } : f)
            );

            const presignedUrlResponse = await api.get('/api/v1/images/upload-url', {
                params: {
                    itemId: itemId,
                    contentType: file.type
                }
            });

            const uploadUrl = presignedUrlResponse.data.uploadUrl;

            // Direct axios call to S3 (not our API)
            await axios.put(uploadUrl, file, {
                headers: {
                    'Content-Type': file.type,
                }
            });

            setFiles(prevFiles =>
                prevFiles.map(f => f === file ? { ...f, uploading: false, uploaded: true } : f)
            );
        } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
            setFiles(prevFiles =>
                prevFiles.map(f => f === file ? { ...f, uploading: false, error: true } : f)
            );
            throw error;
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!title || !price || !category || !description) {
            showNotification("Please fill out all required fields", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await api.post('/api/v1/item/createListing', {
                name: title,
                description,
                price: parseFloat(price),
                category,
            });

            if (files.length > 0 && response.data.success && response.data.itemId) {
                const itemId = response.data.itemId;
                const uploadPromises = files.map(file => uploadFileToS3(file, itemId));
                await Promise.all(uploadPromises);
                showNotification("Listing created successfully with images!", "success");
            } else {
                showNotification("Listing created successfully!", "success");
            }

            setTimeout(() => {
                navigate("/home");
            }, 2000);
        } catch (error) {
            console.error("Error creating listing:", error);
            showNotification("Error creating listing. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(Array.from(e.target.files));
        }
    };

    const addFiles = (newFileList: File[]) => {
        const newFiles = newFileList.map(file => {
            const uploadedFile = file as UploadedFile;
            if (file.type.startsWith('image/')) {
                uploadedFile.preview = URL.createObjectURL(file);
            }
            return uploadedFile;
        });
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            addFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const removeFile = (index: number) => {
        setFiles(prevFiles => {
            const newFiles = [...prevFiles];
            if (newFiles[index].preview) {
                URL.revokeObjectURL(newFiles[index].preview!);
            }
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    return (
        <PageLayout showCategories={false}>
            <Snackbar
                open={!!notification}
                autoHideDuration={4000}
                onClose={() => setNotification(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={notification?.type || 'info'}
                    variant="filled"
                    onClose={() => setNotification(null)}
                >
                    {notification?.message}
                </Alert>
            </Snackbar>

            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{ mr: 2, color: 'primary.main' }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Create New Listing
                </Typography>
            </Box>

            {/* Stepper */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            <Grid container spacing={4}>
                {/* Main Content */}
                <Grid item xs={12} md={8}>
                    {/* Photos Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                            Photos & Video
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                            Add up to 12 photos and a 1-minute video. Show all details and angles.
                        </Typography>

                        {/* Drag & Drop Zone */}
                        <Box
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            sx={{
                                border: `2px dashed ${dragActive ? theme.palette.primary.main : theme.palette.divider}`,
                                borderRadius: 3,
                                p: 4,
                                textAlign: 'center',
                                bgcolor: dragActive
                                    ? alpha(theme.palette.primary.main, 0.05)
                                    : theme.palette.mode === 'light'
                                        ? theme.palette.grey[50]
                                        : alpha(theme.palette.background.paper, 0.5),
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                }
                            }}
                            onClick={handleButtonClick}
                        >
                            <AddPhotoAlternateIcon
                                sx={{
                                    fontSize: 48,
                                    color: dragActive ? 'primary.main' : 'text.secondary',
                                    mb: 2
                                }}
                            />
                            <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500, mb: 1 }}>
                                Drag and drop files here
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                or click to browse
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
                                startIcon={<AddPhotoAlternateIcon />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleButtonClick();
                                }}
                                sx={{ borderRadius: 2, fontWeight: 600 }}
                            >
                                Upload Files
                            </Button>
                        </Box>

                        {/* File Preview Grid */}
                        {files.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                                    Uploaded Files ({files.length}/12)
                                </Typography>
                                <Grid container spacing={2}>
                                    {files.map((file, index) => (
                                        <Grid item xs={6} sm={4} md={3} key={index}>
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    border: `1px solid ${theme.palette.divider}`,
                                                    bgcolor: theme.palette.mode === 'light'
                                                        ? theme.palette.grey[50]
                                                        : theme.palette.grey[900],
                                                }}
                                            >
                                                {file.preview ? (
                                                    <Box
                                                        component="img"
                                                        src={file.preview}
                                                        sx={{
                                                            width: '100%',
                                                            height: 120,
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            height: 120,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        {file.type.includes("video") ? (
                                                            <VideocamIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                                                        ) : (
                                                            <ImageIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                                                        )}
                                                    </Box>
                                                )}

                                                {/* Status Overlay */}
                                                {(file.uploading || file.uploaded || file.error) && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            bgcolor: alpha(theme.palette.background.default, 0.7),
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        {file.uploading && <CircularProgress size={32} />}
                                                        {file.uploaded && <CheckCircleIcon sx={{ fontSize: 32, color: 'success.main' }} />}
                                                        {file.error && <ErrorIcon sx={{ fontSize: 32, color: 'error.main' }} />}
                                                    </Box>
                                                )}

                                                {/* Remove Button */}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => removeFile(index)}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        right: 4,
                                                        bgcolor: alpha(theme.palette.background.paper, 0.9),
                                                        '&:hover': {
                                                            bgcolor: theme.palette.error.main,
                                                            color: 'white',
                                                        }
                                                    }}
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>

                                                {/* File Name */}
                                                <Box sx={{ p: 1 }}>
                                                    <Typography
                                                        variant="caption"
                                                        noWrap
                                                        sx={{ color: 'text.secondary', display: 'block' }}
                                                    >
                                                        {file.name}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                    </Paper>

                    {/* Item Details Form */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
                            Item Details
                        </Typography>

                        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                {/* Title */}
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Listing Title"
                                        placeholder="e.g., Vintage Camera, Calculus Textbook 8th Edition"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        helperText="Be specific and descriptive"
                                    />
                                </Grid>

                                {/* Price */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Price"
                                        type="number"
                                        inputProps={{ step: "0.01", min: "0" }}
                                        placeholder="0.00"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AttachMoneyIcon sx={{ color: 'text.secondary' }} />
                                                </InputAdornment>
                                            ),
                                        }}
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
                                            {categories.map((cat) => (
                                                <MenuItem key={cat.value} value={cat.value}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <span>{cat.icon}</span>
                                                        <span>{cat.label}</span>
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>Choose the best category for your item</FormHelperText>
                                    </FormControl>
                                </Grid>

                                {/* Description */}
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        multiline
                                        rows={5}
                                        label="Description"
                                        placeholder="Describe your item in detail. Include condition, brand, dimensions, and any flaws."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        helperText={`${description.length}/1000 characters`}
                                        inputProps={{ maxLength: 1000 }}
                                    />
                                </Grid>
                            </Grid>

                            {/* Action Buttons */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mt: 4,
                                    pt: 3,
                                    borderTop: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <Button
                                    variant="text"
                                    startIcon={<ArrowBackIcon />}
                                    onClick={() => navigate(-1)}
                                    disabled={isSubmitting}
                                    sx={{ fontWeight: 500 }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting || !title || !price || !category || !description}
                                    sx={{
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 600,
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <CircularProgress size={20} sx={{ mr: 1, color: 'inherit' }} />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Listing'
                                    )}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Sidebar - Tips */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            position: 'sticky',
                            top: 100,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                            Tips for a Great Listing
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                                    Take Great Photos
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Use good lighting and show multiple angles. Include close-ups of any damage or wear.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                                    Write a Clear Title
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Include brand, model, size, or edition. Be specific so buyers can find your item.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                                    Price Competitively
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Check similar listings to price your item fairly. Consider condition and demand.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                                    Be Honest in Description
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Mention any flaws or defects. Honest listings get better reviews and repeat buyers.
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                mt: 3,
                                p: 2,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                            }}
                        >
                            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500 }}>
                                Need help? Contact support@polymart.edu
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </PageLayout>
    );
};

export default CreateListing;
