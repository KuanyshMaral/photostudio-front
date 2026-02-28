const API_BASE = '/api/v1';

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

export interface StudiosResponse {
  studios: any[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export const getStudios = async (filters: any) => {
  const searchParams = new URLSearchParams();
  
  if (filters.city) searchParams.append('city', filters.city);
  if (filters.room_type) searchParams.append('room_type', filters.room_type);
  if (filters.min_price) searchParams.append('min_price', String(filters.min_price));
  if (filters.max_price) searchParams.append('max_price', String(filters.max_price));
  if (filters.search) searchParams.append('search', filters.search);
  if (filters.page) searchParams.append('page', String(filters.page));
  if (filters.limit) searchParams.append('limit', String(filters.limit));
  
  try {
    const response = await fetch(`${API_BASE}/studios?${searchParams.toString()}`);
    
    if (!response.ok) {
      console.warn('Failed to fetch studios:', response.status);
      return {
        studios: [],
        pagination: {
          current_page: 1,
          total_pages: 0,
          total_count: 0,
          per_page: 12
        }
      };
    }
    
    const data = await parseJsonSafely(response);
    
    return {
      studios: data?.data?.studios || [],
      pagination: data?.data?.pagination || {
        current_page: 1,
        total_pages: 1,
        total_count: 0,
        per_page: 12
      }
    };
  } catch (error) {
    console.error('Failed to fetch studios:', error);
    return {
      studios: [],
      pagination: {
        current_page: 1,
        total_pages: 0,
        total_count: 0,
        per_page: 12
      }
    };
  }
};

export const getStudioById = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE}/studios/${id}`);
    
    if (!response.ok) {
      console.warn('Failed to fetch studio:', response.status);
      return null;
    }
    
    const data = await parseJsonSafely(response);
    return data?.data || null;
  } catch (error) {
    console.error('Failed to fetch studio:', error);
    return null;
  }
};
