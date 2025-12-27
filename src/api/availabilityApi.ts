import axios from 'axios';

export interface TimeSlot {
  hour: number;
  available: boolean;
  booking?: {
    id: number;
    start_time: string;
    end_time: string;
  };
}

export const getRoomAvailability = async (roomId: string, date: Date): Promise<TimeSlot[]> => {
  try {
    // Real API call - uncomment when backend is ready
    // const response = await axios.get(`/rooms/${roomId}/availability`, {
    //   params: { date: date.toISOString() }
    // });
    // return response.data;

    // Mock API for development - simulates real API behavior
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    
    // Generate mock data based on date and room ID for consistency
    const seed = roomId.charCodeAt(0) + date.getDate();
    const mockSlots: TimeSlot[] = Array.from({ length: 24 }, (_, hour) => {
      const isBooked = (hour + seed) % 4 === 0; // Every 4th hour is booked, pattern varies by room/date
      return {
        hour,
        available: !isBooked,
        booking: isBooked ? {
          id: Math.floor(Math.random() * 10000) + seed,
          start_time: `${hour.toString().padStart(2, '0')}:00`,
          end_time: `${(hour + 1).toString().padStart(2, '0')}:00`
        } : undefined
      };
    });
    
    return mockSlots;
  } catch (error) {
    console.error('Failed to fetch room availability:', error);
    throw new Error('Failed to fetch room availability');
  }
};
