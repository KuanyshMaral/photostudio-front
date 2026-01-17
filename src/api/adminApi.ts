const API_BASE = '/api/v1';

export const getPendingStudios = async (token: string) => {
    const response = await fetch(`${API_BASE}/admin/studios/pending`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch');
    return (await response.json()).data;
};

export const verifyStudio = async (token: string, studioId: number, notes?: string) => {
    const response = await fetch(`${API_BASE}/admin/studios/${studioId}/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ admin_notes: notes }),
    });
    if (!response.ok) throw new Error('Failed to verify');
    return (await response.json()).data;
};

export const rejectStudio = async (token: string, studioId: number, reason: string) => {
    const response = await fetch(`${API_BASE}/admin/studios/${studioId}/reject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
    });
    if (!response.ok) throw new Error('Failed to reject');
    return (await response.json()).data;
};

export const getStatistics = async (token: string) => {
    const response = await fetch(`${API_BASE}/admin/statistics`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch');
    return (await response.json()).data;
<<<<<<< HEAD
};
=======
};
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
