const API_BASE = '/api/v1';

export interface CreateReviewRequest {
  booking_id: number;
  rating: number;
  comment: string;
}

export interface Review {
  id: number;
  booking_id: number;
  room_id: string;
  room_name?: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name?: string;
}

export const getStudioReviews = async (studioId: number): Promise<Review[]> => {
  const response = await fetch(`${API_BASE}/studios/${studioId}/reviews`);
  if (!response.ok) throw new Error('Failed to fetch reviews');

  const json = await response.json();
  return json.data?.reviews || [];
};

export const createReview = async (token: string, data: CreateReviewRequest): Promise<Review> => {
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

// Kept for backward compatibility if needed elsewhere, but redirects to studio logic or could be removed
export const getRoomReviews = async (roomId: string): Promise<Review[]> => {
    // Ideally this should use the new structure, but keeping placeholder
    console.warn("getRoomReviews is deprecated, use getStudioReviews");
    return [];
};