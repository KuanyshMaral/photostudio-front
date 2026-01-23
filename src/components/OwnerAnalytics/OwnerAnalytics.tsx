import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Calendar, DollarSign, Users, 
  BarChart2, PieChart 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../StatCard';
import './OwnerAnalytics.css';

interface Analytics {
  total_bookings: number;
  total_revenue: number;
  avg_booking_value: number;
  bookings_this_month: number;
  revenue_this_month: number;
  top_rooms: Array<{
    room_id: number;
    room_name: string;
    booking_count: number;
    revenue: number;
  }>;
  bookings_by_status: Record<string, number>;
}

export const OwnerAnalytics: React.FC = () => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/v1/owner/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data?.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
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
    return (
      <div className="owner-analytics owner-analytics--loading">
        <div className="owner-analytics__skeleton" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="owner-analytics owner-analytics--empty">
        <p>Нет данных для отображения</p>
      </div>
    );
  }

  return (
    <div className="owner-analytics">
      <h2 className="owner-analytics__title">
        <BarChart2 size={24} />
        Аналитика
      </h2>

      {/* Основные метрики */}
      <div className="owner-analytics__stats">
        <StatCard
          icon={<Calendar size={20} />}
          label="Всего бронирований"
          value={analytics.total_bookings}
          color="primary"
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label="Общий доход"
          value={formatCurrency(analytics.total_revenue)}
          color="success"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Средний чек"
          value={formatCurrency(analytics.avg_booking_value)}
          color="warning"
        />
        <StatCard
          icon={<Users size={20} />}
          label="За этот месяц"
          value={analytics.bookings_this_month}
          color="danger"
        />
      </div>

      {/* Топ комнат */}
      <div className="owner-analytics__section">
        <h3>
          <PieChart size={18} />
          Топ комнат по бронированиям
        </h3>
        <div className="owner-analytics__rooms">
          {analytics.top_rooms.slice(0, 5).map((room, index) => (
            <div key={room.room_id} className="owner-analytics__room">
              <span className="owner-analytics__room-rank">#{index + 1}</span>
              <span className="owner-analytics__room-name">{room.room_name}</span>
              <span className="owner-analytics__room-count">
                {room.booking_count} бронирований
              </span>
              <span className="owner-analytics__room-revenue">
                {formatCurrency(room.revenue)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Статусы бронирований */}
      <div className="owner-analytics__section">
        <h3>По статусам</h3>
        <div className="owner-analytics__statuses">
          {Object.entries(analytics.bookings_by_status).map(([status, count]) => (
            <div key={status} className={`owner-analytics__status owner-analytics__status--${status}`}>
              <span className="owner-analytics__status-label">
                {getStatusLabel(status)}
              </span>
              <span className="owner-analytics__status-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Ожидает',
    confirmed: 'Подтверждено',
    completed: 'Завершено',
    cancelled: 'Отменено'
  };
  return labels[status] || status;
};

export default OwnerAnalytics;
