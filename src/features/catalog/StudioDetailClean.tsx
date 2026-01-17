import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getStudioById } from './catalog.api';
import type { Studio } from '../../types/index_new';

export default function StudioDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: studio, isLoading, error } = useQuery({
    queryKey: ['studio', id],
    queryFn: () => getStudioById(Number(id)),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Студия не найдена</h1>
          <p className="text-gray-600 mb-4">Студия с ID {id} не существует или была удалена</p>
          <Link 
            to="/catalog"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к каталогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero секция */}
      <div className="relative h-96">
        {studio.photos && studio.photos.length > 0 ? (
          <img 
            src={studio.photos[0]} 
            alt={studio.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-6xl font-bold">{studio.name?.[0] || 'S'}</div>
          </div>
        )}
        
        {/* Градиентный оверлей */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Информация поверх изображения */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{studio.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-semibold">{studio.rating || '0.0'}</span>
                  </div>
                  <span className="text-lg">({studio.reviews_count || 0} отзывов)</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{studio.city}</span>
                </div>
                <p className="text-lg">{studio.address}</p>
                {studio.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{studio.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основная информация */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Кнопка возврата */}
        <div className="mb-6">
          <Link 
            to="/catalog"
            className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к каталогу
          </Link>
        </div>

        {/* Контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Описание */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Описание</h2>
            <p className="text-gray-700 leading-relaxed">
              {studio.description}
            </p>
          </div>

          {/* Контактная информация */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Контакты</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Адрес</p>
                  <p className="text-gray-700">{studio.address}</p>
                  {studio.city && <p className="text-gray-600">{studio.city}</p>}
                </div>
              </div>
              
              {studio.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Телефон</p>
                    <a 
                      href={`tel:${studio.phone}`}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {studio.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Залы */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Залы ({studio.rooms?.length || 0})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studio.rooms?.map(room => (
                <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{room.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{room.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Площадь: {room.area_sqm} м²</span>
                      <span className="text-gray-600">Вместимость: {room.capacity} человек</span>
                    </div>
                    <div className="text-gray-900">
                      <span className="text-sm text-gray-600">Цена за час: </span>
                      <span className="text-xl font-bold">{room.price_per_hour_min} - {room.price_per_hour_max} ₸</span>
                    </div>
                  </div>
                  
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {room.amenities.map(amenity => (
                        <span 
                          key={amenity}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
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
        </div>
      </div>
    </div>
  );
}
