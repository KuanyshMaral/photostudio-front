const API_BASE = '/api/v1';

export interface Statistics {
    total_users: number;
    total_studios: number;
    total_bookings: number;
    pending_studios: number;
    today_bookings: number;
}

export interface PendingStudio {
    id: number;
    name: string;
    address: string;
    city: string;
    owner_name: string;
    owner_email: string;
    created_at: string;
}

export const getStatistics = async (token: string): Promise<Statistics> => {
    const response = await fetch(`${API_BASE}/admin/statistics`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch statistics');
    const json = await response.json();
    return json.data;
};

export const getPendingStudios = async (token: string): Promise<PendingStudio[]> => {
    const response = await fetch(`${API_BASE}/admin/studios/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch pending studios');
    const json = await response.json();
    return json.data?.studios || [];
};

export const verifyStudio = async (token: string, studioId: number, notes?: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/admin/studios/${studioId}/verify`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ admin_notes: notes || '' })
    });
    if (!response.ok) throw new Error('Failed to verify studio');
};

export const rejectStudio = async (token: string, studioId: number, reason: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/admin/studios/${studioId}/reject`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Failed to reject studio');
};
