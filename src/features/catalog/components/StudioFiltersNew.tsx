import { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';

interface Filters {
  city: string;
  minPrice: number;
  maxPrice: number;
  roomType: string;
  search: string;
}

interface StudioFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

export default function StudioFilters({ onFilterChange }: StudioFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    city: '',
    minPrice: 0,
    maxPrice: 50000,
    roomType: '',
    search: ''
  });

  // Debounce поиска (300ms)
  const debouncedSearch = useDebounce(filters.search, 300);

  // Вызываем callback при изменении фильтров
  useEffect(() => {
    onFilterChange({ ...filters, search: debouncedSearch });
  }, [filters.city, filters.minPrice, filters.maxPrice, filters.roomType, debouncedSearch]);

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
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
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Название студии..."
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </form>

      {/* Город */}
      <div>
        <label className="block text-sm font-medium mb-1">Город</label>
        <select
          value={filters.city}
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
            type="number"
            value={filters.minPrice || ''}
            onChange={(e) => updateFilter('minPrice', Number(e.target.value))}
            placeholder="От"
            className="w-1/2 p-2 border rounded-lg"
          />
          <input
            type="number"
            value={filters.maxPrice || ''}
            onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
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
                checked={filters.roomType === type}
                onChange={(e) => updateFilter('roomType', e.target.value)}
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
              checked={filters.roomType === ''}
              onChange={() => updateFilter('roomType', '')}
              className="text-blue-600"
            />
            Любой
          </label>
        </div>
      </div>

      {/* Сброс */}
      <button
        onClick={() => setFilters({ city: '', minPrice: 0, maxPrice: 50000, roomType: '', search: '' })}
        className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
      >
        Сбросить фильтры
      </button>
    </div>
  );
}
