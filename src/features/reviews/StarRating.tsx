import React from 'react';

interface StarRatingProps {
    rating: number;
    editable?: boolean;
    onChange?: (r: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, editable = false, onChange }) => (
    <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
            <span
                key={star}
                className={`star ${star <= rating ? 'filled' : ''} ${editable ? 'editable' : ''}`}
                onClick={() => editable && onChange?.(star)}
            >
                ★
            </span>
        ))}
    </div>
);
