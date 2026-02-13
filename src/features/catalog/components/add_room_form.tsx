// src/components/AddRoomForm.tsx

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Room, RoomType } from '../../../types/types';
import { getRoomTypes, getAmenities, type RoomTypeRef, type Amenity } from '../../../api/referencesApi';

interface AddRoomFormProps {
  studioId: number;
  onClose: () => void;
  onSubmit: (room: Partial<Room>) => Promise<void>;
  initialData?: Room;
  isEdit?: boolean;
}

interface FormData {
  name: string;
  description: string;
  area_sqm: string;
  capacity: string;
  room_type: RoomType | '';
  price_per_hour_min: string;
  price_per_hour_max: string;
  amenities: string[];
}

const AddRoomForm: React.FC<AddRoomFormProps> = ({ 
  studioId,
  onClose, 
  onSubmit,
  initialData,
  isEdit = false
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newAmenity, setNewAmenity] = useState('');

  // Reference data from API
  const [roomTypes, setRoomTypes] = useState<RoomTypeRef[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [refsLoading, setRefsLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    area_sqm: initialData?.area_sqm?.toString() || '',
    capacity: initialData?.capacity?.toString() || '',
    room_type: initialData?.room_type as RoomType || '',
    price_per_hour_min: initialData?.price_per_hour_min?.toString() || '',
    price_per_hour_max: initialData?.price_per_hour_max?.toString() || '',
    amenities: initialData?.amenities || []
  });

  // Load room types and amenities on mount
  useEffect(() => {
    const loadReferences = async () => {
      setRefsLoading(true);
      try {
        const [types, amen] = await Promise.all([
          getRoomTypes(),
          getAmenities()
        ]);
        setRoomTypes(types);
        setAmenities(amen);
      } catch (error) {
        console.error('Failed to load references:', error);
      } finally {
        setRefsLoading(false);
      }
    };
    loadReferences();
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Введите название зала';
    if (!formData.area_sqm) newErrors.area_sqm = 'Введите площадь';
    if (parseInt(formData.area_sqm) <= 0) newErrors.area_sqm = 'Площадь должна быть больше 0';
    if (!formData.capacity) newErrors.capacity = 'Введите вместимость';
    if (parseInt(formData.capacity) <= 0) newErrors.capacity = 'Вместимость должна быть больше 0';
    if (!formData.room_type) newErrors.room_type = 'Выберите тип зала';
    if (!formData.price_per_hour_min) newErrors.price_per_hour_min = 'Введите минимальную цену';
    if (parseFloat(formData.price_per_hour_min) < 0) {
      newErrors.price_per_hour_min = 'Цена не может быть отрицательной';
    }
    if (formData.price_per_hour_max && 
        parseFloat(formData.price_per_hour_max) < parseFloat(formData.price_per_hour_min)) {
      newErrors.price_per_hour_max = 'Максимальная цена должна быть больше минимальной';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      setLoading(true);
      const roomData: Partial<Room> = {
        studio_id: studioId,
        name: formData.name,
        description: formData.description,
        area_sqm: parseInt(formData.area_sqm),
        capacity: parseInt(formData.capacity),
        room_type: formData.room_type as RoomType,
        price_per_hour_min: parseFloat(formData.price_per_hour_min),
        price_per_hour_max: formData.price_per_hour_max ? parseFloat(formData.price_per_hour_max) : undefined,
        amenities: formData.amenities,
        is_active: true
      };

      await onSubmit(roomData);
      onClose();
    } catch (error) {
      console.error('Error submitting room:', error);
      setErrors({ submit: 'Произошла ошибка. Попробуйте снова.' });
    } finally {
      setLoading(false);
    }
  };

  const addAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity]
      });
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter(a => a !== amenity)
    });
  };

  const handleAddCustomAmenity = () => {
    if (newAmenity.trim()) {
      addAmenity(newAmenity.trim());
      setNewAmenity('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto my-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {isEdit ? 'Редактировать зал' : 'Добавить зал'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Название зала <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Например: Fashion Hall"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
              placeholder=""
            />
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Тип зала <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.room_type}
              onChange={(e) => setFormData({ ...formData, room_type: e.target.value as RoomType })}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.room_type ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={refsLoading}
            >
              <option value="">
                {refsLoading ? 'Загрузка типов...' : 'Выберите тип'}
              </option>
              {roomTypes.map(type => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
            {errors.room_type && <p className="text-red-500 text-sm mt-1">{errors.room_type}</p>}
          </div>

          {/* Area and Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Площадь (м²) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.area_sqm}
                onChange={(e) => setFormData({ ...formData, area_sqm: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.area_sqm ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder=""
                min="1"
              />
              {errors.area_sqm && <p className="text-red-500 text-sm mt-1">{errors.area_sqm}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Вместимость (чел) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.capacity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder=""
                min="1"
              />
              {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Мин. цена (₸/час) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price_per_hour_min}
                onChange={(e) => setFormData({ ...formData, price_per_hour_min: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.price_per_hour_min ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder=""
                min="0"
              />
              {errors.price_per_hour_min && (
                <p className="text-red-500 text-sm mt-1">{errors.price_per_hour_min}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Макс. цена (₸/час)</label>
              <input
                type="number"
                value={formData.price_per_hour_max}
                onChange={(e) => setFormData({ ...formData, price_per_hour_max: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.price_per_hour_max ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder=""
                min="0"
              />
              {errors.price_per_hour_max && (
                <p className="text-red-500 text-sm mt-1">{errors.price_per_hour_max}</p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium mb-2">Удобства</label>
            
            {/* Common Amenities from API */}
            <div className="flex flex-wrap gap-2 mb-3">
              {refsLoading ? (
                <p className="text-gray-500 text-sm">Загрузка удобств...</p>
              ) : amenities.length === 0 ? (
                <p className="text-gray-500 text-sm">Нет доступных удобств</p>
              ) : (
                amenities.map(amenity => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => {
                      if (formData.amenities.includes(amenity.name)) {
                        removeAmenity(amenity.name);
                      } else {
                        addAmenity(amenity.name);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      formData.amenities.includes(amenity.name)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {amenity.name}
                  </button>
                ))
              )}
            </div>

            {/* Custom Amenity */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomAmenity())}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Добавить свое удобство"
              />
              <button
                type="button"
                onClick={handleAddCustomAmenity}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Amenities */}
            {formData.amenities.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-sm text-gray-600">Выбранные удобства:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="hover:text-blue-900"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Добавить зал'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomForm;