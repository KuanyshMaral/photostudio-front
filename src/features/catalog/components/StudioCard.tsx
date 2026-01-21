import React, { useState, useEffect } from 'react';
import { Star, MapPin } from 'lucide-react';
import { FavoriteButton } from '../../../components/FavoriteButton';
import { useAuth } from '../../../context/AuthContext';
import './StudioCard.css';

interface Studio {
  id: number;
  name: string;
  address: string;
  price_per_hour: number;
  rating: number;
  photos: string[];
  district?: string;
  is_favorite?: boolean;
}

interface StudioCardProps {
  studio: Studio;
  onClick?: () => void;
}

/**
 * StudioCard — карточка студии в grid.
 * 
 * Показывает: фото, название, адрес, цену, рейтинг, район.
 * Имеет кнопку избранного в углу.
 * По клику открывает детальную модалку.
 */
export const StudioCard: React.FC<StudioCardProps> = ({ studio, onClick }) => {
  const { token } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Проверяем localStorage для состояния избранного
  useEffect(() => {
    if (token) {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${token}`) || '[]');
      const isFav = favorites.includes(studio.id);
      setIsFavorite(isFav);
    } else {
      setIsFavorite(studio.is_favorite || false);
    }
  }, [studio.id, studio.is_favorite, token]);

  // Получаем первое фото или placeholder
  const imageUrl = !imageError && studio.photos?.[0] 
    ? studio.photos[0] 
    : '/images/studio-placeholder.jpg';

  // Форматирование цены
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₸/час';
  };

  const handleFavoriteToggle = (newState: boolean) => {
    setIsFavorite(newState);
  };

  return (
    <article 
      className="studio-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Изображение с кнопкой избранного */}
      <div className="studio-card__image-container">
        <img
          src={imageUrl}
          alt={studio.name}
          className="studio-card__image"
          loading="lazy"
          onError={() => setImageError(true)}
        />
        
        {/* Кнопка избранного */}
        <div className="studio-card__favorite">
          <FavoriteButton
            studioId={studio.id}
            initialState={isFavorite}
            size="sm"
            onToggle={handleFavoriteToggle}
          />
        </div>

        {/* Район (badge внизу изображения) */}
        {studio.district && (
          <div className="studio-card__district">
            {studio.district}
          </div>
        )}
      </div>

      {/* Информация о студии */}
      <div className="studio-card__content">
        <h3 className="studio-card__title">{studio.name}</h3>
        
        <div className="studio-card__location">
          <MapPin size={14} />
          <span>{studio.address}</span>
        </div>

        <div className="studio-card__footer">
          <span className="studio-card__price">
            {formatPrice(studio.price_per_hour)}
          </span>
          
          <div className="studio-card__rating">
            <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
            <span>{studio.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default StudioCard;