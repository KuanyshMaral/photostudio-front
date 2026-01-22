import React, { useState, useEffect } from 'react';
import { Crown, Star, Building2, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './StudioVIPManager.css';

interface Studio {
  id: number;
  name: string;
  city: string;
  rating: number;
  is_vip: boolean;
  is_gold: boolean;
  in_promo_slider: boolean;
}

export const StudioVIPManager: React.FC = () => {
  const { token } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudios();
  }, [token]);

  const fetchStudios = async () => {
    try {
      const response = await fetch('/api/v1/admin/studios?per_page=100', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStudios(data.data?.studios || []);
      }
    } catch (error) {
      console.error('Failed to fetch studios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVIP = async (studioId: number, isVIP: boolean) => {
    try {
      await fetch(`/api/v1/admin/studios/${studioId}/vip`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_vip: !isVIP })
      });
      fetchStudios();
    } catch (error) {
      console.error('Failed to update VIP:', error);
    }
  };

  const toggleGold = async (studioId: number, isGold: boolean) => {
    try {
      await fetch(`/api/v1/admin/studios/${studioId}/gold`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_gold: !isGold })
      });
      fetchStudios();
    } catch (error) {
      console.error('Failed to update Gold:', error);
    }
  };

  if (isLoading) {
    return <div className="vip-manager--loading">Загрузка...</div>;
  }

  return (
    <div className="vip-manager">
      <div className="vip-manager__header">
        <h1>
          <Crown size={24} />
          Управление VIP/Gold
        </h1>
      </div>

      <div className="vip-legend">
        <div className="legend-item">
          <span className="badge badge--vip">VIP</span>
          <span>Премиум размещение + приоритет в поиске</span>
        </div>
        <div className="legend-item">
          <span className="badge badge--gold">Gold</span>
          <span>Золотая рамка + выделение в списке</span>
        </div>
      </div>

      <table className="vip-table">
        <thead>
          <tr>
            <th>Студия</th>
            <th>Город</th>
            <th>Рейтинг</th>
            <th>VIP</th>
            <th>Gold</th>
          </tr>
        </thead>
        <tbody>
          {studios.map(studio => (
            <tr key={studio.id}>
              <td>
                <div className="studio-name">
                  <Building2 size={16} />
                  {studio.name}
                </div>
              </td>
              <td>{studio.city}</td>
              <td>
                <span className="rating">
                  <Star size={14} fill="#f59e0b" />
                  {studio.rating.toFixed(1)}
                </span>
              </td>
              <td>
                <button
                  className={`toggle-btn ${studio.is_vip ? 'active' : ''}`}
                  onClick={() => toggleVIP(studio.id, studio.is_vip)}
                >
                  {studio.is_vip ? <Check size={16} /> : <X size={16} />}
                </button>
              </td>
              <td>
                <button
                  className={`toggle-btn toggle-btn--gold ${studio.is_gold ? 'active' : ''}`}
                  onClick={() => toggleGold(studio.id, studio.is_gold)}
                >
                  {studio.is_gold ? <Check size={16} /> : <X size={16} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudioVIPManager;
