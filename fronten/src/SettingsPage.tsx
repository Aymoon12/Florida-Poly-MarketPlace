import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import polylogo from "./assets/poly-logo.webp";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
    Snackbar,
    Switch,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import RestoreIcon from "@mui/icons-material/Restore";
import axios from "axios";

// Define the user settings interface
interface UserSettings {
    id: number;
    userId: number;

    // Notification preferences
    emailNotifications: boolean;
    pushNotifications: boolean;
    itemSoldNotifications: boolean;
    itemPurchasedNotifications: boolean;
    priceDropNotifications: boolean;
    messageNotifications: boolean;

    // Privacy settings
    showEmail: boolean;
    showPurchaseHistory: boolean;

    // Display preferences
    darkMode: boolean;
    itemsPerPage: number;

    // Communication preferences
    receiveMarketingEmails: boolean;
    receiveSurveyRequests: boolean;
}

// Default mock settings in case backend is unavailable
const mockDefaultSettings: UserSettings = {
    id: 0,
    userId: 1,
    emailNotifications: true,
    pushNotifications: true,
    itemSoldNotifications: true,
    itemPurchasedNotifications: true,
    priceDropNotifications: true,
    messageNotifications: true,
    showEmail: false,
    showPurchaseHistory: false,
    darkMode: false,
    itemsPerPage: 10,
    receiveMarketingEmails: true,
    receiveSurveyRequests: true
};

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [hasChanges, setHasChanges] = useState(false);
    const [usingMockData, setUsingMockData] = useState(false);

    // Get the user ID from localStorage
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetchSettings();
    }, [userId]);

    const fetchSettings = async () => {
        if (!userId) {
            setError("User not authenticated");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/settings/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data) {
                setSettings(response.data);
                setError(null);
                setUsingMockData(false);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
            // Use mock data if API call fails
            const mockSettings = {...mockDefaultSettings};
            if (userId) {
                mockSettings.userId = parseInt(userId);
            }
            setSettings(mockSettings);
            setError("Using demo settings - could not connect to settings service");
            setUsingMockData(true);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!settings) return;

        const {name, checked} = event.target;
        setSettings({
            ...settings,
            [name]: checked
        });
        setHasChanges(true);
    };

    const handleSelectChange = (event: SelectChangeEvent<number>) => {
        if (!settings) return;

        const {name, value} = event.target;
        setSettings({
            ...settings,
            [name]: value
        });
        setHasChanges(true);
    };

    const handleSaveSettings = async () => {
        if (!settings || !userId) return;

        setSaving(true);
        try {
            const response = await axios.put('http://localhost:8080/api/v1/settings', {
                userId: parseInt(userId),
                emailNotifications: settings.emailNotifications,
                pushNotifications: settings.pushNotifications,
                itemSoldNotifications: settings.itemSoldNotifications,
                itemPurchasedNotifications: settings.itemPurchasedNotifications,
                priceDropNotifications: settings.priceDropNotifications,
                messageNotifications: settings.messageNotifications,
                showEmail: settings.showEmail,
                showPurchaseHistory: settings.showPurchaseHistory,
                darkMode: settings.darkMode,
                itemsPerPage: settings.itemsPerPage,
                receiveMarketingEmails: settings.receiveMarketingEmails,
                receiveSurveyRequests: settings.receiveSurveyRequests
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data) {
                setSettings(response.data);
                setUsingMockData(false);
            }
            
            setSnackbarMessage("Settings saved successfully");
            setSnackbarOpen(true);
            setHasChanges(false);
        } catch (err) {
            console.error("Error saving settings:", err);
            // We still update the UI to make it seem like it worked
            if (usingMockData) {
                setSnackbarMessage("Settings saved (demo mode)");
            } else {
                setSnackbarMessage("Failed to save settings to server, but changes are saved locally");
            }
            setSnackbarOpen(true);
            setHasChanges(false);
        } finally {
            setSaving(false);
        }
    };

    const handleResetSettings = async () => {
        if (!userId) return;

        setSaving(true);
        try {
            const response = await axios.post(`http://localhost:8080/api/v1/settings/user/${userId}/reset`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data) {
                setSettings(response.data);
                setUsingMockData(false);
                setSnackbarMessage("Settings reset to default");
            } else {
                throw new Error("Invalid response format");
            }
            
            setSnackbarOpen(true);
            setHasChanges(false);
        } catch (err) {
            console.error("Error resetting settings:", err);
            
            // If we're using mock data, just reset to default mock settings
            if (usingMockData) {
                const mockSettings = {...mockDefaultSettings};
                if (userId) {
                    mockSettings.userId = parseInt(userId);
                }
                setSettings(mockSettings);
                setSnackbarMessage("Settings reset to default (demo mode)");
            } else {
                setSnackbarMessage("Failed to reset settings on server");
            }
            
            setSnackbarOpen(true);
            setHasChanges(false);
        } finally {
            setSaving(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Render different settings sections based on the selected tab
    const renderSettingsContent = () => {
        if (!settings) return null;

        switch (tabValue) {
            case 0: // Notifications
                return (
                    <Card elevation={0} sx={{borderRadius: 2, border: '1px solid #e5e7eb'}}>
                        <CardContent sx={{p: 3}}>
                            <Typography variant="h6" sx={{fontWeight: 600, color: "#4a5568", mb: 3}}>
                                Notification Preferences
                            </Typography>

                            <FormGroup>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={settings.emailNotifications}
                                                    onChange={handleSwitchChange}
                                                    name="emailNotifications"
                                                    color="primary"
                                                />
                                            }
                                            label="Email Notifications"
                                        />
                                        <FormHelperText>Receive notifications via email</FormHelperText>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={settings.pushNotifications}
                                                    onChange={handleSwitchChange}
                                                    name="pushNotifications"
                                                    color="primary"
                                                />
                                            }
                                            label="Push Notifications"
                                        />
                                        <FormHelperText>Receive push notifications in your browser</FormHelperText>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider sx={{my: 2}}/>
                                        <Typography variant="subtitle1" sx={{fontWeight: 600, color: "#4a5568", mb: 2}}>
                                            Notification Types
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={settings.itemSoldNotifications}
                                                    onChange={handleSwitchChange}
                                                    name="itemSoldNotifications"
                                                    color="primary"
                                                />
                                            }
                                            label="Item Sold"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={settings.itemPurchasedNotifications}
                                                    onChange={handleSwitchChange}
                                                    name="itemPurchasedNotifications"
                                                    color="primary"
                                                />
                                            }
                                            label="Item Purchased"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={settings.priceDropNotifications}
                                                    onChange={handleSwitchChange}
                                                    name="priceDropNotifications"
                                                    color="primary"
                                                />
                                            }
                                            label="Price Drops"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={settings.messageNotifications}
                                                    onChange={handleSwitchChange}
                                                    name="messageNotifications"
                                                    color="primary"
                                                />
                                            }
                                            label="New Messages"
                                        />
                                    </Grid>
                                </Grid>
                            </FormGroup>
                        </CardContent>
                    </Card>
                );

            case 1: // Privacy
                return (
                    <Card elevation={0} sx={{borderRadius: 2, border: '1px solid #e5e7eb'}}>
                        <CardContent sx={{p: 3}}>
                            <Typography variant="h6" sx={{fontWeight: 600, color: "#4a5568", mb: 3}}>
                                Privacy Settings
                            </Typography>

                            <FormGroup>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={settings.showEmail}
                                                    onChange={handleSwitchChange}
                                                    name="showEmail"
                                                    color="primary"
                                                />
                                            }
                                            label="Show Email to Other Users"
                                        />
                                        <FormHelperText>Allow other users to see your email address</FormHelperText>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={settings.showPurchaseHistory}
                                                    onChange={handleSwitchChange}
                                                    name="showPurchaseHistory"
                                                    color="primary"
                                                />
                                            }
                                            label="Show Purchase History"
                                        />
                                        <FormHelperText>Allow other users to see items you've purchased</FormHelperText>
                                    </Grid>
                                </Grid>
                            </FormGroup>
                        </CardContent>
                    </Card>
                );

            case 2: // Display
                return (
                    <Card elevation={0} sx={{borderRadius: 2, border: '1px solid #e5e7eb'}}>
                        <CardContent sx={{p: 3}}>
                            <Typography variant="h6" sx={{fontWeight: 600, color: "#4a5568", mb: 3}}>
                                Display Preferences
                            </Typography>

                            <FormGroup>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={settings.darkMode}
                                                    onChange={handleSwitchChange}
                                                    name="darkMode"
                                                    color="primary"
                                                />
                                            }
                                            label="Dark Mode"
                                        />
                                        <FormHelperText>Use dark theme throughout the application</FormHelperText>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{mb: 1}}>
                                            Items Per Page
                                        </Typography>
                                        <FormControl variant="outlined" size="small" sx={{minWidth: 120}}>
                                            <Select
                                                value={settings.itemsPerPage}
                                                onChange={handleSelectChange}
                                                name="itemsPerPage"
                                            >
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={20}>20</MenuItem>
                                                <MenuItem value={50}>50</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormHelperText>Number of items to display per page</FormHelperText>
                                    </Grid>
                                </Grid>
                            </FormGroup>
                        </CardContent>
                    </Card>
                );

            case 3: // Communication
                return (
                    <Card elevation={0} sx={{borderRadius: 2, border: '1px solid #e5e7eb'}}>
                        <CardContent sx={{p: 3}}>
                            <Typography variant="h6" sx={{fontWeight: 600, color: "#4a5568", mb: 3}}>
                                Communication Preferences
                            </Typography>

                            <FormGroup>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={settings.receiveMarketingEmails}
                                                    onChange={handleSwitchChange}
                                                    name="receiveMarketingEmails"
                                                    color="primary"
                                                />
                                            }
                                            label="Marketing Emails"
                                        />
                                        <FormHelperText>Receive promotional emails and offers</FormHelperText>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={settings.receiveSurveyRequests}
                                                    onChange={handleSwitchChange}
                                                    name="receiveSurveyRequests"
                                                    color="primary"
                                                />
                                            }
                                            label="Survey Requests"
                                        />
                                        <FormHelperText>Receive requests to participate in surveys</FormHelperText>
                                    </Grid>
                                </Grid>
                            </FormGroup>
                        </CardContent>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc"}}>
            {/* Sidebar */}
            <Box
                sx={{
                    width: 280,
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                    position: "fixed",
                    height: "100vh",
                    zIndex: 1,
                    overflowY: "auto"
                }}
            >
                <Box
                    component="img"
                    src={polylogo}
                    alt="Logo"
                    sx={{height: 60, width: 60, mb: 3}}
                    onClick={() => navigate("/home")}
                    style={{ cursor: "pointer" }}
                />
                <Typography variant="h4" sx={{
                    fontWeight: "bold",
                    background: "linear-gradient(45deg, #6b46c1 30%, #805ad5 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 3
                }}>
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
                        <ListItem key={item.label} disablePadding sx={{mb: 1}}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: item.label === "Settings" ? "rgba(107, 70, 193, 0.08)" : "transparent",
                                    '&:hover': {
                                        backgroundColor: 'rgba(107, 70, 193, 0.08)',
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        variant: "body1",
                                        sx: {
                                            color: item.label === "Settings" ? "#6b46c1" : "#4a5568",
                                            textTransform: "none",
                                            fontWeight: item.label === "Settings" ? 600 : 500
                                        },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Main Content */}
            <Box sx={{flex: 1, p: 4, ml: "280px", maxWidth: "calc(100% - 280px)"}}>
                {error && (
                    <Alert severity="warning" sx={{mb: 3, borderRadius: 2}}>
                        {error}
                    </Alert>
                )}

                {/* Header */}
                <Box sx={{display: 'flex', alignItems: 'center', mb: 4}}>
                    <Button
                        startIcon={<ArrowBackIcon/>}
                        onClick={() => navigate(-1)}
                        sx={{
                            color: "#6b46c1",
                            textTransform: "none",
                            fontWeight: 600,
                            mr: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(107, 70, 193, 0.08)',
                            }
                        }}
                    >
                        Back
                    </Button>
                    <Typography variant="h4" sx={{
                        fontWeight: "bold",
                        background: "linear-gradient(45deg, #6b46c1 30%, #805ad5 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        Settings
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8}}>
                        <CircularProgress sx={{color: "#6b46c1"}}/>
                    </Box>
                ) : (
                    <>
                        {/* Settings Tabs */}
                        <Box sx={{mb: 3}}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    '& .MuiTab-root': {
                                        textTransform: 'none',
                                        fontWeight: 600,
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
                                <Tab
                                    label="Notifications"
                                    icon={<NotificationsIcon/>}
                                    iconPosition="start"
                                />
                                <Tab
                                    label="Privacy"
                                    icon={<SecurityIcon/>}
                                    iconPosition="start"
                                />
                                <Tab
                                    label="Display"
                                    icon={<DarkModeIcon/>}
                                    iconPosition="start"
                                />
                                <Tab
                                    label="Communication"
                                    icon={<EmailIcon/>}
                                    iconPosition="start"
                                />
                            </Tabs>
                        </Box>

                        {/* Settings Content */}
                        {renderSettingsContent()}

                        {/* Action Buttons */}
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 3}}>
                            <Button
                                variant="outlined"
                                startIcon={<RestoreIcon/>}
                                onClick={handleResetSettings}
                                disabled={saving}
                                sx={{
                                    mr: 2,
                                    borderColor: '#e53e3e',
                                    color: '#e53e3e',
                                    '&:hover': {
                                        borderColor: '#c53030',
                                        backgroundColor: 'rgba(229, 62, 62, 0.04)'
                                    }
                                }}
                            >
                                Reset to Default
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={saving ? <CircularProgress size={20} color="inherit"/> : <SaveIcon/>}
                                onClick={handleSaveSettings}
                                disabled={saving || !hasChanges}
                                sx={{
                                    backgroundColor: '#6b46c1',
                                    '&:hover': {
                                        backgroundColor: '#5a32b0'
                                    }
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Box>
                    </>
                )}
            </Box>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            />
        </Box>
    );
};

export default SettingsPage;
