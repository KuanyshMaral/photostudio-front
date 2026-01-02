// src/components/StudioCard.tsx

import React from 'react';
import { MapPin, Star, Camera } from 'lucide-react';
import { Studio } from '../types';

interface StudioCardProps {
  studio: Studio;
  onClick: () => void;
}

const StudioCard: React.FC<StudioCardProps> = ({ studio, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {studio.photos && studio.photos.length > 0 ? (
          <img 
            src={studio.photos[0]} 
            alt={studio.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {studio.name}
        </h3>

        {/* Address */}
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{studio.address}</span>
        </div>

        {/* Rating and Price */}
        <div className="flex items-center justify-between mb-3">
          {/* Rating */}
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-1 font-semibold">{studio.rating.toFixed(1)}</span>
            <span className="ml-1 text-sm text-gray-500">
              ({studio.total_reviews})
            </span>
          </div>

          {/* Price */}
          {studio.min_price && (
            <div className="text-right">
              <p className="text-xs text-gray-500">от</p>
              <p className="font-bold text-blue-600">
                {studio.min_price.toLocaleString()} ₸
              </p>
            </div>
          )}
        </div>

        {/* District badge (optional) */}
        {studio.district && (
          <div className="mt-2">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
              {studio.district}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioCard;