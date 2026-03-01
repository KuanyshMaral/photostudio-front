import React, { useState, useEffect } from 'react';
import { getOwnerProfile, updateOwnerProfile, type OwnerProfile as OwnerProfileType, type OwnerProfileUpdateRequest } from '../../api/ownerProfileApi';
import './OwnerProfile.css';

interface OwnerProfileProps {
  token: string;
}

export const OwnerProfile: React.FC<OwnerProfileProps> = ({ token }) => {
  const [profile, setProfile] = useState<OwnerProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<OwnerProfileUpdateRequest>({
    company_name: '',
    contact_person: '',
    contact_position: '',
    email: '',
    legal_address: '',
    phone: '',
    website: '',
    bin: ''
  });

  useEffect(() => {
    loadProfile();
  }, [token]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getOwnerProfile(token);
      
      // Extract values from API response format if needed
      const extractedData = {
        ...profileData,
        company_name: (profileData.company_name as any)?.String || profileData.company_name || '',
        contact_person: (profileData.contact_person as any)?.String || profileData.contact_person || '',
        contact_position: (profileData.contact_position as any)?.String || profileData.contact_position || '',
        email: (profileData.email as any)?.String || profileData.email || '',
        legal_address: (profileData.legal_address as any)?.String || profileData.legal_address || '',
        phone: (profileData.phone as any)?.String || profileData.phone || '',
        website: (profileData.website as any)?.String || profileData.website || '',
        bin: (profileData.bin as any)?.String || profileData.bin || ''
      };
      
      setProfile(extractedData);
      setFormData({
        company_name: extractedData.company_name || '',
        contact_person: extractedData.contact_person || '',
        contact_position: extractedData.contact_position || '',
        email: extractedData.email || '',
        legal_address: extractedData.legal_address || '',
        phone: extractedData.phone || '',
        website: extractedData.website || '',
        bin: extractedData.bin || ''
      });
    } catch (error) {
      console.error('Failed to load owner profile:', error);
      setError('Не удалось загрузить профиль');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setEditing(false);
    if (profile) {
      setFormData({
        company_name: (profile.company_name as any)?.String || profile.company_name || '',
        contact_person: (profile.contact_person as any)?.String || profile.contact_person || '',
        contact_position: (profile.contact_position as any)?.String || profile.contact_position || '',
        email: (profile.email as any)?.String || profile.email || '',
        legal_address: (profile.legal_address as any)?.String || profile.legal_address || '',
        phone: (profile.phone as any)?.String || profile.phone || '',
        website: (profile.website as any)?.String || profile.website || '',
        bin: (profile.bin as any)?.String || profile.bin || ''
      });
    }
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updatedProfile = await updateOwnerProfile(token, formData);
      setProfile(updatedProfile);
      setEditing(false);
      setError('');
      alert('Профиль успешно обновлен');
    } catch (error) {
      console.error('Failed to update owner profile:', error);
      setError('Не удалось обновить профиль');
    }
  };

  if (loading) {
    return <div className="owner-profile loading">Загрузка профиля...</div>;
  }

  return (
    <div className="owner-profile">
      <div className="profile-header">
        <h2>Профиль владельца студии</h2>
        {!editing && (
          <button className="edit-btn" onClick={handleEdit}>
            Редактировать
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-content">
        <div className="profile-info">
          {editing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="company_name">Название компании:</label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact_person">Контактное лицо:</label>
                <input
                  type="text"
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact_position">Должность:</label>
                <input
                  type="text"
                  id="contact_position"
                  name="contact_position"
                  value={formData.contact_position}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Телефон:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="legal_address">Юридический адрес:</label>
                <textarea
                  id="legal_address"
                  name="legal_address"
                  value={formData.legal_address}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Веб-сайт:</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bin">БИН:</label>
                <input
                  type="text"
                  id="bin"
                  name="bin"
                  value={formData.bin}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Сохранить
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="detail-item">
                <span className="label">Название компании:</span>
                <span className="value">
                  {profile?.company_name ? 
                    (typeof profile.company_name === 'object' ? (profile.company_name as any).String : profile.company_name) 
                    : 'Не указано'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Контактное лицо:</span>
                <span className="value">
                  {profile?.contact_person ? 
                    (typeof profile.contact_person === 'object' ? (profile.contact_person as any).String : profile.contact_person) 
                    : 'Не указано'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Должность:</span>
                <span className="value">
                  {profile?.contact_position ? 
                    (typeof profile.contact_position === 'object' ? (profile.contact_position as any).String : profile.contact_position) 
                    : 'Не указано'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">
                  {profile?.email ? 
                    (typeof profile.email === 'object' ? (profile.email as any).String : profile.email) 
                    : 'Не указано'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Телефон:</span>
                <span className="value">
                  {profile?.phone ? 
                    (typeof profile.phone === 'object' ? (profile.phone as any).String : profile.phone) 
                    : 'Не указано'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Юридический адрес:</span>
                <span className="value">
                  {profile?.legal_address ? 
                    (typeof profile.legal_address === 'object' ? (profile.legal_address as any).String : profile.legal_address) 
                    : 'Не указано'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Веб-сайт:</span>
                <span className="value">
                  {profile?.website ? 
                    (typeof profile.website === 'object' ? (profile.website as any).String : profile.website) 
                    : 'Не указано'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">БИН:</span>
                <span className="value">
                  {profile?.bin ? 
                    (typeof profile.bin === 'object' ? (profile.bin as any).String : profile.bin) 
                    : 'Не указано'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Статус верификации:</span>
                <span className={`value verification-status ${profile?.verification_status}`}>
                  {profile?.verification_status || 'Не указано'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">ID пользователя:</span>
                <span className="value">{profile?.user_id}</span>
              </div>
              <div className="detail-item">
                <span className="label">Дата регистрации:</span>
                <span className="value">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('ru-RU') : 'Не указано'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
