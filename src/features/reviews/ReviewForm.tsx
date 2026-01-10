import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createReview } from '../../api/reviewApi';
import toast from 'react-hot-toast';
import { StarRating } from './StarRating.tsx';

interface ReviewFormProps {
    studioId: number;
    bookingId: number;
    onSuccess: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ studioId, bookingId, onSuccess }) => {
    const { token } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        
        setIsSubmitting(true);
        try {
            await createReview(token, {
                studio_id: studioId,
                booking_id: bookingId,
                rating,
                comment,
            });
            toast.success('Отзыв добавлен!');
            onSuccess();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create review';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h3>Оставить отзыв</h3>
            <StarRating rating={rating} editable onChange={setRating} />
            <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Ваш отзыв..."
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                {isSubmitting ? 'Отправка...' : 'Отправить'}
            </button>
        </form>
    );
};
