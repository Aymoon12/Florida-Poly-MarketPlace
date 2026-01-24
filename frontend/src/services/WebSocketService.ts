import {Conversation, Message} from './ChatService';

type MessageCallback = (message: Message) => void;
type ConversationCallback = (conversation: Conversation) => void;
type ConnectionCallback = (connected: boolean) => void;

// Dynamically import STOMP client to avoid issues with SSR/module loading
type StompClient = import('@stomp/stompjs').Client;
type StompSubscription = import('@stomp/stompjs').StompSubscription;

const WS_URL = 'http://localhost:8080/ws';

class WebSocketService {
    private client: StompClient | null = null;
    private messageSubscription: StompSubscription | null = null;
    private conversationSubscription: StompSubscription | null = null;
    private messageCallbacks: Set<MessageCallback> = new Set();
    private conversationCallbacks: Set<ConversationCallback> = new Set();
    private connectionCallbacks: Set<ConnectionCallback> = new Set();
    private isConnected: boolean = false;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;

    async connect(): Promise<void> {
        if (this.client?.connected) {
            console.log('WebSocket already connected');
            return;
        }

        try {
            // Dynamic import to avoid module loading issues
            const {Client} = await import('@stomp/stompjs');

            this.client = new Client({
                // Use native WebSocket with SockJS URL format for fallback
                brokerURL: WS_URL.replace('http', 'ws') + '/websocket',
                // Authentication handled via HTTP-only cookies during handshake
                debug: (str) => {
                    console.log('STOMP: ' + str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    console.log('WebSocket connected');
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    this.notifyConnectionCallbacks(true);
                    this.subscribeToUserQueues();
                },
                onDisconnect: () => {
                    console.log('WebSocket disconnected');
                    this.isConnected = false;
                    this.notifyConnectionCallbacks(false);
                },
                onStompError: (frame) => {
                    console.error('STOMP error:', frame.headers['message']);
                    console.error('Additional details:', frame.body);
                },
                onWebSocketClose: () => {
                    console.log('WebSocket connection closed');
                    this.isConnected = false;
                    this.notifyConnectionCallbacks(false);

                    if (this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.reconnectAttempts++;
                        console.log(`Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
                    }
                },
            });

            this.client.activate();
        } catch (error) {
            console.error('Failed to initialize WebSocket client:', error);
        }
    }

    disconnect(): void {
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
            this.messageSubscription = null;
        }
        if (this.conversationSubscription) {
            this.conversationSubscription.unsubscribe();
            this.conversationSubscription = null;
        }
        if (this.client) {
            this.client.deactivate();
            this.client = null;
        }
        this.isConnected = false;
        this.notifyConnectionCallbacks(false);
    }

    private subscribeToUserQueues(): void {
        if (!this.client?.connected) {
            console.warn('Cannot subscribe: not connected');
            return;
        }

        // Subscribe to personal message queue
        this.messageSubscription = this.client.subscribe(
            '/user/queue/messages',
            (message) => {
                try {
                    const parsedMessage: Message = JSON.parse(message.body);
                    console.log('Received message via WebSocket:', parsedMessage);
                    this.notifyMessageCallbacks(parsedMessage);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            }
        );

        // Subscribe to conversation updates
        this.conversationSubscription = this.client.subscribe(
            '/user/queue/conversations',
            (message) => {
                try {
                    const conversation: Conversation = JSON.parse(message.body);
                    console.log('Received conversation update via WebSocket:', conversation);
                    this.notifyConversationCallbacks(conversation);
                } catch (error) {
                    console.error('Error parsing conversation:', error);
                }
            }
        );
    }

    sendMessage(conversationId: number, content: string, offerPrice?: number, meetupLocation?: string, meetupTime?: string): void {
        if (!this.client?.connected) {
            console.error('Cannot send message: not connected');
            return;
        }

        const request = {
            conversationId,
            content,
            offerPrice,
            meetupLocation,
            meetupTime,
        };

        this.client.publish({
            destination: '/app/chat.send',
            body: JSON.stringify(request),
        });
    }

    markAsRead(conversationId: number): void {
        if (!this.client?.connected) {
            console.error('Cannot mark as read: not connected');
            return;
        }

        this.client.publish({
            destination: '/app/chat.markRead',
            body: JSON.stringify(conversationId),
        });
    }

    // Callback registration methods
    onMessage(callback: MessageCallback): () => void {
        this.messageCallbacks.add(callback);
        return () => this.messageCallbacks.delete(callback);
    }

    onConversationUpdate(callback: ConversationCallback): () => void {
        this.conversationCallbacks.add(callback);
        return () => this.conversationCallbacks.delete(callback);
    }

    onConnectionChange(callback: ConnectionCallback): () => void {
        this.connectionCallbacks.add(callback);
        // Immediately notify of current state
        callback(this.isConnected);
        return () => this.connectionCallbacks.delete(callback);
    }

    private notifyMessageCallbacks(message: Message): void {
        this.messageCallbacks.forEach((callback) => {
            try {
                callback(message);
            } catch (error) {
                console.error('Error in message callback:', error);
            }
        });
    }

    private notifyConversationCallbacks(conversation: Conversation): void {
        this.conversationCallbacks.forEach((callback) => {
            try {
                callback(conversation);
            } catch (error) {
                console.error('Error in conversation callback:', error);
            }
        });
    }

    private notifyConnectionCallbacks(connected: boolean): void {
        this.connectionCallbacks.forEach((callback) => {
            try {
                callback(connected);
            } catch (error) {
                console.error('Error in connection callback:', error);
            }
        });
    }

    getConnectionStatus(): boolean {
        return this.isConnected;
    }
}

// Export singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
