const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = `${API_ORIGIN}/api/v1`;

// Types for booking operations based on Swagger
export type BookingData = {
  room_id: number;
  studio_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  notes?: string;
};

export interface CancelBookingRequest {
  reason: string;
}

export interface UpdateDepositRequest {
  deposit_amount: number;
}

export interface UpdatePaymentStatusRequest {
  payment_status: 'unpaid' | 'paid' | 'refunded';
}

export interface UpdateBookingStatusRequest {
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

const parseJsonSafely = async (response: Response) => {
    const text = await response.text();

    if (!text.trim()) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
};

const getErrorMessage = (payload: any, fallback: string) => {
    return payload?.error?.message || payload?.message || fallback;
};

const getResponseData = (payload: any) => {
    return payload?.data ?? payload;
};

const extractBookingsList = (payload: any): any[] => {
    if (Array.isArray(payload)) {
        return payload;
    }

    const candidates = [
        payload?.bookings,
        payload?.items,
        payload?.results,
        payload?.list,
        payload?.data?.bookings,
        payload?.data?.items,
        payload?.data?.results,
        payload?.data?.list,
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            return candidate;
        }
    }

    return [];
};

// Create booking - POST /api/v1/bookings
export const createBooking = async (data: BookingData, token: string) => {
    console.log('Creating booking with data:', data);
    
    const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            room_id: data.room_id,
            studio_id: data.studio_id,
            user_id: data.user_id,
            start_time: data.start_time,
            end_time: data.end_time,
            notes: data.notes,
        }),
    });
    
    console.log('Create booking response status:', response.status);
    
    if (!response.ok) {
        const error = await parseJsonSafely(response);
        console.error('Create booking error:', error);
        throw new Error(getErrorMessage(error, 'Booking failed'));
    }

    const json = await parseJsonSafely(response);
    console.log('Create booking response:', json);
    const responseData = getResponseData(json);
    return responseData?.booking || responseData || {};
};

// Cancel booking - PATCH /api/v1/bookings/{id}/cancel
export const cancelBooking = async (token: string, bookingId: number, data: CancelBookingRequest) => {
    console.log('Cancelling booking:', bookingId, 'reason:', data.reason);
    
    const response = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    
    console.log('Cancel booking response status:', response.status);
    
    if (!response.ok) {
        const error = await parseJsonSafely(response);
        console.error('Cancel booking error:', error);
        throw new Error(getErrorMessage(error, 'Failed to cancel booking'));
    }

    const json = await parseJsonSafely(response);
    console.log('Cancel booking response:', json);
    const responseData = getResponseData(json);
    return responseData?.booking || responseData || {};
};

// Complete booking - PATCH /api/v1/bookings/{id}/complete
export const completeBooking = async (token: string, bookingId: number) => {
    console.log('Completing booking:', bookingId);
    
    const response = await fetch(`${API_BASE}/bookings/${bookingId}/complete`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    console.log('Complete booking response status:', response.status);
    
    if (!response.ok) {
        const error = await parseJsonSafely(response);
        console.error('Complete booking error:', error);
        throw new Error(getErrorMessage(error, 'Failed to complete booking'));
    }

    const json = await parseJsonSafely(response);
    console.log('Complete booking response:', json);
    const responseData = getResponseData(json);
    return responseData?.booking || responseData || {};
};

// Confirm booking - PATCH /api/v1/bookings/{id}/confirm
export const confirmBooking = async (token: string, bookingId: number) => {
    console.log('Confirming booking:', bookingId);
    
    const response = await fetch(`${API_BASE}/bookings/${bookingId}/confirm`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    console.log('Confirm booking response status:', response.status);
    
    if (!response.ok) {
        const error = await parseJsonSafely(response);
        console.error('Confirm booking error:', error);
        throw new Error(getErrorMessage(error, 'Failed to confirm booking'));
    }

    const json = await parseJsonSafely(response);
    console.log('Confirm booking response:', json);
    const responseData = getResponseData(json);
    return responseData?.booking || responseData || {};
};

// Update deposit - PATCH /api/v1/bookings/{id}/deposit
export const updateBookingDeposit = async (token: string, bookingId: number, data: UpdateDepositRequest) => {
    console.log('Updating deposit for booking:', bookingId, 'amount:', data.deposit_amount);
    
    const response = await fetch(`${API_BASE}/bookings/${bookingId}/deposit`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    
    console.log('Update deposit response status:', response.status);
    
    if (!response.ok) {
        const error = await parseJsonSafely(response);
        console.error('Update deposit error:', error);
        throw new Error(getErrorMessage(error, 'Failed to update deposit'));
    }

    const json = await parseJsonSafely(response);
    console.log('Update deposit response:', json);
    const responseData = getResponseData(json);
    return responseData?.booking || responseData || {};
};

// Mark as paid - PATCH /api/v1/bookings/{id}/mark-paid
export const markBookingAsPaid = async (token: string, bookingId: number) => {
    console.log('Marking booking as paid:', bookingId);
    
    const response = await fetch(`${API_BASE}/bookings/${bookingId}/mark-paid`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    console.log('Mark paid response status:', response.status);
    
    if (!response.ok) {
        const error = await parseJsonSafely(response);
        console.error('Mark paid error:', error);
        throw new Error(getErrorMessage(error, 'Failed to mark as paid'));
    }

    const json = await parseJsonSafely(response);
    console.log('Mark paid response:', json);
    const responseData = getResponseData(json);
    return responseData?.booking || responseData || {};
};

// Update payment status - PATCH /api/v1/bookings/{id}/payment-status
export const updatePaymentStatus = async (token: string, bookingId: number, data: UpdatePaymentStatusRequest) => {
    console.log('Updating payment status for booking:', bookingId, 'status:', data.payment_status);
    
    const response = await fetch(`${API_BASE}/bookings/${bookingId}/payment-status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    
    console.log('Update payment status response status:', response.status);
    
    if (!response.ok) {
        const error = await parseJsonSafely(response);
        console.error('Update payment status error:', error);
        throw new Error(getErrorMessage(error, 'Failed to update payment status'));
    }

    const json = await parseJsonSafely(response);
    console.log('Update payment status response:', json);
    const responseData = getResponseData(json);
    return responseData?.booking || responseData || {};
};

// Update booking status - PATCH /api/v1/bookings/{id}/status
export const updateBookingStatus = async (token: string, bookingId: number, data: UpdateBookingStatusRequest) => {
    console.log('Updating booking status:', bookingId, 'status:', data.status);
    
    const response = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    
    console.log('Update booking status response status:', response.status);
    
    if (!response.ok) {
        const error = await parseJsonSafely(response);
        console.error('Update booking status error:', error);
        throw new Error(getErrorMessage(error, 'Failed to update booking status'));
    }

    const json = await parseJsonSafely(response);
    console.log('Update booking status response:', json);
    const responseData = getResponseData(json);
    return responseData?.booking || responseData || {};
};

// Get booking by ID - GET /api/v1/bookings/{id}
export const getBookingById = async (token: string, bookingId: number) => {
    console.log('Getting booking by ID:', bookingId);
    
    const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    console.log('Get booking response status:', response.status);
    
    if (!response.ok) {
        const error = await parseJsonSafely(response);
        console.error('Get booking error:', error);
        throw new Error(getErrorMessage(error, 'Failed to get booking'));
    }

    const json = await parseJsonSafely(response);
    console.log('Get booking response:', json);
    const responseData = getResponseData(json);
    return responseData?.booking || responseData || null;
};

// Get user bookings - GET /api/v1/users/me/bookings
export const getMyBookings = async (token: string, status?: string) => {
    console.log('Getting user bookings, status:', status);
    
    const url = status 
        ? `${API_BASE}/users/me/bookings?status=${status}`
        : `${API_BASE}/users/me/bookings`;
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    console.log('Get user bookings response status:', response.status);
    
    if (!response.ok) {
        const error = await parseJsonSafely(response);
        console.error('Get user bookings error:', error);
        throw new Error(getErrorMessage(error, 'Failed to fetch bookings'));
    }

    const json = await parseJsonSafely(response);
    console.log('Get user bookings response:', json);
    const responseData = getResponseData(json);
    const bookings = extractBookingsList(responseData);
    console.log('Extracted user bookings count:', bookings.length);
    return bookings;
};

// Get room availability - GET /api/v1/rooms/{id}/availability
export const getRoomAvailability = async (token: string, roomId: number, date: string) => {
    console.log('Getting room availability:', roomId, 'date:', date);
    
    const response = await fetch(`${API_BASE}/rooms/${roomId}/availability?date=${date}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    console.log('Get room availability response status:', response.status);
    
    if (!response.ok) {
        const error = await parseJsonSafely(response);
        console.error('Get room availability error:', error);
        throw new Error(getErrorMessage(error, 'Failed to get room availability'));
    }

    const json = await parseJsonSafely(response);
    console.log('Get room availability response:', json);
    const responseData = getResponseData(json);
    return responseData?.availability || responseData || {
        date,
        booked_slots: [],
        available_slots: []
    };
};

// Get room busy slots - GET /api/v1/rooms/{id}/busy-slots
export const getRoomBusySlots = async (token: string, roomId: number, date: string) => {
    console.log('Getting room busy slots:', roomId, 'date:', date);
    
    const response = await fetch(`${API_BASE}/rooms/${roomId}/busy-slots?date=${date}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    console.log('Get room busy slots response status:', response.status);
    
    if (!response.ok) {
        const error = await parseJsonSafely(response);
        console.error('Get room busy slots error:', error);
        throw new Error(getErrorMessage(error, 'Failed to get room busy slots'));
    }

    const json = await parseJsonSafely(response);
    console.log('Get room busy slots response:', json);
    return getResponseData(json) || [];
};

// Get studio bookings - GET /api/v1/studios/{id}/bookings
export const getStudioBookings = async (token: string, studioId: number) => {
    console.log('Getting studio bookings:', studioId);
    
    const response = await fetch(`${API_BASE}/studios/${studioId}/bookings`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    console.log('Get studio bookings response status:', response.status);
    
    if (!response.ok) {
        const error = await parseJsonSafely(response);
        console.error('Get studio bookings error:', error);
        throw new Error(getErrorMessage(error, 'Failed to get studio bookings'));
    }

    const json = await parseJsonSafely(response);
    console.log('Get studio bookings response:', json);
    const responseData = getResponseData(json);
    return responseData?.bookings || json?.bookings || [];
};

// Get user bookings with pagination - GET /api/v1/users/me/bookings
export const getUserBookings = async (token: string, limit?: number, offset?: number) => {
    console.log('Getting user bookings with pagination, limit:', limit, 'offset:', offset);
    
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const url = `${API_BASE}/users/me/bookings${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    console.log('Get user bookings with pagination response status:', response.status);
    
    if (!response.ok) {
        const error = await parseJsonSafely(response);
        console.error('Get user bookings with pagination error:', error);
        throw new Error(getErrorMessage(error, 'Failed to get user bookings'));
    }

    const json = await parseJsonSafely(response);
    console.log('Get user bookings with pagination response:', json);
    const responseData = getResponseData(json);
    const bookings = extractBookingsList(responseData);

    return {
        bookings,
        pagination: responseData?.pagination || {
            total: bookings.length,
            limit: limit || bookings.length,
            offset: offset || 0,
        }
    };
};
