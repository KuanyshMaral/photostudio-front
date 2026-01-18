const API_BASE = 'http://localhost:3001/api/v1';

export interface TimeSlot {
  hour: number;
  available: boolean;
  booking?: {
    id: number;
    start_time: string;
    end_time: string;
  };
}

export interface AvailabilityResponse {
  date: string;
  booked_slots: Array<{
    start: string;
    end: string;
  }>;
  available_slots: TimeSlot[];
}

export const getRoomAvailability = async (roomId: number, date: string): Promise<AvailabilityResponse> => {
    const response = await fetch(`${API_BASE}/rooms/${roomId}/availability?date=${date}`);
    
    if (!response.ok) throw new Error('Failed to fetch availability');
    
    const json = await response.json();
    return json.data;
};

export const getAvailability = async (roomId: number, date: Date): Promise<AvailabilityResponse> => {
    const dateString = date.toISOString().split('T')[0];
    return getRoomAvailability(roomId, dateString);
};
