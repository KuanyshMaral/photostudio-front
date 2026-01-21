import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ImageCarousel.css';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
}

/**
 * ImageCarousel — горизонтальный слайдер изображений.
 * Используется в Studio Modal для "Best Shots".
 */
export const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  alt = 'Studio photo' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Нет изображений — показываем placeholder
  if (!images || images.length === 0) {
    return (
      <div className="image-carousel image-carousel--empty">
        <div className="image-carousel__placeholder">
          📷 Нет фотографий
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="image-carousel" ref={containerRef}>
      {/* Main Image */}
      <div className="image-carousel__main">
        <img
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          className="image-carousel__image"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              className="image-carousel__arrow image-carousel__arrow--left"
              onClick={goToPrevious}
              aria-label="Предыдущее фото"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="image-carousel__arrow image-carousel__arrow--right"
              onClick={goToNext}
              aria-label="Следующее фото"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="image-carousel__counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Dots Navigation */}
      {images.length > 1 && images.length <= 10 && (
        <div className="image-carousel__dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`image-carousel__dot ${
                index === currentIndex ? 'image-carousel__dot--active' : ''
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Перейти к фото ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails (для 3-5 фото) */}
      {images.length > 1 && images.length <= 5 && (
        <div className="image-carousel__thumbnails">
          {images.map((img, index) => (
            <button
              key={index}
              className={`image-carousel__thumbnail ${
                index === currentIndex ? 'image-carousel__thumbnail--active' : ''
              }`}
              onClick={() => goToSlide(index)}
            >
              <img src={img} alt={`Thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
