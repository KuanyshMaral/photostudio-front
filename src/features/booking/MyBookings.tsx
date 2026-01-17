import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getMyBookings, cancelBooking } from '../../api/bookingApi';
// ИСПРАВЛЕНИЕ: отдельный импорт для типа
import type { Booking } from '../../api/bookingApi';
import LoadingSpinner from '../../components/LoadingSpinner';
// УДАЛЕНО: import BookingCard from '../admin/BookingCard'; (так как он не использовался)

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

export default function MyBookings() {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-bookings', statusFilter],
    queryFn: () => getMyBookings(statusFilter === 'all' ? undefined : statusFilter),
  });

  const handleCancel = async (bookingId: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Вы уверены, что хотите отменить бронирование?')) return;

    try {
      await cancelBooking(bookingId);
      toast.success('Бронирование отменено');
      refetch();
    } catch (error) {
      toast.error('Ошибка отмены');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Мои бронирования</h1>

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

      {isLoading ? (
        <LoadingSpinner />
      ) : !data || data.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Нет бронирований
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((booking: Booking) => (
            <div key={booking.id} className="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
                <div>
                    <p className="font-bold">{booking.studio_name} - {booking.room_name}</p>
                    <p className="text-sm text-gray-600">
                        {new Date(booking.start_time).toLocaleDateString()} {new Date(booking.start_time).toLocaleTimeString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'
                    }`}>
                        {getStatusLabel(booking.status)}
                    </span>
                </div>
                {booking.status === 'pending' && (
                    <button 
                        onClick={() => handleCancel(booking.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        Отменить
                    </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}