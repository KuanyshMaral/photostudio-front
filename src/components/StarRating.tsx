import React from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange, 
  size = 'md', 
  readonly = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly) {
      onRatingChange(starRating);
    }
  };

  const handleMouseEnter = (starRating: number) => {
    if (!readonly) {
      onRatingChange(starRating);
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFilled = starValue <= rating;
    const isHalfFilled = starValue === Math.ceil(rating) && rating % 1 !== 0;

    return (
      <button
        key={index}
        type="button"
        className={`${sizeClasses[size]} transition-colors duration-200 ${
          readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transform'
        }`}
        onClick={() => handleStarClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        disabled={readonly}
      >
        <svg
          className={`${sizeClasses[size]} ${
            isFilled ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`star-gradient-${index}`}>
              {isHalfFilled ? (
                <>
                  <stop offset="50%" stopColor="#FBBF24" />
                  <stop offset="50%" stopColor="#D1D5DB" />
                </>
              ) : isFilled ? (
                <stop offset="100%" stopColor="#FBBF24" />
              ) : (
                <stop offset="100%" stopColor="#D1D5DB" />
              )}
            </linearGradient>
          </defs>
          <path
            fill={isHalfFilled ? `url(#star-gradient-${index})` : 'currentColor'}
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      </button>
    );
  };

  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2, 3, 4].map(renderStar)}
      {!readonly && (
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? `${rating}.0` : 'Select rating'}
        </span>
      )}
    </div>
  );
};

export default StarRating;
