import React from 'react';
import { Box, Typography, Paper, Chip, Grid, Avatar } from '@mui/material';
import { format } from 'date-fns';
import { Message } from '../../services/ChatService';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  otherUserName: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser, otherUserName }) => {
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'h:mm a');
    } catch (e) {
      return '';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Grid container spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        {!isCurrentUser && (
          <Grid item>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#6b46c1' }}>
              {otherUserName.charAt(0).toUpperCase()}
            </Avatar>
          </Grid>
        )}
        <Grid item>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {isCurrentUser ? 'You' : otherUserName} • {formatTime(message.sentAt)}
          </Typography>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          maxWidth: '70%',
          borderRadius: 2,
          bgcolor: isCurrentUser ? '#6b46c1' : '#f3f4f6',
          color: isCurrentUser ? 'white' : 'text.primary',
        }}
      >
        <Typography variant="body1">{message.content}</Typography>

        {/* Price offer chip */}
        {message.offerPrice && (
          <Chip
            label={`Offer: $${message.offerPrice.toFixed(2)}`}
            sx={{
              mt: 1,
              bgcolor: isCurrentUser ? 'rgba(255,255,255,0.2)' : '#e9d8fd',
              color: isCurrentUser ? 'white' : '#6b46c1',
              fontWeight: 'bold',
            }}
          />
        )}

        {/* Meetup details */}
        {(message.meetupLocation || message.meetupTime) && (
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: isCurrentUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Proposed Meetup:
            </Typography>
            {message.meetupLocation && (
              <Typography variant="body2">
                Location: {message.meetupLocation}
              </Typography>
            )}
            {message.meetupTime && (
              <Typography variant="body2">
                Time: {format(new Date(message.meetupTime), 'PPp')}
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ChatMessage; 