import React, { useState, useEffect } from 'react';
import { 
  X, User, Phone, Mail, Calendar, Clock, 
  DollarSign, MessageSquare, Edit2, Trash2,
  CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ManagerBookingModal.css';

interface BookingDetails {
  id: number;
  room_name: string;
  studio_name: string;
  client_id: number;
  client_name: string;
  client_phone: string;
  client_email: string;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
  deposit_amount: number;
  balance: number;
  notes?: string;
  cancellation_reason?: string;
  created_at: string;
}

interface ManagerBookingModalProps {
  bookingId: number;
  onClose: () => void;
  onUpdate: () => void;
}

export const ManagerBookingModal: React.FC<ManagerBookingModalProps> = ({
  bookingId,
  onClose,
  onUpdate
}) => {
  const { token } = useAuth();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/v1/manager/bookings/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBooking(data.data?.booking);
        setDepositAmount(data.data?.booking?.deposit_amount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDeposit = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/v1/manager/bookings/${bookingId}/deposit`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deposit_amount: depositAmount })
      });

      if (response.ok) {
        setIsEditing(false);
        fetchBooking();
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update deposit:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/v1/manager/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchBooking();
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    if (cancelReason.length < 10) {
      alert('Причина отмены должна быть не менее 10 символов');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/v1/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: cancelReason })
      });

      if (response.ok) {
        setShowCancelConfirm(false);
        fetchBooking();
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('ru-RU', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'long' 
      }),
      time: date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
      pending: { label: 'Ожидает', color: 'yellow', icon: AlertTriangle },
      confirmed: { label: 'Подтверждено', color: 'blue', icon: CheckCircle },
      completed: { label: 'Завершено', color: 'green', icon: CheckCircle },
      cancelled: { label: 'Отменено', color: 'red', icon: XCircle }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`status-badge status-badge--${config.color}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="manager-booking-modal-overlay">
        <div className="manager-booking-modal manager-booking-modal--loading">
          <div className="manager-booking-modal__spinner" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const start = formatDateTime(booking.start_time);
  const end = formatDateTime(booking.end_time);

  return (
    <div className="manager-booking-modal-overlay" onClick={onClose}>
      <div className="manager-booking-modal" onClick={e => e.stopPropagation()}>
        <div className="manager-booking-modal__header">
          <h2>Бронирование #{booking.id}</h2>
          <button className="manager-booking-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="manager-booking-modal__content">
          {/* Статус */}
          <div className="manager-booking-modal__status-row">
            {getStatusBadge(booking.status)}
            {booking.status === 'pending' && (
              <button 
                className="btn btn-confirm"
                onClick={() => handleUpdateStatus('confirmed')}
                disabled={isSaving}
              >
                <CheckCircle size={16} />
                Подтвердить
              </button>
            )}
            {booking.status === 'confirmed' && (
              <button 
                className="btn btn-complete"
                onClick={() => handleUpdateStatus('completed')}
                disabled={isSaving}
              >
                <CheckCircle size={16} />
                Завершить
              </button>
            )}
          </div>

          {/* Информация о студии/комнате */}
          <div className="manager-booking-modal__section">
            <h3>{booking.room_name}</h3>
            <p className="text-muted">{booking.studio_name}</p>
          </div>

          {/* Клиент */}
          <div className="manager-booking-modal__section">
            <h4>Клиент</h4>
            <div className="manager-booking-modal__client">
              <div className="client-info">
                <User size={16} />
                <span>{booking.client_name}</span>
              </div>
              <div className="client-info">
                <Phone size={16} />
                <a href={`tel:${booking.client_phone}`}>{booking.client_phone}</a>
              </div>
              <div className="client-info">
                <Mail size={16} />
                <a href={`mailto:${booking.client_email}`}>{booking.client_email}</a>
              </div>
            </div>
          </div>

          {/* Время */}
          <div className="manager-booking-modal__section">
            <h4>Время</h4>
            <div className="manager-booking-modal__time">
              <div className="time-row">
                <Calendar size={16} />
                <span>{start.date}</span>
              </div>
              <div className="time-row">
                <Clock size={16} />
                <span>{start.time} — {end.time}</span>
              </div>
            </div>
          </div>

          {/* Финансы */}
          <div className="manager-booking-modal__section">
            <h4>Финансы</h4>
            <div className="manager-booking-modal__finances">
              <div className="finance-row">
                <span>Стоимость</span>
                <span className="finance-value">₸{booking.total_price.toLocaleString()}</span>
              </div>
              <div className="finance-row">
                <span>Предоплата</span>
                {isEditing ? (
                  <div className="finance-edit">
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={e => setDepositAmount(Number(e.target.value))}
                      min={0}
                      max={booking.total_price}
                    />
                    <button onClick={handleUpdateDeposit} disabled={isSaving}>
                      Сохранить
                    </button>
                    <button onClick={() => setIsEditing(false)}>
                      Отмена
                    </button>
                  </div>
                ) : (
                  <div className="finance-value-group">
                    <span className="finance-value">₸{booking.deposit_amount.toLocaleString()}</span>
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <button 
                        className="edit-btn"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="finance-row finance-row--total">
                <span>К оплате</span>
                <span className={`finance-value ${booking.balance === 0 ? 'paid' : ''}`}>
                  ₸{booking.balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Заметки */}
          {booking.notes && (
            <div className="manager-booking-modal__section">
              <h4>Заметки клиента</h4>
              <div className="manager-booking-modal__notes">
                <MessageSquare size={16} />
                <p>{booking.notes}</p>
              </div>
            </div>
          )}

          {/* Причина отмены */}
          {booking.cancellation_reason && (
            <div className="manager-booking-modal__section manager-booking-modal__section--warning">
              <h4>Причина отмены</h4>
              <p>{booking.cancellation_reason}</p>
            </div>
          )}
        </div>

        {/* Footer с действиями */}
        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
          <div className="manager-booking-modal__footer">
            {!showCancelConfirm ? (
              <button 
                className="btn btn-danger"
                onClick={() => setShowCancelConfirm(true)}
              >
                <XCircle size={16} />
                Отменить бронирование
              </button>
            ) : (
              <div className="cancel-confirm">
                <textarea
                  placeholder="Укажите причину отмены (минимум 10 символов)"
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  rows={3}
                />
                <div className="cancel-confirm__actions">
                  <button 
                    className="btn btn-danger"
                    onClick={handleCancel}
                    disabled={isSaving || cancelReason.length < 10}
                  >
                    Подтвердить отмену
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowCancelConfirm(false)}
                  >
                    Назад
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerBookingModal;
