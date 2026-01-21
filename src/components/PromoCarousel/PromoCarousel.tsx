import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './PromoCarousel.css';

interface PromoSlide {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
}

interface PromoCarouselProps {
  slides?: PromoSlide[];
  autoPlay?: boolean;
  interval?: number;
}

// Демо-слайды если не переданы
const defaultSlides: PromoSlide[] = [
  {
    id: 1,
    image: '/images/promo/promo-1.jpg',
    title: 'Скидка 20% на первое бронирование',
    subtitle: 'Только для новых клиентов',
  },
  {
    id: 2,
    image: '/images/promo/promo-2.jpg',
    title: 'Новая студия в центре города',
    subtitle: 'PhotoPro Studio — теперь на Абая',
  },
  {
    id: 3,
    image: '/images/promo/promo-3.jpg',
    title: 'Выходные со скидкой',
    subtitle: 'Сб-Вс бронирование на 15% дешевле',
  },
];

export const PromoCarousel: React.FC<PromoCarouselProps> = ({
  slides = defaultSlides,
  autoPlay = true,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play logic
  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length]);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div className="promo-carousel">
      <div className="promo-carousel__container">
        {/* Background Image */}
        <div 
          className="promo-carousel__slide"
          style={{ backgroundImage: `url(${currentSlide.image})` }}
        >
          <div className="promo-carousel__overlay">
            <div className="promo-carousel__content">
              <h2 className="promo-carousel__title">{currentSlide.title}</h2>
              {currentSlide.subtitle && (
                <p className="promo-carousel__subtitle">{currentSlide.subtitle}</p>
              )}
              {currentSlide.link && (
                <a href={currentSlide.link} className="promo-carousel__cta">
                  Подробнее
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        {slides.length > 1 && (
          <>
            <button 
              className="promo-carousel__arrow promo-carousel__arrow--left"
              onClick={goToPrevious}
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="promo-carousel__arrow promo-carousel__arrow--right"
              onClick={goToNext}
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className="promo-carousel__dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`promo-carousel__dot ${
                    index === currentIndex ? 'promo-carousel__dot--active' : ''
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PromoCarousel;
