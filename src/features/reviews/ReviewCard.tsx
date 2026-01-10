import React from 'react';
import type { Review } from '../../api/reviewApi';
import { StarRating } from './StarRating.tsx';

interface ReviewCardProps {
    review: Review & { owner_response?: string };
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => (
    <div className="review-card">
        <div className="review-header">
            <StarRating rating={review.rating} />
            <span className="review-date">
                {new Date(review.created_at).toLocaleDateString('ru-RU')}
            </span>
        </div>
        <p className="review-comment">{review.comment}</p>
        {review.owner_response && (
            <div className="owner-response">
                <strong>Ответ владельца:</strong>
                <p>{review.owner_response}</p>
            </div>
        )}
    </div>
);
