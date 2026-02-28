import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, Users, BarChart3, 
  Megaphone, MessageSquare, Settings, LogOut, Shield, UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

export const AdminLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Пользователи', icon: Users },
    { path: '/admin/analytics', label: 'Аналитика', icon: BarChart3 },
    { path: '/admin/studios', label: 'Студии', icon: Building2 },
    { path: '/admin/verification', label: 'Верификация', icon: Shield },
    { path: '/admin/leads', label: 'Лиды', icon: UserPlus },
    { path: '/admin/ads', label: 'Реклама', icon: Megaphone },
    { path: '/admin/reviews', label: 'Отзывы', icon: MessageSquare },
    { path: '/admin/settings', label: 'Настройки', icon: Settings },
    { path: '/admin/user-management', label: 'Управление ролями', icon: Shield },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <Shield size={28} className="admin-sidebar__icon" />
          <div>
            <h1>StudioBooking</h1>
            <span className="admin-badge">Admin Panel</span>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `admin-nav-item ${isActive ? 'active' : ''}` 
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-user">
            <div className="admin-user__avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="admin-user__info">
              <span className="admin-user__name">{user?.name || 'Admin'}</span>
              <span className="admin-user__role">Администратор</span>
            </div>
          </div>
          <button className="admin-logout" onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
