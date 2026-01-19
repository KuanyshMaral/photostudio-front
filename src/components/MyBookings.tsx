import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserBookings, cancelBooking, type Booking } from '../api/myBookingsApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import BookingDetailModal from './BookingDetailModal';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, MapPin, Phone, Mail, DollarSign, User } from 'lucide-react';

export default function MyBookings() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { token } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-bookings', statusFilter],
    queryFn: () => getUserBookings(
      statusFilter === 'all' ? undefined : statusFilter as 'pending' | 'confirmed' | 'cancelled' | 'completed', 
      token || ''
    ),
    enabled: !!token,
  });

  const filteredBookings = data || [];

  const handleCancel = async (bookingId: number) => {
    if (!confirm('Вы уверены, что хотите отменить бронирование?')) return;

    try {
      await cancelBooking(bookingId, token || '');
      toast.success('Бронирование отменено');
      refetch();
    } catch (error) {
      toast.error('Ошибка отмены');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Ожидает',
      confirmed: 'Подтверждено',
      completed: 'Завершено',
      cancelled: 'Отменено'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Мои бронирования</h1>

      {/* Status filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getStatusLabel(status === 'all' ? 'all' : status)}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      {isLoading ? (
        <LoadingSpinner />
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {statusFilter === 'all' ? 'У вас пока нет бронирований' : `Нет бронирований со статусом "${getStatusLabel(statusFilter)}"`}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking: Booking) => (
            <div 
              key={booking.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300"
              onClick={() => setSelectedBooking(booking)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {booking.room_name || 'Зал'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    ID бронирования: #{booking.id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(booking.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium mr-2">Дата и время:</span>
                  <span>{formatDate(booking.start_time)} - {new Date(booking.end_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-medium mr-2">Зал:</span>
                  <span>{booking.room_name || 'Не указан'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Создано: {new Date(booking.created_at).toLocaleDateString('ru-RU')}
                </span>
                
                {booking.status === 'pending' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancel(booking.id);
                    }}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Отменить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
