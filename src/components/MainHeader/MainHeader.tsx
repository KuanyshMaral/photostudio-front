import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './MainHeader.css';

interface MainHeaderProps {
  onSearch?: (query: string) => void;
}

/**
 * MainHeader — главный header приложения после редизайна.
 * 
 * Содержит:
 * - Аватар пользователя (кликабельный → /profile)
 * - Имя пользователя
 * - Кнопку уведомлений с badge
 * - Строку поиска
 * 
 * Используется на главной странице (Каталог студий).
 */
export const MainHeader: React.FC<MainHeaderProps> = ({ onSearch }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  // Загрузка количества непрочитанных уведомлений
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!token) return;
      
      try {
        const response = await fetch('/api/v1/notifications/unread-count', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.count || 0);
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };

    fetchUnreadCount();
    // Обновляем каждые 30 секунд
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [token]);

  // Обработка поиска
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  // Обработка ввода поиска с debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Если передан onSearch, вызываем при каждом изменении (для live search)
    // Можно добавить debounce здесь если нужно
  };

  // Получение инициалов для fallback аватара
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="main-header">
      <div className="main-header__container">
        {/* Верхняя строка: Аватар и Уведомления */}
        <div className="main-header__top">
          {/* Левая часть: Аватар + Имя */}
          <Link to="/profile" className="main-header__user">
            <div className="main-header__avatar">
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.name} 
                  className="main-header__avatar-img"
                />
              ) : (
                <div className="main-header__avatar-fallback">
                  {user ? getInitials(user.name) : <User size={20} />}
                </div>
              )}
            </div>
            <span className="main-header__username">
              {user?.name || 'Гость'}
            </span>
          </Link>

          {/* Правая часть: Уведомления */}
          <button 
            className="main-header__notifications"
            onClick={() => navigate('/notifications')}
            aria-label="Уведомления"
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="main-header__badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Строка поиска */}
        <form className="main-header__search" onSubmit={handleSearch}>
          <Search size={20} className="main-header__search-icon" />
          <input
            type="text"
            className="main-header__search-input"
            placeholder="Поиск студий..."
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Поиск студий"
          />
        </form>
      </div>
    </header>
  );
};

export default MainHeader;
