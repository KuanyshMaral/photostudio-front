import type { StudioFilterParams } from '../../../types/index';

const API_BASE = '/api/v1';

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error ${response.status}`);
    }
    
    const json = await response.json();
    return { 
        success: true, 
        data: json.data?.studios || [],
        pagination: json.data?.pagination || { page: 1, limit: 20, total: 0, total_pages: 1 }
    };
};

export const getStudioById = async (id: number) => {
    const response = await fetch(`${API_BASE}/studios/${id}`);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Studio not found');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to load studio');
    }
    
    const json = await response.json();
    return json.data;
};

export const getStudiosWithRooms = async (params: StudioFilterParams) => {
    const searchParams = new URLSearchParams();
    if (params.city) searchParams.append('city', params.city);
    if (params.room_type) searchParams.append('room_type', params.room_type);
    if (params.min_price) searchParams.append('min_price', String(params.min_price));
    if (params.max_price) searchParams.append('max_price', String(params.max_price));
    if (params.search) searchParams.append('search', params.search);
    if (params.page) searchParams.append('page', String(params.page));
    if (params.limit) searchParams.append('limit', String(params.limit));
    
    const response = await fetch(`${API_BASE}/studios?include_rooms=true&${searchParams.toString()}`);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to fetch studios with rooms');
    }
    
    const json = await response.json();
    return { 
        success: true, 
        data: json.data?.studios || [],
        pagination: json.data?.pagination || { page: 1, limit: 20, total: 0, total_pages: 1 }
    };
};