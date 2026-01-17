import api from '../lib/axios';

export interface Booking {
  id: number;
  room_id: number;
  studio_name?: string; // Для отображения в списке
  room_name?: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price: number;
  comment?: string;
}

export const getAvailability = async (roomId: number, date: Date) => {
  const dateStr = date.toISOString().split('T')[0];
  const response = await api.get(`/bookings/availability`, {
    params: { room_id: roomId, date: dateStr }
  });
  return response.data;
};

export const createBooking = async (data: {
  room_id: number;
  start_time: string; // ISO string
  end_time: string;   // ISO string
  comment?: string;
}) => {
  const response = await api.post('/bookings', data);
  return response.data;
};

export const getMyBookings = async (status?: string) => {
  const params = status ? { status } : {};
  const response = await api.get<Booking[]>('/bookings/my', { params });
  return response.data;
};

export const cancelBooking = async (bookingId: number) => {
  const response = await api.post(`/bookings/${bookingId}/cancel`);
  return response.data;
};