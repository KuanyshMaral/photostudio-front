// Re-export types from API for convenience
export type {
    UserBrief,
    StudioBrief,
    BookingBrief,
    MessageBrief,
    Conversation,
    Message,
    ConversationsResponse,
    MessagesResponse,
    CreateConversationRequest,
} from './chat.api';

// Import types for use in UI-specific types
import type {
    Conversation,
    Message,
} from './chat.api';

// Additional UI-specific types

export interface ChatState {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    messages: Message[];
    isLoading: boolean;
    error: string | null;
}

export interface TypingIndicator {
    conversationId: number;
    userId: number;
    isTyping: boolean;
}

// ============================================================
// WEBSOCKET MESSAGE TYPES
// ============================================================

// Базовый тип для всех WS сообщений
export interface WSMessage {
    type: string;
}

// CLIENT → SERVER

export interface WSSendMessage extends WSMessage {
    type: 'message';
    conversation_id: number;
    content: string;
}

export interface WSTypingMessage extends WSMessage {
    type: 'typing';
    conversation_id: number;
    is_typing: boolean;
}

export interface WSReadMessage extends WSMessage {
    type: 'read';
    conversation_id: number;
}

export interface WSPingMessage extends WSMessage {
    type: 'ping';
}

export type WSClientMessage = 
    | WSSendMessage 
    | WSTypingMessage 
    | WSReadMessage 
    | WSPingMessage;

// SERVER → CLIENT

export interface WSNewMessageEvent extends WSMessage {
    type: 'new_message';
    conversation_id: number;
    message: Message;
}

export interface WSTypingEvent extends WSMessage {
    type: 'typing';
    conversation_id: number;
    user_id: number;
    is_typing: boolean;
}

export interface WSReadEvent extends WSMessage {
    type: 'read';
    conversation_id: number;
    user_id: number;
}

export interface WSPongEvent extends WSMessage {
    type: 'pong';
}

export interface WSErrorEvent extends WSMessage {
    type: 'error';
    code: string;
    message: string;
}

export type WSServerMessage = 
    | WSNewMessageEvent 
    | WSTypingEvent 
    | WSReadEvent 
    | WSPongEvent 
    | WSErrorEvent;
