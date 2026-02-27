import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getOwnerAnalytics, type Analytics } from './owner.api';
import { Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import './OwnerDashboard.css';

export default function Analytics() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load analytics
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getOwnerAnalytics(token);
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
        setError('Не удалось загрузить аналитику');
        // Set default values for testing
        setAnalytics({
          total_bookings: 0,
          total_revenue: 0,
          average_booking_value: 0,
          monthly_revenue: 0,
          active_clients: 0,
          conversion_rate: 0
        });
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [token]);

  if (loading) {
    return <div className="tab-content">Загрузка аналитики...</div>;
  }

  if (error && !analytics) {
    return <div className="tab-content">
      <h2>Аналитика студии</h2>
      <div style={{ color: 'red', padding: '20px' }}>{error}</div>
    </div>;
  }

  return (
    <div className="tab-content">
      <div className="content-header">
        <h2>Аналитика студии</h2>
      </div>
      
      <div className="analytics-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-number">{analytics?.total_bookings || 0}</div>
            <div className="stat-label">Всего бронирований</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-number">{analytics?.total_revenue?.toLocaleString() || 0} ₸</div>
            <div className="stat-label">Общий доход</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-number">{analytics?.average_booking_value?.toLocaleString() || 0} ₸</div>
            <div className="stat-label">Средний чек</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-number">{analytics?.active_clients || 0}</div>
            <div className="stat-label">Активные клиенты</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-number">{analytics?.monthly_revenue?.toLocaleString() || 0} ₸</div>
            <div className="stat-label">Доход за месяц</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-number">{((analytics?.conversion_rate || 0) * 100).toFixed(1)}%</div>
            <div className="stat-label">Конверсия</div>
          </div>
        </div>
      </div>
    </div>
  );
}
