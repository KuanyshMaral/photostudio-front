import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudios } from './catalog.api';
import StudioCard from './components/StudioCardSimple';
import StudioFilters from './components/StudioFiltersFinal';
import SkeletonCard from './components/SkeletonCardSimple';
import Pagination from '../../components/Pagination';
import type { StudioFilterParams } from '../../types/index_new';

export default function StudioCatalog() {
  const [filters, setFilters] = useState<StudioFilterParams>({
    city: '',
    min_price: 0,
    max_price: 50000,
    room_type: '',
    search: '',
    page: 1,
    limit: 12
  });

  // React Query для кэширования и автоматических ретраев
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['studios', filters],
    queryFn: () => getStudios(filters),
    staleTime: 30000, // Кэш 30 секунд
    retry: 2, // Количество попыток при ошибке
    retryDelay: 1000, // Задержка между попытками
  });

  const handleFilterChange = (newFilters: Partial<StudioFilterParams>) => {
    setFilters(prev => ({ 
      ...prev, 
      ...newFilters, 
      page: 1 // Сбрасываем страницу при изменении фильтров
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFilters({
      city: '',
      min_price: 0,
      max_price: 50000,
      room_type: '',
      search: '',
      page: 1,
      limit: 12
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Каталог фотостудий</h1>
          <p className="text-gray-600">Найдите идеальную студию для вашей фотосессии</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Сайдбар с фильтрами */}
          <aside className="lg:col-span-1">
            <StudioFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Список студий */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-500 text-lg font-medium mb-2">Ошибка загрузки студий</p>
                <p className="text-gray-600 mb-4">Попробуйте обновить страницу или изменить фильтры</p>
                <button 
                  onClick={() => refetch()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Попробовать снова
                </button>
              </div>
            ) : data?.studios?.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2M5 11V9a2 2 0 012-2h6a2 2 0 012 2m14 0V9a2 2 0 012-2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">Студии не найдены</p>
                <p className="text-gray-400 mb-4">Попробуйте изменить параметры поиска или сбросить фильтры</p>
                <button 
                  onClick={handleReset}
                  className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <>
                {/* Результаты поиска */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    Найдено студий: <span className="font-semibold text-gray-900">{data?.studios?.length || 0}</span>
                  </p>
                  {data?.studios?.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Страница {filters.page} из {Math.ceil((data?.studios?.length || 0) / (filters.limit || 12))}
                    </p>
                  )}
                </div>

                {/* Сетка студий */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.studios?.map(studio => (
                    <StudioCard key={studio.id} studio={studio} />
                  ))}
                </div>

                {/* Пагинация */}
                {data?.studios && data?.studios.length > 0 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={filters.page}
                      totalPages={Math.ceil((data?.studios?.length || 0) / (filters.limit || 12))}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
