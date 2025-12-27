export interface ReviewData {
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
}

export const createReview = async (data: ReviewData): Promise<{ review: Review }> => {
  try {
    // Real API call - uncomment when backend is ready
    // const response = await axios.post('/reviews', data);
    // return response.data;

    // Mock API for development
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockReview: Review = {
      id: Math.floor(Math.random() * 10000),
      booking_id: data.booking_id,
      room_id: 'ROOM-' + Math.floor(Math.random() * 100),
      room_name: 'Conference Room ' + String.fromCharCode(65 + Math.floor(Math.random() * 3)),
      rating: data.rating,
      comment: data.comment,
      created_at: new Date().toISOString()
    };

    return { review: mockReview };
  } catch (error) {
    console.error('Failed to create review:', error);
    throw new Error('Failed to submit review');
  }
};

export const getRoomReviews = async (roomId: string): Promise<Review[]> => {
  try {
    // Real API call - uncomment when backend is ready
    // const response = await axios.get(`/rooms/${roomId}/reviews`);
    // return response.data;

    // Mock API for development
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Generate mock reviews for the room
    const mockReviews: Review[] = [
      {
        id: 2001,
        booking_id: 1001,
        room_id: roomId,
        room_name: 'Conference Room A',
        rating: 5,
        comment: 'Excellent room! Clean, well-equipped, and great for presentations.',
        created_at: '2024-01-10T15:30:00Z'
      },
      {
        id: 2002,
        booking_id: 1002,
        room_id: roomId,
        room_name: 'Conference Room A',
        rating: 4,
        comment: 'Good space, but could use better lighting for video calls.',
        created_at: '2024-01-08T11:20:00Z'
      },
      {
        id: 2003,
        booking_id: 1003,
        room_id: roomId,
        room_name: 'Conference Room A',
        rating: 3,
        comment: 'Decent room, but the AC was a bit noisy during our meeting.',
        created_at: '2024-01-05T14:15:00Z'
      }
    ];

    return mockReviews;
  } catch (error) {
    console.error('Failed to fetch room reviews:', error);
    throw new Error('Failed to fetch reviews');
  }
};
