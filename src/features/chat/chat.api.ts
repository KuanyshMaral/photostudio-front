// ============================================================
// CHAT API SERVICE
// ============================================================

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
    const payload = await fetchWithFallback(
        [
            `${API_BASE}/chat/conversations?limit=${limit}&offset=${offset}`,
            `${API_BASE}/chat/rooms?limit=${limit}&offset=${offset}`,
        ],
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        'Failed to fetch conversations'
    );

    return normalizeConversationsResponse(payload);
}

/**
 * Создать новый диалог или получить существующий
 */
export async function createConversation(
    token: string,
    request: CreateConversationRequest
): Promise<{ conversation: Conversation; message?: Message }> {
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
        },
        'Failed to create conversation'
    );

    const data = unwrapData<any>(payload);
    const rawConversation = data?.conversation || data?.room || data;
    const rawMessage = data?.message;
    const normalizedConversation = normalizeConversation(rawConversation);

    return {
        conversation: normalizedConversation,
        message: rawMessage
            ? normalizeMessage(rawMessage, normalizedConversation.id)
            : undefined,
    };
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
        },
        'Failed to fetch messages'
    );

    return normalizeMessagesResponse(payload, conversationId);
}

/**
 * Отправить сообщение
 */
export async function sendMessage(
    token: string,
    conversationId: number,
    content: string
): Promise<Message> {
    const payload = await fetchWithFallback(
        [
            `${API_BASE}/chat/conversations/${conversationId}/messages`,
            `${API_BASE}/chat/rooms/${conversationId}/messages`,
        ],
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

    const data = unwrapData<any>(payload);
    return normalizeMessage(data?.message || data, conversationId);
}

/**
 * Пометить сообщения как прочитанные
 */
export async function markAsRead(
    token: string,
    conversationId: number
): Promise<{ marked_count: number }> {
    const payload = await fetchWithFallback(
        [
            `${API_BASE}/chat/conversations/${conversationId}/read`,
            `${API_BASE}/chat/rooms/${conversationId}/read`,
        ],
        {
            method: 'PATCH',
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
    conversationId: number,
    file: File
): Promise<Message> {
    const formData = new FormData();
    formData.append('image', file);

    const payload = await fetchWithFallback(
        [
            `${API_BASE}/chat/conversations/${conversationId}/messages/upload`,
            `${API_BASE}/chat/rooms/${conversationId}/messages/upload`,
        ],
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        },
        'Failed to upload image'
    );

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
}
