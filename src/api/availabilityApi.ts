const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = `${API_ORIGIN}/api/v1`;

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

const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const parseJsonSafely = async (response: Response) => {
    const text = await response.text();

    if (!text.trim()) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
};

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
    
    if (!response.ok) throw new Error('Failed to fetch availability');

    const json = await parseJsonSafely(response);
    return json?.data || {
        date,
        booked_slots: [],
        available_slots: []
    };
};

export const getAvailability = async (roomId: number, date: Date, token?: string): Promise<AvailabilityResponse> => {
    const dateString = formatLocalDate(date);
    return getRoomAvailability(roomId, dateString, token);
};
