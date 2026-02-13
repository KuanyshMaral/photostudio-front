import { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import type { StudioFilterParams } from '../../../types/index_new';

interface StudioFiltersProps {
  filters: StudioFilterParams;
  onFilterChange: (filters: StudioFilterParams) => void;
}

export default function StudioFilters({ filters, onFilterChange }: StudioFiltersProps) {
  const [localFilters, setLocalFilters] = useState<StudioFilterParams>({
    city: filters.city || '',
    min_price: filters.min_price || 0,
    max_price: filters.max_price || 50000,
    room_type: filters.room_type || '',
    search: filters.search || ''
  });

  // Debounce поиска (300ms)
  const debouncedSearch = useDebounce(localFilters.search, 300);

  // Синхронизируем локальный стейт с внешними фильтрами
  useEffect(() => {
    setLocalFilters({
      city: filters.city || '',
      min_price: filters.min_price || 0,
      max_price: filters.max_price || 50000,
      room_type: filters.room_type || '',
      search: filters.search || ''
    });
  }, [filters.city, filters.min_price, filters.max_price, filters.room_type, filters.search]);

  // Вызываем callback при изменении фильтров
  useEffect(() => {
    const cleanFilters: StudioFilterParams = {
      city: localFilters.city || undefined,
      min_price: localFilters.min_price || undefined,
      max_price: localFilters.max_price || undefined,
      room_type: localFilters.room_type || undefined,
      search: debouncedSearch || undefined
    };
    
    // Remove undefined values
    const filtered = Object.fromEntries(
      Object.entries(cleanFilters).filter(([_, v]) => v !== undefined)
    );
    
    onFilterChange(filtered);
  }, [localFilters.city, localFilters.min_price, localFilters.max_price, localFilters.room_type, debouncedSearch]);

  const updateFilter = (key: keyof StudioFilterParams, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFilters: StudioFilterParams = {
      city: localFilters.city || undefined,
      min_price: localFilters.min_price || undefined,
      max_price: localFilters.max_price || undefined,
      room_type: localFilters.room_type || undefined,
      search: localFilters.search || undefined
    };
    
    const filtered = Object.fromEntries(
      Object.entries(cleanFilters).filter(([_, v]) => v !== undefined)
    );
    
    onFilterChange(filtered);
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
            value={localFilters.search || ''}
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
          value={localFilters.city || ''}
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
            value={localFilters.min_price || ''}
            onChange={(e) => updateFilter('min_price', Number(e.target.value))}
            placeholder="От"
            className="w-1/2 p-2 border rounded-lg"
          />
          <input
            type="number"
            value={localFilters.max_price || ''}
            onChange={(e) => updateFilter('max_price', Number(e.target.value))}
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
                checked={localFilters.room_type === type}
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
              checked={localFilters.room_type === '' || !localFilters.room_type}
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
          const resetFilters = {
            city: '',
            min_price: 0,
            max_price: 50000,
            room_type: '',
            search: ''
          };
          setLocalFilters(resetFilters);
          onFilterChange(resetFilters);
        }}
        className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
      >
        Сбросить фильтры
      </button>
    </div>
  );
}
