// ============================================================
// CHAT API SERVICE
// Все методы для работы с Chat API
// ============================================================

const RAW_API_URL = String(import.meta.env.VITE_API_URL || 'http://89.35.125.136:8090/api/v1').replace(/\/+$/, '');
const API_BASE = RAW_API_URL.endsWith('/api/v1') ? RAW_API_URL : `${RAW_API_URL}/api/v1`;

console.info('[Chat API] Resolved API_BASE:', API_BASE);

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
    id: string | number;
    other_user: UserBrief;
    studio?: StudioBrief;
    booking?: BookingBrief;
    last_message?: MessageBrief;
    unread_count: number;
    last_message_at: string;
    created_at: string;
}

export interface Message {
    id: string | number;
    conversation_id: string | number;
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

const toIsoString = (value: unknown): string => {
    if (typeof value === 'string' && value.trim()) {
        return value;
    }
    return new Date().toISOString();
};

const resolveConversationId = (raw: any): string | number => {
    const candidate = raw?.id ?? raw?.chat_room_id ?? raw?.room_id ?? raw?.chat_id;

    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
        return candidate;
    }

    if (typeof candidate === 'string') {
        const trimmed = candidate.trim();
        if (trimmed) {
            return trimmed;
        }
    }

    return '';
};

const getOtherUserName = (raw: any): string => {
    return (
        raw?.other_user?.name ||
        raw?.otherUser?.name ||
        raw?.recipient?.name ||
        raw?.user?.name ||
        raw?.participant?.name ||
        raw?.owner_name ||
        raw?.name ||
        'Unknown user'
    );
};

const normalizeConversation = (raw: any): Conversation => {
    const fallbackLastMessageAt =
        raw?.last_message?.created_at || raw?.updated_at || raw?.created_at;

    return {
        id: resolveConversationId(raw),
        other_user: {
            id: Number(
                raw?.other_user?.id ??
                raw?.otherUser?.id ??
                raw?.recipient?.id ??
                raw?.user?.id ??
                raw?.participant?.id ??
                raw?.other_user_id ??
                raw?.recipient_id ??
                0
            ),
            name: getOtherUserName(raw),
            avatar:
                raw?.other_user?.avatar ||
                raw?.other_user?.avatar_url ||
                raw?.otherUser?.avatar ||
                raw?.recipient?.avatar ||
                raw?.user?.avatar ||
                undefined,
            role:
                raw?.other_user?.role ||
                raw?.otherUser?.role ||
                raw?.recipient?.role ||
                raw?.user?.role ||
                undefined,
        },
        studio: raw?.studio
            ? {
                  id: Number(raw.studio.id ?? raw.studio_id ?? 0),
                  name: String(raw.studio.name ?? raw.studio_name ?? 'Studio'),
              }
            : raw?.studio_id
            ? {
                  id: Number(raw.studio_id),
                  name: String(raw?.studio_name ?? 'Studio'),
              }
            : undefined,
        booking: raw?.booking
            ? {
                  id: Number(raw.booking.id ?? raw.booking_id ?? 0),
                  start_time: toIsoString(raw.booking.start_time),
                  status: String(raw.booking.status ?? 'unknown'),
              }
            : undefined,
        last_message: raw?.last_message
            ? {
                  id: Number(raw.last_message.id ?? 0),
                  content: String(raw.last_message.content ?? ''),
                  is_mine: Boolean(raw.last_message.is_mine),
                  created_at: toIsoString(raw.last_message.created_at),
              }
            : undefined,
        unread_count: Number(raw?.unread_count ?? raw?.unread ?? 0),
        last_message_at: toIsoString(raw?.last_message_at ?? fallbackLastMessageAt),
        created_at: toIsoString(raw?.created_at),
    };
};

const resolveMessageId = (raw: any): string | number => {
    const candidate = raw?.id ?? raw?.message_id ?? raw?.uuid ?? raw?._id;

    if (typeof candidate === 'number' && Number.isFinite(candidate) && candidate > 0) {
        return candidate;
    }

    if (typeof candidate === 'string') {
        const trimmed = candidate.trim();
        if (trimmed) {
            return trimmed;
        }
    }

    return `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const normalizeMessage = (raw: any, fallbackConversationId: string | number): Message => {
    const source = raw && typeof raw === 'object' ? raw : {};
    const senderId = Number(source?.sender_id ?? source?.sender?.id ?? source?.user_id ?? 0);
    const rawType = String(source?.message_type ?? '').toLowerCase();

    let messageType: Message['message_type'] = 'text';
    if (rawType === 'image' || rawType === 'file' || rawType === 'system') {
        messageType = rawType;
    }

    return {
        id: resolveMessageId(source),
        conversation_id: source?.conversation_id ?? source?.chat_room_id ?? fallbackConversationId,
        sender_id: Number.isFinite(senderId) ? senderId : 0,
        content: String(source?.content ?? source?.text ?? source?.message ?? ''),
        message_type: messageType,
        attachment_url: source?.attachment_url ?? source?.image_url ?? source?.file_url,
        is_read: Boolean(source?.is_read),
        read_at: typeof source?.read_at === 'string' ? source.read_at : undefined,
        created_at: toIsoString(source?.created_at),
        sender: source?.sender
            ? {
                  id: Number(source.sender.id ?? 0),
                  name: String(source.sender.name ?? 'Unknown user'),
                  avatar: source.sender.avatar,
                  role: source.sender.role,
              }
            : undefined,
    };
};

const normalizeMessagesPayload = (
    payload: any,
    conversationId: string | number
): MessagesResponse => {
    const rawMessages = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.messages)
        ? payload.data.messages
        : Array.isArray(payload?.messages)
        ? payload.messages
        : [];

    const messages = rawMessages
        .map((message: any) => normalizeMessage(message, conversationId))
        .filter((message: Message) => Boolean(message?.id));

    const hasMore = Boolean(payload?.data?.has_more ?? payload?.has_more ?? false);

    return {
        messages,
        has_more: hasMore,
    };
};

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
    console.log('[Chat API] getConversations called with token:', token ? `${token.substring(0, 20)}...` : 'null');
    
    const response = await fetch(
        `${API_BASE}/chats?limit=${limit}&offset=${offset}`,
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
    const rawConversations = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.data?.conversations)
        ? json.data.conversations
        : Array.isArray(json?.conversations)
        ? json.conversations
        : [];

    const normalizedConversations = rawConversations
        .map(normalizeConversation)
        .filter((conversation: Conversation) => String(conversation.id).trim().length > 0);

    return {
        conversations: normalizedConversations,
    };
}

/**
 * Создать новый диалог или получить существующий
 */
export async function createConversation(
    token: string,
    request: CreateConversationRequest
): Promise<{ conversation: Conversation; message?: Message }> {
    // Assuming creating a direct chat room based on swagger
    const response = await fetch(`${API_BASE}/chats/direct`, {
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
    const rawConversation = json?.data?.conversation ?? json?.conversation ?? json?.data ?? json;

    return {
        conversation: normalizeConversation(rawConversation),
        message: json?.data?.message,
    };
}

/**
 * Получить историю сообщений диалога
 */
export async function getMessages(
    token: string,
    conversationId: string | number,
    limit = 50,
    beforeId?: number
): Promise<MessagesResponse> {
    let url = `${API_BASE}/chats/${conversationId}/messages?limit=${limit}`;
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
    return normalizeMessagesPayload(json, conversationId);
}

/**
 * Отправить сообщение
 */
export async function sendMessage(
    token: string,
    conversationId: string | number,
    content: string
): Promise<Message> {
    const response = await fetch(
        `${API_BASE}/chats/${conversationId}/messages`,
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
    const rawMessage = json?.data?.message ?? json?.message ?? json?.data ?? json;
    return normalizeMessage(rawMessage, conversationId);
}

/**
 * Пометить сообщения как прочитанные
 */
export async function markAsRead(
    token: string,
    conversationId: string | number
): Promise<{ marked_count: number }> {
    const response = await fetch(
        `${API_BASE}/chats/${conversationId}/read`,
        {
            method: 'POST', // Switched to POST based on swagger
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
    conversationId: string | number,
    file: File
): Promise<Message> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(
        `${API_BASE}/chats/${conversationId}/messages/upload`,
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
    const rawMessage = json?.data?.message ?? json?.message ?? json?.data ?? json;
    return normalizeMessage(rawMessage, conversationId);
}
