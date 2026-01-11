import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { Studio } from '../types/types'; // Исправленный путь
import { formatPrice } from '../utils/format'; // Исправленный путь

interface StudioCardProps {
  studio: Studio;
  onClick?: () => void; 
}

export const StudioCard: React.FC<StudioCardProps> = ({ studio, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
    >
      <div className="h-48 w-full bg-gray-200 object-cover">
        {studio.preview_image ? (
          <img 
            src={studio.preview_image} 
            alt={studio.name} 
            className="h-full w-full object-cover transition-transform group-hover:scale-105" 
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">Нет фото</div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{studio.name}</h3>
            <div className="flex items-center gap-1 text-sm font-medium">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{studio.rating}</span>
                <span className="text-gray-500">({studio.total_reviews})</span>
            </div>
        </div>

        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPin className="mr-1 h-4 w-4" />
          <span className="line-clamp-1">{studio.address}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
                От
            </div>
            <div className="text-lg font-bold text-indigo-600">
                {formatPrice(studio.min_price)}
                <span className="text-sm font-normal text-gray-500">/час</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudioCard;