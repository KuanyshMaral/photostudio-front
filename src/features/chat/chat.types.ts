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
