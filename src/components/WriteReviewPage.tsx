import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { createReview, type CreateReviewRequest } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

// API function to check if user can leave review
const checkCanLeaveReview = async (studioId: number): Promise<boolean> => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  const response = await fetch(`http://localhost:3001/api/v1/studios/${studioId}/can-review`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) return false;
  
  const json = await response.json();
  return json.data?.can_review || false;
};

export default function WriteReviewPage() {
  const { studioId } = useParams<{ studioId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Проверяем право на отзыв
  const { data: canReview, isLoading: checkingPermission } = useQuery({
    queryKey: ['can-review', studioId],
    queryFn: () => studioId ? checkCanLeaveReview(Number(studioId)) : false,
    enabled: !!studioId && !!token,
  });

  const handleSubmit = async () => {
    if (!studioId || !token) {
      toast.error('Требуется авторизация');
      return;
    }

    if (rating === 0) {
      toast.error('Укажите рейтинг');
      return;
    }
    if (!comment.trim()) {
      toast.error('Напишите отзыв');
      return;
    }

    setIsLoading(true);
    try {
      const reviewData: CreateReviewRequest = {
        studio_id: Number(studioId),
        booking_id: 0, // Will be determined by API based on user's completed bookings
        rating,
        comment: comment.trim(),
      };

      await createReview(token, reviewData);

      toast.success('Отзыв отправлен!');
      navigate(`/studios/${studioId}`);
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || 'Ошибка';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingPermission) return <LoadingSpinner />;

  if (!canReview) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">
          Вы можете оставить отзыв только после завершённого бронирования
        </p>
        <Link to="/studios" className="text-blue-600 hover:underline">
          Вернуться к каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Оставить отзыв</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">Ваша оценка</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
                type="button"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {rating === 1 && 'Очень плохо'}
            {rating === 2 && 'Плохо'}
            {rating === 3 && 'Нормально'}
            {rating === 4 && 'Хорошо'}
            {rating === 5 && 'Отлично'}
          </p>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            Ваш отзыв
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Расскажите о вашем опыте съёмки в этой студии..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            minLength={10}
            maxLength={1000}
          />
          <p className="text-sm text-gray-500 mt-1">
            {comment.length}/1000 символов (минимум 10)
          </p>
        </div>

        {/* Photos (TODO: Implement photo upload) */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="text-gray-400">
            <Star className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm">Загрузка фотографий будет доступна скоро</p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
          <p className="font-medium mb-2">Правила написания отзывов:</p>
          <ul className="space-y-1 text-xs">
            <li>• Будьте честны и объективны</li>
            <li>• Расскажите о качестве оборудования и помещения</li>
            <li>• Упомяните уровень сервиса</li>
            <li>• Избегайте нецензурной лексики</li>
          </ul>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || rating === 0 || comment.trim().length < 10}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? 'Отправка...' : 'Отправить отзыв'}
        </button>
      </div>
    </div>
  );
}
