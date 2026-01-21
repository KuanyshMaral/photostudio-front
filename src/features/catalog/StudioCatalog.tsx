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

<<<<<<< HEAD
          {/* Search and Filters - Top Section */}
          <div className="mb-8">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <input
                type="text"
                placeholder="Поиск студий..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Favorites Toggle */}
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  showFavorites
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {showFavorites ? "Все студии" : `Избранные (${favorites.length})`}
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <LeftPanel
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            <div className="lg:w-3/4">
              {(showFavorites ? favorites : filteredStudios).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {showFavorites ? "Нет избранных студий" : "Студии не найдены"}
                  </p>
                  <button 
                    onClick={() => handleFilterChange({ city: '', min_price: 0, max_price: 100000, room_type: '', search: '' })}
                    className="mt-4 text-blue-600 hover:underline"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {(showFavorites ? favorites : filteredStudios).map((studio: Studio) => (
                      <div key={studio.id} className="relative">
                        <StudioWithRoomsCard 
                          studio={studio}
                          rooms={studio.rooms || []}
                          onClick={() => setSelectedStudio(studio)}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(studio);
                          }}
                          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow z-10"
                        >
                          <svg
                            className={`w-5 h-5 ${
                              favorites.some(fav => fav.id === studio.id)
                                ? "text-red-500 fill-current"
                                : "text-gray-400"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {!showFavorites && totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Studio Detail Modal - outside the blurred container */}
=======
      {/* Studio Detail Modal */}
>>>>>>> origin/alisher-clean-v2
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
