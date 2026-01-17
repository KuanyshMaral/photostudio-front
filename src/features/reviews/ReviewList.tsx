import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudioReviews } from '../../api/reviewApi';
<<<<<<< HEAD
import { ReviewCard } from './ReviewCard';
import LoadingSpinner from '../../components/LoadingSpinner';
=======
import { ReviewCard } from './ReviewCard.tsx';
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410

interface ReviewListProps {
    studioId: number;
}

export const ReviewList: React.FC<ReviewListProps> = ({ studioId }) => {
    const { data: reviews, isLoading } = useQuery({
        queryKey: ['reviews', studioId],
        queryFn: () => getStudioReviews(studioId),
    });
<<<<<<< HEAD

    if (isLoading) return <div className="py-4"><LoadingSpinner size="sm" text="Загрузка отзывов..." /></div>;

    return (
        <div className="reviews mt-8">
            <h2 className="text-2xl font-semibold mb-6">Отзывы</h2>
            {reviews?.length === 0 && <p className="text-gray-500">Пока нет отзывов</p>}
            <div className="space-y-4">
                {reviews?.map(review => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>
        </div>
    );
};
=======
    
    if (isLoading) return <p>Загрузка отзывов...</p>;
    
    return (
        <div className="reviews">
            <h2>Отзывы</h2>
            {reviews?.length === 0 && <p>Пока нет отзывов</p>}
            {reviews?.map(review => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    );
};
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
