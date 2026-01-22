import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './CreateBookingModal.css';

interface Studio {
  id: number;
  name: string;
  rooms: Room[];
}

interface Room {
  id: number;
  name: string;
  hourly_rate: number;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface CreateBookingModalProps {
  startTime: Date;
  endTime: Date;
  onClose: () => void;
  onCreate: () => void;
}

export const CreateBookingModal: React.FC<CreateBookingModalProps> = ({
  startTime,
  endTime,
  onClose,
  onCreate
}) => {
  const { token } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    console.log('CreateBookingModal useEffect triggered');
    fetchStudios();
    fetchClients();
  }, []);

  const fetchStudios = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching studios...');
      // Пробуем сначала получить студии владельца
      const response = await fetch('/api/v1/owner/studios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Owner studios response:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Owner studios data:', data);
        // Если это студии владельца, преобразуем в нужный формат
        const studiosData = data.data?.studios || data || [];
        const formattedStudios = studiosData.map((studio: any) => ({
          id: studio.id,
          name: studio.name,
          rooms: studio.rooms || []
        }));
        console.log('Formatted studios:', formattedStudios);
        setStudios(formattedStudios);
      } else {
        // Пробуем альтернативный эндпоинт
        const response2 = await fetch('/api/v1/studios', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('All studios response:', response2.status);
        if (response2.ok) {
          const data2 = await response2.json();
          console.log('All studios data:', data2);
          const studiosData = data2.data?.studios || data2 || [];
          const formattedStudios = studiosData.map((studio: any) => ({
            id: studio.id,
            name: studio.name,
            rooms: studio.rooms || []
          }));
          console.log('Formatted all studios:', formattedStudios);
          setStudios(formattedStudios);
        }
      }
    } catch (error) {
      console.error('Failed to fetch studios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      console.log('Fetching clients...');
      
      // Пробуем самый простой эндпоинт - всех пользователей
      const response = await fetch('/api/v1/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('/api/v1/users response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('All users data:', data);
        
        // Извлекаем всех пользователей и фильтруем клиентов
        const allUsers = data.data?.users || data.users || data || [];
        console.log('All users:', allUsers);
        
        const clientsData = allUsers
          .filter((user: any) => user.role === 'client')
          .map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || ''
          }));
        
        console.log('Filtered clients:', clientsData);
        setClients(clientsData);
      } else {
        console.log('Failed to load users, trying empty clients array');
        setClients([]);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      setClients([]);
    }
  };

  const handleCreateBooking = async () => {
    if (!selectedStudio || !selectedRoom || !selectedClient) {
      alert('Пожалуйста, выберите студию, комнату и клиента');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/v1/manager/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          room_id: selectedRoom,
          client_id: selectedClient,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          notes,
          deposit_amount: depositAmount
        })
      });

      if (response.ok) {
        onCreate();
        onClose();
      } else {
        const error = await response.json();
        alert(error.message || 'Ошибка при создании бронирования');
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Ошибка при создании бронирования');
    } finally {
      setIsCreating(false);
    }
  };

  const selectedStudioData = studios.find(s => s.id === selectedStudio);
  const selectedRoomData = selectedStudioData?.rooms.find(r => r.id === selectedRoom);
  const selectedClientData = clients.find(c => c.id === selectedClient);

  console.log('Debug info:', {
    selectedStudio,
    selectedRoom,
    selectedClient,
    selectedStudioData,
    selectedRoomData,
    selectedClientData,
    studios,
    clients
  });

  const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
  const totalPrice = selectedRoomData ? selectedRoomData.hourly_rate * hours : 0;

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('ru-RU', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <div className="create-booking-modal-overlay" onClick={onClose}>
      <div className="create-booking-modal" onClick={e => e.stopPropagation()}>
        <div className="create-booking-modal__header">
          <h2>Создать бронирование</h2>
          <button className="create-booking-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="create-booking-modal__content">
          {/* Время */}
          <div className="create-booking-modal__section">
            <h4>Время</h4>
            <div className="time-display">
              <div className="time-row">
                <Calendar size={16} />
                <span>{formatDateTime(startTime)}</span>
              </div>
              <div className="time-row">
                <Clock size={16} />
                <span>{formatDateTime(endTime)}</span>
              </div>
            </div>
          </div>

          {/* Студия */}
          <div className="create-booking-modal__section">
            <h4>Студия</h4>
            <select
              value={selectedStudio || ''}
              onChange={e => {
                setSelectedStudio(Number(e.target.value));
                setSelectedRoom(null);
              }}
              disabled={isLoading}
            >
              <option value="">Выберите студию</option>
              {studios.map(studio => (
                <option key={studio.id} value={studio.id}>
                  {studio.name}
                </option>
              ))}
            </select>
          </div>

          {/* Комната */}
          <div className="create-booking-modal__section">
            <h4>Комната</h4>
            <select
              value={selectedRoom || ''}
              onChange={e => setSelectedRoom(Number(e.target.value))}
              disabled={!selectedStudio || isLoading}
            >
              <option value="">Выберите комнату</option>
              {selectedStudioData?.rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name} - ₸{room.hourly_rate}/час
                </option>
              ))}
            </select>
          </div>

          {/* Клиент */}
          <div className="create-booking-modal__section">
            <h4>Клиент</h4>
            <select
              value={selectedClient || ''}
              onChange={e => setSelectedClient(Number(e.target.value))}
              disabled={isLoading}
            >
              <option value="">Выберите клиента</option>
              {clients.map(client => {
                console.log('Rendering client:', client);
                return (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.phone}
                  </option>
                );
              })}
            </select>
            {clients.length === 0 && !isLoading && (
              <p className="text-red-500 text-sm mt-2">
                Клиенты не найдены. Проверьте консоль для отладки.
              </p>
            )}
          </div>

          {/* Финансы */}
          {selectedRoomData && (
            <div className="create-booking-modal__section">
              <h4>Финансы</h4>
              <div className="finances-summary">
                <div className="finance-row">
                  <span>Стоимость ({hours} ч)</span>
                  <span className="finance-value">₸{totalPrice.toLocaleString()}</span>
                </div>
                <div className="finance-row">
                  <label>Предоплата</label>
                  <div className="deposit-input-group">
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={e => setDepositAmount(Number(e.target.value))}
                      placeholder="0"
                      min={0}
                      max={totalPrice}
                    />
                    <span className="deposit-currency">₸</span>
                  </div>
                </div>
                <div className="finance-row finance-row--total">
                  <span>К оплате</span>
                  <span className="finance-value">
                    ₸{(totalPrice - depositAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Заметки */}
          <div className="create-booking-modal__section">
            <h4>Заметки</h4>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Дополнительная информация о бронировании..."
              rows={3}
            />
          </div>
        </div>

        <div className="create-booking-modal__footer">
          <button 
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isCreating}
          >
            Отмена
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleCreateBooking}
            disabled={isCreating || !selectedStudio || !selectedRoom || !selectedClient}
          >
            {isCreating ? 'Создание...' : 'Создать'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBookingModal;
