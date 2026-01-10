export interface CreateReviewRequest {
  studio_id: number;
  booking_id: number;
  rating: number;
  comment: string;
}

export interface Review {
  id: number;
  studio_id: number;
  room_id?: number;
  booking_id?: number;
  user_id: number;
  user_name: string;
  studio_name?: string;
  room_name?: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface OwnerResponse {
  id: number;
  review_id: number;
  response: string;
  created_at: string;
  responder_name: string;
}

const API_BASE = 'http://localhost:3001/api/v1';

export const getStudioReviews = async (studioId: number): Promise<Review[]> => {
    const response = await fetch(`${API_BASE}/studios/${studioId}/reviews`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    
    const json = await response.json();
    return json.data || [];
};

export const getUserReviews = async (token: string): Promise<Review[]> => {
    const response = await fetch(`${API_BASE}/users/reviews`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (!response.ok) throw new Error('Failed to fetch user reviews');
    
    const json = await response.json();
    return json.data || [];
};

export const getOwnerStudioReviewsDetail = async (token: string, studioId: number): Promise<Review[]> => {
    const response = await fetch(`${API_BASE}/owners/studios/${studioId}/reviews`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (!response.ok) throw new Error('Failed to fetch studio reviews');
    
    const json = await response.json();
    return json.data || [];
};

export const getOwnerStudioReviews = async (token: string): Promise<Review[]> => {
    // Get all reviews for studios owned by the current user
    const response = await fetch(`${API_BASE}/owners/studios/reviews`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (!response.ok) throw new Error('Failed to fetch owner studio reviews');
    
    const json = await response.json();
    return json.data || [];
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
