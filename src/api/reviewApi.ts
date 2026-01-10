export interface CreateReviewRequest {
  studio_id: number;
  booking_id: number;
  rating: number;
  comment: string;
}

export interface Review {
  id: number;
  studio_id: number;
  booking_id: number;
  user_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const API_BASE = 'http://localhost:3001/api/v1';

export const getStudioReviews = async (studioId: number): Promise<Review[]> => {
    const response = await fetch(`${API_BASE}/studios/${studioId}/reviews`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    
    const json = await response.json();
    return json.data?.reviews || [];
};

export const createReview = async (token: string, data: CreateReviewRequest) => {
    const response = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create review');
    }
    
    return (await response.json()).data;
};
