import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Studio } from '../../../types';
import { Star, MapPin } from 'lucide-react';

interface StudioCardProps {
  studio: Studio;
  onClick?: () => void;
}

export const StudioCard: React.FC<StudioCardProps> = ({ studio, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/studios/${studio.id}`);
    }
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
      onClick={handleClick}
    >
      {/* Image Placeholder */}
      <div className="h-48 w-full bg-gray-200 object-cover">
        {studio.photos && studio.photos.length > 0 ? (
          <img 
            src={studio.photos[0]} 
            alt={studio.name} 
            className="h-full w-full object-cover transition-transform group-hover:scale-105" 
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">{studio.name}</h3>
            <div className="flex items-center gap-1 text-sm font-medium">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{studio.rating || '0.0'}</span>
                <span className="text-gray-500">({studio.reviews_count || 0})</span>
            </div>
        </div>

        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPin className="mr-1 h-4 w-4" />
          {studio.address}
        </div>

        <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
                Starting from
            </div>
            <div className="text-lg font-bold text-primary">
                {new Intl.NumberFormat('ru-KZ', { style: 'currency', currency: 'KZT' }).format(studio.min_price || 0)}
                <span className="text-sm font-normal text-gray-500">/hour</span>
            </div>
        </div>
      </div>
    </div>
  );
};