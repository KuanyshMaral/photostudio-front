export interface Booking {
  id: number;
  room_id: number;
  room_name?: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at?: string;
}

export const getUserBookings = async (status?: 'pending' | 'confirmed' | 'cancelled'): Promise<Booking[]> => {
  try {
    // Real API call - uncomment when backend is ready
    // const response = await axios.get('/bookings', {
    //   params: { status }
    // });
    // return response.data;

    // Mock API for development
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Generate mock bookings
    const mockBookings: Booking[] = [
      {
        id: 1001,
        room_id: 'CONF-A101',
        room_name: 'Conference Room A',
        start_time: '2024-01-15T09:00:00Z',
        end_time: '2024-01-15T11:00:00Z',
        status: 'confirmed',
        created_at: '2024-01-10T14:30:00Z'
      },
      {
        id: 1002,
        room_id: 'MEET-B205',
        room_name: 'Meeting Room B',
        start_time: '2024-01-16T14:00:00Z',
        end_time: '2024-01-16T15:30:00Z',
        status: 'pending',
        created_at: '2024-01-11T09:15:00Z'
      },
      {
        id: 1003,
        room_id: 'CONF-A101',
        room_name: 'Conference Room A',
        start_time: '2024-01-17T10:00:00Z',
        end_time: '2024-01-17T12:00:00Z',
        status: 'confirmed',
        created_at: '2024-01-12T16:45:00Z'
      },
      {
        id: 1004,
        room_id: 'LOUNGE-C301',
        room_name: 'Lounge Area C',
        start_time: '2024-01-18T16:00:00Z',
        end_time: '2024-01-18T18:00:00Z',
        status: 'pending',
        created_at: '2024-01-13T11:20:00Z'
      },
      {
        id: 1005,
        room_id: 'MEET-B205',
        room_name: 'Meeting Room B',
        start_time: '2024-01-14T13:00:00Z',
        end_time: '2024-01-14T14:00:00Z',
        status: 'cancelled',
        created_at: '2024-01-09T10:30:00Z',
        updated_at: '2024-01-13T15:00:00Z'
      }
    ];

    // Filter by status if provided
    if (status) {
      return mockBookings.filter(booking => booking.status === status);
    }

    return mockBookings;
  } catch (error) {
    console.error('Failed to fetch user bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
};

export const cancelBooking = async (bookingId: number): Promise<void> => {
  try {
    // Real API call - uncomment when backend is ready
    // await axios.delete(`/bookings/${bookingId}`);

    // Mock API for development
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would make an API call to cancel the booking
    console.log(`Booking ${bookingId} cancelled`);
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    throw new Error('Failed to cancel booking');
  }
};
