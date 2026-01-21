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

<<<<<<< HEAD
export const getRoomAvailability = async (roomId: number, date: string): Promise<AvailabilityResponse> => {
    const response = await fetch(`${API_BASE}/rooms/${roomId}/availability?date=${date}`);
=======
export const getRoomAvailability = async (roomId: number, date: string, token?: string): Promise<AvailabilityResponse> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}/rooms/${roomId}/availability?date=${date}`, {
        headers,
    });
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f
    
    if (!response.ok) throw new Error('Failed to fetch availability');
    
    const json = await response.json();
    return json.data;
};

<<<<<<< HEAD
export const getAvailability = async (roomId: number, date: Date): Promise<AvailabilityResponse> => {
    const dateString = date.toISOString().split('T')[0];
    return getRoomAvailability(roomId, dateString);
=======
export const getAvailability = async (roomId: number, date: Date, token?: string): Promise<AvailabilityResponse> => {
    const dateString = date.toISOString().split('T')[0];
    return getRoomAvailability(roomId, dateString, token);
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f
};
