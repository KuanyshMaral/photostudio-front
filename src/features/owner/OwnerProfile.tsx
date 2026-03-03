import React, { useState, useEffect } from 'react';
import { getOwnerProfile, updateOwnerProfile, type OwnerProfile as OwnerProfileType, type OwnerProfileUpdateRequest } from '../../api/ownerProfileApi';
import { uploadFile } from '../../api/uploadApi';
import AvatarUpload from '../../components/AvatarUpload';
import './OwnerProfile.css';

interface OwnerProfileProps {
  token: string;
}

export const OwnerProfile: React.FC<OwnerProfileProps> = ({ token }) => {
  const [profile, setProfile] = useState<OwnerProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [formData, setFormData] = useState<OwnerProfileUpdateRequest>({
    company_name: '',
    contact_person: '',
    contact_position: '',
    email: '',
    legal_address: '',
    phone: '',
    website: '',
    bin: '',
    avatar_url: ''
  });

  useEffect(() => {
    loadProfile();
  }, [token]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getOwnerProfile(token);
      
      // Extract values from API response format if needed
      const extractedData = {
        ...profileData,
        company_name: (profileData.company_name as any)?.String || profileData.company_name || '',
        contact_person: (profileData.contact_person as any)?.String || profileData.contact_person || '',
        contact_position: (profileData.contact_position as any)?.String || profileData.contact_position || '',
        email: (profileData.email as any)?.String || profileData.email || '',
        legal_address: (profileData.legal_address as any)?.String || profileData.legal_address || '',
        phone: (profileData.phone as any)?.String || profileData.phone || '',
        website: (profileData.website as any)?.String || profileData.website || '',
        bin: (profileData.bin as any)?.String || profileData.bin || '',
        avatar_url: (profileData.avatar_url as any)?.String || profileData.avatar_url || ''
      };
      
      setProfile(extractedData);
      setFormData({
        company_name: extractedData.company_name || '',
        contact_person: extractedData.contact_person || '',
        contact_position: extractedData.contact_position || '',
        email: extractedData.email || '',
        legal_address: extractedData.legal_address || '',
        phone: extractedData.phone || '',
        website: extractedData.website || '',
        bin: extractedData.bin || '',
        avatar_url: extractedData.avatar_url || ''
      });
    } catch (error) {
      console.error('Failed to load owner profile:', error);
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
        company_name: (profile.company_name as any)?.String || profile.company_name || '',
        contact_person: (profile.contact_person as any)?.String || profile.contact_person || '',
        contact_position: (profile.contact_position as any)?.String || profile.contact_position || '',
        email: (profile.email as any)?.String || profile.email || '',
        legal_address: (profile.legal_address as any)?.String || profile.legal_address || '',
        phone: (profile.phone as any)?.String || profile.phone || '',
        website: (profile.website as any)?.String || profile.website || '',
        bin: (profile.bin as any)?.String || profile.bin || '',
        avatar_url: (profile.avatar_url as any)?.String || profile.avatar_url || ''
      });
    }
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setAvatarLoading(true);
      const uploadResult = await uploadFile(file, token);
      const avatarUrl = uploadResult.url;
      
      // Update form data with new avatar URL
      setFormData(prev => ({ ...prev, avatar_url: avatarUrl }));
      
      // Also update profile immediately for preview
      if (profile) {
        setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      setError('Не удалось загрузить аватар');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updatedProfile = await updateOwnerProfile(token, formData);
      setProfile(updatedProfile);
      setEditing(false);
      setError('');
      alert('Профиль успешно обновлен');
    } catch (error) {
      console.error('Failed to update owner profile:', error);
      setError('Не удалось обновить профиль');
    }
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

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Профиль владельца студии</h1>
            <p className="text-gray-500 mt-1">Управление информацией о вашей компании</p>
          </div>
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
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Upload Section */}
                <div className="flex justify-center pb-6 border-b border-gray-100">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Аватар компании</h3>
                    <AvatarUpload
                      currentAvatar={formData.avatar_url ? `http://89.35.125.136:8090${formData.avatar_url}` : undefined}
                      onUpload={handleAvatarUpload}
                      isLoading={avatarLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Название компании <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                    />
                  </div>

                  <div>
                    <label htmlFor="bin" className="block text-sm font-medium text-gray-700 mb-1.5">
                      БИН/ИИН <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="bin"
                      name="bin"
                      value={formData.bin}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="legal_address" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Юридический адрес
                    </label>
                    <textarea
                      id="legal_address"
                      name="legal_address"
                      value={formData.legal_address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none"
                    />
                  </div>

                  <div className="md:col-span-2 py-4 border-t border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Контактная информация</h3>
                  </div>

                  <div>
                    <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Контактное лицо <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact_person"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact_position" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Должность
                    </label>
                    <input
                      type="text"
                      id="contact_position"
                      name="contact_position"
                      value={formData.contact_position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
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
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Веб-сайт
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                      placeholder="https://"
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
                    Сохранить изменения
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Avatar Display Section */}
                <div className="flex justify-center pb-6 border-b border-gray-100">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Аватар компании</h3>
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mx-auto">
                      {profile?.avatar_url ? (
                        <img
                          src={`http://89.35.125.136:8090${(profile.avatar_url as any)?.String || profile.avatar_url}`}
                          alt="Company Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-gray-500">
                          {profile?.company_name ? 
                            (typeof profile.company_name === 'object' ? (profile.company_name as any).String : profile.company_name)?.charAt(0)?.toUpperCase() || '?'
                            : '?'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Информация о компании
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <span className="block text-sm font-medium text-gray-500 mb-1">Название компании</span>
                      <span className="block text-base font-semibold text-gray-900">
                        {profile?.company_name ? 
                          (typeof profile.company_name === 'object' ? (profile.company_name as any).String : profile.company_name) 
                          : 'Не указано'}
                      </span>
                    </div>

                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <span className="block text-sm font-medium text-gray-500 mb-1">БИН/ИИН</span>
                      <span className="block text-base font-semibold text-gray-900 font-mono">
                        {profile?.bin ? 
                          (typeof profile.bin === 'object' ? (profile.bin as any).String : profile.bin) 
                          : 'Не указано'}
                      </span>
                    </div>

                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 md:col-span-2">
                      <span className="block text-sm font-medium text-gray-500 mb-1">Юридический адрес</span>
                      <span className="block text-base font-semibold text-gray-900">
                        {profile?.legal_address ? 
                          (typeof profile.legal_address === 'object' ? (profile.legal_address as any).String : profile.legal_address) 
                          : 'Не указано'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Контактная информация
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <span className="block text-sm font-medium text-gray-500 mb-1">Контактное лицо</span>
                      <span className="block text-base font-semibold text-gray-900">
                        {profile?.contact_person ? 
                          (typeof profile.contact_person === 'object' ? (profile.contact_person as any).String : profile.contact_person) 
                          : 'Не указано'}
                      </span>
                    </div>

                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <span className="block text-sm font-medium text-gray-500 mb-1">Должность</span>
                      <span className="block text-base font-semibold text-gray-900">
                        {profile?.contact_position ? 
                          (typeof profile.contact_position === 'object' ? (profile.contact_position as any).String : profile.contact_position) 
                          : 'Не указано'}
                      </span>
                    </div>

                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <span className="block text-sm font-medium text-gray-500 mb-1">Телефон</span>
                      <span className="block text-base font-semibold text-gray-900">
                        {profile?.phone ? 
                          (typeof profile.phone === 'object' ? (profile.phone as any).String : profile.phone) 
                          : 'Не указано'}
                      </span>
                    </div>

                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <span className="block text-sm font-medium text-gray-500 mb-1">Email</span>
                      <span className="block text-base font-semibold text-gray-900">
                        {profile?.email ? 
                          (typeof profile.email === 'object' ? (profile.email as any).String : profile.email) 
                          : 'Не указано'}
                      </span>
                    </div>

                    {((typeof profile?.website === 'object' ? (profile?.website as any).String : profile?.website)) && (
                      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 md:col-span-2">
                        <span className="block text-sm font-medium text-gray-500 mb-1">Веб-сайт</span>
                        <a 
                          href={typeof profile?.website === 'object' ? (profile?.website as any).String : profile?.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block text-base font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          {typeof profile?.website === 'object' ? (profile?.website as any).String : profile?.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* System Info */}
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="block text-sm font-medium text-blue-600 mb-1">Статус верификации</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          profile?.verification_status === 'verified' ? 'bg-green-500' : 
                          profile?.verification_status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-base font-semibold text-gray-900 uppercase tracking-wide">
                          {profile?.verification_status === 'verified' ? 'Подтвержден' :
                           profile?.verification_status === 'pending' ? 'На проверке' : 
                           profile?.verification_status || 'Не указано'}
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="block text-sm font-medium text-blue-600 mb-1">Дата регистрации</span>
                      <span className="block text-base font-medium text-gray-900">
                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : 'Не указано'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
