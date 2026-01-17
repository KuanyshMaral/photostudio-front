import api from '../lib/axios';

export const checkCanLeaveReview = async (studioId: number) => {
  try {
    const response = await api.get(`/reviews/check-permission`, {
      params: { studio_id: studioId }
    });
    return response.data.can_review;
  } catch (error) {
    return false;
  }
};

export const createReview = async (data: {
  studio_id: number;
  rating: number;
  comment: string;
  photos?: File[];
}) => {
  // Для отправки файлов используем FormData
  const formData = new FormData();
  formData.append('studio_id', data.studio_id.toString());
  formData.append('rating', data.rating.toString());
  formData.append('comment', data.comment);
  
  if (data.photos) {
    data.photos.forEach(photo => {
      formData.append('photos', photo);
    });
  }

  const response = await api.post('/reviews', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};