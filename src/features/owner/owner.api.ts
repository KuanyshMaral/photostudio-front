const API_BASE = '/api/v1';

export const getMyStudios = async (token: string) => {
    const response = await fetch(`${API_BASE}/studios/my`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed');
    return (await response.json()).data?.studios || [];
};

export const getStudioBookings = async (token: string, studioId: number) => {
    const response = await fetch(`${API_BASE}/studios/${studioId}/bookings`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed');
    return (await response.json()).data?.bookings || [];
};

export const updatePaymentStatus = async (
    token: string,
    bookingId: number,
    status: 'unpaid' | 'paid' | 'refunded'
) => {
    const response = await fetch(`${API_BASE}/bookings/${bookingId}/payment`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ payment_status: status })
    });
    if (!response.ok) throw new Error('Failed');
};