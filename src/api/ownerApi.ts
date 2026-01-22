const API_BASE = '/api/v1';

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

// PIN
export const setOwnerPIN = async (token: string, pin: string) => {
  const response = await fetch(`${API_BASE}/owner/set-pin`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pin })
  });
  if (!response.ok) throw new Error('Failed to set PIN');
  return response.json();
};

export const verifyOwnerPIN = async (token: string, pin: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE}/owner/verify-pin`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pin })
  });
  return response.ok;
};

export const hasOwnerPIN = async (token: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE}/owner/has-pin`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) return false;
  const data = await response.json();
  return data.data?.has_pin || false;
};

// Analytics
export const getOwnerAnalytics = async (token: string) => {
  const response = await fetch(`${API_BASE}/owner/analytics`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch analytics');
  const data = await response.json();
  return data.data?.analytics;
};

// Procurement
export const getProcurementItems = async (token: string, showCompleted = false) => {
  const response = await fetch(
    `${API_BASE}/owner/procurement?show_completed=${showCompleted}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  if (!response.ok) throw new Error('Failed to fetch procurement');
  const data = await response.json();
  return data.data?.items || [];
};

// Maintenance
export const getMaintenanceItems = async (token: string, status = 'all') => {
  const response = await fetch(
    `${API_BASE}/owner/maintenance?status=${status}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  if (!response.ok) throw new Error('Failed to fetch maintenance');
  const data = await response.json();
  return data.data?.items || [];
};

// Company Profile
export const getCompanyProfile = async (token: string) => {
  const response = await fetch(`${API_BASE}/company/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  const data = await response.json();
  return data.data?.profile;
};

export const updateCompanyProfile = async (token: string, profile: any) => {
  const response = await fetch(`${API_BASE}/company/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profile)
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
};

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
