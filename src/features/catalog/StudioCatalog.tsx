import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { StudioWithRoomsCard } from './components/StudioWithRoomsCard';
import { LeftPanel } from './components/LeftPanel';
import StudioDetailModal from '../../components/StudioDetailModal';
import NotificationBell from '../../components/NotificationBell';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getProfile } from '../auth/auth.api';
import type { Studio, StudioFilterParams } from '../../types/index';
import type { Profile } from '../auth/auth.types';
import { getStudiosWithRooms } from './api/studios';

const StudioCatalog: React.FC = () => {
  const { token } = useAuth();
  const [filters, setFilters] = useState<StudioFilterParams>({
    city: '',
    min_price: 0,
    max_price: 100000,
    room_type: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [favorites, setFavorites] = useState<Studio[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
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

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then(setProfile)
        .catch(console.error);
    }
  }, [token]);

  const toggleFavorite = (studio: Studio) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === studio.id);
      if (isFavorite) {
        return prev.filter(fav => fav.id !== studio.id);
      } else {
        return [...prev, studio];
      }
    });
  };

  const filteredStudios = studios.filter((studio: Studio) =>
    studio.name.toLowerCase().includes(filters.search?.toLowerCase() || '') ||
    studio.address?.toLowerCase().includes(filters.search?.toLowerCase() || '')
  );

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
          {/* Header with user info and notifications */}
          <div className="flex items-center justify-between mb-8">
            {/* Left side - User avatar and name */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{profile?.name || 'Пользователь'}</h2>
                <p className="text-sm text-gray-600">{profile?.role || 'client'}</p>
              </div>
            </div>

            {/* Right side - Logo and Notifications */}
            <div className="flex items-center space-x-6">
              <div className="text-2xl font-bold text-gray-800">
                StudioBooking
              </div>
              <NotificationBell />
            </div>
          </div>

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
              totalStudios={studios.length}
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
