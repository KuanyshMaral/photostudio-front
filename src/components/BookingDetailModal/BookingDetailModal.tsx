import React from 'react';
import { X, Calendar, Clock, DollarSign, MapPin } from 'lucide-react';
import './BookingDetailModal.css';

interface Booking {
  id: number;
  studio_name?: string;
  room_name?: string;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
  notes?: string;
  room?: {
    photos?: string[];
    studio?: {
      address?: string;
    };
  };
}

interface BookingDetailModalProps {
  booking: Booking;
  onClose: () => void;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Ожидает', color: 'warning' },
  confirmed: { label: 'Подтверждено', color: 'success' },
  cancelled: { label: 'Отменено', color: 'danger' },
  completed: { label: 'Завершено', color: 'neutral' },
};

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  onClose,
}) => {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₸';
  };

  const statusConfig = STATUS_LABELS[booking.status] || STATUS_LABELS.pending;
  const coverImage = booking.room?.photos?.[0] || '/images/studio-placeholder.jpg';

  return (
    <div className="booking-detail-overlay" onClick={onClose}>
      <div 
        className="booking-detail-modal"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="booking-detail-modal__header">
          <h2>Детали бронирования</h2>
          <button 
            className="booking-detail-modal__close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cover Image */}
        <div className="booking-detail-modal__image">
          <img src={coverImage} alt={booking.studio_name} />
        </div>

        {/* Content */}
        <div className="booking-detail-modal__content">
          {/* Studio Name */}
          <h3 className="booking-detail-modal__title">
            {booking.studio_name} — {booking.room_name}
          </h3>

          {/* Status Badge */}
          <div className={`booking-detail-modal__status status--${statusConfig.color}`}>
            {statusConfig.label}
          </div>

          {/* Info Grid */}
          <div className="booking-detail-modal__info">
            <div className="booking-detail-modal__info-item">
              <Calendar size={18} />
              <div>
                <span className="info-label">Дата</span>
                <span className="info-value">{formatDate(booking.start_time)}</span>
              </div>
            </div>

            <div className="booking-detail-modal__info-item">
              <Clock size={18} />
              <div>
                <span className="info-label">Время</span>
                <span className="info-value">
                  {formatTime(booking.start_time)} — {formatTime(booking.end_time)}
                </span>
              </div>
            </div>

            <div className="booking-detail-modal__info-item">
              <DollarSign size={18} />
              <div>
                <span className="info-label">Стоимость</span>
                <span className="info-value info-value--price">
                  {formatPrice(booking.total_price)}
                </span>
              </div>
            </div>

            {booking.room?.studio?.address && (
              <div className="booking-detail-modal__info-item">
                <MapPin size={18} />
                <div>
                  <span className="info-label">Адрес</span>
                  <span className="info-value">{booking.room.studio.address}</span>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="booking-detail-modal__notes">
              <h4>Примечание</h4>
              <p>{booking.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
