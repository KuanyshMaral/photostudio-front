import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, User, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MainHeaderProps {
  onSearch?: (query: string) => void;
}

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
    <header className="glass sticky top-0 z-50 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl mr-4">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">StudioBooking</h1>
          </div>

          {/* Search Bar */}
          <form className="flex-1 max-w-xl mx-8" onSubmit={handleSearch}>
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="modern-input pl-12 pr-4 py-3 w-full"
                placeholder="Поиск студий, локаций..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Поиск студий"
              />
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button 
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
              onClick={() => navigate('/notifications')}
              aria-label="Уведомления"
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            <Link to="/profile" className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {user ? getInitials(user.name) : <User size={16} className="text-white" />}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.name || 'Гость'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
