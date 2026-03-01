import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getMyStudios,
  createStudio,
  updateStudio,
  deleteStudio,
  type Studio,
  type StudioCreateRequest,
  type StudioUpdateRequest
} from './owner.api';
import { Plus, Edit, Trash2, MapPin, Phone, Mail, Clock, Star, Home } from 'lucide-react';
import StudioRoomsManagement from './StudioRoomsManagement';
import AttachmentsManager from '../../components/AttachmentsManager';
import { normalizeImageUrl } from '../../api/uploadApi';
import './OwnerDashboard.css';

export default function StudioManagement() {
  const { token } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStudio, setEditingStudio] = useState<Studio | null>(null);
  const [selectedStudioForRooms, setSelectedStudioForRooms] = useState<Studio | null>(null);
  const [form, setForm] = useState<StudioCreateRequest>({
    name: '',
    description: '',
    address: '',
    city: '',
    district: '',
    phone: '',
    email: '',
    website: '',
    working_hours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '09:00', close: '18:00' }
    }
  });

  // Load studios
  useEffect(() => {
    const loadStudios = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getMyStudios(token);
        console.log('Studios API response:', data);
        
        // Handle different API response formats
        const response = data as any;
        let studiosData: Studio[] = [];
        
        if (response.data && response.data.studios) {
          // API returns {data: {studios: [...]}}
          studiosData = response.data.studios;
        } else if (response.data && response.data.items) {
          // API returns {data: {items: [...]}}
          studiosData = response.data.items;
        } else if (response.items) {
          // API returns {items: [...]}
          studiosData = response.items;
        } else if (Array.isArray(response)) {
          // API returns [...] directly
          studiosData = response;
        } else if (Array.isArray(data)) {
          // API returns [...] directly
          studiosData = data;
        } else {
          console.warn('Unexpected API response format:', data);
          studiosData = [];
        }
        
        console.log('Processed studios data:', studiosData);
        setStudios(studiosData);
      } catch (error) {
        console.error('Failed to load studios:', error);
        setError('Не удалось загрузить студии');
        setStudios([]);
      } finally {
        setLoading(false);
      }
    };
    loadStudios();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const studioData = {
        ...form
      };

      console.log('Submitting studio data:', studioData);

      if (editingStudio) {
        // Update existing studio
        console.log('Updating studio ID:', editingStudio.id);
        const updated = await updateStudio(token, editingStudio.id, studioData);
        console.log('Updated studio response:', updated);
        setStudios(studios.map(s => s.id === updated.id ? updated : s));
        alert('Студия успешно обновлена');
      } else {
        // Create new studio
        console.log('Creating new studio');
        const newStudio = await createStudio(token, studioData);
        console.log('Created studio response:', newStudio);
        setStudios([...studios, newStudio]);
        alert('Студия успешно создана');
      }
      
      setShowForm(false);
      setEditingStudio(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save studio:', error);
      alert(editingStudio ? 'Не удалось обновить студию' : 'Не удалось создать студию');
    }
  };

  const handleEdit = (studio: Studio) => {
    console.log('Editing studio:', studio);
    console.log('Setting editingStudio to:', studio);
    
    setEditingStudio(studio);
    setForm({
      name: studio.name,
      description: studio.description,
      address: studio.address,
      city: studio.city,
      district: studio.district,
      phone: studio.phone,
      email: studio.email,
      website: studio.website,
      working_hours: studio.working_hours || {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '09:00', close: '18:00' },
        sunday: { open: '09:00', close: '18:00' }
      }
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm('Вы уверены, что хотите удалить эту студию?')) return;

    try {
      await deleteStudio(token, id);
      setStudios(studios.filter(s => s.id !== id));
      alert('Студия успешно удалена');
    } catch (error) {
      console.error('Failed to delete studio:', error);
      alert('Не удалось удалить студию');
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      address: '',
      city: '',
      district: '',
      phone: '',
      email: '',
      website: '',
      working_hours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '09:00', close: '18:00' },
        sunday: { open: '09:00', close: '18:00' }
      }
    });
  };

  if (loading) {
    return <div className="tab-content">Загрузка студий...</div>;
  }

  if (error) {
    return <div className="tab-content">
      <h2>Мои студии</h2>
      <div style={{ color: 'red', padding: '20px' }}>{error}</div>
    </div>;
  }

  return (
    <div className="tab-content">
      {selectedStudioForRooms ? (
        <StudioRoomsManagement 
          studio={selectedStudioForRooms} 
          onBack={() => setSelectedStudioForRooms(null)} 
        />
      ) : (
        <>
          <div className="content-header">
            <h2>Мои студии</h2>
            <button className="btn-primary" onClick={() => {
              setEditingStudio(null);
              resetForm();
              setShowForm(true);
            }}>
              <Plus size={16} /> Добавить студию
            </button>
          </div>

          {showForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>{editingStudio ? 'Редактировать студию' : 'Добавить студию'}</h3>
                  <button onClick={() => {
                    setShowForm(false);
                    setEditingStudio(null);
                  }} className="close-button">×</button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit} className="studio-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Название студии</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Город</label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Район</label>
                        <input
                          type="text"
                          value={form.district}
                          onChange={(e) => setForm({ ...form, district: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Телефон</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Вебсайт</label>
                        <input
                          type="url"
                          value={form.website}
                          onChange={(e) => setForm({ ...form, website: e.target.value })}
                        />
                      </div>
                      <div className="form-group full-width">
                        <label>Адрес</label>
                        <input
                          type="text"
                          value={form.address}
                          onChange={(e) => setForm({ ...form, address: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group full-width">
                        <label>Описание</label>
                        <textarea
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          rows={4}
                          required
                        />
                      </div>
                      <div className="form-group full-width">
                        <label>Фотографии студии</label>
                        {editingStudio ? (
                          <AttachmentsManager
                            targetType="studio_gallery"
                            targetId={editingStudio.id}
                            token={token || ''}
                            maxImages={5}
                          />
                        ) : (
                          <div style={{ 
                            padding: '20px', 
                            background: '#f5f5f5', 
                            borderRadius: '8px',
                            textAlign: 'center',
                            color: '#666'
                          }}>
                            Сначала сохраните студию, затем сможете добавить фотографии
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button className="btn-secondary" onClick={() => {
                    setShowForm(false);
                    setEditingStudio(null);
                  }}>
                    Отмена
                  </button>
                  <button className="btn-primary" onClick={handleSubmit}>
                    {editingStudio ? 'Сохранить' : 'Создать'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="studios-grid">
            {studios.length > 0 ? (
              studios.map((studio) => (
                <div key={studio.id} className="studio-card">
                  <div className="studio-header">
                    <h3>{studio.name}</h3>
                    <div className="studio-actions">
                      <button 
                        className="btn-secondary"
                        onClick={() => handleEdit(studio)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          setSelectedStudioForRooms(studio);
                        }}
                      >
                        <Home size={16} />
                        Комнаты
                      </button>
                      <button 
                        className="btn-danger"
                        onClick={() => handleDelete(studio.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Studio Images */}
                  {studio.images && studio.images.length > 0 && (
                    <div className="studio-images">
                      {studio.images.slice(0, 3).map((image: string, index: number) => {
                        const normalizedUrl = normalizeImageUrl(image);
                        return normalizedUrl ? (
                          <img 
                            key={index}
                            src={normalizedUrl} 
                            alt={`${studio.name} - Image ${index + 1}`}
                            className="studio-image"
                            onError={(e) => {
                              console.error('Failed to load image:', normalizedUrl);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : null;
                      })}
                      {studio.images.length > 3 && (
                        <div className="studio-image-more">
                          +{studio.images.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="studio-info">
                    <div className="info-item">
                      <MapPin size={14} />
                      <span>{studio.address}, {studio.city}</span>
                    </div>
                    {studio.phone && (
                      <div className="info-item">
                        <Phone size={14} />
                        <span>{studio.phone}</span>
                      </div>
                    )}
                    {studio.email && (
                      <div className="info-item">
                        <Mail size={14} />
                        <span>{studio.email}</span>
                      </div>
                    )}
                    {studio.website && (
                      <div className="info-item">
                        <span>🌐</span>
                        <a href={studio.website} target="_blank" rel="noopener noreferrer">{studio.website}</a>
                      </div>
                    )}
                  </div>
                  
                  <p className="studio-description">{studio.description}</p>
                  
                  {studio.rating && (
                    <div className="studio-rating">
                      <Star size={14} />
                      <span>{studio.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <h3>У вас пока нет студий</h3>
                <p>Создайте свою первую студию, чтобы начать принимать бронирования</p>
                <button className="btn-primary" onClick={() => {
                  setEditingStudio(null);
                  resetForm();
                  setShowForm(true);
                }}>
                  <Plus size={16} /> Создать студию
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
