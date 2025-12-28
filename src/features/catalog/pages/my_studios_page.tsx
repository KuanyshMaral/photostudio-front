// src/pages/MyStudios.tsx

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, MapPin, Star } from 'lucide-react';
import { Studio, Room } from '../types';
import CreateStudioForm from '../components/CreateStudioForm';
import AddRoomForm from '../components/AddRoomForm';
import { mockStudios, mockRooms } from '../data/mockData';
// import { catalogAPI } from '../services/api'; // Uncomment for real API

const MyStudios: React.FC = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [editingStudio, setEditingStudio] = useState<Studio | null>(null);
  const [expandedStudioId, setExpandedStudioId] = useState<number | null>(null);

  useEffect(() => {
    loadMyStudios();
  }, []);

  const loadMyStudios = async () => {
    try {
      setLoading(true);
      
      // MOCK DATA (replace with real API)
      // Симулируем "мои" студии (первые 2)
      setStudios(mockStudios.slice(0, 2));

      /* REAL API:
      const response = await catalogAPI.getMyStudios();
      if (response.success) {
        setStudios(response.data.studios);
      }
      */
    } catch (error) {
      console.error('Error loading studios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudio = async (studioData: Partial<Studio>) => {
    try {
      /* REAL API:
      const newStudio = await catalogAPI.createStudio(studioData);
      setStudios([...studios, newStudio]);
      */
      
      // MOCK: Add to list
      const newStudio = {
        ...studioData,
        id: Date.now(),
        rating: 0,
        total_reviews: 0
      } as Studio;
      setStudios([...studios, newStudio]);
      
      console.log('Created studio:', studioData);
    } catch (error) {
      console.error('Error creating studio:', error);
      throw error;
    }
  };

  const handleUpdateStudio = async (studioData: Partial<Studio>) => {
    if (!editingStudio) return;

    try {
      /* REAL API:
      const updated = await catalogAPI.updateStudio(editingStudio.id, studioData);
      setStudios(studios.map(s => s.id === editingStudio.id ? updated : s));
      */

      // MOCK: Update in list
      setStudios(studios.map(s => 
        s.id === editingStudio.id ? { ...s, ...studioData } : s
      ));
      
      console.log('Updated studio:', studioData);
      setEditingStudio(null);
    } catch (error) {
      console.error('Error updating studio:', error);
      throw error;
    }
  };

  const handleDeleteStudio = async (studioId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту студию?')) {
      return;
    }

    try {
      /* REAL API:
      await catalogAPI.deleteStudio(studioId);
      */

      setStudios(studios.filter(s => s.id !== studioId));
      console.log('Deleted studio:', studioId);
    } catch (error) {
      console.error('Error deleting studio:', error);
    }
  };

  const handleAddRoom = async (roomData: Partial<Room>) => {
    if (!selectedStudio) return;

    try {
      /* REAL API:
      await catalogAPI.addRoom(selectedStudio.id, roomData);
      */

      console.log('Added room:', roomData);
      setShowAddRoomForm(false);
      setSelectedStudio(null);
    } catch (error) {
      console.error('Error adding room:', error);
      throw error;
    }
  };

  const toggleStudioExpand = (studioId: number) => {
    setExpandedStudioId(expandedStudioId === studioId ? null : studioId);
  };

  const getRoomsForStudio = (studioId: number): Room[] => {
    return mockRooms[studioId] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Мои студии</h1>
              <p className="text-gray-600 mt-1">Управление вашими фотостудиями</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              Создать студию
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {studios.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">У вас пока нет студий</h3>
              <p className="text-gray-600 mb-6">
                Создайте свою первую студию и начните принимать бронирования
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Создать студию
              </button>
            </div>
          </div>
        ) : (
          // Studios List
          <div className="space-y-4">
            {studios.map(studio => {
              const rooms = getRoomsForStudio(studio.id);
              const isExpanded = expandedStudioId === studio.id;

              return (
                <div key={studio.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Studio Card */}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{studio.name}</h3>
                          <div className="flex items-center">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="ml-1 font-semibold">{studio.rating.toFixed(1)}</span>
                            <span className="ml-1 text-sm text-gray-500">
                              ({studio.total_reviews})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{studio.address}</span>
                        </div>

                        {studio.description && (
                          <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                            {studio.description}
                          </p>
                        )}

                        <div className="flex gap-2">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {rooms.length} {rooms.length === 1 ? 'зал' : 'залов'}
                          </span>
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Активна
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => toggleStudioExpand(studio.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded transition"
                          title={isExpanded ? "Скрыть залы" : "Показать залы"}
                        >
                          {isExpanded ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => setEditingStudio(studio)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Редактировать"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudio(studio.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                          title="Удалить"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Rooms Section (Expandable) */}
                  {isExpanded && (
                    <div className="border-t bg-gray-50 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Залы</h4>
                        <button
                          onClick={() => {
                            setSelectedStudio(studio);
                            setShowAddRoomForm(true);
                          }}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                          Добавить зал
                        </button>
                      </div>

                      {rooms.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>Пока нет залов</p>
                          <button
                            onClick={() => {
                              setSelectedStudio(studio);
                              setShowAddRoomForm(true);
                            }}
                            className="mt-2 text-blue-600 hover:underline text-sm"
                          >
                            Добавить первый зал
                          </button>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {rooms.map(room => (
                            <div
                              key={room.id}
                              className="bg-white rounded-lg p-4 border border-gray-200"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h5 className="font-semibold mb-1">{room.name}</h5>
                                  <div className="flex gap-4 text-sm text-gray-600">
                                    <span>{room.area_sqm} м²</span>
                                    <span>до {room.capacity} чел</span>
                                    <span className="font-medium text-blue-600">
                                      {room.price_per_hour_min.toLocaleString()} ₸/час
                                    </span>
                                  </div>
                                  {room.amenities && room.amenities.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {room.amenities.slice(0, 3).map((amenity, i) => (
                                        <span
                                          key={i}
                                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                        >
                                          {amenity}
                                        </span>
                                      ))}
                                      {room.amenities.length > 3 && (
                                        <span className="text-xs text-gray-500">
                                          +{room.amenities.length - 3}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  room.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {room.is_active ? 'Активен' : 'Неактивен'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreateForm && (
        <CreateStudioForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateStudio}
        />
      )}

      {editingStudio && (
        <CreateStudioForm
          onClose={() => setEditingStudio(null)}
          onSubmit={handleUpdateStudio}
          initialData={editingStudio}
          isEdit={true}
        />
      )}

      {showAddRoomForm && selectedStudio && (
        <AddRoomForm
          studioId={selectedStudio.id}
          onClose={() => {
            setShowAddRoomForm(false);
            setSelectedStudio(null);
          }}
          onSubmit={handleAddRoom}
        />
      )}
    </div>
  );
};

export default MyStudios;