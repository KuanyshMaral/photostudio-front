import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserBookings, cancelBooking, type Booking } from '../api/myBookingsApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: number) => void;
}

function BookingCard({ booking, onCancel }: BookingCardProps) {
  const startDate = new Date(booking.start_time);
  const endDate = new Date(booking.end_time);
  
  const formatDateTime = (date: Date) => {
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {booking.room_name || 'Зал'}
          </h3>
          <p className="text-gray-600 text-sm">
            ID бронирования: #{booking.id}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
          {getStatusLabel(booking.status)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Дата и время:</span>
          <span>{formatDateTime(startDate)} - {endDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
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
            onClick={() => onCancel(booking.id)}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            Отменить
          </button>
        )}
      </div>
    </div>
  );
}

export default function MyBookings() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { token } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-bookings', statusFilter],
    queryFn: () => getUserBookings(
      statusFilter === 'all' ? undefined : statusFilter as 'pending' | 'confirmed' | 'cancelled' | 'completed', 
      token || ''
    ),
    enabled: !!token,
  });

  // Filter bookings based on status (redundant since API handles filtering, but kept for safety)
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
            {getStatusLabel(status)}
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
            <BookingCard 
              key={booking.id} 
              booking={booking} 
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Status labels
function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    all: 'Все',
    pending: 'Ожидают',
    confirmed: 'Подтверждённые',
    completed: 'Завершённые',
    cancelled: 'Отменённые'
  };
  return labels[status] || status;
}
