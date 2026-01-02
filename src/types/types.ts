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
}

export interface StudioFilterParams {
  city?: string;
  min_price?: number;
  max_price?: number;
  room_type?: string;
  page?: number;
  limit?: number;
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