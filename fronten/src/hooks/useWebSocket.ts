import { useEffect, useState, useCallback, useRef } from 'react';
import webSocketService from '../services/WebSocketService';
import { Message, Conversation } from '../services/ChatService';

interface UseWebSocketOptions {
  onMessage?: (message: Message) => void;
  onConversationUpdate?: (conversation: Conversation) => void;
  autoConnect?: boolean;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (
    conversationId: number,
    content: string,
    offerPrice?: number,
    meetupLocation?: string,
    meetupTime?: string
  ) => void;
  markAsRead: (conversationId: number) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const { onMessage, onConversationUpdate, autoConnect = true } = options;
  const [isConnected, setIsConnected] = useState(webSocketService.getConnectionStatus());

  // Use refs to avoid stale closures
  const onMessageRef = useRef(onMessage);
  const onConversationUpdateRef = useRef(onConversationUpdate);

  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onConversationUpdateRef.current = onConversationUpdate;
  }, [onConversationUpdate]);

  const connect = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await webSocketService.connect(token);
    } else {
      console.warn('Cannot connect WebSocket: no token found');
    }
  }, []);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
  }, []);

  const sendMessage = useCallback(
    (
      conversationId: number,
      content: string,
      offerPrice?: number,
      meetupLocation?: string,
      meetupTime?: string
    ) => {
      webSocketService.sendMessage(conversationId, content, offerPrice, meetupLocation, meetupTime);
    },
    []
  );

  const markAsRead = useCallback((conversationId: number) => {
    webSocketService.markAsRead(conversationId);
  }, []);

  useEffect(() => {
    // Subscribe to connection status changes
    const unsubscribeConnection = webSocketService.onConnectionChange(setIsConnected);

    // Subscribe to messages
    const unsubscribeMessage = webSocketService.onMessage((message) => {
      if (onMessageRef.current) {
        onMessageRef.current(message);
      }
    });

    // Subscribe to conversation updates
    const unsubscribeConversation = webSocketService.onConversationUpdate((conversation) => {
      if (onConversationUpdateRef.current) {
        onConversationUpdateRef.current(conversation);
      }
    });

    // Auto-connect if enabled and not already connected
    if (autoConnect && !webSocketService.getConnectionStatus()) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      unsubscribeConnection();
      unsubscribeMessage();
      unsubscribeConversation();
    };
  }, [autoConnect, connect]);

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    markAsRead,
  };
}

export default useWebSocket;
