import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  Hidden,
  Badge,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import ConversationsList from './components/chat/ConversationsList';
import ChatConversation from './components/chat/ChatConversation';
import ChatService, { Conversation } from './services/ChatService';
import { useNavigate } from 'react-router-dom';

const InboxPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    
    fetchConversations();
    
    // Poll for new conversations every 30 seconds
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
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
  };

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleBackToList = () => {
    setSelectedConversationId(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, height: 'calc(100vh - 80px)' }}>
      <Grid container spacing={0} sx={{ height: '100%' }}>
        {/* Mobile AppBar */}
        <Hidden mdUp>
          <AppBar position="static" color="default" elevation={0} sx={{ mb: 2 }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Messages
              </Typography>
              {selectedConversationId ? (
                <IconButton color="inherit" onClick={handleBackToList}>
                  <ArrowBackIcon />
                </IconButton>
              ) : (
                <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                  <Badge color="primary" variant="dot" invisible={!conversations.some(c => c.unread)}>
                    <MenuIcon />
                  </Badge>
                </IconButton>
              )}
            </Toolbar>
          </AppBar>
        </Hidden>

        {/* Conversations List - Desktop */}
        <Hidden mdDown>
          <Grid item md={4} lg={3} sx={{ height: '100%' }}>
            <Paper sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <ChatBubbleOutlineIcon sx={{ mr: 1 }} />
                  Messages
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ overflowY: 'auto', height: 'calc(100% - 57px)' }}>
                <ConversationsList
                  conversations={conversations}
                  loading={loading}
                  onSelectConversation={handleSelectConversation}
                  selectedConversationId={selectedConversationId || undefined}
                />
              </Box>
            </Paper>
          </Grid>
        </Hidden>

        {/* Conversations List - Mobile Drawer */}
        <Hidden mdUp>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{ '& .MuiDrawer-paper': { width: '80%', maxWidth: 300 } }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <ChatBubbleOutlineIcon sx={{ mr: 1 }} />
                Messages
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ overflowY: 'auto', height: 'calc(100% - 57px)' }}>
              <ConversationsList
                conversations={conversations}
                loading={loading}
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversationId || undefined}
              />
            </Box>
          </Drawer>
        </Hidden>

        {/* Chat Conversation Area */}
        <Grid item xs={12} md={8} lg={9} sx={{ height: '100%' }}>
          {selectedConversationId ? (
            <ChatConversation
              conversationId={selectedConversationId}
              onBack={isMobile ? handleBackToList : undefined}
            />
          ) : (
            <Paper
              sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: { xs: 0, md: 2 },
                p: 4,
                textAlign: 'center'
              }}
            >
              <Box>
                <ChatBubbleOutlineIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Your Messages
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {conversations.length > 0
                    ? 'Select a conversation to view messages'
                    : 'No conversations yet. Start chatting with sellers by visiting item listings.'}
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default InboxPage; 