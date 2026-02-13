
import { X, MapPin, Calendar, Clock, DollarSign, User, Phone, Mail } from 'lucide-react';

interface BookingDetailModalProps {
  booking: any;
  onClose: () => void;
}

export default function BookingDetailModal({ booking, onClose }: BookingDetailModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => '';

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Ожидает подтверждения',
      confirmed: 'Подтверждено',
      completed: 'Завершено',
      cancelled: 'Отменено'
    };
    return labels[status] || status;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Детали бронирования</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500">Статус бронирования</span>
              <div className="mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {getStatusLabel(booking.status)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">ID бронирования</span>
              <div className="text-lg font-semibold">#{booking.id}</div>
            </div>
          </div>

          {/* Studio Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о студии</h3>
            
            {/* Studio Photo */}
            {booking.studio?.photos?.[0] && (
              <div className="mb-4">
                <img
                  src={booking.studio.photos[0]}
                  alt={booking.studio.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">{booking.studio?.name || 'Студия'}</p>
                  <p className="text-sm text-gray-600">{booking.studio?.address || 'Адрес не указан'}</p>
                </div>
              </div>

              {booking.studio?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <p className="text-gray-700">{booking.studio.phone}</p>
                </div>
              )}

              {booking.studio?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <p className="text-gray-700">{booking.studio.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о бронировании</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Дата</p>
                  <p className="font-medium">{formatDate(booking.start_time)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Время</p>
                  <p className="font-medium">
                    {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Зал</p>
                  <p className="font-medium">{booking.room_name || 'Не указан'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Цена</p>
                  <p className="font-medium text-lg">
                    {booking.total_price ? `${booking.total_price.toLocaleString()} ₸` : 'Не указана'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Создано:</span> {formatDate(booking.created_at)} {formatTime(booking.created_at)}
              </div>
              {booking.updated_at && (
                <div>
                  <span className="font-medium">Обновлено:</span> {formatDate(booking.updated_at)} {formatTime(booking.updated_at)}
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          {booking.contact_info && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Контактная информация</h4>
              <p className="text-sm text-yellow-700">{booking.contact_info}</p>
            </div>
          )}

          {/* Notes/Comment */}
          {booking.comment && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Примечания</h4>
              <p className="text-sm text-green-700">{booking.comment}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Закрыть
            </button>
            {booking.status === 'pending' && (
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={() => {
                  // TODO: Implement cancel booking
                  alert('Функция отмены будет доступна скоро');
                }}
              >
                Отменить бронирование
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
