import { useState, useCallback, useRef, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import type { StudioFilterParams } from '../../../types/index_new';

interface StudioFiltersProps {
  filters: StudioFilterParams;
  onFilterChange: (filters: StudioFilterParams) => void;
}

export default function StudioFilters({ filters, onFilterChange }: StudioFiltersProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const minPriceRef = useRef<HTMLInputElement>(null);
  const maxPriceRef = useRef<HTMLInputElement>(null);
  
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchValue, 500);

  // Применяем debounced поиск
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch, filters, onFilterChange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  const handleMinPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      onFilterChange({ 
        ...filters, 
        min_price: value === '' ? undefined : Number(value) 
      });
    }
  }, [filters, onFilterChange]);

  const handleMaxPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      onFilterChange({ 
        ...filters, 
        max_price: value === '' ? undefined : Number(value) 
      });
    }
  }, [filters, onFilterChange]);

  const updateFilter = useCallback((key: keyof StudioFilterParams, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  }, [filters, onFilterChange]);

  const handleReset = useCallback(() => {
    setSearchValue('');
    onFilterChange({
      city: '',
      min_price: undefined,
      max_price: undefined,
      room_type: '',
      search: ''
    });
  }, [filters, onFilterChange]);

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h3 className="font-semibold text-lg">Фильтры</h3>

      {/* Поиск */}
      <div>
        <label className="block text-sm font-medium mb-1">Поиск</label>
        <input
          ref={searchInputRef}
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Название студии..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Город */}
      <div>
        <label className="block text-sm font-medium mb-1">Город</label>
        <select
          value={filters.city || ''}
          onChange={(e) => updateFilter('city', e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все города</option>
          <option value="Алматы">Алматы</option>
          <option value="Астана">Астана</option>
          <option value="Шымкент">Шымкент</option>
        </select>
      </div>

      {/* Цена */}
      <div>
        <label className="block text-sm font-medium mb-1">Цена за час (₸)</label>
        <div className="flex gap-2">
          <input
            ref={minPriceRef}
            key={`min-${filters.min_price}`}
            type="text"
            defaultValue={filters.min_price || ''}
            onChange={handleMinPriceChange}
            placeholder="От"
            className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            ref={maxPriceRef}
            key={`max-${filters.max_price}`}
            type="text"
            defaultValue={filters.max_price || ''}
            onChange={handleMaxPriceChange}
            placeholder="До"
            className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Тип зала */}
      <div>
        <label className="block text-sm font-medium mb-1">Тип зала</label>
        <div className="space-y-2">
          {['Fashion', 'Portrait', 'Creative', 'Commercial'].map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio"
                name="roomType"
                value={type}
                checked={filters.room_type === type}
                onChange={(e) => updateFilter('room_type', e.target.value)}
                className="text-blue-600"
              />
              {type}
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="radio"
              name="roomType"
              value=""
              checked={!filters.room_type || filters.room_type === ''}
              onChange={() => updateFilter('room_type', '')}
              className="text-blue-600"
            />
            Любой
          </label>
        </div>
      </div>

      {/* Сброс */}
      <button
        onClick={handleReset}
        className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        Сбросить фильтры
      </button>
    </div>
  );
}
