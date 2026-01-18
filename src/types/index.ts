// src/types/index.ts

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'client' | 'studio_owner' | 'admin';
  studio_status?: 'pending' | 'verified' | 'rejected';
  avatar?: string;
  created_at: string;
}

export interface Studio {
  id: number;
  owner_id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  district?: string;
  phone: string;
  email?: string;
  website?: string;
  working_hours?: string;
  photos?: string[];
  preview_image?: string;
  rating?: number;
  reviews_count?: number;
  min_price?: number;
  rooms?: Room[];
  created_at: string;
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
  room_type: 'Fashion' | 'Portrait' | 'Creative' | 'Commercial';
  area_sqm?: number;
  capacity?: number;
  price_per_hour_min: number;
  price_per_hour_max: number;
  amenities?: string[];
  photos?: string[];
  is_active: boolean;
  equipment?: Equipment[];
}

export interface Equipment {
  id: number;
  room_id: number;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  quantity: number;
  rental_price?: number;
}

export interface Booking {
  id: number;
  user_id: number;
  room_id: number;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
  payment_status: 'pending' | 'paid' | 'refunded';
  total_price: number;
  notes?: string;
  room?: Room;
  studio?: Studio;
  created_at: string;
}

export interface Review {
  id: number;
  user_id: number;
  studio_id: number;
  booking_id?: number;
  rating: number;
  comment: string;
  photos?: string[];
  is_visible: boolean;
  user?: User;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface StudioFilterParams {
  city?: string;
  room_type?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  page?: number;
  limit?: number;
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