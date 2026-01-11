import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { getMyBookings, cancelBooking as cancelBookingApi } from '../../api/bookingApi';
import { useAuth } from '../../context/AuthContext.tsx';
import type { Booking } from '../../types/booking';
import LoadingSpinner from '../../components/LoadingSpinner'; // Импорт спиннера
import { formatDate } from '../../utils/format'; // Импорт форматтера
import { formatPrice } from '../../utils/format';

const statusFilters = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const;
type StatusFilter = typeof statusFilters[number];

const MyBookings: React.FC = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  // Fetch user's bookings
  const {
    data: bookings = [],
    isLoading,
    error,
  } = useQuery<Booking[]>({
    queryKey: ['my-bookings', token],
    queryFn: () => getMyBookings(token || ''),
    enabled: !!token,
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: number) => cancelBookingApi(bookingId, token || ''),
    onSuccess: (_, bookingId) => {
      const cancelledBooking = bookings.find(b => b.id === bookingId);
      const roomName = cancelledBooking?.roomName || 'booking';
      toast.success(`Бронирование ${roomName} успешно отменено`);
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Не удалось отменить бронирование');
    },
  });

  // Filter bookings based on status
  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === 'ALL') return true;
    return booking.status === statusFilter;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!token) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Мои бронирования</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Пожалуйста, войдите, чтобы увидеть свои бронирования.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex justify-center h-64 items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Мои бронирования</h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">Ошибка загрузки. Попробуйте позже.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Мои бронирования</h1>
        <div className="flex space-x-2">
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {statusFilters.map((filter) => (
              <option key={filter} value={filter}>
                {filter === 'ALL' ? 'Все' : filter}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Бронирований не найдено.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-semibold">{booking.roomName}</h3>
                    <p className="text-gray-600">{booking.studioName}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-medium">{formatPrice(booking.price)}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(booking.startTime)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                    Создано: {formatDate(booking.createdAt)}
                  </div>
                  <div className="space-x-2">
                    {booking.status === 'PENDING' || booking.status === 'CONFIRMED' ? (
                      <button
                        onClick={() => {
                          if (window.confirm('Вы уверены, что хотите отменить бронирование?')) {
                            cancelBookingMutation.mutate(booking.id);
                          }
                        }}
                        disabled={cancelBookingMutation.isPending}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none disabled:opacity-50"
                      >
                        {cancelBookingMutation.isPending && cancelBookingMutation.variables === booking.id ? (
                          'Отмена...'
                        ) : 'Отменить'}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;