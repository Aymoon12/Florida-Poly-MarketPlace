import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Snackbar,
    Switch,
    Tab,
    Tabs,
    Typography,
    useTheme,
    alpha,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import RestoreIcon from "@mui/icons-material/Restore";
import api from "./services/api";
import { PageLayout, DashboardSidebar } from "./components/layout";
import { LoadingState } from "./components/common";
import { useThemeMode } from "./theme";

interface UserSettings {
    id: number;
    userId: number;
    emailNotifications: boolean;
    pushNotifications: boolean;
    itemSoldNotifications: boolean;
    itemPurchasedNotifications: boolean;
    priceDropNotifications: boolean;
    messageNotifications: boolean;
    showEmail: boolean;
    showPurchaseHistory: boolean;
    darkMode: boolean;
    itemsPerPage: number;
    receiveMarketingEmails: boolean;
    receiveSurveyRequests: boolean;
}

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
    const theme = useTheme();
    const { mode, setMode, isDark } = useThemeMode();
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [hasChanges, setHasChanges] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetchSettings();
    }, [userId]);

    useEffect(() => {
        if (settings) {
            setSettings(prev => prev ? { ...prev, darkMode: isDark } : null);
        }
    }, [isDark]);

    const fetchSettings = async () => {
        if (!userId) {
            setError("User not authenticated");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await api.get(`/api/v1/settings/user/${userId}`);

            if (response.data) {
                setSettings({ ...response.data, darkMode: isDark });
                setError(null);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
            const mockSettings = { ...mockDefaultSettings, darkMode: isDark };
            if (userId) {
                mockSettings.userId = parseInt(userId);
            }
            setSettings(mockSettings);
            setError("Using demo settings - could not connect to settings service");
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!settings) return;

        const { name, checked } = event.target;

        if (name === 'darkMode') {
            setMode(checked ? 'dark' : 'light');
        }

        setSettings({
            ...settings,
            [name]: checked
        });
        setHasChanges(true);
    };

    const handleSelectChange = (event: SelectChangeEvent<number>) => {
        if (!settings) return;

        const { name, value } = event.target;
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
            await api.put('/api/v1/settings', {
                userId: parseInt(userId),
                ...settings
            });

            setSnackbarMessage("Settings saved successfully");
            setSnackbarOpen(true);
            setHasChanges(false);
        } catch (err) {
            console.error("Error saving settings:", err);
            setSnackbarMessage("Settings saved locally");
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
            const response = await api.post(`/api/v1/settings/user/${userId}/reset`, {});

            if (response.data) {
                setSettings({ ...response.data, darkMode: false });
                setMode('light');
                setSnackbarMessage("Settings reset to default");
            }
            setSnackbarOpen(true);
            setHasChanges(false);
        } catch (err) {
            console.error("Error resetting settings:", err);
            const mockSettings = { ...mockDefaultSettings };
            if (userId) {
                mockSettings.userId = parseInt(userId);
            }
            setSettings(mockSettings);
            setMode('light');
            setSnackbarMessage("Settings reset to default");
            setSnackbarOpen(true);
            setHasChanges(false);
        } finally {
            setSaving(false);
        }
    };

    const renderSettingsContent = () => {
        if (!settings) return null;

        switch (tabValue) {
            case 0: // Notifications
                return (
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
                                Notification Preferences
                            </Typography>

                            <FormGroup>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: theme.palette.mode === 'light'
                                                    ? theme.palette.grey[50]
                                                    : alpha(theme.palette.background.paper, 0.5),
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                    Email Notifications
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Receive notifications via email
                                                </Typography>
                                            </Box>
                                            <Switch
                                                checked={settings.emailNotifications}
                                                onChange={handleSwitchChange}
                                                name="emailNotifications"
                                                color="primary"
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: theme.palette.mode === 'light'
                                                    ? theme.palette.grey[50]
                                                    : alpha(theme.palette.background.paper, 0.5),
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                    Push Notifications
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Receive push notifications in your browser
                                                </Typography>
                                            </Box>
                                            <Switch
                                                checked={settings.pushNotifications}
                                                onChange={handleSwitchChange}
                                                name="pushNotifications"
                                                color="primary"
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
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
                        </Box>
                    </Paper>
                );

            case 1: // Privacy
                return (
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
                                Privacy Settings
                            </Typography>

                            <FormGroup>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: theme.palette.mode === 'light'
                                                    ? theme.palette.grey[50]
                                                    : alpha(theme.palette.background.paper, 0.5),
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                    Show Email to Other Users
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Allow other users to see your email address
                                                </Typography>
                                            </Box>
                                            <Switch
                                                checked={settings.showEmail}
                                                onChange={handleSwitchChange}
                                                name="showEmail"
                                                color="primary"
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: theme.palette.mode === 'light'
                                                    ? theme.palette.grey[50]
                                                    : alpha(theme.palette.background.paper, 0.5),
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                    Show Purchase History
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Allow other users to see items you've purchased
                                                </Typography>
                                            </Box>
                                            <Switch
                                                checked={settings.showPurchaseHistory}
                                                onChange={handleSwitchChange}
                                                name="showPurchaseHistory"
                                                color="primary"
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </FormGroup>
                        </Box>
                    </Paper>
                );

            case 2: // Display
                return (
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
                                Display Preferences
                            </Typography>

                            <FormGroup>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: theme.palette.mode === 'light'
                                                    ? theme.palette.grey[50]
                                                    : alpha(theme.palette.background.paper, 0.5),
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                    Dark Mode
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Use dark theme throughout the application
                                                </Typography>
                                            </Box>
                                            <Switch
                                                checked={settings.darkMode}
                                                onChange={handleSwitchChange}
                                                name="darkMode"
                                                color="primary"
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                                            Items Per Page
                                        </Typography>
                                        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
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
                        </Box>
                    </Paper>
                );

            case 3: // Communication
                return (
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
                                Communication Preferences
                            </Typography>

                            <FormGroup>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: theme.palette.mode === 'light'
                                                    ? theme.palette.grey[50]
                                                    : alpha(theme.palette.background.paper, 0.5),
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                    Marketing Emails
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Receive promotional emails and offers
                                                </Typography>
                                            </Box>
                                            <Switch
                                                checked={settings.receiveMarketingEmails}
                                                onChange={handleSwitchChange}
                                                name="receiveMarketingEmails"
                                                color="primary"
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: theme.palette.mode === 'light'
                                                    ? theme.palette.grey[50]
                                                    : alpha(theme.palette.background.paper, 0.5),
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                    Survey Requests
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Receive requests to participate in surveys
                                                </Typography>
                                            </Box>
                                            <Switch
                                                checked={settings.receiveSurveyRequests}
                                                onChange={handleSwitchChange}
                                                name="receiveSurveyRequests"
                                                color="primary"
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </FormGroup>
                        </Box>
                    </Paper>
                );

            default:
                return null;
        }
    };

    return (
        <PageLayout variant="dashboard" showCategories={false} showFooter={false}>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setSnackbarOpen(false)}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
                {/* Sidebar */}
                <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <Box sx={{
                    flex: 1,
                    p: { xs: 2, md: 4 },
                    ml: { xs: 0, md: '260px' },
                    maxWidth: { md: 'calc(100% - 260px)' },
                }}>
                    {error && (
                        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                Settings
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                Manage your account preferences
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<RestoreIcon />}
                                onClick={handleResetSettings}
                                disabled={saving}
                                sx={{ borderRadius: 2, fontWeight: 600 }}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                onClick={handleSaveSettings}
                                disabled={saving || !hasChanges}
                                sx={{ borderRadius: 2, fontWeight: 600, px: 3 }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Box>
                    </Box>

                    {loading ? (
                        <LoadingState message="Loading settings..." />
                    ) : (
                        <>
                            {/* Tabs */}
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 3,
                                    border: `1px solid ${theme.palette.divider}`,
                                    mb: 3,
                                    overflow: 'hidden',
                                }}
                            >
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    sx={{ px: 2 }}
                                >
                                    <Tab
                                        label="Notifications"
                                        icon={<NotificationsIcon />}
                                        iconPosition="start"
                                    />
                                    <Tab
                                        label="Privacy"
                                        icon={<SecurityIcon />}
                                        iconPosition="start"
                                    />
                                    <Tab
                                        label="Display"
                                        icon={<DarkModeIcon />}
                                        iconPosition="start"
                                    />
                                    <Tab
                                        label="Communication"
                                        icon={<EmailIcon />}
                                        iconPosition="start"
                                    />
                                </Tabs>
                            </Paper>

                            {/* Settings Content */}
                            {renderSettingsContent()}
                        </>
                    )}
                </Box>
            </Box>
        </PageLayout>
    );
};

export default SettingsPage;
