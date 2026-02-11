// src/components/StudioCard.tsx

import React from 'react';
import { MapPin, Star, Camera, Heart, Users } from 'lucide-react';
import type { Studio } from '../types';

interface StudioCardProps {
  studio: Studio;
  onClick?: () => void;
}

const StudioCard: React.FC<StudioCardProps> = ({ studio, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="modern-card overflow-hidden cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {studio.photos && studio.photos.length > 0 ? (
          <img 
            src={studio.photos[0]} 
            alt={studio.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Overlay with favorite button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-4 right-4">
            <button 
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle favorite toggle
              }}
            >
              <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Rating badge */}
        {studio.rating && (
          <div className="absolute top-4 left-4">
            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-gray-800">
                {studio.rating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {studio.name}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-primary-500" />
            <span className="text-sm line-clamp-1">{studio.address}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {studio.reviews_count && (
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {studio.reviews_count}
                </span>
              </div>
            )}
            {studio.district && (
              <div className="modern-badge">
                {studio.district}
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        {studio.min_price && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Цена от</p>
              <p className="text-2xl font-bold gradient-text">
                {studio.min_price.toLocaleString()} ₸
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">в час</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioCard;