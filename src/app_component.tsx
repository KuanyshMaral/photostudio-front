// src/App.tsx

import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Studio, Filters } from './types';
import { mockStudios, mockRooms } from './data/mockData';
// import { catalogAPI } from './services/api'; // Раскомментируйте для реального API

import StudioCard from './components/StudioCard';
import FilterPanel from './components/FilterPanel';
import StudioDetailModal from './components/StudioDetailModal';
import Pagination from './components/Pagination';

function App() {
  // State
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<Filters>({
    city: '',
    min_price: '',
    max_price: '',
    room_type: '',
    search: ''
  });
  
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const studiosPerPage = 6;

  // Load studios on mount
  useEffect(() => {
    loadStudios();
  }, []);

  // Load studios (mock data or API)
  const loadStudios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // MOCK DATA (замените на реальный API)
      setStudios(mockStudios);
      
      /* REAL API (раскомментируйте когда backend готов):
      const response = await catalogAPI.getStudios(filters, currentPage, studiosPerPage);
      if (response.success) {
        setStudios(response.data.studios);
      }
      */
      
    } catch (err) {
      console.error('Error loading studios:', err);
      setError('Не удалось загрузить студии. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Filter studios
  const filteredStudios = studios.filter(studio => {
    // Search by name
    if (filters.search && !studio.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Filter by city
    if (filters.city && studio.city !== filters.city) {
      return false;
    }
    
    // Filter by min price
    if (filters.min_price && studio.min_price && studio.min_price < parseInt(filters.min_price)) {
      return false;
    }
    
    // Filter by max price
    if (filters.max_price && studio.max_price && studio.max_price > parseInt(filters.max_price)) {
      return false;
    }
    
    // Note: room_type filter requires checking rooms (implement if needed)
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudios.length / studiosPerPage);
  const startIndex = (currentPage - 1) * studiosPerPage;
  const paginatedStudios = filteredStudios.slice(startIndex, startIndex + studiosPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Handle studio click
  const handleStudioClick = (studio: Studio) => {
    setSelectedStudio(studio);
    
    /* REAL API (раскомментируйте когда backend готов):
    const loadStudioDetails = async () => {
      try {
        const response = await catalogAPI.getStudioById(studio.id);
        if (response.success) {
          setSelectedStudio(response.data.studio);
        }
      } catch (err) {
        console.error('Error loading studio details:', err);
      }
    };
    loadStudioDetails();
    */
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">StudioBooking</h1>
            
            {/* User menu could go here */}
            <div className="flex items-center gap-2">
              {/* Add login/register buttons if needed */}
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск студий..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
            >
              <Filter className="w-5 h-5" />
              Фильтры
            </button>
          </div>
          
          {/* Results count */}
          <div className="mt-2 text-sm text-gray-600">
            Найдено студий: {filteredStudios.length}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          // Loading state
          <div className="flex justify-center items-center py-16">
            <div className="text-gray-500">Загрузка...</div>
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-16">
            <p className="text-red-500 text-lg">{error}</p>
            <button 
              onClick={loadStudios}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Попробовать снова
            </button>
          </div>
        ) : paginatedStudios.length === 0 ? (
          // Empty state
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Студии не найдены</p>
            <p className="text-gray-400 mt-2">Попробуйте изменить параметры поиска</p>
          </div>
        ) : (
          // Studios grid
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedStudios.map(studio => (
                <StudioCard
                  key={studio.id}
                  studio={studio}
                  onClick={() => handleStudioClick(studio)}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {selectedStudio && (
        <StudioDetailModal
          studio={selectedStudio}
          rooms={mockRooms[selectedStudio.id] || []}
          onClose={() => setSelectedStudio(null)}
        />
      )}
    </div>
  );
}

export default App;