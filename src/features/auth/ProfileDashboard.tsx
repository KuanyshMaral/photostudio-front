import React, { useState, useEffect } from 'react';
import { Camera, Mail, Phone, Calendar, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RecentActivityItem } from '../../components/RecentActivityItem';
import { EditProfileModal } from './EditProfileModal';
import { getProfile } from './auth.api';
import type { Profile } from './auth.types';
import './ProfileDashboard.css';

export const ProfileDashboard: React.FC = () => {
  const { token, refreshUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Загрузка профиля с статистикой
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const profileData = await getProfile(token);
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Получение инициалов для fallback аватара
  const getInitials = (name: string): string => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Форматирование даты регистрации
  const formatMemberSince = (dateStr: string): string => {
    if (!dateStr) return 'недавно';
    try {
      const date = new Date(dateStr);
      const options: Intl.DateTimeFormatOptions = { 
        month: 'long', 
        year: 'numeric' 
      };
      return date.toLocaleDateString('ru-RU', options);
    } catch {
      return 'недавно';
    }
  };

  // Роль на русском
  const getRoleLabel = (role: string): string => {
    const roles: Record<string, string> = {
      client: 'Клиент',
      studio_owner: 'Владелец студии',
      admin: 'Администратор',
    };
    return roles[role] || role;
  };

  // Callback после обновления профиля
  const handleProfileUpdate = () => {
    setIsEditModalOpen(false);
    refreshUser?.();
    // Re-fetch profile
    window.location.reload();
  };

  if (isLoading) {
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
          <p className="text-gray-500 mb-6">Не удалось загрузить данные профиля. Пожалуйста, попробуйте обновить страницу.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors w-full"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Левая колонка: Identity Card */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
              <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              
              <div className="px-6 pb-6 text-center">
                {/* Аватар */}
                <div className="relative inline-block -mt-16 mb-4">
                  <div className="w-32 h-32 rounded-full bg-white p-2 shadow-md">
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                      {profile.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.name || 'Аватар пользователя'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-gray-400">
                          {getInitials(profile.name || '')}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    className="absolute bottom-2 right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 hover:scale-110 transition-all border-2 border-white"
                    aria-label="Изменить фото"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                {/* Имя и роль */}
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.name || 'Пользователь'}</h1>
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                    {getRoleLabel(profile.role || 'client')}
                  </span>
                </div>

                {/* Дата регистрации */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6 bg-gray-50 py-2 px-4 rounded-lg">
                  <Calendar size={14} className="text-gray-400" />
                  <span>С нами с {formatMemberSince(profile.created_at || '')}</span>
                </div>

                {/* Кнопка редактирования */}
                <button 
                  className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit2 size={16} />
                  <span>Редактировать профиль</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Правая колонка: Stats + Info + Activity */}
          <main className="flex-1 w-full space-y-8">
            {/* Stats секция */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Статистика
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Всего бронирований</span>
                    <span className="text-xl">📊</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {profile.stats?.total_bookings || 0}
                  </div>
                </div>
                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Предстоящих</span>
                    <span className="text-xl">📅</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {profile.stats?.upcoming_bookings || 0}
                  </div>
                </div>
                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Завершённых</span>
                    <span className="text-xl">✅</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {profile.stats?.completed_bookings || 0}
                  </div>
                </div>
              </div>
            </section>

            {/* Personal Info секция */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Контактная информация
              </h2>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  <div className="p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-0.5">Email</p>
                      <p className="font-semibold text-gray-900">{profile.email || 'Не указан'}</p>
                    </div>
                  </div>

                  <div className="p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-0.5">Телефон</p>
                      <p className="font-semibold text-gray-900">{profile.phone || 'Не указан'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity секция */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Недавняя активность
              </h2>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {profile.recent_bookings && profile.recent_bookings.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {profile.recent_bookings.map(booking => (
                      <div key={booking.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                        <RecentActivityItem
                          studioName={booking.studio_name}
                          roomName={booking.room_name}
                          date={booking.date}
                          status={booking.status}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                      📭
                    </div>
                    <h3 className="text-base font-medium text-gray-900 mb-1">Пока нет активности</h3>
                    <p className="text-sm text-gray-500">У вас пока нет ни одного бронирования</p>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>

        {/* Модалка редактирования */}
        {isEditModalOpen && (
          <EditProfileModal
            profile={profile}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleProfileUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileDashboard;
