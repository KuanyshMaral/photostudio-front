import React, { useState, useEffect } from 'react';
import { 
  Save, Percent, Bell, Shield, 
  Globe, Clock, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './AdminSettings.css';

interface PlatformSettings {
  platform_name: string;
  commission_rate: number;
  max_booking_days_ahead: number;
  auto_approve_studios: boolean;
  require_email_verification: boolean;
  maintenance_mode: boolean;
  support_email: string;
  cancellation_window_hours: number;
  max_images_per_studio: number;
  enable_reviews: boolean;
  enable_chat: boolean;
  enable_notifications: boolean;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  platform_name: 'StudioBooking',
  commission_rate: 10,
  max_booking_days_ahead: 90,
  auto_approve_studios: false,
  require_email_verification: true,
  maintenance_mode: false,
  support_email: 'support@studiobooking.kz',
  cancellation_window_hours: 24,
  max_images_per_studio: 10,
  enable_reviews: true,
  enable_chat: true,
  enable_notifications: true,
};

export const AdminSettings: React.FC = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/admin/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.data?.settings) {
          setSettings({ ...DEFAULT_SETTINGS, ...data.data.settings });
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/v1/admin/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        toast.success('Настройки сохранены');
        setHasChanges(false);
      } else {
        toast.error('Ошибка при сохранении настроек');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Ошибка при сохранении настроек');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = <K extends keyof PlatformSettings>(
    key: K, 
    value: PlatformSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  if (isLoading) {
    return <div className="admin-settings admin-settings--loading">Загрузка...</div>;
  }

  return (
    <div className="admin-settings">
      <div className="admin-settings__header">
        <div>
          <h1>Настройки платформы</h1>
          <p>Управление параметрами платформы StudioBooking</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
        >
          <Save size={18} />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      {hasChanges && (
        <div className="admin-settings__unsaved">
          <AlertCircle size={16} />
          <span>Есть несохранённые изменения</span>
        </div>
      )}

      {/* General Settings */}
      <section className="settings-section">
        <div className="settings-section__header">
          <Globe size={20} />
          <h2>Общие настройки</h2>
        </div>
        <div className="settings-section__body">
          <div className="setting-item">
            <div className="setting-item__info">
              <label>Название платформы</label>
              <span className="setting-item__description">Отображается в заголовке и письмах</span>
            </div>
            <input
              type="text"
              value={settings.platform_name}
              onChange={e => updateSetting('platform_name', e.target.value)}
              className="setting-input"
            />
          </div>
          <div className="setting-item">
            <div className="setting-item__info">
              <label>Email поддержки</label>
              <span className="setting-item__description">Контактный email для обращений</span>
            </div>
            <input
              type="email"
              value={settings.support_email}
              onChange={e => updateSetting('support_email', e.target.value)}
              className="setting-input"
            />
          </div>
          <div className="setting-item">
            <div className="setting-item__info">
              <label>Режим обслуживания</label>
              <span className="setting-item__description">Временно ограничить доступ к платформе</span>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={e => updateSetting('maintenance_mode', e.target.checked)}
              />
              <span className="toggle__slider"></span>
            </label>
          </div>
        </div>
      </section>

      {/* Financial Settings */}
      <section className="settings-section">
        <div className="settings-section__header">
          <Percent size={20} />
          <h2>Финансовые настройки</h2>
        </div>
        <div className="settings-section__body">
          <div className="setting-item">
            <div className="setting-item__info">
              <label>Комиссия платформы (%)</label>
              <span className="setting-item__description">Процент от каждого бронирования</span>
            </div>
            <input
              type="number"
              min="0"
              max="50"
              step="0.5"
              value={settings.commission_rate}
              onChange={e => updateSetting('commission_rate', parseFloat(e.target.value) || 0)}
              className="setting-input setting-input--small"
            />
          </div>
        </div>
      </section>

      {/* Booking Settings */}
      <section className="settings-section">
        <div className="settings-section__header">
          <Clock size={20} />
          <h2>Настройки бронирования</h2>
        </div>
        <div className="settings-section__body">
          <div className="setting-item">
            <div className="setting-item__info">
              <label>Макс. дней вперёд для бронирования</label>
              <span className="setting-item__description">На сколько дней вперёд можно бронировать</span>
            </div>
            <input
              type="number"
              min="1"
              max="365"
              value={settings.max_booking_days_ahead}
              onChange={e => updateSetting('max_booking_days_ahead', parseInt(e.target.value) || 30)}
              className="setting-input setting-input--small"
            />
          </div>
          <div className="setting-item">
            <div className="setting-item__info">
              <label>Окно отмены (часов)</label>
              <span className="setting-item__description">За сколько часов до начала можно отменить бронь</span>
            </div>
            <input
              type="number"
              min="0"
              max="168"
              value={settings.cancellation_window_hours}
              onChange={e => updateSetting('cancellation_window_hours', parseInt(e.target.value) || 0)}
              className="setting-input setting-input--small"
            />
          </div>
        </div>
      </section>

      {/* Studio Settings */}
      <section className="settings-section">
        <div className="settings-section__header">
          <Shield size={20} />
          <h2>Настройки студий</h2>
        </div>
        <div className="settings-section__body">
          <div className="setting-item">
            <div className="setting-item__info">
              <label>Автоматическое одобрение студий</label>
              <span className="setting-item__description">Новые студии будут одобрены без ручной проверки</span>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.auto_approve_studios}
                onChange={e => updateSetting('auto_approve_studios', e.target.checked)}
              />
              <span className="toggle__slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-item__info">
              <label>Макс. фото на студию</label>
              <span className="setting-item__description">Ограничение количества изображений</span>
            </div>
            <input
              type="number"
              min="1"
              max="50"
              value={settings.max_images_per_studio}
              onChange={e => updateSetting('max_images_per_studio', parseInt(e.target.value) || 5)}
              className="setting-input setting-input--small"
            />
          </div>
          <div className="setting-item">
            <div className="setting-item__info">
              <label>Верификация email</label>
              <span className="setting-item__description">Требовать подтверждение email при регистрации</span>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.require_email_verification}
                onChange={e => updateSetting('require_email_verification', e.target.checked)}
              />
              <span className="toggle__slider"></span>
            </label>
          </div>
        </div>
      </section>

      {/* Feature Toggles */}
      <section className="settings-section">
        <div className="settings-section__header">
          <Bell size={20} />
          <h2>Функционал</h2>
        </div>
        <div className="settings-section__body">
          <div className="setting-item">
            <div className="setting-item__info">
              <label>Отзывы</label>
              <span className="setting-item__description">Разрешить пользователям оставлять отзывы</span>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.enable_reviews}
                onChange={e => updateSetting('enable_reviews', e.target.checked)}
              />
              <span className="toggle__slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-item__info">
              <label>Чат</label>
              <span className="setting-item__description">Включить систему сообщений между пользователями</span>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.enable_chat}
                onChange={e => updateSetting('enable_chat', e.target.checked)}
              />
              <span className="toggle__slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-item__info">
              <label>Уведомления</label>
              <span className="setting-item__description">Отправлять email-уведомления пользователям</span>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.enable_notifications}
                onChange={e => updateSetting('enable_notifications', e.target.checked)}
              />
              <span className="toggle__slider"></span>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminSettings;
