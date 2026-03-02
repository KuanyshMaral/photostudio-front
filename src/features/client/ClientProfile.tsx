import React, { useState, useEffect } from 'react';
import { uploadFile } from '../../api/uploadApi';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload';
import './ClientProfile.css';

interface ClientProfileProps {
  token?: string;
}

interface ClientProfileType {
  id: number;
  user_id: number;
  name: string;
  nickname: string;
  phone: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

interface ClientProfileUpdateRequest {
  name?: string;
  nickname?: string;
  phone?: string;
  avatar_url?: string;
}

const ClientProfile: React.FC<ClientProfileProps> = ({ token: propToken }) => {
  const auth = useAuth();
  const token = propToken || auth.token;
  const [profile, setProfile] = useState<ClientProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState<string>('');
  const [formData, setFormData] = useState<ClientProfileUpdateRequest>({
    name: '',
    nickname: '',
    phone: '',
    avatar_url: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Small delay to ensure auth context is properly set up
    const timer = setTimeout(() => {
      if (token) {
        loadProfile();
      } else {
        setLoading(false);
        setError('Требуется авторизация');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [token]);

  // Helper function to extract string values from sql.NullString objects
  const extractStringValue = (value: any) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.String !== undefined) return value.String;
    return '';
  };

  const loadProfile = async () => {
    if (!token) {
      setError('Требуется авторизация');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Direct API call to bypass apiWrapper auth context issues
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/profiles/client`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to fetch client profile');
      }

      const result = await response.json();
      const profileData = result.data;
      
      // Extract values from API response format (handle sql.NullString objects)
      const extractedData = {
        ...profileData,
        name: extractStringValue(profileData.name),
        nickname: extractStringValue(profileData.nickname),
        phone: extractStringValue(profileData.phone),
        avatar_url: extractStringValue(profileData.avatar_url)
      };
      
      setProfile(extractedData);
      setFormData({
        name: extractStringValue(profileData.name),
        nickname: extractStringValue(profileData.nickname),
        phone: extractStringValue(profileData.phone),
        avatar_url: extractStringValue(profileData.avatar_url)
      });
      setAvatar(extractStringValue(profileData.avatar_url));
    } catch (error) {
      console.error('Failed to load client profile:', error);
      setError('Не удалось загрузить профиль');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setEditing(false);
    if (profile) {
      setFormData({
        name: extractStringValue(profile.name),
        nickname: extractStringValue(profile.nickname),
        phone: extractStringValue(profile.phone),
        avatar_url: extractStringValue(profile.avatar_url)
      });
      setAvatar(extractStringValue(profile.avatar_url));
    }
    setError('');
  };

  const handleAvatarChange = async (newAvatar: string) => {
    setAvatar(newAvatar);
    
    if (newAvatar && typeof newAvatar === 'string' && newAvatar.startsWith('data:image/')) {
      try {
        // Upload avatar to server
        const base64Data = newAvatar.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        const mimeType = newAvatar.split(';')[0].split(':')[1];
        const file = new File([byteArray], 'avatar.jpg', { type: mimeType });
        
        const uploadResult = await uploadFile(file, token || '');
        setFormData((prev: ClientProfileUpdateRequest) => ({ ...prev, avatar_url: uploadResult.url }));
      } catch (error) {
        console.error('Failed to upload avatar:', error);
        setError('Не удалось загрузить аватар');
      }
    } else {
      setFormData((prev: ClientProfileUpdateRequest) => ({ ...prev, avatar_url: newAvatar || '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Требуется авторизация');
      return;
    }
    
    try {
      // Direct API call to bypass apiWrapper auth context issues
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/profiles/client`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to update client profile');
      }

      const result = await response.json();
      const updatedProfile = result.data;
      
      setProfile(updatedProfile);
      setEditing(false);
      setError('');
      alert('Профиль успешно обновлен');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Не удалось обновить профиль');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: ClientProfileUpdateRequest) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
          <div className="w-48 h-6 bg-gray-200 rounded-lg mb-2"></div>
          <div className="w-32 h-4 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-500 mb-6">{error || 'Профиль не найден'}</p>
          <button 
            onClick={() => loadProfile()} 
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors w-full"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Профиль клиента</h1>
          {!editing && (
            <button 
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center gap-2 active:scale-[0.98] shadow-sm"
              onClick={handleEdit}
            >
              Редактировать
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <span className="text-xl">!</span>
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar Section */}
              <div className="w-full md:w-auto flex flex-col items-center flex-shrink-0">
                <div className="relative mb-4">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-50">
                    {avatar && typeof avatar === 'string' ? (
                      <img 
                        src={avatar.startsWith('data:') ? avatar : `http://89.35.125.136:8090${avatar}`}
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300">
                        {(extractStringValue(formData.name) || extractStringValue(profile?.name) || '?').toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                
                {editing && (
                  <div className="w-full max-w-xs">
                    <ImageUpload
                      images={avatar && typeof avatar === 'string' ? [avatar] : []}
                      onImagesChange={(images) => handleAvatarChange(images[0] || '')}
                      maxImages={1}
                    />
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex-1 w-full">
                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Имя <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                          placeholder="Введите ваше имя"
                        />
                      </div>

                      <div>
                        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Никнейм
                        </label>
                        <input
                          type="text"
                          id="nickname"
                          name="nickname"
                          value={formData.nickname}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                          placeholder="Введите никнейм"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Телефон <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                          placeholder="+7 (777) 123-45-67"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6 mt-6 border-t border-gray-100">
                      <button 
                        type="button" 
                        className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors active:scale-[0.98]" 
                        onClick={handleCancel}
                      >
                        Отмена
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-sm transition-colors active:scale-[0.98]"
                      >
                        Сохранить
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <span className="block text-sm font-medium text-gray-500 mb-1">Имя</span>
                        <span className="block text-base font-semibold text-gray-900">
                          {extractStringValue(profile?.name) || 'Не указано'}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <span className="block text-sm font-medium text-gray-500 mb-1">Никнейм</span>
                        <span className="block text-base font-semibold text-gray-900">
                          {extractStringValue(profile?.nickname) || 'Не указано'}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <span className="block text-sm font-medium text-gray-500 mb-1">Телефон</span>
                        <span className="block text-base font-semibold text-gray-900">
                          {extractStringValue(profile?.phone) || 'Не указано'}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <span className="block text-sm font-medium text-gray-500 mb-1">ID пользователя</span>
                        <span className="block text-base font-semibold text-gray-900 font-mono text-sm">
                          {profile?.user_id || 'Не указано'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                      <span>Зарегистрирован:</span>
                      <span className="font-medium">
                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : 'Не указано'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
