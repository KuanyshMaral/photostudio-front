import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StudioWithRoomsCard } from './components/StudioWithRoomsCard';
import { LeftPanel } from './components/LeftPanel';
import StudioDetailModal from '../../components/StudioDetailModal';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { Studio, StudioFilterParams } from '../../types/index';
import { getStudiosWithRooms } from './api/studios';

const StudioCatalog: React.FC = () => {
  const [filters, setFilters] = useState<StudioFilterParams>({
    city: '',
    min_price: 0,
    max_price: 100000,
    room_type: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const studiosPerPage = 12;

  const { data: studiosData, isLoading, error } = useQuery({
    queryKey: ['studios', filters, currentPage],
    queryFn: () => getStudiosWithRooms({
      ...filters,
      page: currentPage,
      limit: studiosPerPage
    }),
    staleTime: 30000, // Cache 30 seconds
  });

  const studios = studiosData?.data || [];
  const totalPages = studiosData?.pagination?.total_pages || 1;

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

  return (
    <>
      <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${selectedStudio ? 'blur-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Фотостудии</h1>
            <p className="text-gray-600">Найдите идеальную студию для вашей фотосессии</p>
          </div>

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

      {/* Studio Detail Modal - outside the blurred container */}
      {selectedStudio && (
        <StudioDetailModal
          studio={selectedStudio}
          rooms={selectedStudio.rooms || []}
          onClose={() => setSelectedStudio(null)}
        />
      )}
    </>
  );
};

export default StudioCatalog;
