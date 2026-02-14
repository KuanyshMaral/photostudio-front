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

  // Заглушка: состояние избранного приходит из props или API.
  // Удалены локальные мок-реализации с localStorage.
  useEffect(() => {
    setIsFavorite(initialState);
  }, [initialState]);

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
      // No-op: backend integration required. Only trigger callback.
      onToggle?.(newState);
    } finally {
      setIsLoading(false);
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
