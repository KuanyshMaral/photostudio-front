import { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import type { StudioFilterParams } from '../../../types/index_new';

interface StudioFiltersProps {
  filters: StudioFilterParams;
  onFilterChange: (filters: StudioFilterParams) => void;
}

export default function StudioFilters({ filters, onFilterChange }: StudioFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');

  // Debounce поиска (300ms)
  const debouncedSearch = useDebounce(searchValue, 300);

  // Применяем debounced поиск
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch, filters.search, filters, onFilterChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchValue });
  };

  const updateFilter = (key: keyof StudioFilterParams, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h3 className="font-semibold text-lg">Фильтры</h3>

      {/* Поиск */}
      <form onSubmit={handleSearchSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">Поиск</label>
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Название студии..."
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </form>

      {/* Город */}
      <div>
        <label className="block text-sm font-medium mb-1">Город</label>
        <select
          value={filters.city || ''}
          onChange={(e) => updateFilter('city', e.target.value)}
          className="w-full p-2 border rounded-lg"
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
            value={filters.min_price || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d+$/.test(value)) {
                updateFilter('min_price', value === '' ? undefined : Number(value));
              }
            }}
            placeholder="От"
            className="w-1/2 p-2 border rounded-lg"
          />
          <input
            type="text"
            value={filters.max_price || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d+$/.test(value)) {
                updateFilter('max_price', value === '' ? undefined : Number(value));
              }
            }}
            placeholder="До"
            className="w-1/2 p-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Тип зала */}
      <div>
        <label className="block text-sm font-medium mb-1">Тип зала</label>
        <div className="space-y-2">
          {[].map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
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
          <label className="flex items-center gap-2 cursor-pointer">
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
        onClick={() => {
          setSearchValue('');
          onFilterChange({
            city: '',
            min_price: undefined,
            max_price: undefined,
            room_type: '',
            search: ''
          });
        }}
        className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
      >
        Сбросить фильтры
      </button>
    </div>
  );
}
