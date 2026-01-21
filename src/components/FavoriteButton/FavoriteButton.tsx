import React, { useState, useCallback, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './FavoriteButton.css';

interface FavoriteButtonProps {
  studioId: number;
  initialState?: boolean;
  onToggle?: (isFavorite: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * FavoriteButton — кнопка добавления в избранное.
 * 
 * Показывает сердечко (пустое/заполненное).
 * При клике сохраняет состояние в localStorage (mock).
 * Имеет оптимистичное обновление UI.
 */
export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  studioId,
  initialState = false,
  onToggle,
  size = 'md',
}) => {
  const { token } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Размеры иконки в зависимости от size prop
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  // Загружаем избранное из localStorage при монтировании
  useEffect(() => {
    if (token) {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${token}`) || '[]');
      const isFav = favorites.includes(studioId);
      setIsFavorite(isFav);
    }
  }, [studioId, token]);

  // Сохраняем избранное в localStorage
  const saveFavorites = useCallback((favorites: number[]) => {
    if (token) {
      localStorage.setItem(`favorites_${token}`, JSON.stringify(favorites));
    }
  }, [token]);

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    // Предотвращаем всплытие (чтобы не открылась карточка студии)
    e.preventDefault();
    e.stopPropagation();

    if (isLoading || !token) {
      // Если нет токена, просто показываем анимацию без сохранения
      if (!token) {
        const newState = !isFavorite;
        setIsFavorite(newState);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
        return;
      }
      return;
    }

    // Оптимистичное обновление
    const newState = !isFavorite;
    setIsFavorite(newState);
    setIsAnimating(true);
    setIsLoading(true);

    try {
      // Mock API call - сохраняем в localStorage
      const favorites = JSON.parse(localStorage.getItem(`favorites_${token}`) || '[]');
      
      if (newState) {
        // Добавляем в избранное
        if (!favorites.includes(studioId)) {
          favorites.push(studioId);
        }
      } else {
        // Удаляем из избранного
        const index = favorites.indexOf(studioId);
        if (index > -1) {
          favorites.splice(index, 1);
        }
      }
      
      saveFavorites(favorites);
      
      // Вызываем callback если есть
      onToggle?.(newState);
      
      console.log(`Studio ${studioId} ${newState ? 'added to' : 'removed from'} favorites (mock)`);
      
    } catch (error) {
      // Откатываем при ошибке
      setIsFavorite(!newState);
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
      // Убираем анимацию через 300ms
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [studioId, isFavorite, isLoading, token, onToggle, saveFavorites]);

  return (
    <button
      className={`favorite-button favorite-button--${size} ${
        isFavorite ? 'favorite-button--active' : ''
      } ${isAnimating ? 'favorite-button--animating' : ''}`}
      onClick={handleClick}
      disabled={isLoading}
      aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
      title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <Heart
        size={iconSizes[size]}
        fill={isFavorite ? 'currentColor' : 'none'}
        strokeWidth={2}
      />
    </button>
  );
};

export default FavoriteButton;
