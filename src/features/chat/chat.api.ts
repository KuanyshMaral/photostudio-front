// ============================================================
// CHAT API SERVICE
// ============================================================

<<<<<<< HEAD
const RAW_API_URL = String(import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const API_BASE = RAW_API_URL
    ? (RAW_API_URL.endsWith('/api/v1') ? RAW_API_URL : `${RAW_API_URL}/api/v1`)
    : '/api/v1';

console.info('[Chat API] Resolved API_BASE:', API_BASE);

interface ErrorData {
    code?: string;
    message?: string;
}

interface ApiResponse<T> {
    success?: boolean;
    data?: T;
    error?: ErrorData;
    message?: string;
}
=======
const RAW_API_URL = String(import.meta.env.VITE_API_URL || 'http://89.35.125.136:8090/api/v1').replace(/\/+$/, '');
const API_BASE = RAW_API_URL.endsWith('/api/v1') ? RAW_API_URL : `${RAW_API_URL}/api/v1`;

console.info('[Chat API] Resolved API_BASE:', API_BASE);
>>>>>>> main

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

<<<<<<< HEAD
export interface CreateDirectRequest {
    recipient_id: number;
}

export interface CreateGroupRequest {
    name: string;
    member_ids?: number[];
}

export interface AddMemberRequest {
    user_id: number;
}

export interface SendMessageRequest {
    content?: string;
    upload_id?: string;
}

const RETRYABLE_STATUS = new Set([404, 405]);

function getErrorMessage(payload: unknown, fallback: string): string {
    const response = payload as ApiResponse<unknown>;
    return response?.error?.message || response?.message || fallback;
}

function unwrapData<T>(payload: unknown): T {
    const response = payload as ApiResponse<T>;
    if (response && typeof response === 'object' && 'data' in response) {
        return (response.data ?? {}) as T;
    }

    return payload as T;
}

async function parseJsonSafe(response: Response): Promise<unknown> {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

async function fetchWithFallback(
    urls: string[],
    init: RequestInit,
    fallbackMessage: string
): Promise<unknown> {
    let lastRetryPayload: unknown = null;

    for (const url of urls) {
        const response = await fetch(url, init);
        const payload = await parseJsonSafe(response);

        if (response.ok) {
            return payload;
        }

        if (RETRYABLE_STATUS.has(response.status)) {
            lastRetryPayload = payload;
            continue;
        }

        throw new Error(getErrorMessage(payload, fallbackMessage));
    }

    throw new Error(getErrorMessage(lastRetryPayload, fallbackMessage));
}

function normalizeConversation(raw: any): Conversation {
    const otherUser = raw?.other_user || raw?.otherUser || raw?.recipient || raw?.user || {};
    const lastMessage = raw?.last_message || raw?.lastMessage;

    return {
        id: Number(raw?.id || 0),
        other_user: {
            id: Number(otherUser?.id || 0),
            name: otherUser?.name || otherUser?.full_name || 'Unknown user',
            avatar: otherUser?.avatar || otherUser?.avatar_url,
            role: otherUser?.role,
        },
        studio: raw?.studio
            ? {
                id: Number(raw.studio.id || 0),
                name: raw.studio.name || 'Studio',
            }
            : undefined,
        booking: raw?.booking
            ? {
                id: Number(raw.booking.id || 0),
                start_time: raw.booking.start_time || '',
                status: raw.booking.status || '',
            }
            : undefined,
        last_message: lastMessage
            ? {
                id: Number(lastMessage.id || 0),
                content: lastMessage.content || '',
                is_mine: Boolean(lastMessage.is_mine),
                created_at: lastMessage.created_at || raw?.updated_at || raw?.created_at || '',
            }
            : undefined,
        unread_count: Number(raw?.unread_count ?? raw?.unread ?? 0),
        last_message_at: raw?.last_message_at || raw?.updated_at || raw?.created_at || new Date().toISOString(),
        created_at: raw?.created_at || raw?.last_message_at || new Date().toISOString(),
    };
}

function normalizeMessage(raw: any, conversationId?: number): Message {
    const sender = raw?.sender || raw?.user;
    const messageType = raw?.message_type || raw?.type || 'text';

    return {
        id: Number(raw?.id || 0),
        conversation_id: Number(raw?.conversation_id || raw?.room_id || conversationId || 0),
        sender_id: Number(raw?.sender_id || sender?.id || raw?.user_id || 0),
        content: raw?.content || '',
        message_type: messageType,
        attachment_url: raw?.attachment_url || raw?.image_url || raw?.file_url,
        is_read: Boolean(raw?.is_read),
        read_at: raw?.read_at,
        created_at: raw?.created_at || new Date().toISOString(),
        sender: sender
            ? {
                id: Number(sender.id || 0),
                name: sender.name || sender.full_name || 'Unknown user',
                avatar: sender.avatar || sender.avatar_url,
                role: sender.role,
            }
            : undefined,
    };
}

function normalizeConversationsResponse(payload: unknown): ConversationsResponse {
    const data = unwrapData<any>(payload);
    const rawConversations = Array.isArray(data)
        ? data
        : data?.conversations || data?.rooms || [];

    return {
        conversations: rawConversations.map(normalizeConversation),
    };
}

function normalizeMessagesResponse(payload: unknown, conversationId: number): MessagesResponse {
    const data = unwrapData<any>(payload);
    const rawMessages = Array.isArray(data)
        ? data
        : data?.messages || data?.items || [];

    return {
        messages: rawMessages.map((message: any) => normalizeMessage(message, conversationId)),
        has_more: Boolean(data?.has_more ?? data?.hasMore ?? false),
    };
}
=======
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
>>>>>>> main

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
<<<<<<< HEAD
    const payload = await fetchWithFallback(
        [
            `${API_BASE}/chat/conversations?limit=${limit}&offset=${offset}`,
            `${API_BASE}/chat/rooms?limit=${limit}&offset=${offset}`,
        ],
=======
    console.log('[Chat API] getConversations called with token:', token ? `${token.substring(0, 20)}...` : 'null');
    
    const response = await fetch(
        `${API_BASE}/chats?limit=${limit}&offset=${offset}`,
>>>>>>> main
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        'Failed to fetch conversations'
    );

<<<<<<< HEAD
    return normalizeConversationsResponse(payload);
=======
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
>>>>>>> main
}

/**
 * Создать новый диалог или получить существующий
 */
export async function createConversation(
    token: string,
    request: CreateConversationRequest
): Promise<{ conversation: Conversation; message?: Message }> {
<<<<<<< HEAD
    const payload = await fetchWithFallback(
        [
            `${API_BASE}/chat/conversations`,
            `${API_BASE}/chat/direct`,
        ],
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
=======
    // Assuming creating a direct chat room based on swagger
    const response = await fetch(`${API_BASE}/chats/direct`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
>>>>>>> main
        },
        'Failed to create conversation'
    );

    const data = unwrapData<any>(payload);
    const rawConversation = data?.conversation || data?.room || data;
    const rawMessage = data?.message;
    const normalizedConversation = normalizeConversation(rawConversation);

<<<<<<< HEAD
    return {
        conversation: normalizedConversation,
        message: rawMessage
            ? normalizeMessage(rawMessage, normalizedConversation.id)
            : undefined,
=======
    const json = await response.json();
    const rawConversation = json?.data?.conversation ?? json?.conversation ?? json?.data ?? json;

    return {
        conversation: normalizeConversation(rawConversation),
        message: json?.data?.message,
>>>>>>> main
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
<<<<<<< HEAD
    const before = beforeId ? `&before=${beforeId}` : '';
    const payload = await fetchWithFallback(
        [
            `${API_BASE}/chat/conversations/${conversationId}/messages?limit=${limit}${before}`,
            `${API_BASE}/chat/rooms/${conversationId}/messages?limit=${limit}${before}`,
        ],
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
=======
    let url = `${API_BASE}/chats/${conversationId}/messages?limit=${limit}`;
    if (beforeId) {
        url += `&before=${beforeId}`;
    }

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
>>>>>>> main
        },
        'Failed to fetch messages'
    );

<<<<<<< HEAD
    return normalizeMessagesResponse(payload, conversationId);
=======
    if (!response.ok) {
        throw new Error('Failed to fetch messages');
    }

    const json = await response.json();
    return normalizeMessagesPayload(json, conversationId);
>>>>>>> main
}

/**
 * Отправить сообщение
 */
export async function sendMessage(
    token: string,
    conversationId: string | number,
    content: string
): Promise<Message> {
<<<<<<< HEAD
    const payload = await fetchWithFallback(
        [
            `${API_BASE}/chat/conversations/${conversationId}/messages`,
            `${API_BASE}/chat/rooms/${conversationId}/messages`,
        ],
=======
    const response = await fetch(
        `${API_BASE}/chats/${conversationId}/messages`,
>>>>>>> main
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content } satisfies SendMessageRequest),
        },
        'Failed to send message'
    );

<<<<<<< HEAD
    const data = unwrapData<any>(payload);
    return normalizeMessage(data?.message || data, conversationId);
=======
    if (!response.ok) {
        throw new Error('Failed to send message');
    }

    const json = await response.json();
    const rawMessage = json?.data?.message ?? json?.message ?? json?.data ?? json;
    return normalizeMessage(rawMessage, conversationId);
>>>>>>> main
}

/**
 * Пометить сообщения как прочитанные
 */
export async function markAsRead(
    token: string,
    conversationId: string | number
): Promise<{ marked_count: number }> {
<<<<<<< HEAD
    const payload = await fetchWithFallback(
        [
            `${API_BASE}/chat/conversations/${conversationId}/read`,
            `${API_BASE}/chat/rooms/${conversationId}/read`,
        ],
=======
    const response = await fetch(
        `${API_BASE}/chats/${conversationId}/read`,
>>>>>>> main
        {
            method: 'POST', // Switched to POST based on swagger
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        'Failed to mark as read'
    );

    const data = unwrapData<any>(payload);
    return {
        marked_count: Number(data?.marked_count ?? data?.updated ?? 0),
    };
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

<<<<<<< HEAD
    const payload = await fetchWithFallback(
        [
            `${API_BASE}/chat/conversations/${conversationId}/messages/upload`,
            `${API_BASE}/chat/rooms/${conversationId}/messages/upload`,
        ],
=======
    const response = await fetch(
        `${API_BASE}/chats/${conversationId}/messages/upload`,
>>>>>>> main
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        },
        'Failed to upload image'
    );

<<<<<<< HEAD
    const data = unwrapData<any>(payload);
    return normalizeMessage(data?.message || data, conversationId);
}

export async function createDirectConversation(
    token: string,
    request: CreateDirectRequest
): Promise<{ conversation: Conversation; message?: Message }> {
    return createConversation(token, {
        recipient_id: request.recipient_id,
    });
}

export async function createGroupConversation(
    token: string,
    request: CreateGroupRequest
): Promise<{ conversation: Conversation }> {
    const payload = await fetchWithFallback(
        [`${API_BASE}/chat/groups`],
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        },
        'Failed to create group conversation'
    );

    const data = unwrapData<any>(payload);
    const rawConversation = data?.conversation || data?.group || data;

    return {
        conversation: normalizeConversation(rawConversation),
    };
}

export async function addConversationMember(
    token: string,
    conversationId: number,
    request: AddMemberRequest
): Promise<void> {
    await fetchWithFallback(
        [
            `${API_BASE}/chat/conversations/${conversationId}/members`,
            `${API_BASE}/chat/groups/${conversationId}/members`,
        ],
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        },
        'Failed to add conversation member'
    );
=======
    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    const json = await response.json();
    const rawMessage = json?.data?.message ?? json?.message ?? json?.data ?? json;
    return normalizeMessage(rawMessage, conversationId);
>>>>>>> main
}
