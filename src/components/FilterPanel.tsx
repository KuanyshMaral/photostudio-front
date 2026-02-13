// src/components/FilterPanel.tsx

import React from 'react';
import { X } from 'lucide-react';
import type { Filters } from '../types';

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange, onClose }) => {
  const roomTypes: string[] = [];
  const cities: string[] = [];

  const handleReset = () => {
    onChange({
      city: '',
      min_price: '',
      max_price: '',
      room_type: '',
      search: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Фильтры</h3>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Filters */}
        <div className="p-4 space-y-4">
          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Город
            </label>
            <select
              value={filters.city}
              onChange={(e) => onChange({ ...filters, city: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все города</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Тип зала
            </label>
            <select
              value={filters.room_type}
              onChange={(e) => onChange({ ...filters, room_type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все типы</option>
              {roomTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Цена за час (₸)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="От"
                value={filters.min_price}
                onChange={(e) => onChange({ ...filters, min_price: e.target.value })}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
              <input
                type="number"
                placeholder="До"
                value={filters.max_price}
                onChange={(e) => onChange({ ...filters, max_price: e.target.value })}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Сбросить
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Применить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;