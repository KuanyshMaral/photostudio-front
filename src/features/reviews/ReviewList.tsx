import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudioReviews } from '../../api/reviewApi';
import { ReviewCard } from './ReviewCard.tsx';

interface ReviewListProps {
    studioId: number;
}

export const ReviewList: React.FC<ReviewListProps> = ({ studioId }) => {
    const { data: reviews, isLoading } = useQuery({
        queryKey: ['reviews', studioId],
        queryFn: () => getStudioReviews(studioId),
    });
    
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
