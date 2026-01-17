import React from 'react';

<<<<<<< HEAD
export const StarRating: React.FC<{ rating: number; editable?: boolean; onChange?: (r: number) => void }> = ({
    rating,
    editable = false,
    onChange
}) => (
    <div className="flex gap-1 text-yellow-400">
        {[1, 2, 3, 4, 5].map(star => (
            <span
                key={star}
                className={`text-xl ${editable ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
=======
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
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
                onClick={() => editable && onChange?.(star)}
            >
                ★
            </span>
        ))}
    </div>
<<<<<<< HEAD
);
=======
);
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
