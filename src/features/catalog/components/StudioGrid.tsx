import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StudioWithRoomsCard } from './StudioWithRoomsCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import type { Studio } from '../../../types/index';
import { getStudiosWithRooms } from '../api/studios';

interface FiltersState {
  city: string;
  district: string;
  priceMin: number;
  priceMax: number;
}

interface StudioGridProps {
  searchQuery: string;
  filters: FiltersState;
  onStudioClick: (studio: Studio) => void;
}

export const StudioGrid: React.FC<StudioGridProps> = ({ 
  searchQuery, 
  filters,
  onStudioClick
}) => {
  const studiosPerPage = 12;
  const [currentPage, setCurrentPage] = React.useState(1);

  // Convert FiltersState to API format
  const apiFilters = {
    city: filters.city || '',
    min_price: filters.priceMin || 0,
    max_price: filters.priceMax || 100000,
    search: searchQuery || '',
    page: currentPage,
    limit: studiosPerPage
  };

  const { data: studiosData, isLoading, error } = useQuery({
    queryKey: ['studios', apiFilters, currentPage],
    queryFn: () => getStudiosWithRooms(apiFilters),
    staleTime: 30000, // Cache 30 seconds
  });

  const studios = studiosData?.data || [];
  const totalPages = studiosData?.pagination?.total_pages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Ошибка загрузки студий</p>
        <p className="text-gray-600 mt-2">Попробуйте обновить страницу позже</p>
      </div>
    );
  }

  if (studios.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Студии не найдены</p>
        <p className="text-gray-400 mt-2">Попробуйте изменить параметры поиска или фильтры</p>
      </div>
    );
  }

  return (
    <div className="studio-grid">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {studios.map((studio: Studio) => (
          <StudioWithRoomsCard
            key={studio.id}
            studio={studio}
            rooms={studio.rooms || []}
            onClick={() => onStudioClick(studio)}
            onContactOwner={() => {
              // Handle contact owner
              console.log('Contact owner for studio:', studio.id);
            }}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Назад
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Вперед
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioGrid;
