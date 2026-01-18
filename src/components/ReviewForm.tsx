import { useState } from 'react';
import { createReview, type CreateReviewRequest } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import StarRating from './StarRating';

interface Props {
  studioId: number;
  bookingId: number;
  studioName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReviewForm({
  studioId,
  bookingId,
  studioName,
  onSuccess,
  onCancel
}: Props) {
  const { token } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Требуется авторизация');
      return;
    }

    if (rating === 0) {
      toast.error('Пожалуйста, поставьте оценку');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Отзыв должен содержать минимум 10 символов');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData: CreateReviewRequest = {
        studio_id: studioId,
        booking_id: bookingId,
        rating,
        comment: comment.trim(),
      };

      await createReview(token, reviewData);
      toast.success('Отзыв успешно опубликован!');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка при публикации отзыва');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Оставить отзыв о студии</h3>
      
      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-1">{studioName}</h4>
          <p className="text-sm text-gray-600">Поделитесь вашим впечатлением от съёмки</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ваша оценка
          </label>
          <div className="flex justify-center">
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="lg"
              readonly={false}
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-1">
            {rating === 5 && 'Отлично!'}
            {rating === 4 && 'Хорошо'}
            {rating === 3 && 'Нормально'}
            {rating === 2 && 'Плохо'}
            {rating === 1 && 'Очень плохо'}
          </p>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Ваш отзыв
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Расскажите о вашем опыте съёмки в этой студии..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            minLength={10}
            maxLength={1000}
          />
          <p className="text-sm text-gray-500 mt-1">
            {comment.length}/1000 символов (минимум 10)
          </p>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
          <p className="font-medium mb-1">Правила написания отзывов:</p>
          <ul className="space-y-1 text-xs">
            <li>• Будьте честны и объективны</li>
            <li>• Расскажите о качестве оборудования и помещения</li>
            <li>• Упомяните уровень сервиса</li>
            <li>• Избегайте нецензурной лексики</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? 'Публикация...' : 'Опубликовать отзыв'}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
