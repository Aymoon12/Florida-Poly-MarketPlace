import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Grid,
  Typography
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SendIcon from '@mui/icons-material/Send';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { SendMessageRequest } from '../../services/ChatService';

interface MessageInputProps {
  conversationId: number;
  onSendMessage: (message: SendMessageRequest) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  onSendMessage,
  disabled = false,
  placeholder = "Type a message..."
}) => {
  const [message, setMessage] = useState('');
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [meetupDialogOpen, setMeetupDialogOpen] = useState(false);
  const [offerPrice, setOfferPrice] = useState<number | undefined>(undefined);
  const [meetupLocation, setMeetupLocation] = useState('');
  const [meetupTime, setMeetupTime] = useState<Date | null>(null);

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const messageRequest: SendMessageRequest = {
      conversationId,
      content: message
    };

    onSendMessage(messageRequest);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendOffer = () => {
    if (!offerPrice) return;

    const messageRequest: SendMessageRequest = {
      conversationId,
      content: `I'm offering $${offerPrice.toFixed(2)} for this item.`,
      offerPrice
    };

    onSendMessage(messageRequest);
    setOfferDialogOpen(false);
    setOfferPrice(undefined);
  };

  const handleSendMeetup = () => {
    if (!meetupLocation && !meetupTime) return;

    let content = 'I would like to meet up';
    if (meetupLocation) content += ` at ${meetupLocation}`;
    if (meetupTime) content += ` on ${meetupTime.toLocaleString()}`;
    content += '.';

    const messageRequest: SendMessageRequest = {
      conversationId,
      content,
      meetupLocation: meetupLocation || undefined,
      meetupTime: meetupTime ? meetupTime.toISOString() : undefined
    };

    onSendMessage(messageRequest);
    setMeetupDialogOpen(false);
    setMeetupLocation('');
    setMeetupTime(null);
  };

  return (
    <>
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={1}>
          <Grid item xs>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={placeholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled}
              multiline
              maxRows={4}
              size="small"
            />
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', height: '100%' }}>
              <IconButton 
                color="primary" 
                onClick={() => setOfferDialogOpen(true)}
                disabled={disabled}
                sx={{ mr: 1 }}
              >
                <AttachMoneyIcon />
              </IconButton>
              <IconButton 
                color="primary" 
                onClick={() => setMeetupDialogOpen(true)}
                disabled={disabled}
                sx={{ mr: 1 }}
              >
                <LocationOnIcon />
              </IconButton>
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={handleSendMessage}
                disabled={disabled || message.trim() === ''}
                sx={{ borderRadius: 2, bgcolor: '#6b46c1', '&:hover': { bgcolor: '#553c9a' } }}
              >
                Send
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Price Offer Dialog */}
      <Dialog open={offerDialogOpen} onClose={() => setOfferDialogOpen(false)}>
        <DialogTitle>Make a Price Offer</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Send a price offer to the seller. This will be visible in the chat and they can accept or decline.
          </Typography>
          <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
            <InputLabel htmlFor="offer-price">Offer Amount</InputLabel>
            <Input
              id="offer-price"
              type="number"
              value={offerPrice || ''}
              onChange={(e) => setOfferPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOfferDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSendOffer} 
            variant="contained" 
            disabled={!offerPrice}
            sx={{ bgcolor: '#6b46c1', '&:hover': { bgcolor: '#553c9a' } }}
          >
            Send Offer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Meetup Dialog */}
      <Dialog open={meetupDialogOpen} onClose={() => setMeetupDialogOpen(false)}>
        <DialogTitle>Propose a Meetup</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Suggest a location and time to meet for the item exchange.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="location"
            label="Meetup Location"
            fullWidth
            variant="standard"
            value={meetupLocation}
            onChange={(e) => setMeetupLocation(e.target.value)}
            sx={{ mb: 2 }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Meetup Time"
              value={meetupTime}
              onChange={(newValue: Date | null) => setMeetupTime(newValue)}
              slotProps={{ textField: { variant: 'standard', fullWidth: true } }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMeetupDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSendMeetup} 
            variant="contained" 
            disabled={!meetupLocation && !meetupTime}
            sx={{ bgcolor: '#6b46c1', '&:hover': { bgcolor: '#553c9a' } }}
          >
            Propose Meetup
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MessageInput; 