import React, { useState } from 'react';
import { MainHeader } from '../../components/MainHeader';
import { HorizontalFilters } from './components/HorizontalFilters';
import { PromoCarousel } from '../../components/PromoCarousel/PromoCarousel';
import { StudioGrid } from './components/StudioGrid';
import { InfoFooter } from '../../components/InfoFooter/InfoFooter';
import StudioDetailModal from '../../components/StudioDetailModal';
import type { Studio } from '../../types/index';
import './StudioCatalog.css';

interface FiltersState {
  city: string;
  district: string;
  priceMin: number;
  priceMax: number;
}

export const StudioCatalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FiltersState>({
    city: '',
    district: '',
    priceMin: 0,
    priceMax: 100000,
  });
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);

  // Обработка поиска из Header
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Обработка клика на студию
  const handleStudioClick = (studio: Studio) => {
    setSelectedStudio(studio);
  };

  // Закрытие модального окна
  const handleCloseModal = () => {
    setSelectedStudio(null);
  };

  return (
    <div className="studio-catalog">
      {/* Header with Search */}
      <MainHeader onSearch={handleSearch} />
      
      {/* Block 8: Promo Carousel */}
      <PromoCarousel />
      
      {/* Filters */}
      <HorizontalFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      {/* Grid */}
      <StudioGrid 
        searchQuery={searchQuery}
        filters={filters}
        onStudioClick={handleStudioClick}
      />

      {/* Block 8: Info Footer */}
      <InfoFooter />

      {/* Studio Detail Modal */}
      {selectedStudio && (
        <StudioDetailModal
          studio={selectedStudio}
          rooms={selectedStudio.rooms || []}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default StudioCatalog;
