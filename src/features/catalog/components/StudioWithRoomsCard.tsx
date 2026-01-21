import React from 'react';
import type { Studio, Room } from '../../../types';
import { Star, MapPin, Users, DollarSign, MessageCircle } from 'lucide-react';

interface StudioWithRoomsCardProps {
  studio: Studio;
  rooms?: Room[];
  onClick: () => void;
  onContactOwner?: (studio: Studio) => void;
}

export const StudioWithRoomsCard: React.FC<StudioWithRoomsCardProps> = ({ 
  studio, 
  rooms = [],
  onClick,
  onContactOwner 
}) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
      onClick={onClick}
    >
      {/* Studio Header */}
      <div className="relative">
        {/* Studio Image */}
        <div className="h-48 bg-gray-200">
          {studio.photos && studio.photos.length > 0 ? (
            <img 
              src={studio.photos[0]} 
              alt={studio.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        
        {/* Studio Rating Badge */}
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-md flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm font-semibold">{(studio.rating || 0).toFixed(1)}</span>
        </div>
      </div>

      {/* Studio Info */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{studio.name}</h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm">{studio.address}</span>
        </div>

        {/* Price Range */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Цена за час:</span>
          <div className="text-right">
            {studio.min_price && (
              <p className="font-bold text-blue-600">
                от {studio.min_price.toLocaleString()} ₸
              </p>
            )}
          </div>
        </div>

        {/* Rooms Section */}
        <div className="border-t pt-3">
          <h4 className="font-semibold text-gray-900 mb-2">Доступные залы:</h4>
          {rooms.length > 0 ? (
            <div className="space-y-2">
              {rooms.slice(0, 2).map((room) => (
                <div key={room.id} className="bg-gray-50 rounded p-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{room.name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          до {room.capacity} чел
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {room.area_sqm} м²
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-blue-600">
                        {room.price_per_hour_min.toLocaleString()} ₸
                      </p>
                      <p className="text-xs text-gray-500">/час</p>
                    </div>
                  </div>
                </div>
              ))}
              {rooms.length > 2 && (
                <p className="text-sm text-gray-500 text-center">
                  +{rooms.length - 2} еще залов
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Нет доступных залов</p>
          )}
        </div>

        {/* District Badge */}
        {studio.district && (
          <div className="mt-3">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
              {studio.district}
            </span>
          </div>
        )}

        {/* Contact Owner Button */}
        {onContactOwner && (
          <div className="mt-4 pt-3 border-t">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onContactOwner(studio);
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Написать владельцу
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
