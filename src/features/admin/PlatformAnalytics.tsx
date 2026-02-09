import React, { useState, useEffect } from 'react';
import { 
<<<<<<< HEAD
  BarChart3, MapPin, Building2, Calendar, DollarSign
=======
  BarChart3, MapPin, Building2,
  Calendar, DollarSign
>>>>>>> e5f455b231255c8509021dc9ed0381e12b32b4fb
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './PlatformAnalytics.css';

interface Analytics {
  total_users: number;
  total_studios: number;
  total_bookings: number;
  total_revenue: number;
  platform_commission: number;
  top_studios: Array<{
    studio_id: number;
    studio_name: string;
    city: string;
    bookings: number;
    revenue: number;
    rating: number;
    is_vip: boolean;
    is_gold: boolean;
  }>;
  top_cities: Array<{
    city: string;
    studios: number;
    bookings: number;
    revenue: number;
  }>;
  bookings_by_day: Array<{
    date: string;
    bookings: number;
    revenue: number;
  }>;
  users_by_role: Record<string, number>;
}

export const PlatformAnalytics: React.FC = () => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [daysBack, setDaysBack] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [token, daysBack]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/admin/analytics?days=${daysBack}`, {
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
    return <div className="platform-analytics--loading">Загрузка аналитики...</div>;
  }

  if (!analytics) {
    return <div className="platform-analytics--error">Ошибка загрузки</div>;
  }

<<<<<<< HEAD
  const getRoleLabel = (role: string): string => {
    const labels: Record<string, string> = {
      client: 'Клиенты',
      studio_owner: 'Владельцы',
      admin: 'Админы'
    };
    return labels[role] || role;
  };

=======
>>>>>>> e5f455b231255c8509021dc9ed0381e12b32b4fb
  return (
    <div className="platform-analytics">
      <div className="platform-analytics__header">
        <h1>
          <BarChart3 size={28} />
          Аналитика платформы
        </h1>
        <div className="platform-analytics__filters">
          <select 
            value={daysBack}
            onChange={e => setDaysBack(Number(e.target.value))}
          >
            <option value={7}>7 дней</option>
            <option value={30}>30 дней</option>
            <option value={90}>90 дней</option>
            <option value={365}>1 год</option>
          </select>
        </div>
      </div>

      {/* Revenue Formula */}
      <div className="platform-analytics__formula">
        <div className="formula-card">
          <h3>Формула дохода платформы</h3>
          <div className="formula-content">
            <div className="formula-item">
              <span className="formula-label">Общий оборот</span>
              <span className="formula-value">{formatCurrency(analytics.total_revenue)}</span>
            </div>
            <span className="formula-operator">×</span>
            <div className="formula-item">
              <span className="formula-label">Комиссия</span>
              <span className="formula-value">10%</span>
            </div>
            <span className="formula-operator">=</span>
            <div className="formula-item formula-item--result">
              <span className="formula-label">Доход</span>
              <span className="formula-value">{formatCurrency(analytics.platform_commission)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Studios */}
      <div className="platform-analytics__section">
        <h2>
          <Building2 size={20} />
          Топ студий
        </h2>
        <div className="studios-table-wrapper">
          <table className="studios-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Студия</th>
                <th>Город</th>
                <th>Бронирований</th>
                <th>Выручка</th>
                <th>Рейтинг</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {analytics.top_studios.map((studio, index) => (
                <tr key={studio.studio_id}>
                  <td>{index + 1}</td>
                  <td>
                    <a href={`/admin/studios/${studio.studio_id}`}>
                      {studio.studio_name}
                    </a>
                  </td>
                  <td>{studio.city}</td>
                  <td>{studio.bookings}</td>
                  <td>{formatCurrency(studio.revenue)}</td>
                  <td>
                    <span className="rating-badge">★ {studio.rating.toFixed(1)}</span>
                  </td>
                  <td>
                    {studio.is_vip && <span className="status-badge vip">VIP</span>}
                    {studio.is_gold && <span className="status-badge gold">Gold</span>}
                    {!studio.is_vip && !studio.is_gold && <span className="status-badge regular">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Cities */}
      <div className="platform-analytics__section">
        <h2>
          <MapPin size={20} />
          По городам
        </h2>
        <div className="cities-grid">
          {analytics.top_cities.map(city => (
            <div key={city.city} className="city-card">
              <h4>{city.city}</h4>
              <div className="city-stats">
                <div className="city-stat">
                  <Building2 size={16} />
                  <span>{city.studios} студий</span>
                </div>
                <div className="city-stat">
                  <Calendar size={16} />
                  <span>{city.bookings} бронирований</span>
                </div>
                <div className="city-stat">
                  <DollarSign size={16} />
                  <span>{formatCurrency(city.revenue)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users by Role */}
      <div className="platform-analytics__section">
        <h2>Пользователи по ролям</h2>
        <div className="roles-grid">
          {Object.entries(analytics.users_by_role).map(([role, count]) => (
            <div key={role} className={`role-card role-card--${role}`}>
              <span className="role-label">{getRoleLabel(role)}</span>
              <span className="role-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default PlatformAnalytics;
=======
const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    client: 'Клиенты',
    studio_owner: 'Владельцы',
    admin: 'Админы'
  };
  return labels[role] || role;
};

export default PlatformAnalytics;
>>>>>>> e5f455b231255c8509021dc9ed0381e12b32b4fb
