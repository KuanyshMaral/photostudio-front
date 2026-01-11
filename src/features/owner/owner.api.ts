const API_BASE = '/api/v1';

export const getMyStudios = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/studios/my`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch studios');
  }
  return response.json();
};

export const getStudioBookings = async (studioId: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/studios/${studioId}/bookings`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch bookings');
  }
  return response.json();
};

export const updateBookingStatus = async (bookingId: number, status: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
    method: 'PATCH',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to update booking');
  }
  return response.json();
};

export const updatePaymentStatus = async (bookingId: number, paymentStatus: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/bookings/${bookingId}/payment`, {
    method: 'PATCH',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ payment_status: paymentStatus })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to update payment');
  }
  return response.json();
};

export const uploadStudioPhoto = async (studioId: number, file: File) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('photo', file);
  
  const response = await fetch(`${API_BASE}/studios/${studioId}/photos`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to upload photo');
  }
  return response.json();
};