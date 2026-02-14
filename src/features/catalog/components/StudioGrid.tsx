import React from 'react';
import { useQuery } from '@tanstack/react-query';
import StudioCard from '../../../components/StudioCard';
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
  onContactOwner?: (studio: Studio) => void;
}

export const StudioGrid: React.FC<StudioGridProps> = ({ 
  searchQuery, 
  filters,
  onStudioClick,
  onContactOwner: _onContactOwner
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="modern-card animate-pulse">
              <div className="h-56 bg-gray-200 rounded-t-2xl"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ошибка загрузки</h3>
          <p className="text-gray-600">Не удалось загрузить студии. Попробуйте обновить страницу.</p>
        </div>
      </div>
    );
  }

  if (studios.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Студии не найдены</h3>
          <p className="text-gray-600 mb-6">Попробуйте изменить параметры поиска или фильтры</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-secondary"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Results count */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Найдено студий: <span className="gradient-text">{studios.length}</span>
          </h2>
          <p className="text-gray-600 mt-1">
            Страница {currentPage} из {totalPages}
          </p>
        </div>
        
        {/* Sort options */}
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-sm text-gray-600">Сортировка:</span>
          <select className="modern-input py-2 px-4 text-sm">
            <option>По рейтингу</option>
            <option>По цене</option>
            <option>По названию</option>
          </select>
        </div>
      </div>

      {/* Studio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {studios.map((studio: Studio) => (
          <div key={studio.id} className="animate-fade-in">
            <StudioCard
              studio={studio}
              onClick={() => onStudioClick(studio)}
            />
          </div>
        ))}
      </div>

      {/* Modern Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl font-medium transition-all duration-200
                       bg-white border border-gray-200 text-gray-600
                       hover:bg-gray-50 hover:border-gray-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl font-medium transition-all duration-200
                       bg-white border border-gray-200 text-gray-600
                       hover:bg-gray-50 hover:border-gray-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioGrid;
