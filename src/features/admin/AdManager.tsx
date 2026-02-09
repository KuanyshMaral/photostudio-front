import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Eye, EyeOff, 
  Image, Link, Calendar, BarChart2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdManager.css';

interface Ad {
  id: number;
  title: string;
  image_url: string;
  target_url?: string;
  placement: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  impressions: number;
  clicks: number;
  created_at: string;
}

<<<<<<< HEAD
interface AdFormModalProps {
  ad: Ad | null;
  onClose: () => void;
  onSave: () => void;
}

const AdFormModal: React.FC<AdFormModalProps> = ({ ad, onClose, onSave }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: ad?.title || '',
    image_url: ad?.image_url || '',
    target_url: ad?.target_url || '',
    placement: ad?.placement || 'home_banner',
    is_active: ad?.is_active ?? true,
    start_date: ad?.start_date?.split('T')[0] || '',
    end_date: ad?.end_date?.split('T')[0] || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = ad 
        ? `/api/v1/admin/ads/${ad.id}` 
        : '/api/v1/admin/ads';
      const method = ad ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Failed to save ad:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal ad-form-modal" onClick={e => e.stopPropagation()}>
        <h2>{ad ? 'Редактировать рекламу' : 'Создать рекламу'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Название</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="form-field">
            <label>URL изображения</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={e => setFormData({...formData, image_url: e.target.value})}
              required
            />
          </div>

          <div className="form-field">
            <label>Ссылка перехода</label>
            <input
              type="url"
              value={formData.target_url}
              onChange={e => setFormData({...formData, target_url: e.target.value})}
            />
          </div>

          <div className="form-field">
            <label>Размещение</label>
            <select
              value={formData.placement}
              onChange={e => setFormData({...formData, placement: e.target.value})}
            >
              <option value="home_banner">Главный баннер</option>
              <option value="sidebar">Сайдбар</option>
              <option value="promo_carousel">Промо карусель</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Дата начала</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={e => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label>Дата окончания</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={e => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
          </div>

          <div className="form-field form-field--checkbox">
            <label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={e => setFormData({...formData, is_active: e.target.checked})}
              />
              Активна
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

=======
>>>>>>> e5f455b231255c8509021dc9ed0381e12b32b4fb
export const AdManager: React.FC = () => {
  const { token } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchAds();
  }, [token, filter]);

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      let url = '/api/v1/admin/ads';
      if (filter !== 'all') {
        url += `?placement=${filter}`;
      }
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAds(data.data?.ads || []);
      }
    } catch (error) {
      console.error('Failed to fetch ads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (adId: number, isActive: boolean) => {
    try {
      await fetch(`/api/v1/admin/ads/${adId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !isActive })
      });
      fetchAds();
    } catch (error) {
      console.error('Failed to toggle ad:', error);
    }
  };

  const handleDelete = async (adId: number) => {
    if (!confirm('Удалить рекламу?')) return;
    
    try {
      await fetch(`/api/v1/admin/ads/${adId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAds();
    } catch (error) {
      console.error('Failed to delete ad:', error);
    }
  };

  const getCTR = (impressions: number, clicks: number): string => {
    if (impressions === 0) return '0%';
    return ((clicks / impressions) * 100).toFixed(2) + '%';
  };

  const getPlacementLabel = (placement: string): string => {
    const labels: Record<string, string> = {
      home_banner: 'Главный баннер',
      sidebar: 'Сайдбар',
      promo_carousel: 'Промо карусель'
    };
    return labels[placement] || placement;
  };

  return (
    <div className="ad-manager">
      <div className="ad-manager__header">
        <h1>Управление рекламой</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingAd(null);
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Создать рекламу
        </button>
      </div>

      <div className="ad-manager__filters">
        {['all', 'home_banner', 'sidebar', 'promo_carousel'].map(p => (
          <button
            key={p}
            className={`filter-btn ${filter === p ? 'active' : ''}`}
            onClick={() => setFilter(p)}
          >
            {p === 'all' ? 'Все' : getPlacementLabel(p)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="ad-manager__loading">Загрузка...</div>
      ) : ads.length === 0 ? (
        <div className="ad-manager__empty">
          <Image size={48} />
          <p>Нет рекламных объявлений</p>
        </div>
      ) : (
        <div className="ad-manager__grid">
          {ads.map(ad => (
            <div key={ad.id} className={`ad-card ${!ad.is_active ? 'ad-card--inactive' : ''}`}>
              <div className="ad-card__image">
                <img src={ad.image_url} alt={ad.title} />
                {!ad.is_active && (
                  <div className="ad-card__inactive-overlay">
                    <EyeOff size={24} />
                    <span>Неактивна</span>
                  </div>
                )}
              </div>
              <div className="ad-card__content">
                <h3>{ad.title}</h3>
                <span className="ad-card__placement">
                  {getPlacementLabel(ad.placement)}
                </span>
                
                <div className="ad-card__stats">
                  <div className="ad-stat">
                    <Eye size={14} />
                    <span>{ad.impressions.toLocaleString()}</span>
                  </div>
                  <div className="ad-stat">
                    <Link size={14} />
                    <span>{ad.clicks.toLocaleString()}</span>
                  </div>
                  <div className="ad-stat">
                    <BarChart2 size={14} />
                    <span>CTR: {getCTR(ad.impressions, ad.clicks)}</span>
                  </div>
                </div>

                {(ad.start_date || ad.end_date) && (
                  <div className="ad-card__dates">
                    <Calendar size={14} />
                    <span>
                      {ad.start_date ? new Date(ad.start_date).toLocaleDateString() : '—'}
                      {' — '}
                      {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : '∞'}
                    </span>
                  </div>
                )}
              </div>
              <div className="ad-card__actions">
                <button
                  onClick={() => handleToggleActive(ad.id, ad.is_active)}
                  title={ad.is_active ? 'Деактивировать' : 'Активировать'}
                >
                  {ad.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  onClick={() => {
                    setEditingAd(ad);
                    setShowForm(true);
                  }}
                  title="Редактировать"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(ad.id)}
                  className="delete"
                  title="Удалить"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

<<<<<<< HEAD
=======
      {/* Модалка создания/редактирования */}
>>>>>>> e5f455b231255c8509021dc9ed0381e12b32b4fb
      {showForm && (
        <AdFormModal
          ad={editingAd}
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false);
            fetchAds();
          }}
        />
      )}
    </div>
  );
};

<<<<<<< HEAD
export default AdManager;
=======
// Компонент формы
interface AdFormModalProps {
  ad: Ad | null;
  onClose: () => void;
  onSave: () => void;
}

const AdFormModal: React.FC<AdFormModalProps> = ({ ad, onClose, onSave }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: ad?.title || '',
    image_url: ad?.image_url || '',
    target_url: ad?.target_url || '',
    placement: ad?.placement || 'home_banner',
    is_active: ad?.is_active ?? true,
    start_date: ad?.start_date?.split('T')[0] || '',
    end_date: ad?.end_date?.split('T')[0] || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = ad 
        ? `/api/v1/admin/ads/${ad.id}` 
        : '/api/v1/admin/ads';
      const method = ad ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Failed to save ad:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal ad-form-modal" onClick={e => e.stopPropagation()}>
        <h2>{ad ? 'Редактировать рекламу' : 'Создать рекламу'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Название</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="form-field">
            <label>URL изображения</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={e => setFormData({...formData, image_url: e.target.value})}
              required
            />
          </div>

          <div className="form-field">
            <label>Ссылка перехода</label>
            <input
              type="url"
              value={formData.target_url}
              onChange={e => setFormData({...formData, target_url: e.target.value})}
            />
          </div>

          <div className="form-field">
            <label>Размещение</label>
            <select
              value={formData.placement}
              onChange={e => setFormData({...formData, placement: e.target.value})}
            >
              <option value="home_banner">Главный баннер</option>
              <option value="sidebar">Сайдбар</option>
              <option value="promo_carousel">Промо карусель</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Дата начала</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={e => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label>Дата окончания</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={e => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
          </div>

          <div className="form-field form-field--checkbox">
            <label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={e => setFormData({...formData, is_active: e.target.checked})}
              />
              Активна
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdManager;
>>>>>>> e5f455b231255c8509021dc9ed0381e12b32b4fb
