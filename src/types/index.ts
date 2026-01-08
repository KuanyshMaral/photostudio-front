// src/types/index.ts

export interface Studio {
  id: number;
  name: string;
  address: string;
  district?: string;
  rating: number;
  total_reviews: number;
  min_price?: number;
  max_price?: number;
  photos?: string[];
  description?: string;
  working_hours?: Record<string, DaySchedule>;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface DaySchedule {
  open: string;
  close: string;
}

export interface Room {
  id: number;
  studio_id: number;
  name: string;
  description?: string;
  area_sqm: number;
  capacity: number;
  room_type: RoomType;
  price_per_hour_min: number;
  price_per_hour_max?: number;
  amenities?: string[];
  photos?: string[];
  is_active: boolean;
  equipment?: Equipment[];
}

export type RoomType = 'Fashion' | 'Portrait' | 'Creative' | 'Commercial';

export interface Equipment {
  id: number;
  room_id: number;
  name: string;
  category?: string;
  brand?: string;
  model?: string;
  quantity: number;
  rental_price?: number;
}

export interface Filters {
  city: string;
  min_price: string;
  max_price: string;
  room_type: string;
  search: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface StudiosResponse {
  success: boolean;
  data: {
    studios: Studio[];
    pagination: PaginationInfo;
  };
}

export interface StudioDetailResponse {
  success: boolean;
  data: {
    studio: Studio;
    rooms: Room[];
  };
}

// Added types
export interface Booking {
    id: number;
    room_id: number;
    studio_id: number;
    start_time: string;
    end_time: string;
    total_price: number;
    status: BookingStatus;
    payment_status: PaymentStatus;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface Review {
    id: number;
    studio_id: number;
    user_id: number;
    rating: number;
    comment?: string;
    owner_response?: string;
    created_at: string;
}