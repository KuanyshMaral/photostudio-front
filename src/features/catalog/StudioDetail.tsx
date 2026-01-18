import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, MapPin, Phone, Mail, Globe, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { getStudioById } from './api/studios';
import type { Studio, Room, Equipment } from '../../types/index';

const StudioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: studioData, isLoading, error } = useQuery({
    queryKey: ['studio', id],
    queryFn: () => id ? getStudioById(Number(id)) : null,
    enabled: !!id,
  });

  const studio = studioData as Studio;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Студия не найдена</h1>
          <button 
            onClick={() => navigate('/catalog')}
            className="text-blue-600 hover:underline"
          >
            Вернуться к каталогу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96">
        <img 
          src={studio.photos?.[0] || '/placeholder.jpg'} 
          alt={studio.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{studio.name}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              {studio.rating || '0.0'}
            </span>
            <span>({studio.reviews_count || 0} отзывов)</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {studio.address}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Phone className="w-4 h-4" />
              <span className="text-sm">Телефон</span>
            </div>
            <p className="font-medium">{studio.phone}</p>
          </div>
          
          {studio.email && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm">Email</span>
              </div>
              <p className="font-medium">{studio.email}</p>
            </div>
          )}
          
          {studio.website && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Сайт</span>
              </div>
              <a href={studio.website} className="font-medium text-blue-600 hover:underline">
                {studio.website}
              </a>
            </div>
          )}
          
          {studio.working_hours && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Часы работы</span>
              </div>
              <p className="font-medium">{studio.working_hours}</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="rooms" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="rooms">Залы</TabsTrigger>
            <TabsTrigger value="equipment">Оборудование</TabsTrigger>
            <TabsTrigger value="info">О студии</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms">
            <RoomsSection rooms={studio.rooms || []} />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentSection rooms={studio.rooms || []} />
          </TabsContent>

          <TabsContent value="info">
            <InfoSection studio={studio} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Rooms Section Component
const RoomsSection: React.FC<{ rooms: Room[] }> = ({ rooms }) => {
  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-500">Информация о залах временно недоступна</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <div key={room.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          {room.photos && room.photos.length > 0 ? (
            <img 
              src={room.photos[0]} 
              alt={room.name}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
              Нет фото
            </div>
          )}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{room.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{room.description}</p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Тип: {room.room_type}</span>
              <span className="text-sm text-gray-500">Площадь: {room.area_sqm}м²</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Вместимость: {room.capacity} человек</span>
              <div className="text-right">
                <p className="font-bold text-blue-600">
                  {new Intl.NumberFormat('ru-KZ', { style: 'currency', currency: 'KZT' }).format(room.price_per_hour_min)}
                </p>
                <p className="text-xs text-gray-500">в час</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Equipment Section Component
const EquipmentSection: React.FC<{ rooms: Room[] }> = ({ rooms }) => {
  const allEquipment = rooms.flatMap(room => room.equipment || []);
  
  if (allEquipment.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-500">Информация об оборудовании временно недоступна</p>
      </div>
    );
  }

  const equipmentByCategory = allEquipment.reduce((acc, equipment) => {
    if (!acc[equipment.category]) {
      acc[equipment.category] = [];
    }
    acc[equipment.category].push(equipment);
    return acc;
  }, {} as Record<string, Equipment[]>);

  return (
    <div className="space-y-6">
      {Object.entries(equipmentByCategory).map(([category, equipment]) => (
        <div key={category} className="bg-white rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((item) => (
              <div key={item.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{item.name}</h4>
                  <span className="text-sm text-gray-500">x{item.quantity}</span>
                </div>
                {item.brand && (
                  <p className="text-sm text-gray-600">Бренд: {item.brand}</p>
                )}
                {item.model && (
                  <p className="text-sm text-gray-600">Модель: {item.model}</p>
                )}
                {item.rental_price && (
                  <p className="text-sm font-medium text-blue-600 mt-2">
                    Аренда: {new Intl.NumberFormat('ru-KZ', { style: 'currency', currency: 'KZT' }).format(item.rental_price)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Info Section Component
const InfoSection: React.FC<{ studio: Studio }> = ({ studio }) => {
  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4">О студии</h3>
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed">{studio.description}</p>
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <h4 className="font-medium mb-3">Контактная информация</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{studio.address}, {studio.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>{studio.phone}</span>
          </div>
          {studio.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{studio.email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioDetail;
