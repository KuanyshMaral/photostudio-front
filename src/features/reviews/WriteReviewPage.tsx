import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { checkCanLeaveReview, createReview } from '../../api/reviewApi';
import LoadingSpinner from '../../components/LoadingSpinner';

// Временный компонент Star, если его нет глобально
const Star = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

export default function WriteReviewPage() {
  const { studioId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  // const [photos, setPhotos] = useState<File[]>([]); // Для будущей реализации
  const [isLoading, setIsLoading] = useState(false);

  const { data: canReview, isLoading: checkingPermission } = useQuery({
    queryKey: ['can-review', studioId],
    queryFn: () => checkCanLeaveReview(Number(studioId)),
    enabled: !!studioId
  });

  const handleSubmit = async () => {
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
      await createReview({
        studio_id: Number(studioId),
        rating,
        comment,
        photos: [] // TODO: добавить загрузку фото
      });

      toast.success('Отзыв отправлен!');
      navigate(`/studios/${studioId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Ошибка');
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
        <div>
          <label className="block text-sm font-medium mb-2">Ваша оценка</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
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
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Ваш отзыв</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Расскажите о вашем опыте..."
            className="w-full p-3 border rounded-lg resize-none h-32"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Отправка...' : 'Отправить отзыв'}
        </button>
      </div>
    </div>
  );
}