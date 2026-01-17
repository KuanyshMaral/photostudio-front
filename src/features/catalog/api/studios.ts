<<<<<<< HEAD
﻿import type { StudioDetailResponse, StudiosResponse } from '../../../types/index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStudios = async (_params: any): Promise<StudiosResponse> => {
    // Mock data
    return {
        success: true,
        data: {
            studios: [
                {
                    id: 1,
                    name: "Studio Light Pro",
                    address: "ул. Абая, 150",
                    rating: 4.9,
                    total_reviews: 127,
                    min_price: 8000,
                    city: "Алматы",
                    description: "Professional studio with high-end equipment"
                }
            ],
            pagination: { page: 1, limit: 20, total: 1, total_pages: 1 }
        }
    };
};

export const getStudioById = async (id: number): Promise<StudioDetailResponse['data']> => {
    // Mock data
    return {
        studio: {
            id: id,
            name: "Studio Light Pro",
            address: "ул. Абая, 150",
            rating: 4.9,
            total_reviews: 127,
            min_price: 8000,
            city: "Алматы",
            description: "Professional studio with high-end equipment",
            working_hours: {
                monday: { open: "09:00", close: "22:00" }
            }
        },
        rooms: [
            {
                id: 101,
                studio_id: id,
                name: "Cyclorama Room",
                description: "Large white cyclorama",
                area_sqm: 60,
                capacity: 10,
                room_type: 'Fashion',
                price_per_hour_min: 8000,
                is_active: true
            },
            {
                id: 102,
                studio_id: id,
                name: "Interior Room",
                description: "Cozy interior with natural light",
                area_sqm: 45,
                capacity: 5,
                room_type: 'Portrait',
                price_per_hour_min: 7000,
                is_active: true
            }
        ]
    };
=======
﻿import type { StudioFilterParams } from '../../../types/index';

const API_BASE = '/api/v1';

export const getStudios = async (params: StudioFilterParams) => {
    const searchParams = new URLSearchParams();
    if (params.city) searchParams.append('city', params.city);
    if (params.room_type) searchParams.append('room_type', params.room_type);
    if (params.min_price) searchParams.append('min_price', String(params.min_price));
    if (params.max_price) searchParams.append('max_price', String(params.max_price));
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
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
};