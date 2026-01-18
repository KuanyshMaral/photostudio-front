const API_BASE = 'http://localhost:3001/api/v1';

export type BookingData = {
  room_id: string;
  studio_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  comment?: string;
};

export const createBooking = async (data: BookingData, token: string) => {
    const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            room_id: Number(data.room_id),
            studio_id: data.studio_id,
            user_id: data.user_id,
            start_time: data.start_time,
            end_time: data.end_time,
        }),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Booking failed');
    }
    
    const json = await response.json();
    return json.data;
};

export const getMyBookings = async (token: string) => {
    const response = await fetch(`${API_BASE}/users/me/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) throw new Error('Failed to fetch bookings');
    
    const json = await response.json();
    return json.data?.items || [];
};

export const updateBookingStatus = async (token: string, bookingId: number, status: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to update booking status');
    }
};
