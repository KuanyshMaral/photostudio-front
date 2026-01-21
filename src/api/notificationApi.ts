const API_BASE = 'http://localhost:3001/api/v1';

export interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    data: any;
    created_at: string;
}

export const getNotifications = async (token: string): Promise<{ notifications: Notification[]; unread_count: number }> => {
    const response = await fetch(`${API_BASE}/notifications?limit=20`, {
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
