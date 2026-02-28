import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, X, ToggleLeft, ToggleRight, Users, Building } from 'lucide-react';
import {
  getOwnerProfiles,
  updateOwnerVerification,
  updateOwnerStudioStatus,
  type OwnerProfile
} from './admin.api';
import '../owner/OwnerDashboard.css';

export default function OwnerVerification() {
  const { token } = useAuth();
  const [owners, setOwners] = useState<OwnerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load owner profiles
  useEffect(() => {
    const loadOwners = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setError(null);
        // Use admin API function
        const data = await getOwnerProfiles(token);
        console.log('Owner profiles API response:', data);
        
        // Handle different API response formats
        let ownersData: OwnerProfile[] = [];
        
        if (data.data && Array.isArray(data.data)) {
          ownersData = data.data;
        } else if (Array.isArray(data)) {
          ownersData = data;
        } else {
          console.warn('Unexpected API response format:', data);
          ownersData = [];
        }
        
        console.log('Processed owners data:', ownersData);
        setOwners(ownersData);
      } catch (error) {
        console.error('Failed to load owner profiles:', error);
        setError('Не удалось загрузить профили владельцев');
        setOwners([]);
      } finally {
        setLoading(false);
      }
    };
    loadOwners();
  }, [token]);

  const handleVerificationUpdate = async (studioId: number, newStatus: 'pending' | 'verified' | 'rejected') => {
    if (!token) return;
    
    try {
      // Use admin API function with studio_id
      await updateOwnerVerification(token, studioId, newStatus);
      setOwners(owners.map(owner => 
        owner.studio_id === studioId 
          ? { ...owner, verification_status: newStatus }
          : owner
      ));
      alert(`Статус верификации обновлен на "${newStatus}"`);
    } catch (error) {
      console.error('Failed to update verification status:', error);
      alert('Не удалось обновить статус верификации');
    }
  };

  const handleStudioStatusUpdate = async (studioId: number, newStatus: 'active' | 'inactive') => {
    if (!token) return;
    
    try {
      // Use admin API function with studio_id
      await updateOwnerStudioStatus(token, studioId, newStatus);
      setOwners(owners.map(owner => 
        owner.studio_id === studioId 
          ? { ...owner, studio_status: newStatus }
          : owner
      ));
      alert(`Статус студии обновлен на "${newStatus}"`);
    } catch (error) {
      console.error('Failed to update studio status:', error);
      alert('Не удалось обновить статус студии');
    }
  };

  const getVerificationBadgeColor = (status: string) => {
    switch (status) {
      case 'verified': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getVerificationBadgeText = (status: string) => {
    switch (status) {
      case 'verified': return 'Верифицирован';
      case 'rejected': return 'Отклонен';
      case 'pending': return 'Ожидает';
      default: return 'Неизвестно';
    }
  };

  const getStudioStatusIcon = (status: string) => {
    return status === 'active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />;
  };

  if (loading) {
    return <div className="tab-content">Загрузка профилей владельцев...</div>;
  }

  if (error) {
    return <div className="tab-content">
      <h2>Верификация владельцев</h2>
      <div style={{ color: 'red', padding: '20px' }}>{error}</div>
    </div>;
  }

  return (
    <div className="tab-content">
      <div className="content-header">
        <h2>Верификация владельцев</h2>
        <div className="header-info">
          <Users size={16} />
          <span>Всего владельцев: {owners.length}</span>
        </div>
      </div>

      <div className="studios-grid">
        {owners.length > 0 ? (
          owners.map((owner) => (
            <div key={owner.studio_id} className="studio-card owner-card">
              <div className="studio-header">
                <h3>{owner.company_name || `Студия #${owner.studio_id}`}</h3>
                <div className="owner-actions">
                  <button 
                    className="btn-small btn-secondary"
                    onClick={() => handleStudioStatusUpdate(
                      owner.studio_id, 
                      owner.studio_status === 'active' ? 'inactive' : 'active'
                    )}
                    title={owner.studio_status === 'active' ? 'Деактивировать студию' : 'Активировать студию'}
                  >
                    {getStudioStatusIcon(owner.studio_status || 'inactive')}
                  </button>
                </div>
              </div>
              
              <div className="studio-info">
                <div className="info-item">
                  <span>👤</span>
                  <span>ID: {owner.studio_id}</span>
                </div>
                {owner.contact_person && (
                  <div className="info-item">
                    <span>👔</span>
                    <span>{owner.contact_person}</span>
                  </div>
                )}
                {owner.phone && (
                  <div className="info-item">
                    <span>📞</span>
                    <span>{owner.phone}</span>
                  </div>
                )}
                {owner.email && (
                  <div className="info-item">
                    <span>📧</span>
                    <span>{owner.email}</span>
                  </div>
                )}
              </div>
              
              <div className="verification-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getVerificationBadgeColor(owner.verification_status) }}
                >
                  {getVerificationBadgeText(owner.verification_status)}
                </span>
              </div>
              
              <div className="verification-actions">
                {owner.verification_status !== 'verified' && (
                  <button 
                    className="btn-small btn-primary"
                    onClick={() => handleVerificationUpdate(owner.studio_id, 'verified')}
                  >
                    <Check size={14} /> Верифицировать
                  </button>
                )}
                {owner.verification_status !== 'rejected' && (
                  <button 
                    className="btn-small btn-danger"
                    onClick={() => handleVerificationUpdate(owner.studio_id, 'rejected')}
                  >
                    <X size={14} /> Отклонить
                  </button>
                )}
                {owner.verification_status !== 'pending' && (
                  <button 
                    className="btn-small btn-secondary"
                    onClick={() => handleVerificationUpdate(owner.studio_id, 'pending')}
                  >
                    <Users size={14} /> На рассмотрение
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h3>Нет владельцев для верификации</h3>
            <p>В системе пока нет зарегистрированных владельцев студий</p>
          </div>
        )}
      </div>
    </div>
  );
}
