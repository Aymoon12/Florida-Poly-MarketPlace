import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Badge,
  CircularProgress,
} from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import { Conversation } from '../../services/ChatService';

interface ConversationsListProps {
  conversations: Conversation[];
  loading: boolean;
  onSelectConversation: (conversationId: number) => void;
  selectedConversationId?: number;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  loading,
  onSelectConversation,
  selectedConversationId,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      
      if (date.toDateString() === today.toDateString()) {
        // If today, show time
        return format(date, 'h:mm a');
      } else {
        // Otherwise show relative time
        return formatDistanceToNow(date, { addSuffix: true });
      }
    } catch (e) {
      return '';
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (conversations.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, p: 2 }}>
        <Typography color="text.secondary" align="center">
          No conversations yet. Start a conversation by messaging a seller from an item page.
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {conversations.map((conversation) => {
        const userId = localStorage.getItem('userId');
        const isCurrentUserBuyer = conversation.buyerId.toString() === userId;
        const otherUserName = isCurrentUserBuyer ? conversation.sellerName : conversation.buyerName;
        const isSelected = selectedConversationId === conversation.id;

        return (
          <React.Fragment key={conversation.id}>
            <ListItem
              alignItems="flex-start"
              onClick={() => onSelectConversation(conversation.id)}
              sx={{
                py: 2,
                px: 3,
                cursor: 'pointer',
                bgcolor: isSelected ? 'rgba(107, 70, 193, 0.08)' : 'transparent',
                '&:hover': {
                  bgcolor: isSelected ? 'rgba(107, 70, 193, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemAvatar>
                <Badge
                  color="primary"
                  variant="dot"
                  invisible={!conversation.unread}
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                  <Avatar sx={{ bgcolor: '#6b46c1' }}>
                    {otherUserName.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: conversation.unread ? 700 : 500 }}>
                      {otherUserName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(conversation.updatedAt)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        display: 'inline',
                        fontWeight: conversation.unread ? 600 : 400,
                        maxWidth: '85%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {conversation.lastMessage || 'No messages yet'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      {conversation.itemImageUrl && (
                        <Box
                          component="img"
                          src={conversation.itemImageUrl}
                          alt={conversation.itemTitle}
                          sx={{ width: 16, height: 16, borderRadius: 0.5, objectFit: 'cover', mr: 0.5 }}
                        />
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {conversation.itemTitle}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default ConversationsList; 