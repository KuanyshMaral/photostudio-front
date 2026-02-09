import React, { useState } from 'react';
import { MainHeader } from '../../components/MainHeader';
import { HorizontalFilters } from './components/HorizontalFilters';
import { PromoCarousel } from '../../components/PromoCarousel/PromoCarousel';
import { StudioGrid } from './components/StudioGrid';
import { InfoFooter } from '../../components/InfoFooter/InfoFooter';
import StudioDetailModal from '../../components/StudioDetailModal';
import ChatModal from '../../components/ChatModal';
import type { Studio } from '../../types/index';
import { createConversation } from '../chat/chat.api';
import { useAuth } from '../../context/AuthContext';
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
  const [chatConversation, setChatConversation] = useState<any>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const { token } = useAuth();

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

  // Обработка нажатия на "Написать владельцу"
  const handleContactOwner = async (studio: Studio) => {
    if (!token || !studio.owner_id) {
      console.error('No token or studio owner ID');
      return;
    }

    try {
      const response = await createConversation(token, {
        recipient_id: studio.owner_id,
        studio_id: studio.id
      });
      
      setChatConversation(response.conversation);
      setIsChatModalOpen(true);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  // Закрытие чат модального окна
  const handleCloseChatModal = () => {
    setIsChatModalOpen(false);
    setChatConversation(null);
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
        onContactOwner={handleContactOwner}
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

      {/* Chat Modal */}
      <ChatModal
        conversation={chatConversation}
        isOpen={isChatModalOpen}
        onClose={handleCloseChatModal}
      />
    </div>
  );
};

export default StudioCatalog;
