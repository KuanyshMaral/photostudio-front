// ============================================================
// CHAT API SERVICE
// Все методы для работы с Chat API
// ============================================================

const API_BASE = '/api/v1';

// ============================================================
// TYPES
// ============================================================

export interface UserBrief {
    id: number;
    name: string;
    avatar?: string;
    role?: string;
}

export interface StudioBrief {
    id: number;
    name: string;
}

export interface BookingBrief {
    id: number;
    start_time: string;
    status: string;
}

export interface MessageBrief {
    id: number;
    content: string;
    is_mine: boolean;
    created_at: string;
}

export interface Conversation {
    id: number;
    other_user: UserBrief;
    studio?: StudioBrief;
    booking?: BookingBrief;
    last_message?: MessageBrief;
    unread_count: number;
    last_message_at: string;
    created_at: string;
}

export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    message_type: 'text' | 'image' | 'file' | 'system';
    attachment_url?: string;
    is_read: boolean;
    read_at?: string;
    created_at: string;
    sender?: UserBrief;
}

export interface ConversationsResponse {
    conversations: Conversation[];
}

export interface MessagesResponse {
    messages: Message[];
    has_more: boolean;
}

export interface CreateConversationRequest {
    recipient_id: number;
    studio_id?: number;
    booking_id?: number;
    initial_message?: string;
}

// ============================================================
// API METHODS
// ============================================================

/**
 * Получить список диалогов текущего пользователя
 */
export async function getConversations(
    token: string,
    limit = 20,
    offset = 0
): Promise<ConversationsResponse> {
    const response = await fetch(
        `${API_BASE}/chat/conversations?limit=${limit}&offset=${offset}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch conversations');
    }

    const json = await response.json();
    return json.data;
}

/**
 * Создать новый диалог или получить существующий
 */
export async function createConversation(
    token: string,
    request: CreateConversationRequest
): Promise<{ conversation: Conversation; message?: Message }> {
    const response = await fetch(`${API_BASE}/chat/conversations`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create conversation');
    }

    const json = await response.json();
    return json.data;
}

/**
 * Получить историю сообщений диалога
 */
export async function getMessages(
    token: string,
    conversationId: number,
    limit = 50,
    beforeId?: number
): Promise<MessagesResponse> {
    let url = `${API_BASE}/chat/conversations/${conversationId}/messages?limit=${limit}`;
    if (beforeId) {
        url += `&before=${beforeId}`;
    }

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch messages');
    }

    const json = await response.json();
    return json.data;
}

/**
 * Отправить сообщение
 */
export async function sendMessage(
    token: string,
    conversationId: number,
    content: string
): Promise<Message> {
    const response = await fetch(
        `${API_BASE}/chat/conversations/${conversationId}/messages`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to send message');
    }

    const json = await response.json();
    return json.data.message;
}

/**
 * Пометить сообщения как прочитанные
 */
export async function markAsRead(
    token: string,
    conversationId: number
): Promise<{ marked_count: number }> {
    const response = await fetch(
        `${API_BASE}/chat/conversations/${conversationId}/read`,
        {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to mark as read');
    }

    const json = await response.json();
    return json.data;
}

/**
 * Загрузить изображение в чат
 */
export async function uploadImage(
    token: string,
    conversationId: number,
    file: File
): Promise<Message> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(
        `${API_BASE}/chat/conversations/${conversationId}/messages/upload`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    const json = await response.json();
    return json.data.message;
}
