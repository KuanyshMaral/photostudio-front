const API_BASE = '/api/v1';

export interface ManagerBooking {
  id: number;
  room_id: number;
  room_name: string;
  studio_id: number;
  studio_name: string;
  client_id: number;
  client_name: string;
  client_phone: string;
  client_email: string;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
  deposit_amount: number;
  balance: number;
  notes?: string;
  cancellation_reason?: string;
}

export interface ManagerBookingFilters {
  studio_id?: number;
  room_id?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  client?: string;
  page?: number;
  per_page?: number;
}

export const getManagerBookings = async (
  token: string, 
  filters: ManagerBookingFilters = {}
): Promise<{ bookings: ManagerBooking[]; total: number }> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, String(value));
    }
  });

  const response = await fetch(`${API_BASE}/manager/bookings?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) throw new Error('Failed to fetch bookings');
  
  const data = await response.json();
  return {
    bookings: data.data?.bookings || [],
    total: data.data?.total || 0
  };
};

export const getManagerBooking = async (
  token: string, 
  bookingId: number
): Promise<ManagerBooking> => {
  const response = await fetch(`${API_BASE}/manager/bookings/${bookingId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) throw new Error('Failed to fetch booking');
  
  const data = await response.json();
  return data.data?.booking;
};

export const updateBookingDeposit = async (
  token: string,
  bookingId: number,
  depositAmount: number
): Promise<void> => {
  const response = await fetch(`${API_BASE}/manager/bookings/${bookingId}/deposit`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ deposit_amount: depositAmount })
  });

  if (!response.ok) throw new Error('Failed to update deposit');
};

export const updateBookingStatus = async (
  token: string,
  bookingId: number,
  status: string
): Promise<void> => {
  const response = await fetch(`${API_BASE}/manager/bookings/${bookingId}/status`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) throw new Error('Failed to update status');
};

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  total_bookings: number;
  total_spent: number;
  last_booking_at?: string;
}

export const getManagerClients = async (
  token: string,
  search?: string,
  page = 1,
  perPage = 20
): Promise<{ clients: Client[]; total: number }> => {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage)
  });
  if (search) params.append('search', search);

  const response = await fetch(`${API_BASE}/manager/clients?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) throw new Error('Failed to fetch clients');

  const data = await response.json();
  return {
    clients: data.data?.clients || [],
    total: data.data?.total || 0
  };
};
