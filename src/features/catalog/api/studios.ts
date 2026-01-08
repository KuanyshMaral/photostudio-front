import type { StudioDetailResponse, StudiosResponse } from '../../../types/index';

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
};