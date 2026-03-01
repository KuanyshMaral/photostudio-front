import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Home, MapPin, Users, DollarSign, ArrowLeft, Package } from 'lucide-react';
import AttachmentsManager from '../../components/AttachmentsManager';
import './OwnerDashboard.css';

// Types based on Swagger API
interface RoomType {
  id?: string;
  name: string;
  description?: string;
}

interface Room {
  id: number;
  studio_id: number;
  name: string;
  room_type: string;
  description?: string;
  area_sqm?: number;
  capacity?: number;
  price_per_hour_min?: number;
  price_per_hour_max?: number;
  photos?: string[];
  amenities?: string[];
  created_at?: string;
  updated_at?: string;
}

interface Equipment {
  id?: number;
  name: string;
  brand?: string;
  model?: string;
  category?: string;
  quantity: number;
  rental_price: number;
  room_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface CreateEquipmentRequest {
  name: string;
  brand?: string;
  model?: string;
  category?: string;
  quantity: number;
  rental_price: number;
}

interface UpdateEquipmentRequest extends Partial<CreateEquipmentRequest> {}

interface CreateRoomRequest {
  name: string;
  room_type: string;
  description?: string;
  area_sqm?: number;
  capacity?: number;
  price_per_hour_min?: number;
  price_per_hour_max?: number;
  photos?: string[];
  amenities?: string[];
}

interface UpdateRoomRequest extends Partial<CreateRoomRequest> {}

interface Studio {
  id: number;
  name: string;
  city: string;
  district?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  description?: string;
  rating?: number;
}

// API functions
const API_BASE = '/api/v1';

const getRoomTypes = async (token: string): Promise<RoomType[]> => {
  const response = await fetch(`${API_BASE}/room-types`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch room types');
  
  const data = await response.json();
  console.log('Raw room types response:', data);
  
  // Handle the actual API response format: { data: { room_types: [...] } }
  if (data && data.data && Array.isArray(data.data.room_types)) {
    return data.data.room_types.map((name: string) => ({ name }));
  } else if (data && Array.isArray(data.room_types)) {
    return data.room_types.map((name: string) => ({ name }));
  } else if (Array.isArray(data)) {
    return data;
  } else if (data && data.data && Array.isArray(data.data)) {
    return data.data;
  } else {
    console.warn('Unexpected room types response format:', data);
    return [];
  }
};

const getRooms = async (token: string, studioId: number): Promise<Room[]> => {
  const response = await fetch(`${API_BASE}/rooms?studio_id=${studioId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch rooms');
  
  const data = await response.json();
  console.log('Raw rooms response:', data);
  
  // Handle the actual API response format: { data: { rooms: [...] } }
  if (data && data.data && Array.isArray(data.data.rooms)) {
    return data.data.rooms;
  } else if (data && Array.isArray(data.rooms)) {
    return data.rooms;
  } else if (Array.isArray(data)) {
    return data;
  } else if (data && data.data && Array.isArray(data.data)) {
    return data.data;
  } else {
    console.warn('Unexpected rooms response format:', data);
    return [];
  }
};

const createRoom = async (token: string, studioId: number, roomData: CreateRoomRequest): Promise<Room> => {
  const response = await fetch(`${API_BASE}/studios/${studioId}/rooms`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roomData)
  });
  if (!response.ok) throw new Error('Failed to create room');
  return response.json();
};

const updateRoom = async (token: string, roomId: number, roomData: UpdateRoomRequest): Promise<Room> => {
  const response = await fetch(`${API_BASE}/rooms/${roomId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roomData)
  });
  if (!response.ok) throw new Error('Failed to update room');
  return response.json();
};

const deleteRoom = async (token: string, roomId: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/rooms/${roomId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to delete room');
};

// Equipment API functions
const addEquipment = async (token: string, roomId: number, equipmentData: CreateEquipmentRequest): Promise<Equipment> => {
  const response = await fetch(`${API_BASE}/rooms/${roomId}/equipment`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(equipmentData)
  });
  if (!response.ok) throw new Error('Failed to add equipment');
  return response.json();
};

interface StudioRoomsManagementProps {
  studio: Studio;
  onBack: () => void;
}

export default function StudioRoomsManagement({ studio, onBack }: StudioRoomsManagementProps) {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [selectedRoomForEquipment, setSelectedRoomForEquipment] = useState<Room | null>(null);

  const [formData, setFormData] = useState<CreateRoomRequest>({
    name: '',
    room_type: '',
    description: '',
    area_sqm: 0,
    capacity: 0,
    price_per_hour_min: 0,
    price_per_hour_max: 0,
    photos: [],
    amenities: []
  });

  const [equipmentFormData, setEquipmentFormData] = useState<CreateEquipmentRequest>({
    name: '',
    brand: '',
    model: '',
    category: '',
    quantity: 1,
    rental_price: 0
  });

  // Fetch room types and rooms for this studio
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const [roomTypesData, roomsData] = await Promise.all([
          getRoomTypes(token),
          getRooms(token, studio.id)
        ]);
        
        console.log('Room types:', roomTypesData);
        console.log('Rooms data:', roomsData);
        
        setRoomTypes(Array.isArray(roomTypesData) ? roomTypesData : []);
        setRooms(Array.isArray(roomsData) ? roomsData : []);
        setError(null);
      } catch (err) {
        console.error('Error loading rooms:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, studio.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingRoom) {
        // Update existing room
        const updatedRoom = await updateRoom(token, editingRoom.id, formData);
        setRooms(rooms.map(room => 
          room.id === editingRoom.id ? updatedRoom : room
        ));
      } else {
        // Create new room
        const newRoom = await createRoom(token, studio.id, formData);
        setRooms([...rooms, newRoom]);
      }

      // Reset form
      setFormData({
        name: '',
        room_type: '',
        description: '',
        area_sqm: 0,
        capacity: 0,
        price_per_hour_min: 0,
        price_per_hour_max: 0,
        photos: [],
        amenities: []
      });
      setShowForm(false);
      setEditingRoom(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save room');
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      room_type: room.room_type,
      description: room.description || '',
      area_sqm: room.area_sqm || 0,
      capacity: room.capacity || 0,
      price_per_hour_min: room.price_per_hour_min || 0,
      price_per_hour_max: room.price_per_hour_max || 0,
      photos: room.photos || [],
      amenities: room.amenities || []
    });
    setShowForm(true);
  };

  const handleDelete = async (roomId: number) => {
    if (!token) return;
    
    if (!confirm('Вы уверены, что хотите удалить эту комнату?')) return;

    try {
      await deleteRoom(token, roomId);
      setRooms(rooms.filter(room => room.id !== roomId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete room');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      room_type: '',
      description: '',
      area_sqm: 0,
      capacity: 0,
      price_per_hour_min: 0,
      price_per_hour_max: 0,
      photos: [],
      amenities: []
    });
    setEditingRoom(null);
    setShowForm(false);
  };

  const handleAddEquipment = (room: Room) => {
    setSelectedRoomForEquipment(room);
    setEquipmentFormData({
      name: '',
      brand: '',
      model: '',
      category: '',
      quantity: 1,
      rental_price: 0
    });
    setShowEquipmentForm(true);
  };

  const handleEquipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedRoomForEquipment) return;

    try {
      await addEquipment(token, selectedRoomForEquipment.id, equipmentFormData);
      alert('Оборудование успешно добавлено!');
      setShowEquipmentForm(false);
      setSelectedRoomForEquipment(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add equipment');
    }
  };

  if (loading) {
    return <div className="tab-content">Загрузка комнат...</div>;
  }

  if (error) {
    return <div className="tab-content">
      <div className="content-header">
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Назад к студиям
        </button>
        <h2>Комнаты студии "{studio.name}"</h2>
      </div>
      <div style={{ color: 'red', padding: '20px' }}>{error}</div>
    </div>;
  }

  return (
    <div className="tab-content">
      <div className="content-header">
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Назад к студиям
        </button>
        <h2>Комнаты студии "{studio.name}"</h2>
        <button className="btn-primary" onClick={() => {
          resetForm();
          setShowForm(true);
        }}>
          <Plus size={16} /> Добавить комнату
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingRoom ? 'Редактировать комнату' : 'Добавить комнату'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название комнаты *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Тип комнаты *</label>
                <select
                  value={formData.room_type}
                  onChange={(e) => setFormData({...formData, room_type: e.target.value})}
                  required
                >
                  <option value="">Выберите тип</option>
                  {roomTypes.map((type) => (
                    <option key={type.id || type.name} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {roomTypes.length === 0 && (
                  <small style={{ color: 'red' }}>Типы комнат не загружены</small>
                )}
              </div>

              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Площадь (м²)</label>
                  <input
                    type="number"
                    value={formData.area_sqm}
                    onChange={(e) => setFormData({...formData, area_sqm: Number(e.target.value)})}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Вместимость</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Цена за час (мин)</label>
                  <input
                    type="number"
                    value={formData.price_per_hour_min}
                    onChange={(e) => setFormData({...formData, price_per_hour_min: Number(e.target.value)})}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Цена за час (макс)</label>
                  <input
                    type="number"
                    value={formData.price_per_hour_max}
                    onChange={(e) => setFormData({...formData, price_per_hour_max: Number(e.target.value)})}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Удобства (через запятую)</label>
                <input
                  type="text"
                  value={formData.amenities?.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData, 
                    amenities: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                  })}
                  placeholder="Wi-Fi, Кондиционер, Освещение"
                />
              </div>

              <div className="form-group">
                <label>Фотографии комнаты</label>
                {editingRoom ? (
                  <AttachmentsManager
                    targetType="room_gallery"
                    targetId={editingRoom.id}
                    token={token || ''}
                    maxImages={8}
                  />
                ) : (
                  <div style={{ 
                    padding: '20px', 
                    background: '#f5f5f5', 
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#666'
                  }}>
                    Сначала сохраните комнату, затем сможете добавить фотографии
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}>
                  Отмена
                </button>
                <button type="submit" className="btn-primary">
                  {editingRoom ? 'Сохранить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="rooms-grid">
        {!Array.isArray(rooms) || rooms.length === 0 ? (
          <div className="empty-state">
            <Home size={48} />
            <h3>У этой студии пока нет комнат</h3>
            <p>Создайте первую комнату, чтобы начать принимать бронирования</p>
          </div>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-header">
                <h3>{room.name}</h3>
                <span className="room-type">{room.room_type}</span>
              </div>
              
              <div className="room-info">
                {room.area_sqm && (
                  <div className="info-item">
                    <MapPin size={16} />
                    {room.area_sqm} м²
                  </div>
                )}
                {room.capacity && (
                  <div className="info-item">
                    <Users size={16} />
                    {room.capacity} человек
                  </div>
                )}
                {room.price_per_hour_min && (
                  <div className="info-item">
                    <DollarSign size={16} />
                    {room.price_per_hour_min} - {room.price_per_hour_max} ₽/час
                  </div>
                )}
              </div>

              {room.description && (
                <p className="room-description">{room.description}</p>
              )}

              {room.amenities && room.amenities.length > 0 && (
                <div className="room-amenities">
                  {room.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="amenity-tag">{amenity}</span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="amenity-tag">+{room.amenities.length - 3}</span>
                  )}
                </div>
              )}

              <div className="room-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => handleEdit(room)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => handleAddEquipment(room)}
                >
                  <Package size={16} />
                  Оборудование
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => handleDelete(room.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showEquipmentForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Добавить оборудование в комнату "{selectedRoomForEquipment?.name}"</h3>
              <button onClick={() => {
                setShowEquipmentForm(false);
                setSelectedRoomForEquipment(null);
              }} className="close-button">×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEquipmentSubmit} className="equipment-form">
                <div className="form-group">
                  <label>Название оборудования *</label>
                  <input
                    type="text"
                    value={equipmentFormData.name}
                    onChange={(e) => setEquipmentFormData({...equipmentFormData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Бренд</label>
                    <input
                      type="text"
                      value={equipmentFormData.brand}
                      onChange={(e) => setEquipmentFormData({...equipmentFormData, brand: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Модель</label>
                    <input
                      type="text"
                      value={equipmentFormData.model}
                      onChange={(e) => setEquipmentFormData({...equipmentFormData, model: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Категория</label>
                  <input
                    type="text"
                    value={equipmentFormData.category}
                    onChange={(e) => setEquipmentFormData({...equipmentFormData, category: e.target.value})}
                    placeholder="Например: Освещение, Аудио, Камеры"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Количество *</label>
                    <input
                      type="number"
                      value={equipmentFormData.quantity}
                      onChange={(e) => setEquipmentFormData({...equipmentFormData, quantity: Number(e.target.value)})}
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Цена аренды (₽/час) *</label>
                    <input
                      type="number"
                      value={equipmentFormData.rental_price}
                      onChange={(e) => setEquipmentFormData({...equipmentFormData, rental_price: Number(e.target.value)})}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => {
                    setShowEquipmentForm(false);
                    setSelectedRoomForEquipment(null);
                  }}>
                    Отмена
                  </button>
                  <button type="submit" className="btn-primary">
                    Добавить оборудование
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
