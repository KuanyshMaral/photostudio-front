import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import type { StudioFilterParams } from '../../../types/index';

interface Filters {
  city: string;
  min_price: number;
  max_price: number;
  room_type: string;
  search: string;
}

interface StudioFiltersProps {
  filters: StudioFilterParams;
  onFilterChange: (filters: StudioFilterParams) => void;
}

export const StudioFilters: React.FC<StudioFiltersProps> = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState<Filters>({
    city: filters.city || '',
    min_price: filters.min_price || 0,
    max_price: filters.max_price || 50000,
    room_type: filters.room_type || '',
    search: filters.search || ''
  });

  // Debounce search (500ms for better UX)
  const debouncedSearch = useDebounce(localFilters.search, 500);

  // Sync local filters with props when they change from outside
  useEffect(() => {
    setLocalFilters({
      city: filters.city || '',
      min_price: filters.min_price || 0,
      max_price: filters.max_price || 50000,
      room_type: filters.room_type || '',
      search: filters.search || ''
    });
  }, [filters.city, filters.min_price, filters.max_price, filters.room_type, filters.search]);

  // Call callback when filters change (except search which is debounced)
  useEffect(() => {
    const cleanFilters: StudioFilterParams = {
      ...localFilters,
      search: debouncedSearch
    };
    
    // Remove empty values to keep query clean
    Object.keys(cleanFilters).forEach(key => {
      const value = cleanFilters[key as keyof StudioFilterParams];
      if (value === '' || value === null || value === undefined) {
        delete cleanFilters[key as keyof StudioFilterParams];
      }
    });
    
    onFilterChange(cleanFilters);
  }, [localFilters.city, localFilters.min_price, localFilters.max_price, localFilters.room_type, debouncedSearch]);

  const updateFilter = (key: keyof Filters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    const defaultFilters = {
      city: '',
      min_price: 0,
      max_price: 50000,
      room_type: '',
      search: ''
    };
    setLocalFilters(defaultFilters);
    // Also call onFilterChange immediately for reset
    onFilterChange(defaultFilters);
  };

  return (
    <div className="space-y-6 rounded-lg border p-4 shadow-sm bg-white">
      <div>
        <h3 className="font-semibold mb-4">Фильтры</h3>
        
        {/* Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Поиск</label>
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Название студии..."
            className="w-full rounded-md border p-2"
          />
        </div>

        {/* City Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Город</label>
          <select 
            value={localFilters.city} 
            onChange={(e) => updateFilter('city', e.target.value)} 
            className="w-full rounded-md border p-2"
          >
            <option value="">Все города</option>
            <option value="Алматы">Алматы</option>
            <option value="Астана">Астана</option>
            <option value="Шымкент">Шымкент</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Цена за час (₸)</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={localFilters.min_price || ''}
              onChange={(e) => updateFilter('min_price', Number(e.target.value) || 0)}
              placeholder="От" 
              className="w-1/2 rounded-md border p-2"
            />
            <input 
              type="number" 
              value={localFilters.max_price || ''}
              onChange={(e) => updateFilter('max_price', Number(e.target.value) || 0)}
              placeholder="До" 
              className="w-1/2 rounded-md border p-2"
            />
          </div>
        </div>

        {/* Room Type Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Тип зала</label>
          <div className="space-y-2">
            {['Fashion', 'Portrait', 'Creative', 'Commercial'].map(type => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="roomType"
                  value={type}
                  checked={localFilters.room_type === type}
                  onChange={(e) => updateFilter('room_type', e.target.value)}
                  className="text-blue-600"
                />
                {type}
              </label>
            ))}
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="roomType"
                value=""
                checked={localFilters.room_type === ''}
                onChange={() => updateFilter('room_type', '')}
                className="text-blue-600"
              />
              Любой
            </label>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
      >
        Сбросить фильтры
      </button>
    </div>
  );
};