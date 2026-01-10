const API_BASE = 'http://localhost:3001/api/v1';

export interface OwnerBooking {
  id: number;
  studio_id: number;
  room_id: number;
  room_name?: string;
  user_id: number;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price?: number;
  created_at: string;
}

export interface OwnerStudio {
  id: number;
  name: string;
  address: string;
  description?: string;
  owner_id: number;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

// Get bookings for a specific studio (for studio owners)
export const getStudioBookings = async (token: string, studioId: number): Promise<OwnerBooking[]> => {
  const response = await fetch(`${API_BASE}/studios/${studioId}/bookings`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch studio bookings');
  }
  
  const json = await response.json();
  return json.data?.bookings || [];
};

// Get studios owned by the current user
export const getMyStudios = async (token: string): Promise<OwnerStudio[]> => {
  const response = await fetch(`${API_BASE}/studios/my`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch your studios');
  }
  
  const json = await response.json();
  return json.data?.studios || [];
};

// Update booking status (confirm/reject)
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
