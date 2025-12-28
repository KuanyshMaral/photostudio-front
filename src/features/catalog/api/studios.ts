import { Studio, StudioFilterParams, PaginatedResponse } from '../../../types/types';
export const getStudios = async (params: any) => {
    return {
        success: true,
        data: [
            {
                id: 1,
                name: "Studio Light Pro",
                address: "ул. Абая, 150",
                rating: 4.9,
                total_reviews: 127,
                min_price: 8000,
                city: "Алматы",
                room_types: ["Fashion"]
            }
        ],
        pagination: { page: 1, limit: 20, total: 1, total_pages: 1 }
    };
};