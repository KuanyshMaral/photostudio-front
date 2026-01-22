import React, { useState, useEffect } from 'react';
import { 
  X, Building2, User, Globe, Image, Settings, 
  Save, Plus, Trash2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './CompanyProfileModal.css';

interface CompanyProfile {
  id: number;
  logo?: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  website?: string;
  city: string;
  company_type?: string;
  description?: string;
  specialization?: string;
  years_experience?: number;
  team_size?: number;
  work_hours?: string;
  services?: string[];
  socials?: Record<string, string>;
}

interface PortfolioProject {
  id: number;
  image_url: string;
  title?: string;
  category?: string;
}

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'info' | 'about' | 'portfolio' | 'services' | 'settings';

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  isOpen,
  onClose
}) => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [profileRes, portfolioRes] = await Promise.all([
        fetch('/api/v1/company/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/v1/company/portfolio', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data.data?.profile);
      }
      if (portfolioRes.ok) {
        const data = await portfolioRes.json();
        setPortfolio(data.data?.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch company data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/v1/company/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        setHasChanges(false);
        // toast.success('Профиль сохранён');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof CompanyProfile, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
    setHasChanges(true);
  };

  if (!isOpen) return null;

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'info', label: 'Информация', icon: Building2 },
    { id: 'about', label: 'О компании', icon: User },
    { id: 'portfolio', label: 'Портфолио', icon: Image },
    { id: 'services', label: 'Услуги', icon: Globe },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <div className="company-modal-overlay">
      <div className="company-modal">
        <div className="company-modal__header">
          <h2>Профиль компании</h2>
          <div className="company-modal__actions">
            {hasChanges && (
              <button 
                className="company-modal__save"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save size={18} />
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </button>
            )}
            <button className="company-modal__close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="company-modal__tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`company-modal__tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="company-modal__content">
          {isLoading ? (
            <div className="company-modal__loading">Загрузка...</div>
          ) : (
            <>
              {activeTab === 'info' && profile && (
                <div className="company-modal__section">
                  <div className="company-modal__logo">
                    {profile.logo ? (
                      <img src={profile.logo} alt="Logo" />
                    ) : (
                      <div className="company-modal__logo-placeholder">
                        <Building2 size={40} />
                      </div>
                    )}
                    <button className="company-modal__logo-upload">
                      Загрузить лого
                    </button>
                  </div>

                  <div className="company-modal__form">
                    <div className="company-modal__field">
                      <label>Название компании</label>
                      <input
                        type="text"
                        value={profile.company_name || ''}
                        onChange={e => updateField('company_name', e.target.value)}
                      />
                    </div>
                    <div className="company-modal__row">
                      <div className="company-modal__field">
                        <label>Контактное лицо</label>
                        <input
                          type="text"
                          value={profile.contact_person || ''}
                          onChange={e => updateField('contact_person', e.target.value)}
                        />
                      </div>
                      <div className="company-modal__field">
                        <label>Город</label>
                        <input
                          type="text"
                          value={profile.city || ''}
                          onChange={e => updateField('city', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="company-modal__row">
                      <div className="company-modal__field">
                        <label>Email</label>
                        <input
                          type="email"
                          value={profile.email || ''}
                          onChange={e => updateField('email', e.target.value)}
                        />
                      </div>
                      <div className="company-modal__field">
                        <label>Телефон</label>
                        <input
                          type="tel"
                          value={profile.phone || ''}
                          onChange={e => updateField('phone', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="company-modal__field">
                      <label>Сайт</label>
                      <input
                        type="url"
                        value={profile.website || ''}
                        onChange={e => updateField('website', e.target.value)}
                        placeholder="https://"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'about' && profile && (
                <div className="company-modal__section">
                  <div className="company-modal__field">
                    <label>Описание компании</label>
                    <textarea
                      value={profile.description || ''}
                      onChange={e => updateField('description', e.target.value)}
                      rows={5}
                      placeholder="Расскажите о вашей компании..."
                    />
                  </div>
                  <div className="company-modal__row">
                    <div className="company-modal__field">
                      <label>Специализация</label>
                      <input
                        type="text"
                        value={profile.specialization || ''}
                        onChange={e => updateField('specialization', e.target.value)}
                      />
                    </div>
                    <div className="company-modal__field">
                      <label>Тип компании</label>
                      <select
                        value={profile.company_type || ''}
                        onChange={e => updateField('company_type', e.target.value)}
                      >
                        <option value="">Выберите...</option>
                        <option value="ИП">ИП</option>
                        <option value="ТОО">ТОО</option>
                        <option value="АО">АО</option>
                      </select>
                    </div>
                  </div>
                  <div className="company-modal__row">
                    <div className="company-modal__field">
                      <label>Опыт (лет)</label>
                      <input
                        type="number"
                        value={profile.years_experience || ''}
                        onChange={e => updateField('years_experience', parseInt(e.target.value))}
                        min={0}
                      />
                    </div>
                    <div className="company-modal__field">
                      <label>Размер команды</label>
                      <input
                        type="number"
                        value={profile.team_size || ''}
                        onChange={e => updateField('team_size', parseInt(e.target.value))}
                        min={1}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="company-modal__section">
                  <div className="company-modal__portfolio-grid">
                    {portfolio.map(project => (
                      <div key={project.id} className="company-modal__portfolio-item">
                        <img src={project.image_url} alt={project.title || 'Project'} />
                        <div className="company-modal__portfolio-overlay">
                          <span>{project.title || 'Без названия'}</span>
                          <button className="company-modal__portfolio-delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="company-modal__portfolio-add">
                      <Plus size={24} />
                      <span>Добавить</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'services' && profile && (
                <div className="company-modal__section">
                  <div className="company-modal__services">
                    {(profile.services || []).map((service, index) => (
                      <div key={index} className="company-modal__service-item">
                        <input
                          type="text"
                          value={service}
                          onChange={e => {
                            const newServices = [...(profile.services || [])];
                            newServices[index] = e.target.value;
                            updateField('services', newServices);
                          }}
                        />
                        <button
                          onClick={() => {
                            const newServices = (profile.services || []).filter((_, i) => i !== index);
                            updateField('services', newServices);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      className="company-modal__add-service"
                      onClick={() => {
                        const newServices = [...(profile.services || []), ''];
                        updateField('services', newServices);
                      }}
                    >
                      <Plus size={18} />
                      Добавить услугу
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && profile && (
                <div className="company-modal__section">
                  <div className="company-modal__field">
                    <label>Часы работы</label>
                    <input
                      type="text"
                      value={profile.work_hours || ''}
                      onChange={e => updateField('work_hours', e.target.value)}
                      placeholder="Пн-Пт: 09:00-18:00"
                    />
                  </div>
                  <h4>Социальные сети</h4>
                  <div className="company-modal__socials">
                    {['instagram', 'telegram', 'whatsapp'].map(social => (
                      <div key={social} className="company-modal__field">
                        <label>{social.charAt(0).toUpperCase() + social.slice(1)}</label>
                        <input
                          type="text"
                          value={profile.socials?.[social] || ''}
                          onChange={e => {
                            const newSocials = { ...(profile.socials || {}), [social]: e.target.value };
                            updateField('socials', newSocials);
                          }}
                          placeholder={`@username`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileModal;
