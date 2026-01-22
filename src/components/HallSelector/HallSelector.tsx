import React from 'react';
import { Users, Maximize, DollarSign } from 'lucide-react';
import type { Room } from '../../types';
import './HallSelector.css';

interface HallSelectorProps {
  rooms: Room[];
  selectedRoomId: number | null;
  onSelect: (roomId: number) => void;
}

/**
 * HallSelector — карточки залов с подсветкой выбранного.
 */
export const HallSelector: React.FC<HallSelectorProps> = ({
  rooms,
  selectedRoomId,
  onSelect,
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₸/час';
  };

  return (
    <div className="hall-selector">
      {rooms.map(room => (
        <button
          key={room.id}
          className={`hall-selector__card ${
            selectedRoomId === room.id ? 'hall-selector__card--selected' : ''
          }`}
          onClick={() => onSelect(room.id)}
        >
          {/* Thumbnail */}
          <div className="hall-selector__image">
            {room.photos?.[0] ? (
              <img src={room.photos[0]} alt={room.name} />
            ) : (
              <div className="hall-selector__placeholder">📷</div>
            )}
          </div>

          {/* Info */}
          <div className="hall-selector__info">
            <h4 className="hall-selector__name">{room.name}</h4>
            
            <div className="hall-selector__meta">
              {room.capacity && (
                <span className="hall-selector__meta-item">
                  <Users size={14} />
                  до {room.capacity} чел.
                </span>
              )}
              {room.area_sqm && (
                <span className="hall-selector__meta-item">
                  <Maximize size={14} />
                  {room.area_sqm} м²
                </span>
              )}
            </div>

            <div className="hall-selector__price">
              <DollarSign size={16} />
              {formatPrice(room.price_per_hour_min)}
            </div>
          </div>

          {/* Selected indicator */}
          {selectedRoomId === room.id && (
            <div className="hall-selector__check">✓</div>
          )}
        </button>
      ))}
    </div>
  );
};

export default HallSelector;
