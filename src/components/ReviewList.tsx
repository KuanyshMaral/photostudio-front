import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudioReviews, type Review } from '../api/reviewApi';
import StarRating from './StarRating';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  studioId: number;
  studioName?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function ReviewList({ studioId, studioName }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['studio-reviews', studioId, currentPage],
    queryFn: () => getStudioReviews(studioId),
    enabled: !!studioId,
  });

  // Mock pagination data (in real app, this would come from API)
  const pagination: PaginationInfo = {
    currentPage,
    totalPages: Math.ceil((reviews?.length || 0) / itemsPerPage),
    totalItems: reviews?.length || 0,
    itemsPerPage,
  };

  // Get current page items
  const currentReviews = reviews?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Не удалось загрузить отзывы. Попробуйте позже.
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {studioName ? `У студии "${studioName}" пока нет отзывов` : 'Пока нет отзывов'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews List */}
      <div className="space-y-4">
        {currentReviews.map((review: Review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <PaginationControls
          pagination={pagination}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
            <StarRating 
              rating={review.rating} 
              size="sm" 
              readonly={true}
              onRatingChange={() => {}} 
            />
          </div>
          <p className="text-sm text-gray-500">
            {formatDate(review.created_at)}
            {review.room_name && ` • ${review.room_name}`}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </div>

      {review.studio_name && (
        <div className="text-xs text-gray-500 border-t pt-3">
          Отзыв о студии: {review.studio_name}
        </div>
      )}
    </div>
  );
}

interface PaginationControlsProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

function PaginationControls({ pagination, onPageChange }: PaginationControlsProps) {
  const { currentPage, totalPages, totalItems } = pagination;

  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
      <div className="text-sm text-gray-600">
        Показано {((currentPage - 1) * pagination.itemsPerPage) + 1}-
        {Math.min(currentPage * pagination.itemsPerPage, totalItems)} из {totalItems} отзывов
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Назад
        </button>
        
        {getVisiblePages().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm border rounded ${
              page === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Вперед
        </button>
      </div>
    </div>
  );
}
