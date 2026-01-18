// src/components/StudioDetailModal.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Star, MapPin, Users, DollarSign, Phone, Mail, Camera, Plus } from 'lucide-react';
// import ReviewsModal from './ReviewsModal';
import { getStudioReviews } from '../api/reviewApi';
import type { Review } from '../api/reviewApi';

// Define types locally since they're not imported
interface Studio {
  id: number;
  name: string;
  description: string;
  address: string;
  phone?: string;
  email?: string;
  price_per_hour: number;
  rating: number;
  amenities: string[];
  photos: string[];
  working_hours?: string;
  total_reviews?: number;
  district?: string;
}

interface Room {
  id: number;
  name: string;
  description?: string;
  price_per_hour_min?: number;
  area_sqm?: number;
  capacity?: number;
  room_type?: string;
  amenities?: string[];
  equipment?: Array<{
    id: number;
    name: string;
    brand?: string;
    model?: string;
    category?: string;
    quantity: number;
  }>;
}

interface StudioDetailModalProps {
  studio: Studio;
  rooms?: Room[];
  onClose: () => void;
}

type TabType = 'overview' | 'gallery' | 'equipment' | 'reviews';

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

  // Fetch reviews when reviews tab is active
  useEffect(() => {
    if (activeTab === 'reviews' && studio.id) {
      const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const data = await getStudioReviews(studio.id);
          
          // Mock owner responses for demonstration (remove this when owner responses are implemented in backend)
          const reviewsWithResponses = data.map((review: Review) => ({
            ...review,
            ownerResponse: Math.random() > 0.5 ? {
              id: Math.floor(Math.random() * 10000),
              review_id: review.id,
              response: "Thank you for your feedback! We're glad you enjoyed your experience in our studio. We've noted your suggestions and will work on improving our services.",
              created_at: new Date(review.created_at).getTime() + 86400000 + '', // 1 day after review
              responder_name: "Studio Manager"
            } : undefined
          }));
          
          setReviews(reviewsWithResponses);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch reviews");
        } finally {
          setLoading(false);
        }
      };

      fetchReviews();
    }
  }, [activeTab, studio.id]);

  const tabs = [
    { id: 'overview', label: 'Обзор' },
    { id: 'gallery', label: 'Галерея' },
    { id: 'equipment', label: 'Оборудование' },
    { id: 'reviews', label: 'Отзывы' }
  ] as const;

  // Utility functions
  const token = localStorage.getItem('token');
  
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
    // Navigate to booking page with studio data (user will choose room there)
    navigate('/booking', { 
      state: { 
        studio, 
        rooms: rooms 
      } 
    });
  };

  // Форматирование рабочих часов
  const formatWorkingHours = (day: string) => {
    if (!studio.working_hours || !(studio.working_hours as any)[day]) {
      return 'Закрыто';
    }
    const hours = (studio.working_hours as any)[day];
    return `${hours.open} - ${hours.close}`;
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Понедельник' },
    { key: 'tuesday', label: 'Вторник' },
    { key: 'wednesday', label: 'Среда' },
    { key: 'thursday', label: 'Четверг' },
    { key: 'friday', label: 'Пятница' },
    { key: 'saturday', label: 'Суббота' },
    { key: 'sunday', label: 'Воскресенье' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto my-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="p-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{studio.name}</h2>
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
            <div className="space-y-6">
              {/* Rating */}
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <span className="ml-2 text-2xl font-bold">{studio.rating.toFixed(1)}</span>
                  <span className="ml-2 text-gray-500">({studio.total_reviews} отзывов)</span>
                </div>
              </div>

              {/* Description */}
              {studio.description && (
                <div>
                  <h3 className="font-bold text-lg mb-2">О студии</h3>
                  <p className="text-gray-700 leading-relaxed">{studio.description}</p>
                </div>
              )}

              {/* Address */}
              <div>
                <h3 className="font-bold text-lg mb-2">Адрес</h3>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700">{studio.address}</p>
                    {studio.district && (
                      <p className="text-sm text-gray-500">{studio.district} район</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              {(studio.phone || studio.email) && (
                <div>
                  <h3 className="font-bold text-lg mb-2">Контакты</h3>
                  <div className="space-y-2">
                    {studio.phone && (
                      <div className="flex items-center text-gray-700">
                        <Phone className="w-5 h-5 text-gray-400 mr-2" />
                        <a href={`tel:${studio.phone}`} className="hover:text-blue-600">
                          {studio.phone}
                        </a>
                      </div>
                    )}
                    {studio.email && (
                      <div className="flex items-center text-gray-700">
                        <Mail className="w-5 h-5 text-gray-400 mr-2" />
                        <a href={`mailto:${studio.email}`} className="hover:text-blue-600">
                          {studio.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Working Hours */}
              {studio.working_hours && (
                <div>
                  <h3 className="font-bold text-lg mb-2">Время работы</h3>
                  <div className="space-y-1">
                    {daysOfWeek.map(day => (
                      <div key={day.key} className="flex justify-between text-sm">
                        <span className="text-gray-600">{day.label}</span>
                        <span className="font-medium">{formatWorkingHours(day.key)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rooms */}
              {rooms.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-3">Доступные залы</h3>
                  <div className="space-y-3">
                    {rooms.map(room => (
                      <div 
                        key={room.id} 
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-lg">{room.name}</h4>
                          <p className="text-blue-600 font-bold">
                            {room.price_per_hour_min?.toLocaleString() || 0} ₸/час
                          </p>
                        </div>
                        
                        {room.description && (
                          <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                        )}
                        
                        <div className="flex gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {room.area_sqm} м²
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            до {room.capacity} чел
                          </div>
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {room.room_type}
                          </span>
                        </div>
                        
                        {room.amenities && room.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {room.amenities.map((amenity, i) => (
                              <span 
                                key={i} 
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Single Booking Button */}
              <div className="mt-6">
                <button
                  onClick={handleBooking}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-lg"
                >
                  Забронировать
                </button>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-2 gap-4">
              {studio.photos && studio.photos.length > 0 ? (
                studio.photos.map((photo, i) => (
                  <img 
                    key={i} 
                    src={photo} 
                    alt={`${studio.name} ${i + 1}`} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-16">
                  <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Фотографии скоро появятся</p>
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