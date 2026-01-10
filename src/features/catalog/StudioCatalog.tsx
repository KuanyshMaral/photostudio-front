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
    room_type: ''
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
  });

  const studios = studiosData?.data || [];
  const totalPages = studiosData?.pagination?.total_pages || 1;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Ошибка загрузки студий</div>;
  }

  return (
    <>
      <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${selectedStudio ? 'blur-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Photo Studios</h1>
            <p className="text-gray-600">Find perfect studio for your photoshoot</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <LeftPanel 
              filters={filters}
              onFilterChange={setFilters}
              totalStudios={studios.length}
            />
            
            <div className="lg:w-3/4">
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
                    onPageChange={setCurrentPage}
                  />
                </div>
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
