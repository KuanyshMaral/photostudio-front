import React, { useState } from "react";
import StarRating from "../../components/StarRating";
import { createReview } from "../../api/reviewApi";
import type { CreateReviewRequest } from "../../api/reviewApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface ReviewFormProps {
  bookingId?: number;
  studioId?: number;
  roomId?: string;
  roomName?: string;
  onReviewSubmitted?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  bookingId, 
  studioId,
  roomId, 
  roomName,
  onReviewSubmitted 
}) => {
  const { token } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): string[] => {
    const newErrors: string[] = [];
    
    if (rating === 0) {
      newErrors.push("Please select a rating");
    }
    
    if (comment.trim().length === 0) {
      newErrors.push("Please provide a comment");
    }
    
    if (comment.trim().length > 500) {
      newErrors.push("Comment must be less than 500 characters");
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (!bookingId) {
      toast.error('Review can only be submitted after a booking');
      return;
    }
    
    if (!studioId) {
      toast.error('Studio ID is required');
      return;
    }
    
    const formErrors = validateForm();
    setErrors(formErrors);
    
    if (formErrors.length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');
    
    try {
      const reviewData: CreateReviewRequest = {
        studio_id: studioId,
        booking_id: bookingId,
        rating,
        comment: comment.trim()
      };
      
      await createReview(token, reviewData);
      toast.success('Review submitted successfully!');
      setMessage('Review submitted successfully!');
      
      // Reset form
      setRating(0);
      setComment('');
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit review';
      toast.error(errorMessage);
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'Select a rating';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Write a Review</h2>
            <p className="text-amber-100 mt-1">
              {roomName ? `Review for ${roomName}` : 'Share your experience'}
            </p>
          </div>
          
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Room Info */}
              {roomId && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Room:</span> {roomId}
                    {roomName && ` (${roomName})`}
                  </p>
                  {bookingId && studioId ? (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Booking ID:</span> #{bookingId}
                    </p>
                  ) : (
                    <p className="text-sm text-amber-600 mt-1">
                      <span className="font-medium">Note:</span> Review can only be submitted after a booking
                    </p>
                  )}
                </div>
              )}

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  How was your experience?
                </label>
                <div className="flex items-center space-x-4">
                  <StarRating 
                    rating={rating} 
                    onRatingChange={setRating} 
                    size="lg" 
                  />
                  {rating > 0 && (
                    <span className="text-lg font-medium text-gray-700">
                      {getRatingText(rating)}
                    </span>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience with this room..."
                  rows={5}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 placeholder-gray-400 resize-none"
                />
                <div className="mt-1 text-right">
                  <span className={`text-sm ${
                    comment.length > 450 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {comment.length}/500
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !token || !bookingId || !studioId}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-amber-600 hover:to-orange-700 transform hover:scale-[1.02] transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-red-700 font-medium mb-2">Please fix the following:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-red-600 text-sm">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className={`mt-6 p-4 rounded-lg border ${
                message.includes('successfully') 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-yellow-50 border-yellow-200 text-yellow-700'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
