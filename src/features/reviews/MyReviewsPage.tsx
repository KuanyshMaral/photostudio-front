import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating';
import { getOwnerStudioReviews, getUserReviews } from "../../api/reviewApi";
import type { Review } from '../../api/reviewApi';

interface OwnerResponse {
  id: number;
  review_id: number;
  response: string;
  created_at: string;
  responder_name: string;
}

const MyReviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [reviews, setReviews] = useState<(Review & { ownerResponse?: OwnerResponse })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyReviews = async () => {
      if (!token) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Use the new API to get all reviews for studios owned by current user
        const data = await getOwnerStudioReviews(token);
        
        // Mock owner responses for demonstration
        const reviewsWithResponses = data.map((review: Review) => ({
          ...review,
          ownerResponse: Math.random() > 0.5 ? {
            id: Math.floor(Math.random() * 10000),
            review_id: review.id,
            response: "Thank you for your feedback! We're glad you enjoyed your experience in our studio. We've noted your suggestions and will work on improving our services.",
            created_at: new Date(review.created_at).getTime() + 86400000 + '', // 1 day after review
            responder_name: "Studio Manager"
          } : undefined
        }));
        
        setReviews(reviewsWithResponses);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchMyReviews();
  }, [token]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <span className="ml-3 text-gray-600">Loading your reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Мои отзывы</h1>
              <p className="text-gray-600 mt-1">Управляйте вашими отзывами о студиях</p>
            </div>
            <button
              onClick={() => navigate('/write-review')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Оставить отзыв
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-lg mb-4">У вас пока нет отзывов</div>
            <p className="text-gray-500 mb-6">Поделитесь вашим опытом посещения студий</p>
            <button
              onClick={() => navigate('/write-review')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Оставить первый отзыв
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                {/* Review Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{review.studio_name}</h3>
                    <p className="text-gray-600">{review.room_name}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(review.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <StarRating rating={review.rating} onRatingChange={() => {}} readonly size="sm" />
                    <p className="text-sm font-medium text-gray-700 mt-1">{getRatingText(review.rating)}</p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>

                {/* Owner Response */}
                {review.ownerResponse && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-sm font-semibold">M</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-blue-900 text-sm">{review.ownerResponse.responder_name}</p>
                          <span className="text-xs text-blue-600">• {formatDate(review.ownerResponse.created_at)}</span>
                        </div>
                        <p className="text-blue-800 text-sm leading-relaxed">{review.ownerResponse.response}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviewsPage;
