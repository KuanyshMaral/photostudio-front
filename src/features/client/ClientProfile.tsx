import React, { useState, useEffect } from 'react';
import { getClientProfile, updateClientProfile, type ClientProfile, type ClientProfileUpdateRequest } from '../../api/clientApi';
import { uploadFile } from '../../api/uploadApi';
import ImageUpload from '../../components/ImageUpload';
import './ClientProfile.css';

interface ClientProfileProps {
  token: string;
}

const ClientProfile: React.FC<ClientProfileProps> = ({ token }) => {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState<string>('');
  const [formData, setFormData] = useState<ClientProfileUpdateRequest>({
    name: '',
    nickname: '',
    phone: '',
    avatar_url: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, [token]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getClientProfile(token);
      
      // Extract values from API response format
      const extractedData = {
        ...profileData,
        name: (profileData.name as any)?.String || '',
        nickname: (profileData.nickname as any)?.String || '',
        phone: (profileData.phone as any)?.String || '',
        avatar_url: (profileData.avatar_url as any)?.String || ''
      };
      
      setProfile(extractedData);
      setFormData({
        name: (profileData.name as any)?.String || '',
        nickname: (profileData.nickname as any)?.String || '',
        phone: (profileData.phone as any)?.String || '',
        avatar_url: (profileData.avatar_url as any)?.String || ''
      });
      setAvatar((profileData.avatar_url as any)?.String || '');
    } catch (error) {
      console.error('Failed to load client profile:', error);
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
        name: (profile.name as any)?.String || '',
        nickname: (profile.nickname as any)?.String || '',
        phone: (profile.phone as any)?.String || '',
        avatar_url: (profile.avatar_url as any)?.String || ''
      });
      setAvatar((profile.avatar_url as any)?.String || '');
    }
    setError('');
  };

  const handleAvatarChange = async (newAvatar: string) => {
    setAvatar(newAvatar);
    
    if (newAvatar && typeof newAvatar === 'string' && newAvatar.startsWith('data:image/')) {
      try {
        // Upload avatar to server
        const base64Data = newAvatar.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        const mimeType = newAvatar.split(';')[0].split(':')[1];
        const file = new File([byteArray], 'avatar.jpg', { type: mimeType });
        
        const uploadResult = await uploadFile(file, token);
        setFormData(prev => ({ ...prev, avatar_url: uploadResult.url }));
      } catch (error) {
        console.error('Failed to upload avatar:', error);
        setError('Не удалось загрузить аватар');
      }
    } else {
      setFormData(prev => ({ ...prev, avatar_url: newAvatar || '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updatedProfile = await updateClientProfile(token, formData);
      setProfile(updatedProfile);
      setEditing(false);
      setError('');
      alert('Профиль успешно обновлен');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Не удалось обновить профиль');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="client-profile">
        <div className="loading">Загрузка профиля...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="client-profile">
        <div className="error">{error || 'Профиль не найден'}</div>
      </div>
    );
  }

  return (
    <div className="client-profile">
      <div className="profile-header">
        <h2>Профиль клиента</h2>
        {!editing && (
          <button className="edit-btn" onClick={handleEdit}>
            Редактировать
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-content">
        <div className="avatar-section">
          <div className="avatar-container">
            {avatar && typeof avatar === 'string' ? (
              <img 
                src={avatar.startsWith('data:') ? avatar : `http://89.35.125.136:8090${avatar}`}
                alt="Avatar" 
                className="avatar"
              />
            ) : (
              <div className="avatar-placeholder">
                <span>Нет аватара</span>
              </div>
            )}
          </div>
          {editing && (
            <ImageUpload
              images={avatar && typeof avatar === 'string' ? [avatar] : []}
              onImagesChange={(images) => handleAvatarChange(images[0] || '')}
              maxImages={1}
            />
          )}
        </div>

        <div className="profile-info">
          {editing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Имя:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nickname">Никнейм:</label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
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
                <span className="label">Имя:</span>
                <span className="value">
                  {profile && profile.name ? 
                    (typeof profile.name === 'object' ? (profile.name as any).String : profile.name) 
                    : 'Не указано'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Никнейм:</span>
                <span className="value">
                  {profile && profile.nickname ? 
                    (typeof profile.nickname === 'object' ? (profile.nickname as any).String : profile.nickname) 
                    : 'Не указано'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Телефон:</span>
                <span className="value">
                  {profile && profile.phone ? 
                    (typeof profile.phone === 'object' ? (profile.phone as any).String : profile.phone) 
                    : 'Не указано'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">ID пользователя:</span>
                <span className="value">{profile?.user_id || 'Не указано'}</span>
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

export default ClientProfile;
