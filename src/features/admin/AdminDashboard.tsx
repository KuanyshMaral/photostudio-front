import React, { useState, useEffect } from 'react';
import { 
  Users, Building2, Calendar, DollarSign, 
  TrendingUp, ArrowUpRight, MessageSquare, Megaphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/StatCard';
import './AdminDashboard.css';

interface DashboardStats {
  total_users: number;
  total_studios: number;
  total_bookings: number;
  total_revenue: number;
  new_users_this_month: number;
  new_studios_this_month: number;
  bookings_this_month: number;
  revenue_this_month: number;
  platform_commission: number;
  commission_this_month: number;
}

export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [token]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/v1/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.data?.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KZT',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (isLoading) {
    return <div className="admin-dashboard admin-dashboard--loading">Загрузка...</div>;
  }

  if (!stats) {
    return <div className="admin-dashboard admin-dashboard--error">Ошибка загрузки</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1>Панель управления</h1>
        <p>Обзор платформы StudioBooking</p>
      </div>

      {/* Main Stats */}
      <div className="admin-dashboard__stats">
        <StatCard
          icon={<Users size={20} />}
          label="Пользователей"
          value={stats.total_users}
          color="primary"
        />
        <StatCard
          icon={<Building2 size={20} />}
          label="Студий"
          value={stats.total_studios}
          color="success"
        />
        <StatCard
          icon={<Calendar size={20} />}
          label="Бронирований"
          value={stats.total_bookings}
          color="warning"
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label="Оборот"
          value={formatCurrency(stats.total_revenue)}
          color="danger"
        />
      </div>

      {/* Monthly Stats */}
      <div className="admin-dashboard__monthly-stats">
        <h3>За этот месяц</h3>
        <div className="monthly-stats-grid">
          <div className="monthly-stat">
            <span className="monthly-stat__label">Новые пользователи</span>
            <span className="monthly-stat__value">+{stats.new_users_this_month}</span>
          </div>
          <div className="monthly-stat">
            <span className="monthly-stat__label">Новые студии</span>
            <span className="monthly-stat__value">+{stats.new_studios_this_month}</span>
          </div>
          <div className="monthly-stat">
            <span className="monthly-stat__label">Бронирования</span>
            <span className="monthly-stat__value">{stats.bookings_this_month}</span>
          </div>
          <div className="monthly-stat">
            <span className="monthly-stat__label">Доход</span>
            <span className="monthly-stat__value">{formatCurrency(stats.revenue_this_month)}</span>
          </div>
        </div>
      </div>

      {/* Commission Stats */}
      <div className="admin-dashboard__commission">
        <div className="commission-card">
          <div className="commission-card__header">
            <TrendingUp size={24} />
            <h3>Доход платформы (10% комиссия)</h3>
          </div>
          <div className="commission-card__body">
            <div className="commission-stat">
              <span className="commission-label">Всего</span>
              <span className="commission-value">
                {formatCurrency(stats.platform_commission)}
              </span>
            </div>
            <div className="commission-stat">
              <span className="commission-label">За этот месяц</span>
              <span className="commission-value commission-value--highlight">
                {formatCurrency(stats.commission_this_month)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-dashboard__actions">
        <h3>Быстрые действия</h3>
        <div className="quick-actions">
          <a href="/admin/studios?filter=pending" className="quick-action">
            <Building2 size={20} />
            <span>Ожидающие верификации</span>
            <ArrowUpRight size={16} />
          </a>
          <a href="/admin/reviews?filter=reported" className="quick-action">
            <MessageSquare size={20} />
            <span>Жалобы на отзывы</span>
            <ArrowUpRight size={16} />
          </a>
          <a href="/admin/ads" className="quick-action">
            <Megaphone size={20} />
            <span>Управление рекламой</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
