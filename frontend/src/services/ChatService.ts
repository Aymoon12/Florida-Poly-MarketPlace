import api from './api';

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
  userId?: string;
}

export interface SendMessageRequest {
  conversationId: number;
  content: string;
  offerPrice?: number;
  meetupLocation?: string;
  meetupTime?: string;
}

const ChatService = {
  // Get all conversations for current user
  getUserConversations: async (): Promise<Conversation[]> => {
    const response = await api.get('/api/v1/chat/conversations');
    return response.data;
  },

  // Get a specific conversation
  getConversation: async (conversationId: number): Promise<Conversation> => {
    const response = await api.get(`/api/v1/chat/conversation/${conversationId}`);
    return response.data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId: number): Promise<Message[]> => {
    const response = await api.get(`/api/v1/chat/messages/${conversationId}`);
    return response.data;
  },

  // Start a new conversation
  startConversation: async (request: CreateConversationRequest): Promise<Conversation> => {
    const response = await api.post('/api/v1/chat/start', request);
    return response.data;
  },

  // Send a message
  sendMessage: async (request: SendMessageRequest): Promise<Message> => {
    const response = await api.post('/api/v1/chat/send', request);
    return response.data;
  },

  // Mark a conversation as read
  markAsRead: async (conversationId: number): Promise<void> => {
    await api.post(`/api/v1/chat/mark-read/${conversationId}`);
  },

  // Get unread message count
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/api/v1/chat/unread-count');
    return response.data;
  }
};

export default ChatService; 