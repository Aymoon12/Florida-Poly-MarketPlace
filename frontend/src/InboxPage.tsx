import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Drawer,
    Badge,
    Divider,
    useMediaQuery,
    useTheme,
    alpha,
    Chip,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import ConversationsList from './components/chat/ConversationsList';
import ChatConversation from './components/chat/ChatConversation';
import ChatService, { Conversation } from './services/ChatService';
import { useNavigate } from 'react-router-dom';
import { PageLayout, DashboardSidebar } from './components/layout';
import { EmptyState } from './components/common';
import { useWebSocket } from './hooks/useWebSocket';

const InboxPage: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [conversationsDrawerOpen, setConversationsDrawerOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

    // Handle conversation updates from WebSocket
    const handleConversationUpdate = useCallback((updatedConversation: Conversation) => {
        setConversations(prev => {
            const existingIndex = prev.findIndex(c => c.id === updatedConversation.id);
            if (existingIndex >= 0) {
                // Update existing conversation and move to top
                const updated = [...prev];
                updated.splice(existingIndex, 1);
                return [updatedConversation, ...updated];
            } else {
                // New conversation - add to top
                return [updatedConversation, ...prev];
            }
        });
    }, []);

    // Initialize WebSocket connection
    const { isConnected } = useWebSocket({
        onConversationUpdate: handleConversationUpdate,
        autoConnect: true,
    });

    const fetchConversations = useCallback(async () => {
        try {
            if (!userId) return;
            setLoading(true);
            const data = await ChatService.getUserConversations(userId);
            setConversations(data);

            // Select the first conversation by default if none is selected and there are conversations
            if (!selectedConversationId && data.length > 0) {
                setSelectedConversationId(data[0].id);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    }, [userId, selectedConversationId]);

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }

        fetchConversations();

        // Fallback polling only when WebSocket is disconnected (every 60 seconds)
        const interval = setInterval(() => {
            if (!isConnected) {
                fetchConversations();
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [userId, navigate, isConnected, fetchConversations]);

    const handleSelectConversation = (conversationId: number) => {
        setSelectedConversationId(conversationId);
        if (isMobile) {
            setConversationsDrawerOpen(false);
        }
    };

    const handleBackToList = () => {
        setSelectedConversationId(null);
    };

    return (
        <PageLayout variant="dashboard" showCategories={false} showFooter={false}>
            <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
                {/* Dashboard Sidebar */}
                <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <Box sx={{
                    flex: 1,
                    p: { xs: 2, md: 4 },
                    ml: { xs: 0, md: '260px' },
                    maxWidth: { md: 'calc(100% - 260px)' },
                }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                    Messages
                                </Typography>
                                <Chip
                                    icon={isConnected ? <WifiIcon /> : <WifiOffIcon />}
                                    label={isConnected ? 'Live' : 'Offline'}
                                    size="small"
                                    color={isConnected ? 'success' : 'default'}
                                    variant="outlined"
                                    sx={{ height: 24, '& .MuiChip-icon': { fontSize: 14 } }}
                                />
                            </Box>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                Chat with buyers and sellers
                            </Typography>
                        </Box>
                        {isMobile && (
                            <IconButton
                                onClick={() => setConversationsDrawerOpen(true)}
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                                    },
                                }}
                            >
                                <Badge color="primary" variant="dot" invisible={!conversations.some(c => c.unread)}>
                                    <MenuIcon />
                                </Badge>
                            </IconButton>
                        )}
                    </Box>

                    {/* Chat Container */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            height: 'calc(100vh - 200px)',
                            display: 'flex',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Conversations List - Desktop */}
                        {!isMobile && (
                            <Box
                                sx={{
                                    width: isSmallScreen ? 280 : 320,
                                    borderRight: `1px solid ${theme.palette.divider}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                                        <ChatBubbleOutlineIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        Conversations
                                    </Typography>
                                </Box>
                                <Box sx={{ overflowY: 'auto', flex: 1 }}>
                                    <ConversationsList
                                        conversations={conversations}
                                        loading={loading}
                                        onSelectConversation={handleSelectConversation}
                                        selectedConversationId={selectedConversationId || undefined}
                                    />
                                </Box>
                            </Box>
                        )}

                        {/* Conversations List - Mobile Drawer */}
                        <Drawer
                            anchor="left"
                            open={conversationsDrawerOpen}
                            onClose={() => setConversationsDrawerOpen(false)}
                            sx={{
                                '& .MuiDrawer-paper': {
                                    width: '85%',
                                    maxWidth: 360,
                                    borderRadius: '0 16px 16px 0',
                                }
                            }}
                        >
                            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                                    <ChatBubbleOutlineIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    Conversations
                                </Typography>
                            </Box>
                            <Box sx={{ overflowY: 'auto', flex: 1 }}>
                                <ConversationsList
                                    conversations={conversations}
                                    loading={loading}
                                    onSelectConversation={handleSelectConversation}
                                    selectedConversationId={selectedConversationId || undefined}
                                />
                            </Box>
                        </Drawer>

                        {/* Chat Conversation Area */}
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {selectedConversationId ? (
                                <ChatConversation
                                    conversationId={selectedConversationId}
                                    onBack={isMobile ? handleBackToList : undefined}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        flex: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        p: 4,
                                    }}
                                >
                                    <EmptyState
                                        type="messages"
                                        title="Your Messages"
                                        description={conversations.length > 0
                                            ? "Select a conversation to view messages"
                                            : "No conversations yet. Start chatting with sellers by visiting item listings."}
                                        actionLabel={conversations.length === 0 ? "Browse Items" : undefined}
                                        onAction={conversations.length === 0 ? () => navigate('/home') : undefined}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </PageLayout>
    );
};

export default InboxPage;
