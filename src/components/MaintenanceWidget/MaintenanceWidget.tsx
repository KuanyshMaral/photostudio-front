import React, { useState, useEffect } from 'react';
import { Wrench, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './MaintenanceWidget.css';

interface MaintenanceItem {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_date?: string;
}

export const MaintenanceWidget: React.FC = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('pending');

  useEffect(() => {
    fetchItems();
  }, [token, filter]);

  const fetchItems = async () => {
    try {
      const response = await fetch(`/api/v1/owner/maintenance?status=${filter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data.data?.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch maintenance items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/v1/owner/maintenance/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      fetchItems();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusIcon = (status: string) => null;
  const getStatusLabel = (status: string) => status;

  return (
    <div className="maintenance-widget">
      <div className="maintenance-widget__header">
        <div className="maintenance-widget__title">
          <Wrench size={20} />
          <span>Обслуживание</span>
        </div>
        <a href="/owner/maintenance" className="maintenance-widget__link">
          <Plus size={18} />
        </a>
      </div>

      <div className="maintenance-widget__filters">
        {['all', 'pending', 'in_progress', 'completed'].map(status => (
          <button
            key={status}
            className={`maintenance-widget__filter ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status === 'all' ? 'Все' : getStatusLabel(status)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="maintenance-widget__loading">Загрузка...</div>
      ) : items.length === 0 ? (
        <div className="maintenance-widget__empty">
          <p>Нет задач</p>
        </div>
      ) : (
        <ul className="maintenance-widget__list">
          {items.slice(0, 5).map(item => (
            <li key={item.id} className="maintenance-widget__item">
              <div className="maintenance-widget__status">
                {getStatusIcon(item.status)}
              </div>
              <div className="maintenance-widget__content">
                <span className="maintenance-widget__name">{item.title}</span>
                {item.assigned_to && (
                  <span className="maintenance-widget__assignee">
                    {item.assigned_to}
                  </span>
                )}
              </div>
              {item.status !== 'completed' && (
                <select
                  value={item.status}
                  onChange={e => updateStatus(item.id, e.target.value)}
                  className="maintenance-widget__status-select"
                >
                  <option value="pending">Ожидает</option>
                  <option value="in_progress">В работе</option>
                  <option value="completed">Выполнено</option>
                </select>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MaintenanceWidget;
