import type { StudioFilterParams } from '../../../types/index';

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

const getErrorMessage = (payload: any, fallback: string) => {
    return payload?.error?.message || payload?.message || fallback;
};

export const getStudios = async (params: StudioFilterParams) => {
    const searchParams = new URLSearchParams();
    if (params.city) searchParams.append('city', params.city);
    if (params.room_type) searchParams.append('room_type', params.room_type);
    if (params.min_price) searchParams.append('min_price', String(params.min_price));
    if (params.max_price) searchParams.append('max_price', String(params.max_price));
    if (params.search) searchParams.append('search', params.search);
    if (params.page) searchParams.append('page', String(params.page));
    if (params.limit) searchParams.append('limit', String(params.limit));
    
    const response = await fetch(`${API_BASE}/studios?${searchParams.toString()}`);
    
    if (!response.ok) {
        const errorData = await parseJsonSafely(response);
        throw new Error(getErrorMessage(errorData, `HTTP error ${response.status}`));
    }
    
    const json = await parseJsonSafely(response);
    return { 
        success: true, 
        data: json?.data?.studios || [],
        pagination: json?.data?.pagination || { page: 1, limit: 20, total: 0, total_pages: 1 }
    };
};

export const getStudioById = async (id: number) => {
    const response = await fetch(`${API_BASE}/studios/${id}`);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Studio not found');
        }
        const errorData = await parseJsonSafely(response);
        throw new Error(getErrorMessage(errorData, 'Failed to load studio'));
    }
    
    const json = await parseJsonSafely(response);
    return json?.data || null;
};

export const getStudiosWithRooms = async (params: StudioFilterParams) => {
    const searchParams = new URLSearchParams();
    if (params.city) searchParams.append('city', params.city);
    if (params.room_type) searchParams.append('room_type', params.room_type);
    if (params.search) searchParams.append('search', params.search);
    if (params.min_price) searchParams.append('min_price', String(params.min_price));
    if (params.max_price) searchParams.append('max_price', String(params.max_price));
    if (params.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params.sort_order) searchParams.append('sort_order', params.sort_order);
    if (params.page) searchParams.append('page', String(params.page));
    if (params.limit) searchParams.append('limit', String(params.limit));
    
    const response = await fetch(`${API_BASE}/studios?include_rooms=true&${searchParams.toString()}`);
    
    console.log('Studios API URL:', `${API_BASE}/studios?include_rooms=true&${searchParams.toString()}`);
    
    if (!response.ok) {
        const errorData = await parseJsonSafely(response);
        console.error('Studios API error:', errorData);
        throw new Error(getErrorMessage(errorData, 'Failed to fetch studios with rooms'));
    }
    
    const json = await parseJsonSafely(response);
    console.log('Studios API response:', json);
    return { 
        success: true, 
        data: json?.data?.studios || [],
        pagination: json?.data?.pagination || { page: 1, limit: 20, total: 0, total_pages: 1 }
    };
};