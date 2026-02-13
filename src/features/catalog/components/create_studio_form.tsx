// src/components/CreateStudioForm.tsx

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { Studio } from '../../../types/types';
import { getCities, getDistrictsByCity, type City, type District } from '../../../api/referencesApi';

interface CreateStudioFormProps {
  onClose: () => void;
  onSubmit: (studio: Partial<Studio>) => Promise<void>;
  initialData?: Studio;
  isEdit?: boolean;
}

type Step = 1 | 2 | 3;

const CreateStudioForm: React.FC<CreateStudioFormProps> = ({ 
  onClose, 
  onSubmit,
  initialData,
  isEdit = false
}) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reference data (loaded from API)
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [districtsLoading, setDistrictsLoading] = useState(false);

  const [formData, setFormData] = useState<Record<string, any>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    address: initialData?.address || '',
    district: initialData?.district || '',
    city: initialData?.city || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    website: initialData?.website || '',
    working_hours: initialData?.working_hours || {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '22:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '10:00', close: '20:00' }
    }
  });

  // Load cities on mount
  useEffect(() => {
    const loadCities = async () => {
      setCitiesLoading(true);
      try {
        const citiesData = await getCities();
        setCities(citiesData);
      } catch (error) {
        console.error('Failed to load cities:', error);
      } finally {
        setCitiesLoading(false);
      }
    };
    loadCities();
  }, []);

  // Load districts when city changes
  useEffect(() => {
    if (!formData.city) {
      setDistricts([]);
      return;
    }

    const loadDistricts = async () => {
      setDistrictsLoading(true);
      try {
        const districtsData = await getDistrictsByCity(formData.city);
        setDistricts(districtsData);
      } catch (error) {
        console.error('Failed to load districts:', error);
        setDistricts([]);
      } finally {
        setDistrictsLoading(false);
      }
    };
    loadDistricts();
  }, [formData.city]);

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Введите название студии';
      if (!formData.description.trim()) newErrors.description = 'Введите описание';
      if (formData.description.length < 50) newErrors.description = 'Описание должно быть не менее 50 символов';
    }

    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Введите адрес';
      if (!formData.city) newErrors.city = 'Выберите город';
      if (!formData.phone.trim()) newErrors.phone = 'Введите телефон';
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Неверный формат email';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(3, prev + 1) as Step);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as Step);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Произошла ошибка. Попробуйте снова.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto my-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {isEdit ? 'Редактировать студию' : 'Создать студию'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step ? <Check className="w-5 h-5" /> : step}
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:inline">
                    {step === 1 && 'Основная информация'}
                    {step === 2 && 'Адрес и контакты'}
                    {step === 3 && 'Рабочие часы'}
                  </span>
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Название студии <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Например: Studio Light Pro"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Описание <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 h-32 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Расскажите о вашей студии (минимум 50 символов)..."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                  <p className="text-gray-500 text-sm ml-auto">{formData.description.length} символов</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Address & Contacts */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Город <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value, district: '' })}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={citiesLoading}
                >
                  <option value="">
                    {citiesLoading ? 'Загрузка городов...' : 'Выберите город'}
                  </option>
                  {cities.map(city => (
                    <option key={city.id} value={city.name}>{city.name}</option>
                  ))}
                </select>
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Район</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  disabled={!formData.city || districtsLoading}
                >
                  <option value="">
                    {districtsLoading ? 'Загрузка районов...' : (formData.city ? 'Выберите район' : 'Выберите город сначала')}
                  </option>
                  {districts.map(district => (
                    <option key={district.id} value={district.name}>{district.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Адрес <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ул. Абая, 150"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+7 701 123 4567"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="info@studio.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Веб-сайт</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://studio.com"
                />
              </div>
            </div>
          )}

          {/* Step 3: Working Hours */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-3">Рабочие часы</h3>
              <p className="text-gray-500 text-sm">Загрузка конфигурации...</p>
            </div>
          )}

          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {errors.submit}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between">
          <button
            onClick={currentStep === 1 ? onClose : handleBack}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            disabled={loading}
          >
            {currentStep === 1 ? (
              'Отмена'
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                Назад
              </>
            )}
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              Далее
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Сохранение...' : isEdit ? 'Сохранить изменения' : 'Создать студию'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateStudioForm;