export interface Studio {
  id: number;
  name: string;
  address: string;
  rating: number;
  total_reviews: number;
  min_price: number;
  city: string;
  room_types: string[];
  preview_image?: string;
  description?: string;
  district?: string;
  phone?: string;
  email?: string;
  website?: string;
  working_hours?: {
    open: string;
    close: string;
  };
}

export interface Room {
  id: number;
  name: string;
  studio_id?: number;
  room_type: string;
  price_per_hour_min: number;
  price_per_hour_max?: number;
  area_sqm: number;
  capacity: number;
  description?: string;
  amenities?: string[];
  is_active?: boolean;
}

export type RoomType = 'studio' | 'bedroom' | 'conference' | 'event' | 'fashion' | 'portrait' | 'creative' | 'commercial';

export interface StudioFilterParams {
  city?: string;
  min_price?: number;
  max_price?: number;
  room_type?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// ============ REFERENCE TYPES ============

export interface City {
  id: number;
  name: string;
  code: string;
  country: string;
}

export interface District {
  id: number;
  city_id: number;
  name: string;
  code: string;
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
  category?: string;
}

export interface RoomTypeReference {
  id: number;
  name: string;
  description?: string;
}

export interface BookingStatus {
  id: number;
  code: string;
  name: string;
  color: string;
}

export interface StudioStatus {
  id: number;
  code: string;
  name: string;
  description?: string;
}