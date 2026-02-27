import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCompanyProfile, updateCompanyProfile, type CompanyProfile, type CompanyProfileResponse } from './owner.api';
import { Building, User, Phone, Mail, Globe, Clock, Edit } from 'lucide-react';
import './OwnerDashboard.css';

export default function CompanyProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<Partial<CompanyProfile>>({});

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setError(null);
        console.log('Loading company profile...');
        const response = await getCompanyProfile(token);
        console.log('Profile API response:', response);
        // API returns {data: {profile: {...}}, success: true}
        setProfile(response.data.profile);
        setProfileForm(response.data.profile);
      } catch (error) {
        console.error('Failed to load profile:', error);
        setError('Не удалось загрузить профиль компании');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [token]);

  // Profile handlers
  const handleUpdateProfile = async () => {
    if (!token) return;
    try {
      const updated = await updateCompanyProfile(token, profileForm);
      setProfile(updated.data.profile);
      setEditingProfile(false);
      alert('Профиль успешно обновлен');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Не удалось обновить профиль');
    }
  };

  if (loading) {
    return <div className="tab-content">Загрузка профиля...</div>;
  }

  if (error) {
    return <div className="tab-content">
      <h2>Профиль компании</h2>
      <div style={{ color: 'red', padding: '20px' }}>{error}</div>
    </div>;
  }

  if (!profile) {
    return <div className="tab-content">Профиль не найден</div>;
  }

  return (
    <div className="tab-content">
      <div className="content-header">
        <h2>Профиль компании</h2>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setEditingProfile(true)}>
            <Edit size={16} /> Редактировать
          </button>
        </div>
      </div>

      {editingProfile ? (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Редактировать профиль компании</h3>
              <button onClick={() => setEditingProfile(false)} className="close-button">×</button>
            </div>
            <div className="modal-body">
              <div className="profile-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Название компании</label>
                    <input
                      type="text"
                      value={profileForm.company_name || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Тип компании</label>
                    <input
                      type="text"
                      value={profileForm.company_type || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, company_type: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Специализация</label>
                    <input
                      type="text"
                      value={profileForm.specialization || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Контактное лицо</label>
                    <input
                      type="text"
                      value={profileForm.contact_person || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, contact_person: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Телефон</label>
                    <input
                      type="text"
                      value={profileForm.phone || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={profileForm.email || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Вебсайт</label>
                    <input
                      type="text"
                      value={profileForm.website || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Город</label>
                    <input
                      type="text"
                      value={profileForm.city || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Часы работы</label>
                    <input
                      type="text"
                      value={profileForm.work_hours || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, work_hours: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Опыт (лет)</label>
                    <input
                      type="number"
                      value={profileForm.years_experience || 0}
                      onChange={(e) => setProfileForm({ ...profileForm, years_experience: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Размер команды</label>
                    <input
                      type="number"
                      value={profileForm.team_size || 0}
                      onChange={(e) => setProfileForm({ ...profileForm, team_size: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Описание</label>
                    <textarea
                      value={profileForm.description || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setEditingProfile(false)}>
                Отмена
              </button>
              <button className="btn-primary" onClick={handleUpdateProfile}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-view">
          <div className="info-grid">
            <div className="info-item">
              <label>Название компании</label>
              <span>{profile.company_name}</span>
            </div>
            <div className="info-item">
              <label>Тип компании</label>
              <span>{profile.company_type}</span>
            </div>
            <div className="info-item">
              <label>Специализация</label>
              <span>{profile.specialization}</span>
            </div>
            <div className="info-item">
              <label>Контактное лицо</label>
              <span>{profile.contact_person}</span>
            </div>
            <div className="info-item">
              <label>Телефон</label>
              <span><Phone size={14} /> {profile.phone}</span>
            </div>
            <div className="info-item">
              <label>Email</label>
              <span><Mail size={14} /> {profile.email}</span>
            </div>
            {profile.website && (
              <div className="info-item">
                <label>Вебсайт</label>
                <span><Globe size={14} /> {profile.website}</span>
              </div>
            )}
            <div className="info-item">
              <label>Город</label>
              <span>{profile.city}</span>
            </div>
            <div className="info-item">
              <label>Часы работы</label>
              <span><Clock size={14} /> {profile.work_hours}</span>
            </div>
            <div className="info-item">
              <label>Опыт</label>
              <span>{profile.years_experience} лет</span>
            </div>
            <div className="info-item">
              <label>Размер команды</label>
              <span>{profile.team_size} человек</span>
            </div>
            <div className="info-item full-width">
              <label>Описание</label>
              <span>{profile.description}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
