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

export const getRoomAvailability = async (roomId: number, date: string): Promise<TimeSlot[]> => {
    const response = await fetch(`${API_BASE}/rooms/${roomId}/availability?date=${date}`);
    
    if (!response.ok) throw new Error('Failed to fetch availability');
    
    const json = await response.json();
    return json.data?.available_slots || [];
};
