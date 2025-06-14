import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import { Conversation, Message, SendMessageRequest } from '../../services/ChatService';
import ChatService from '../../services/ChatService';

interface ChatConversationProps {
  conversationId: number;
  onBack?: () => void;
}

const ChatConversation: React.FC<ChatConversationProps> = ({ conversationId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchConversation();
    fetchMessages();

    // Mark conversation as read when opened
    if (userId) {
      ChatService.markAsRead(conversationId, userId);
    }

    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversation = async () => {
    try {
      if (!userId) return;
      const data = await ChatService.getConversation(conversationId, userId);
      setConversation(data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      if (!userId) return;
      setLoading(true);
      const data = await ChatService.getMessages(conversationId, userId);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (messageRequest: SendMessageRequest) => {
    try {
      if (!userId) return;
      setSending(true);
      const newMessage = await ChatService.sendMessage(messageRequest, userId);
      setMessages([...messages, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!conversation && loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Determine the other user
  const isCurrentUserBuyer = conversation?.buyerId.toString() === userId;
  const otherUserName = isCurrentUserBuyer ? conversation?.sellerName : conversation?.buyerName;
  const otherUserId = isCurrentUserBuyer ? conversation?.sellerId : conversation?.buyerId;

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 0, overflow: 'hidden' }}>
      {/* Conversation header */}
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          {onBack && (
            <IconButton edge="start" color="inherit" onClick={onBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Avatar sx={{ bgcolor: '#6b46c1', mr: 2 }}>
            {otherUserName?.charAt(0).toUpperCase() || '?'}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
              {otherUserName || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isCurrentUserBuyer ? 'Seller' : 'Buyer'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              icon={<ShoppingBagIcon />}
              label="View Item"
              clickable
              onClick={() => window.open(`/item/${conversation?.itemId}`, '_blank')}
              sx={{ bgcolor: '#f3f4f6', fontWeight: 500 }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Item info */}
      <Box sx={{ p: 2, bgcolor: '#f9fafb', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {conversation?.itemImageUrl && (
            <Box
              component="img"
              src={conversation.itemImageUrl}
              alt={conversation.itemTitle}
              sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover', mr: 2 }}
            />
          )}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {conversation?.itemTitle || 'Item'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You are {isCurrentUserBuyer ? 'buying' : 'selling'} this item
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Messages container */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: '#f9fafb',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {loading && messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isCurrentUser={message.senderId.toString() === userId}
                otherUserName={otherUserName || 'User'}
              />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message input */}
      <MessageInput
        conversationId={conversationId}
        onSendMessage={handleSendMessage}
        disabled={sending}
        placeholder={sending ? 'Sending...' : 'Type a message...'}
      />
    </Paper>
  );
};

export default ChatConversation; 