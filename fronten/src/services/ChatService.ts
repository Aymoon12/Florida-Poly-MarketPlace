import axios from 'axios';

// Types
export interface Conversation {
  id: number;
  itemId: number;
  itemTitle: string;
  itemImageUrl: string;
  buyerId: number;
  buyerName: string;
  sellerId: number;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
  unread: boolean;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  offerPrice?: number;
  meetupLocation?: string;
  meetupTime?: string;
}

export interface CreateConversationRequest {
  itemId: number;
  initialMessage: string;
  userId: number;
}

export interface SendMessageRequest {
  conversationId: number;
  content: string;
  offerPrice?: number;
  meetupLocation?: string;
  meetupTime?: string;
}

const BASE_URL = 'http://localhost:8080/api/v1/chat';

const ChatService = {
  // Get all conversations for a user
  getUserConversations: async (userId: string): Promise<Conversation[]> => {
    const response = await axios.get(`${BASE_URL}/conversations`, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Get a specific conversation
  getConversation: async (conversationId: number, userId: string): Promise<Conversation> => {
    const response = await axios.get(`${BASE_URL}/conversation/${conversationId}`, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId: number, userId: string): Promise<Message[]> => {
    const response = await axios.get(`${BASE_URL}/messages/${conversationId}`, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Start a new conversation
  startConversation: async (request: CreateConversationRequest): Promise<Conversation> => {
    const response = await axios.post(`${BASE_URL}/start`, request, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Send a message
  sendMessage: async (request: SendMessageRequest, userId: string): Promise<Message> => {
    const response = await axios.post(`${BASE_URL}/send`, request, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Mark a conversation as read
  markAsRead: async (conversationId: number, userId: string): Promise<void> => {
    await axios.post(`${BASE_URL}/mark-read/${conversationId}`, {}, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Get unread message count
  getUnreadCount: async (userId: string): Promise<number> => {
    const response = await axios.get(`${BASE_URL}/unread-count`, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  }
};

export default ChatService; 