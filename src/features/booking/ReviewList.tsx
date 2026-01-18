import React, { useState, useEffect } from "react";
import StarRating from "../../components/StarRating";
import { getStudioReviews } from "../../api/reviewApi";
import type { Review } from "../../api/reviewApi";

interface ReviewListProps {
  roomName?: string;
  studioId?: number;
}

interface OwnerResponse {
  id: number;
  review_id: number;
  response: string;
  created_at: string;
  responder_name: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ roomName, studioId }) => {
  const [reviews, setReviews] = useState<(Review & { ownerResponse?: OwnerResponse })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  useEffect(() => {
    const fetchReviews = async () => {
      if (!studioId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getStudioReviews(studioId);
        
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

    fetchReviews();
  }, [studioId]);

  const sortReviews = (reviewsToSort: (Review & { ownerResponse?: OwnerResponse })[]) => {
    const sorted = [...reviewsToSort];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  };

  const sortedReviews = sortReviews(reviews);

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

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading reviews...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Reviews</h2>
            <p className="text-indigo-100 mt-1">
              {roomName ? `Reviews for ${roomName}` : 'Room Reviews'}
            </p>
          </div>
          
          <div className="p-8">
            {/* Summary Stats */}
            {reviews.length > 0 && (
              <div className="mb-8 bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
                    <div>
                      <StarRating rating={parseFloat(averageRating)} onRatingChange={() => {}} readonly size="lg" />
                      <p className="text-sm text-gray-600 mt-1">
                        {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Sort Options */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Reviews List */}
            {sortedReviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">No reviews yet</div>
                <p className="text-gray-500 mt-2">Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedReviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                    {/* Review Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold">
                              {review.user_name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{review.user_name || 'Guest User'}</p>
                            <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                          </div>
                        </div>
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
      </div>
    </div>
  );
};

export default ReviewList;
