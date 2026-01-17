import React from 'react';
import { MapPin, Star, Clock, Filter, TrendingUp } from 'lucide-react';
import { StudioFilters } from './StudioFilters';
import type { StudioFilterParams } from '../../../types';

interface LeftPanelProps {
  filters: StudioFilterParams;
  onFilterChange: (filters: StudioFilterParams) => void;
  totalStudios: number;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ 
  filters, 
  onFilterChange, 
  totalStudios 
}) => {
  return (
    <div className="lg:w-1/4 space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Фильтры</h3>
        </div>
        <StudioFilters 
          filters={filters} 
          onFilterChange={onFilterChange}
        />
      </div>

      {/* Popular Cities */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Популярные города</h3>
        <div className="space-y-2">
          {['Алматы', 'Астана', 'Шымкент', 'Караганда'].map((city) => (
            <button
              key={city}
              onClick={() => onFilterChange({ ...filters, city })}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                filters.city === city 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Room Types */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Типы залов</h3>
        <div className="space-y-2">
          {[
            { value: 'Fashion', label: 'Фэшн студия' },
            { value: 'Portrait', label: 'Портретная' },
            { value: 'Creative', label: 'Креативная' },
            { value: 'Commercial', label: 'Коммерческая' }
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => onFilterChange({ ...filters, room_type: type.value })}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                filters.room_type === type.value 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Статистика</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Всего студий
            </div>
            <span className="font-semibold text-gray-900">{totalStudios}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 mr-2" />
              Средний рейтинг
            </div>
            <span className="font-semibold text-gray-900">4.5</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              Часы работы
            </div>
            <span className="font-semibold text-gray-900">24/7</span>
          </div>
        </div>
      </div>

      {/* Popular Studios */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Популярные студии</h3>
        <div className="space-y-3">
          {[
            { name: 'Photo Pro Studio', rating: 4.8, reviews: 124 },
            { name: 'Creative Space', rating: 4.6, reviews: 89 },
            { name: 'Light House', rating: 4.9, reviews: 156 }
          ].map((studio, index) => (
            <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{studio.name}</h4>
                  <div className="flex items-center mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">
                      {studio.rating} ({studio.reviews})
                    </span>
                  </div>
                </div>
                <MapPin className="w-3 h-3 text-gray-400 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
