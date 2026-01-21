import React, { useState, useEffect } from 'react';
import { Camera, Mail, Phone, Calendar, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/StatCard';
import { RecentActivityItem } from '../../components/RecentActivityItem';
import { EditProfileModal } from './EditProfileModal';
import './ProfileDashboard.css';

interface UserStats {
  total_bookings: number;
  upcoming_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
}

interface RecentBooking {
  id: number;
  studio_name: string;
  room_name: string;
  date: string;
  status: 'completed' | 'cancelled' | 'pending' | 'confirmed';
}

interface UserProfile {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  stats?: UserStats;
  recent_bookings?: RecentBooking[];
}

export const ProfileDashboard: React.FC = () => {
  const { token, refreshUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Загрузка профиля с статистикой
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const response = await fetch('/api/v1/users/me?include_stats=true', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
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
      <div className="profile-dashboard profile-dashboard--loading">
        <div className="profile-skeleton" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-dashboard profile-dashboard--error">
        <p>Не удалось загрузить профиль</p>
      </div>
    );
  }

  return (
    <div className="profile-dashboard">
      {/* Левая колонка: Identity Card */}
      <aside className="profile-dashboard__identity">
        <div className="identity-card">
          {/* Аватар */}
          <div className="identity-card__avatar-container">
            <div className="identity-card__avatar">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.name || 'Аватар пользователя'}
                  className="identity-card__avatar-img"
                />
              ) : (
                <span className="identity-card__avatar-fallback">
                  {getInitials(profile.name || '')}
                </span>
              )}
            </div>
            <button 
              className="identity-card__avatar-edit"
              aria-label="Изменить фото"
            >
              <Camera size={16} />
            </button>
          </div>

          {/* Имя и роль */}
          <h1 className="identity-card__name">{profile.name || 'Пользователь'}</h1>
          <span className="identity-card__role">
            {getRoleLabel(profile.role || 'client')}
          </span>

          {/* Дата регистрации */}
          <div className="identity-card__member-since">
            <Calendar size={14} />
            <span>С нами с {formatMemberSince(profile.created_at || '')}</span>
          </div>

          {/* Кнопка редактирования */}
          <button 
            className="identity-card__edit-btn"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit2 size={18} />
            <span>Редактировать профиль</span>
          </button>
        </div>
      </aside>

      {/* Правая колонка: Stats + Info + Activity */}
      <main className="profile-dashboard__main">
        {/* Stats секция */}
        <section className="profile-section">
          <h2 className="profile-section__title">Статистика</h2>
          <div className="stats-grid">
            <StatCard
              value={profile.stats?.total_bookings || 0}
              label="Всего бронирований"
              icon="📊"
              color="primary"
            />
            <StatCard
              value={profile.stats?.upcoming_bookings || 0}
              label="Предстоящих"
              icon="📅"
              color="success"
            />
            <StatCard
              value={profile.stats?.completed_bookings || 0}
              label="Завершённых"
              icon="✅"
              color="primary"
            />
          </div>
        </section>

        {/* Personal Info секция */}
        <section className="profile-section">
          <h2 className="profile-section__title">Контактная информация</h2>
          <div className="info-card">
            <div className="info-item">
              <Mail size={18} className="info-item__icon" />
              <div className="info-item__content">
                <span className="info-item__label">Email</span>
                <span className="info-item__value">{profile.email || 'Не указан'}</span>
              </div>
            </div>

            <div className="info-item">
              <Phone size={18} className="info-item__icon" />
              <div className="info-item__content">
                <span className="info-item__label">Телефон</span>
                <span className="info-item__value">
                  {profile.phone || 'Не указан'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity секция */}
        <section className="profile-section">
          <h2 className="profile-section__title">Недавняя активность</h2>
          <div className="activity-card">
            {profile.recent_bookings && profile.recent_bookings.length > 0 ? (
              profile.recent_bookings.map(booking => (
                <RecentActivityItem
                  key={booking.id}
                  studioName={booking.studio_name}
                  roomName={booking.room_name}
                  date={booking.date}
                  status={booking.status}
                />
              ))
            ) : (
              <div className="activity-empty">
                <span>📭</span>
                <p>Пока нет бронирований</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Модалка редактирования */}
      {isEditModalOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default ProfileDashboard;
