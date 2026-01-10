// src/components/StudioDetailModal.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Star, MapPin, Users, DollarSign, Phone, Mail, Camera } from 'lucide-react';
import ReviewsModal from './ReviewsModal';
import type { Studio, Room } from '../types/index';

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
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', label: 'Обзор' },
    { id: 'gallery', label: 'Галерея' },
    { id: 'equipment', label: 'Оборудование' },
    { id: 'reviews', label: 'Отзывы' }
  ] as const;

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
    if (!studio.working_hours || !studio.working_hours[day]) {
      return 'Закрыто';
    }
    const hours = studio.working_hours[day];
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
                            {room.price_per_hour_min.toLocaleString()} ₸/час
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
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Отзывы скоро появятся</p>
              <button
                onClick={() => setShowReviewsModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Посмотреть отзывы
              </button>
            </div>
          )}
        </div>

        {/* Reviews Modal */}
        {showReviewsModal && (
          <ReviewsModal
            studioId={studio.id}
            studioName={studio.name}
            onClose={() => setShowReviewsModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default StudioDetailModal;