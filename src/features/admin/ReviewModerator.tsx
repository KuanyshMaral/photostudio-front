import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Star, EyeOff, Trash2, 
  User, Building2, Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ReviewModerator.css';

interface Review {
  id: number;
  studio_id: number;
  studio_name: string;
  user_id: number;
  user_name: string;
  rating: number;
  comment: string;
  is_hidden: boolean;
  created_at: string;
}

export const ReviewModerator: React.FC = () => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 20;

  useEffect(() => {
    fetchReviews();
  }, [token, page]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/v1/admin/reviews?page=${page}&per_page=${perPage}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data.data?.reviews || []);
        setTotal(data.data?.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHide = async (reviewId: number) => {
    try {
      await fetch(`/api/v1/admin/reviews/${reviewId}/hide`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchReviews();
    } catch (error) {
      console.error('Failed to hide review:', error);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('Удалить отзыв навсегда?')) return;
    
    try {
      await fetch(`/api/v1/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={i < rating ? 'star-filled' : 'star-empty'}
        fill={i < rating ? '#f59e0b' : 'none'}
      />
    ));
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="review-moderator">
      <div className="review-moderator__header">
        <h1>
          <MessageSquare size={24} />
          Модерация отзывов
        </h1>
        <span className="review-count">Всего: {total}</span>
      </div>

      {isLoading ? (
        <div className="review-moderator__loading">Загрузка...</div>
      ) : reviews.length === 0 ? (
        <div className="review-moderator__empty">
          <MessageSquare size={48} />
          <p>Нет отзывов</p>
        </div>
      ) : (
        <div className="review-list">
          {reviews.map(review => (
            <div 
              key={review.id} 
              className={`review-card ${review.is_hidden ? 'review-card--hidden' : ''}`}
            >
              <div className="review-card__header">
                <div className="review-card__user">
                  <User size={16} />
                  <span>{review.user_name}</span>
                </div>
                <div className="review-card__rating">
                  {renderStars(review.rating)}
                </div>
              </div>

              <div className="review-card__studio">
                <Building2 size={14} />
                <a href={`/admin/studios/${review.studio_id}`}>
                  {review.studio_name}
                </a>
              </div>

              <div className="review-card__comment">
                {review.comment}
              </div>

              <div className="review-card__footer">
                <div className="review-card__date">
                  <Calendar size={14} />
                  {new Date(review.created_at).toLocaleDateString('ru-RU')}
                </div>
                <div className="review-card__actions">
                  {!review.is_hidden && (
                    <button
                      onClick={() => handleHide(review.id)}
                      title="Скрыть"
                      className="btn-hide"
                    >
                      <EyeOff size={16} />
                      Скрыть
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    title="Удалить"
                    className="btn-delete"
                  >
                    <Trash2 size={16} />
                    Удалить
                  </button>
                </div>
              </div>

              {review.is_hidden && (
                <div className="review-card__hidden-badge">
                  <EyeOff size={14} />
                  Скрыт
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="review-moderator__pagination">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Назад
          </button>
          <span>Страница {page} из {totalPages}</span>
          <button 
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Далее
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewModerator;
