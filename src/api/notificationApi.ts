const API_BASE = `${import.meta.env.VITE_API_URL}/api/v1`;

export interface Notification {
    id: number;
    user_id: number;
    type: string;
    title: string;
    body?: string;
    data?: any;
    is_read: boolean;
    read_at?: string;
    created_at: string;
}

export interface NotificationListResponse {
    notifications: Notification[];
    unread_count: number;
    total: number;
}

export const getNotifications = async (token: string, limit: number = 20, offset: number = 0): Promise<NotificationListResponse> => {
    const response = await fetch(`${API_BASE}/notifications?limit=${limit}&offset=${offset}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    const result = await response.json();
    return result.data;
};

export const markAsRead = async (token: string, id: number): Promise<void> => {
    await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

export const markAllAsRead = async (token: string): Promise<void> => {
    await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });
};
