export interface Booking {
  id: number;
  room_id: string;
  room_name?: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at?: string;
}

export const getUserBookings = async (status?: 'pending' | 'confirmed' | 'cancelled' | 'completed', token?: string): Promise<Booking[]> => {
  try {
    const response = await fetch('http://localhost:3001/api/v1/users/me/bookings', {
      headers: { 
        'Authorization': token ? `Bearer ${token}` : ''
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch bookings');
    
    const json = await response.json();
    let bookings = json.data?.items || [];
    
    // Filter by status if provided
    if (status) {
      bookings = bookings.filter((booking: Booking) => booking.status === status);
    }

    return bookings;
  } catch (error) {
    console.error('Failed to fetch user bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
};

export const cancelBooking = async (bookingId: number, token?: string): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:3001/api/v1/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
    });

    if (!response.ok) throw new Error('Failed to cancel booking');
    
    console.log(`Booking ${bookingId} cancelled`);
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    throw new Error('Failed to cancel booking');
  }
};
