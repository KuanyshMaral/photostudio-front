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
<<<<<<< HEAD
    min_price: 0,
    max_price: 100000,
    room_type: '',
    search: ''
=======
    district: '',
    priceMin: 0,
    priceMax: 100000,
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f
  });
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);

<<<<<<< HEAD
  const { data: studiosData, isLoading, error } = useQuery({
    queryKey: ['studios', filters, currentPage],
    queryFn: () => getStudiosWithRooms({
      ...filters,
      page: currentPage,
      limit: studiosPerPage
    }),
    staleTime: 30000, // Cache 30 seconds
  });
=======
  // Обработка поиска из Header
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f

  // Обработка клика на студию
  const handleStudioClick = (studio: Studio) => {
    setSelectedStudio(studio);
  };

<<<<<<< HEAD
  const handleFilterChange = (newFilters: StudioFilterParams) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Ошибка загрузки студий</p>
          <p className="text-gray-600 mt-2">Попробуйте обновить страницу позже</p>
        </div>
      </div>
    );
  }
=======
  // Закрытие модального окна
  const handleCloseModal = () => {
    setSelectedStudio(null);
  };
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f

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

<<<<<<< HEAD
          <div className="flex flex-col lg:flex-row gap-8">
            <LeftPanel 
              filters={filters}
              onFilterChange={handleFilterChange}
              totalStudios={studios.length}
            />
            
            <div className="lg:w-3/4">
              {studios.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Студии не найдены</p>
                  <button 
                    onClick={() => handleFilterChange({ city: '', min_price: 0, max_price: 100000, room_type: '', search: '' })}
                    className="mt-4 text-blue-600 hover:underline"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                    {studios.map((studio: Studio) => (
                      <StudioWithRoomsCard 
                        key={studio.id} 
                        studio={studio}
                        rooms={studio.rooms || []}
                        onClick={() => setSelectedStudio(studio)}
                      />
                    ))}
                  </div>
                  
                  {totalPages > 1 && (
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
=======
      {/* Block 8: Info Footer */}
      <InfoFooter />
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f

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
