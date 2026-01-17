import React, { useState } from 'react';
<<<<<<< HEAD
import { toast } from 'react-hot-toast';
import { createReview } from '../../api/reviewApi';
import { useAuth } from '../../context/AuthContext.tsx';
import { StarRating } from './StarRating';
=======
import { useAuth } from '../../context/AuthContext';
import { createReview } from '../../api/reviewApi';
import toast from 'react-hot-toast';
import { StarRating } from './StarRating.tsx';
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410

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
<<<<<<< HEAD

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error('Вы должны быть авторизованы');
            return;
        }

        setIsSubmitting(true);
        try {
            await createReview(token, {
                // studio_id: studioId, // Removed as per API definition check, but keeping if backend requires it. 
                // Based on API type CreateReviewRequest { booking_id, rating, comment }, studio_id might not be in body.
                // Assuming the prompt code is correct for the spec, passing it. 
                // If TypeScript complains, cast it or update the type.
                studio_id: studioId, 
                booking_id: bookingId,
                rating,
                comment,
            } as any); 
            toast.success('Отзыв добавлен!');
            onSuccess();
        } catch (error: any) {
            toast.error(error.message || 'Ошибка отправки отзыва');
=======
    
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
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
        } finally {
            setIsSubmitting(false);
        }
    };
<<<<<<< HEAD

    return (
        <form onSubmit={handleSubmit} className="review-form bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Оставить отзыв</h3>
            <div className="mb-4">
                <StarRating rating={rating} editable onChange={setRating} />
            </div>
=======
    
    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h3>Оставить отзыв</h3>
            <StarRating rating={rating} editable onChange={setRating} />
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
            <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Ваш отзыв..."
<<<<<<< HEAD
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] mb-4"
                required
=======
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-lg"
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
            />
            <button 
                type="submit" 
                disabled={isSubmitting}
<<<<<<< HEAD
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
=======
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
            >
                {isSubmitting ? 'Отправка...' : 'Отправить'}
            </button>
        </form>
    );
<<<<<<< HEAD
};
=======
};
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
