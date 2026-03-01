import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getMyStudios,
  createStudio,
  updateStudio,
  deleteStudio,
  type Studio,
  type StudioCreateRequest
} from './owner.api';
import { Plus, Edit, Trash2, MapPin, Phone, Mail, Home } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import './OwnerDashboard.css';

export default function StudioManagement() {
  const { token } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStudio, setEditingStudio] = useState<Studio | null>(null);
  const [studioImages, setStudioImages] = useState<string[]>([]);
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
        const response = data as any;
        let studiosData: Studio[] = [];
        
        if (response.data && response.data.studios) {
          studiosData = response.data.studios;
        } else if (response.data && response.data.items) {
          studiosData = response.data.items;
        } else if (response.items) {
          studiosData = response.items;
        } else if (Array.isArray(response)) {
          studiosData = response;
        } else if (Array.isArray(data)) {
          studiosData = data;
        }
        
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
        ...form,
        images: studioImages
      };

      if (editingStudio) {
        const updated = await updateStudio(token, editingStudio.id, studioData);
        setStudios(studios.map(s => s.id === updated.id ? updated : s));
        alert('Студия успешно обновлена');
      } else {
        const newStudio = await createStudio(token, studioData);
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
    setForm({
      name: studio.name,
      description: studio.description,
      address: studio.address,
      city: studio.city,
      district: studio.district,
      phone: studio.phone,
      email: studio.email,
      website: studio.website,
      working_hours: studio.working_hours
    });
    
    // Load images from localStorage
    const storedImages = JSON.parse(localStorage.getItem(`studio_images_${studio.id}`) || '[]');
    setStudioImages(storedImages);
    
    setEditingStudio(studio);
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
    setStudioImages([]);
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
      <div className="dashboard-header">
        <h2>Мои студии</h2>
        <button 
          className="btn-primary"
          onClick={() => {
            setEditingStudio(null);
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus size={16} />
          Добавить студию
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingStudio ? 'Редактировать студию' : 'Новая студия'}</h3>
              <button onClick={() => setShowForm(false)} className="btn-close">×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Название студии *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Город *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({...form, city: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Адрес *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({...form, address: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Район</label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={(e) => setForm({...form, district: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Телефон</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Описание</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Веб-сайт</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({...form, website: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Фотографии студии</label>
                  <ImageUpload
                    images={studioImages}
                    onImagesChange={setStudioImages}
                    maxImages={5}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Отмена
                </button>
                <button type="submit" className="btn-primary">
                  {editingStudio ? 'Сохранить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="studios-grid">
        {studios.map(studio => (
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
                  className="btn-danger"
                  onClick={() => handleDelete(studio.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
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
            </div>
            
            {studio.description && (
              <p className="studio-description">{studio.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
