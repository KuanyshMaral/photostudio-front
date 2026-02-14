import { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import type { StudioFilterParams } from '../../../types/index_new';

interface StudioFiltersProps {
  filters: StudioFilterParams;
  onFilterChange: (filters: StudioFilterParams) => void;
}

export default function StudioFilters({ filters, onFilterChange }: StudioFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [minPriceInput, setMinPriceInput] = useState(String(filters.min_price || ''));
  const [maxPriceInput, setMaxPriceInput] = useState(String(filters.max_price || ''));

  // Debounce поиска (500ms)
  const debouncedSearch = useDebounce(searchInput, 500);

  // Применяем debounced поиск
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch]);

  // Синхронизация при изменении внешних фильтров
  useEffect(() => {
    setSearchInput(filters.search || '');
    setMinPriceInput(String(filters.min_price || ''));
    setMaxPriceInput(String(filters.max_price || ''));
  }, [filters.search, filters.min_price, filters.max_price]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPriceInput(value);
    if (value === '' || /^\d+$/.test(value)) {
      onFilterChange({ 
        ...filters, 
        min_price: value === '' ? undefined : Number(value) 
      });
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPriceInput(value);
    if (value === '' || /^\d+$/.test(value)) {
      onFilterChange({ 
        ...filters, 
        max_price: value === '' ? undefined : Number(value) 
      });
    }
  };

  const updateFilter = (key: keyof StudioFilterParams, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    onFilterChange({
      city: '',
      min_price: undefined,
      max_price: undefined,
      room_type: '',
      search: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h3 className="font-semibold text-lg">Фильтры</h3>

      {/* Поиск */}
      <div>
        <label className="block text-sm font-medium mb-1">Поиск</label>
        <input
          type="text"
          value={searchInput}
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
            type="text"
            value={minPriceInput}
            onChange={handleMinPriceChange}
            placeholder="От"
            className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={maxPriceInput}
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
          {[].map(type => (
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
