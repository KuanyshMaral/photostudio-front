// src/components/StudioDetailModal.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Star, Plus, ArrowLeft } from 'lucide-react';
// import ReviewsModal from './ReviewsModal';
import { getStudioReviews } from '../api/reviewApi';
import type { Review } from '../api/reviewApi';
import type { Studio, Room } from '../types';
import AvailabilityCalendar from './AvailabilityCalendar';
import BookingForm from './BookingForm';
import { ImageCarousel } from './ImageCarousel/ImageCarousel';
import { LiveStatusBadge } from './LiveStatusBadge/LiveStatusBadge';
import { ClickableLinks } from './ClickableLinks/ClickableLinks';
import { HallSelector } from './HallSelector';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import './StudioDetailModal.css';

interface StudioDetailModalProps {
  studio: Studio;
  rooms?: Room[];
  onClose: () => void;
}

type TabType = 'overview' | 'equipment' | 'reviews';

const StudioDetailModal: React.FC<StudioDetailModalProps> = ({ 
  studio, 
  rooms = [], 
  onClose 
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  // const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [reviews, setReviews] = useState<(Review & { ownerResponse?: any })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  
  // Use the custom hook to lock body scroll when modal is open
  useBodyScrollLock(true);
  
  // Booking state
  const [showBookingCalendar, setShowBookingCalendar] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; start: string; end: string } | null>(null);

  // Fetch reviews when reviews tab is active
  useEffect(() => {
    if (activeTab === 'reviews' && studio.id) {
      const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const data = await getStudioReviews(studio.id);
          
          // Owner responses must come from backend; do not synthesize mock responses here.
          setReviews(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch reviews");
        } finally {
          setLoading(false);
        }
      };

      fetchReviews();
    }
  }, [activeTab, studio.id]);

  // Tab labels removed — rely on backend or translations later
  const tabs: { id: TabType; label: string }[] = [];

  // Utility functions
  const token = localStorage.getItem('token');

  // Обрезка текста с ellipsis
  const truncateText = (text: string, maxLength: number): string => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };
  
  const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) => {
    const sizeClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star: number) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingText = (rating: number): string => {
    if (rating >= 4.5) return 'Отлично';
    if (rating >= 3.5) return 'Хорошо';
    if (rating >= 2.5) return 'Нормально';
    if (rating >= 1.5) return 'Плохо';
    return 'Ужасно';
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const handleBooking = () => {
    // Always show calendar booking for consistent UX
    if (rooms.length > 0) {
      // If there are rooms, select the first one by default and show calendar
      setSelectedRoom(rooms[0]);
      setShowBookingCalendar(true);
    }
  };

  const handleSlotSelect = (date: Date, start: string, end: string) => {
    setSelectedSlot({ date, start, end });
    setShowBookingForm(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    setShowBookingCalendar(false);
    setSelectedSlot(null);
    // Could show success message or refresh bookings
  };

  const handleBookingCancel = () => {
    setShowBookingForm(false);
    setSelectedSlot(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto my-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-full transition"
                title="Назад"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">{studio.name}</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex border-t">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  activeTab === tab.id 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="studio-modal__overview">
              {/* Block 5: Hero Carousel */}
              <ImageCarousel 
                images={studio.photos?.slice(0, 5) || []} 
                alt={studio.name}
              />

              {/* Live Status + Working Hours (compact) */}
              <div className="studio-modal__status-row">
                <LiveStatusBadge studioId={studio.id} />
                <span className="studio-modal__hours-compact">
                  Пн-Пт: 10:00-20:00
                </span>
              </div>

              {/* Block 5: Description truncated */}
              <div className="studio-modal__description">
                <h3>О студии</h3>
                <p className="studio-modal__description-text">
                  {truncateText(studio.description || '', 150)}
                </p>
              </div>

              {/* Block 5: Clickable Links */}
              <div className="studio-modal__contacts">
                <h3>Контакты</h3>
                <ClickableLinks
                  address={studio.address}
                  phone={studio.phone}
                  email={studio.email}
                  city="almaty"
                />
              </div>

              {/* Rooms / Halls */}
              <div className="studio-modal__rooms">
                <h3>Залы</h3>
                {rooms.length > 0 && (
                  <HallSelector
                    rooms={rooms}
                    selectedRoomId={selectedRoom?.id || null}
                    onSelect={(roomId) => {
                      const room = rooms.find(r => r.id === roomId);
                      setSelectedRoom(room || null);
                    }}
                  />
                )}
              </div>

              {/* Booking Section */}
              <div className="mt-6">
                {!showBookingCalendar ? (
                  <button
                    onClick={handleBooking}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-lg"
                  >
                    Забронировать
                  </button>
                ) : (
                  <div className="space-y-4">
                    {/* Room Selector for multiple rooms */}
                    {rooms.length > 1 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Выберите зал
                        </label>
                        <select
                          value={selectedRoom?.id || rooms[0]?.id}
                          onChange={(e) => {
                            const room = rooms.find(r => r.id === Number(e.target.value));
                            setSelectedRoom(room || rooms[0]);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {rooms.map(room => (
                            <option key={room.id} value={room.id}>
                              {room.name} - {room.price_per_hour_min?.toLocaleString() || 0} ₸/час
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {selectedRoom && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Выбран зал: {selectedRoom.name}</h4>
                        <p className="text-sm text-gray-600">
                          Цена: {selectedRoom.price_per_hour_min || studio.price_per_hour || studio.min_price || 0} ₸/час
                        </p>
                      </div>
                    )}
                    
                    <AvailabilityCalendar
                      roomId={selectedRoom?.id || rooms[0]?.id}
                      pricePerHour={selectedRoom?.price_per_hour_min || studio.price_per_hour || studio.min_price || 0}
                      onSlotSelect={handleSlotSelect}
                    />
                    
                    <button
                      onClick={() => setShowBookingCalendar(false)}
                      className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                    >
                      Назад
                    </button>
                  </div>
                )}
              </div>

              {/* Booking Form Modal */}
              {showBookingForm && selectedSlot && selectedRoom && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
                  <BookingForm
                    roomId={selectedRoom.id}
                    roomName={selectedRoom.name}
                    studioName={studio.name}
                    studioId={studio.id}
                    date={selectedSlot.date}
                    startTime={selectedSlot.start}
                    endTime={selectedSlot.end}
                    pricePerHour={selectedRoom?.price_per_hour_min || studio.price_per_hour || studio.min_price || 0}
                    onSuccess={handleBookingSuccess}
                    onCancel={handleBookingCancel}
                  />
                </div>
              )}
            </div>
          )}

          {/* Equipment Tab */}
          {activeTab === 'equipment' && (
            <div className="space-y-4">
              {rooms.filter(r => r.equipment && r.equipment.length > 0).length > 0 ? (
                rooms.map(room => (
                  room.equipment && room.equipment.length > 0 && (
                    <div key={room.id}>
                      <h4 className="font-semibold text-lg mb-3">{room.name}</h4>
                      <div className="grid gap-3">
                        {room.equipment.map(eq => (
                          <div 
                            key={eq.id} 
                            className="border border-gray-200 rounded-lg p-3 flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium">{eq.name}</p>
                              {eq.brand && (
                                <p className="text-sm text-gray-500">
                                  {eq.brand} {eq.model && `• ${eq.model}`}
                                </p>
                              )}
                              {eq.category && (
                                <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-1">
                                  {eq.category}
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">×{eq.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500">Информация об оборудовании скоро появится</p>
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="text-center py-16">
              {loading && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              )}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              {!loading && !error && reviews.length === 0 && (
                <div className="text-gray-400 text-lg mb-4">Отзывов пока нет</div>
              )}
              
              {!loading && !error && reviews.length > 0 && (
                <>
                  <div className="space-y-6">
                    {/* Summary Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl font-bold text-gray-900">{averageRating}</div>
                        <div>
                          <StarRating rating={parseFloat(averageRating)} size="lg" />
                          <p className="text-sm text-gray-600 mt-1">
                            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Sort Options */}
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700">Сортировать по:</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      >
                        <option value="newest">Сначала новые</option>
                        <option value="oldest">Сначала старые</option>
                        <option value="highest">Высший рейтинг</option>
                        <option value="lowest">Низший рейтинг</option>
                      </select>
                    </div>
                    
                    {/* Write Review Button */}
                    {token && (
                      <button
                        onClick={() => {
                          onClose();
                          navigate('/write-review');
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Оставить отзыв
                      </button>
                    )}
                  </div>
                  
                  {/* Reviews List */}
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                        {/* Review Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-indigo-600 text-sm font-semibold">
                                {review.user_name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{review.user_name || 'Guest User'}</p>
                                <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <StarRating rating={review.rating} />
                            <p className="text-sm font-medium text-gray-700 mt-1">{getRatingText(review.rating)}</p>
                          </div>
                        </div>
                    
                    {/* Review Content */}
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                    
                    {/* Owner Response */}
                    {review.ownerResponse && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 text-sm font-semibold">M</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-medium text-blue-900 text-sm">{review.ownerResponse.responder_name}</p>
                              <span className="text-xs text-blue-600">• {formatDate(review.ownerResponse.created_at)}</span>
                            </div>
                            <p className="text-blue-800 text-sm leading-relaxed">{review.ownerResponse.response}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioDetailModal;