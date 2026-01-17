<<<<<<< HEAD
const API_BASE = '/api/v1';
=======
const API_BASE = 'http://localhost:3001/api/v1';
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410

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
<<<<<<< HEAD
        headers: {
            'Authorization': `Bearer ${token}`
        }
=======
        headers: { 'Authorization': `Bearer ${token}` }
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return (await response.json()).data;
};

export const markAsRead = async (token: string, id: number): Promise<void> => {
    await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PATCH',
<<<<<<< HEAD
        headers: {
            'Authorization': `Bearer ${token}`
        }
=======
        headers: { 'Authorization': `Bearer ${token}` }
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
    });
};

export const markAllAsRead = async (token: string): Promise<void> => {
    await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PATCH',
<<<<<<< HEAD
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};
=======
        headers: { 'Authorization': `Bearer ${token}` }
    });
};
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
