export interface TimeSlot {
  hour: number;
  available: boolean;
}

export interface Booking {
  id: number;
  roomId: number;
  studioId: number;
  userId: number;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  price: number;
  roomName: string;
  studioName: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  roomId: number;
  studioId: number;
  startTime: string;
  endTime: string;
}

export interface BookingResponse {
  success: boolean;
  data: Booking;
  message?: string;
}
