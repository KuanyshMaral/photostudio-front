import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Search } from 'lucide-react';
import './StudioManagement.css';

interface Studio {
  id: number;
  name: string;
  email: string;
  address: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export default function StudioManagement() {
  const { token } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockStudios: Studio[] = [
      {
        id: 1,
        name: 'Photo Studio Pro',
        email: 'studio@example.com',
        address: '123 Main St, City',
        status: 'verified',
        created_at: '2024-01-01'
      },
      {
        id: 2,
        name: 'Creative Space',
        email: 'creative@example.com',
        address: '456 Oak Ave, Town',
        status: 'pending',
        created_at: '2024-01-02'
      }
    ];
    
    setTimeout(() => {
      setStudios(mockStudios);
      setLoading(false);
    }, 1000);
  }, [token]);

  const handleStatusChange = (studioId: number, newStatus: Studio['status']) => {
    setStudios(prev => prev.map(studio => 
      studio.id === studioId ? { ...studio, status: newStatus } : studio
    ));
  };

  if (loading) {
    return <div className="studio-management--loading">Загрузка студий...</div>;
  }

  return (
    <div className="studio-management">
      <div className="studio-management__header">
        <h1>
          <Building2 size={28} />
          Управление студиями
        </h1>
        <div className="studio-management__filters">
          <div className="filter-group">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Поиск студий..."
              onChange={() => {
                // Add search functionality here
              }}
            />
          </div>
          <select>
            <option value="all">Все статусы</option>
            <option value="verified">Подтвержденные</option>
            <option value="pending">В ожидании</option>
            <option value="rejected">Отклоненные</option>
          </select>
        </div>
      </div>
      
      <div className="studios-table-wrapper">
        <table className="studios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название студии</th>
              <th>Email</th>
              <th>Адрес</th>
              <th>Статус</th>
              <th>Создана</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {studios.map((studio) => (
              <tr key={studio.id}>
                <td>{studio.id}</td>
                <td>
                  <a href={`/admin/studios/${studio.id}`}>
                    {studio.name}
                  </a>
                </td>
                <td>{studio.email}</td>
                <td>{studio.address}</td>
                <td>
                  <span className={`status-badge ${studio.status}`}>
                    {studio.status === 'verified' ? 'Подтверждена' :
                     studio.status === 'pending' ? 'В ожидании' :
                     'Отклонена'}
                  </span>
                </td>
                <td>{new Date(studio.created_at).toLocaleDateString('ru-RU')}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-button">
                      Просмотр
                    </button>
                    {studio.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(studio.id, 'verified')}
                          className="action-button approve"
                        >
                          Одобрить
                        </button>
                        <button 
                          onClick={() => handleStatusChange(studio.id, 'rejected')}
                          className="action-button reject"
                        >
                          Отклонить
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
