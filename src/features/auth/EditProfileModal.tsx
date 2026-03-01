import React, { useState } from 'react';
import { X, Camera, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from './auth.api';
import toast from 'react-hot-toast';
import type { Profile } from './auth.types';
import './EditProfileModal.css';

interface EditProfileModalProps {
  profile: Profile;
  onClose: () => void;
  onSave: (updatedProfile: Profile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  onClose,
  onSave,
}) => {
  const { token } = useAuth();
  const displayName = profile.name || profile.full_name || profile.contact_person || '';
  const [formData, setFormData] = useState({
    name: displayName,
    email: profile.email,
    phone: profile.phone || '',
    company_name: profile.company_name || profile.companyName || '',
    bin: profile.bin || '',
    legal_address: profile.legal_address || profile.address || '',
    contact_person: profile.contact_person || profile.contactPerson || '',
    contact_position: profile.contact_position || '',
    website: profile.website || '',
    full_name: profile.full_name || profile.name || '',
    position: profile.position || '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!token) {
        toast.error('Токен авторизации отсутствует');
        return;
      }

      const updatedProfile = await updateProfile(token, {
        name: formData.name,
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email,
        company_name: formData.company_name,
        bin: formData.bin,
        legal_address: formData.legal_address,
        contact_person: formData.contact_person,
        contact_position: formData.contact_position,
        website: formData.website,
        position: formData.position,
      });

      toast.success('Профиль успешно обновлен!');
      onSave(updatedProfile);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const message = error.response?.data?.error?.message || error.message || 'Ошибка обновления профиля';
      toast.error(message);
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

            {profile.role === 'admin' && (
              <>
                <div className="form-group">
                  <label htmlFor="full_name">ФИО</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="position">Должность</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

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

            {profile.role === 'studio_owner' && (
              <>
                <div className="form-group">
                  <label htmlFor="company_name">Компания</label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bin">БИН</label>
                  <input
                    type="text"
                    id="bin"
                    name="bin"
                    value={formData.bin}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact_person">Контактное лицо</label>
                  <input
                    type="text"
                    id="contact_person"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact_position">Должность контактного лица</label>
                  <input
                    type="text"
                    id="contact_position"
                    name="contact_position"
                    value={formData.contact_position}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="legal_address">Юридический адрес</label>
                  <input
                    type="text"
                    id="legal_address"
                    name="legal_address"
                    value={formData.legal_address}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="website">Сайт</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
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
