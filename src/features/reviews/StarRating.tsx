import React from 'react';

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
                onClick={() => editable && onChange?.(star)}
            >
                ★
            </span>
        ))}
    </div>
);