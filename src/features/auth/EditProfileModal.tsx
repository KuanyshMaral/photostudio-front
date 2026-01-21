import React, { useState } from 'react';
import { X, Camera, User } from 'lucide-react';
import './EditProfileModal.css';

interface UserProfile {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: string;
  avatar_url?: string;
  created_at: string;
}

interface EditProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone || '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement API call to update profile
      console.log('Updating profile:', formData);
      onSave();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="edit-profile-modal-overlay">
      <div className="edit-profile-modal">
        <div className="edit-profile-modal__header">
          <h2>Редактировать профиль</h2>
          <button 
            className="edit-profile-modal__close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-modal__form">
          {/* Avatar */}
          <div className="edit-profile-modal__avatar-section">
            <div className="edit-profile-modal__avatar">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} />
              ) : (
                <div className="edit-profile-modal__avatar-placeholder">
                  <User size={40} />
                </div>
              )}
            </div>
            <button 
              type="button"
              className="edit-profile-modal__avatar-btn"
            >
              <Camera size={16} />
              Изменить фото
            </button>
          </div>

          {/* Form fields */}
          <div className="edit-profile-modal__fields">
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Телефон</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="edit-profile-modal__actions">
            <button 
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button 
              type="submit"
              className="btn btn--primary"
              disabled={isLoading}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
