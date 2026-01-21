import React from 'react';
import { MapPin, Building2, DollarSign } from 'lucide-react';
import './HorizontalFilters.css';

interface FiltersState {
  city: string;
  district: string;
  priceMin: number;
  priceMax: number;
}

interface HorizontalFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
}

// Константы для dropdowns
const CITIES = [
  { value: '', label: 'Все города' },
  { value: 'almaty', label: 'Алматы' },
  { value: 'astana', label: 'Астана' },
  { value: 'shymkent', label: 'Шымкент' },
];

const DISTRICTS = [
  { value: '', label: 'Все районы' },
  { value: 'medeu', label: 'Медеуский' },
  { value: 'bostandyk', label: 'Бостандыкский' },
  { value: 'almaly', label: 'Алмалинский' },
  { value: 'auezov', label: 'Ауэзовский' },
];

export const HorizontalFilters: React.FC<HorizontalFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleChange = (field: keyof FiltersState, value: string | number) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  // Сброс всех фильтров
  const handleReset = () => {
    onFiltersChange({
      city: '',
      district: '',
      priceMin: 0,
      priceMax: 100000,
    });
  };

  // Проверка, есть ли активные фильтры
  const hasActiveFilters = 
    filters.city || 
    filters.district || 
    filters.priceMin > 0 || 
    filters.priceMax < 100000;

  return (
    <div className="horizontal-filters">
      <div className="horizontal-filters__container">
        {/* Город */}
        <div className="filter-group">
          <MapPin size={18} className="filter-icon" />
          <select
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="filter-select"
          >
            {CITIES.map(city => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
        </div>

        {/* Район */}
        <div className="filter-group">
          <Building2 size={18} className="filter-icon" />
          <select
            value={filters.district}
            onChange={(e) => handleChange('district', e.target.value)}
            className="filter-select"
          >
            {DISTRICTS.map(district => (
              <option key={district.value} value={district.value}>
                {district.label}
              </option>
            ))}
          </select>
        </div>

        {/* Цена */}
        <div className="filter-group filter-group--price">
          <DollarSign size={18} className="filter-icon" />
          <input
            type="number"
            value={filters.priceMin || ''}
            onChange={(e) => handleChange('priceMin', Number(e.target.value))}
            placeholder="От"
            className="filter-input filter-input--small"
          />
          <span className="filter-separator">—</span>
          <input
            type="number"
            value={filters.priceMax === 100000 ? '' : filters.priceMax}
            onChange={(e) => handleChange('priceMax', Number(e.target.value) || 100000)}
            placeholder="До"
            className="filter-input filter-input--small"
          />
          <span className="filter-currency">₸</span>
        </div>

        {/* Кнопка сброса */}
        {hasActiveFilters && (
          <button 
            className="filter-reset"
            onClick={handleReset}
          >
            Сбросить
          </button>
        )}
      </div>
    </div>
  );
};

export default HorizontalFilters;
