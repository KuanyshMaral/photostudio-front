import React, { useState, useEffect } from 'react';
import { MapPin, Building2, DollarSign } from 'lucide-react';
import { getCities, getDistrictsByCity, type City, type District } from '../../../api/referencesApi';
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

export const HorizontalFilters: React.FC<HorizontalFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  // Reference data from API
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [districtsLoading, setDistrictsLoading] = useState(false);

  // Load cities on mount
  useEffect(() => {
    const loadCities = async () => {
      setCitiesLoading(true);
      try {
        const citiesData = await getCities();
        setCities(citiesData);
      } catch (error) {
        console.error('Failed to load cities:', error);
      } finally {
        setCitiesLoading(false);
      }
    };
    loadCities();
  }, []);

  // Load districts when city changes
  useEffect(() => {
    if (!filters.city) {
      setDistricts([]);
      return;
    }

    const loadDistricts = async () => {
      setDistrictsLoading(true);
      try {
        const districtsData = await getDistrictsByCity(filters.city);
        setDistricts(districtsData);
      } catch (error) {
        console.error('Failed to load districts:', error);
        setDistricts([]);
      } finally {
        setDistrictsLoading(false);
      }
    };
    loadDistricts();
  }, [filters.city]);

  const handleChange = (field: keyof FiltersState, value: string | number) => {
    if (field === 'city') {
      // Reset district when city changes
      onFiltersChange({
        ...filters,
        city: value as string,
        district: '',
      });
    } else {
      onFiltersChange({
        ...filters,
        [field]: value,
      });
    }
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
            disabled={citiesLoading}
          >
            <option value="">
              {citiesLoading ? 'Загрузка городов...' : 'Все города'}
            </option>
            {cities.map(city => (
              <option key={city.id} value={city.name}>
                {city.name}
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
            disabled={!filters.city || districtsLoading}
          >
            <option value="">
              {districtsLoading ? 'Загрузка районов...' : (filters.city ? 'Все районы' : 'Выберите город')}
            </option>
            {districts.map(district => (
              <option key={district.id} value={district.name}>
                {district.name}
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
