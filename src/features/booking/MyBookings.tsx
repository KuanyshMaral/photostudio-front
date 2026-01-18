import React, { useState, useEffect } from "react";
import { getMyBookings, updateBookingStatus } from "../../api/bookingApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface Booking {
  id: number;
  room_id: string;
  room_name?: string;
  studio_id?: number;
  studio_name?: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at?: string;
  price?: number;
}

const MyBookings: React.FC = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');
  const [cancelling, setCancelling] = useState<number | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setError("Please login to view bookings");
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getMyBookings(token);
        setBookings(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Не удалось загрузить бронирования";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const handleCancel = async (bookingId: number) => {
    if (!token) {
      toast.error('Пожалуйста, войдите в систему для отмены бронирования');
      return;
    }
    
    setCancelling(bookingId);
    
    try {
      await updateBookingStatus(token, bookingId, 'cancelled');
      toast.success('Бронирование отменено');
      // Refetch bookings after cancellation
      const data = await getMyBookings(token);
      setBookings(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Не удалось отменить бронирование";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter bookings based on status filter
  const filteredBookings = bookings.filter(booking => {
    if (statusFilter === 'all') return true;
    return booking.status === statusFilter;
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'confirmed': return 'Подтверждено';
      case 'pending': return 'Ожидает';
      case 'cancelled': return 'Отменено';
      case 'completed': return 'Завершено';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Загрузка бронирований...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Мои бронирования</h2>
            <p className="text-teal-100 mt-1">Управляйте вашими бронированиями студий</p>
          </div>
          
          <div className="p-8">
            {/* Status Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    statusFilter === 'all'
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Все ({bookings.length})
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    statusFilter === 'pending'
                      ? 'bg-yellow-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Ожидает ({bookings.filter(b => b.status === 'pending').length})
                </button>
                <button
                  onClick={() => setStatusFilter('confirmed')}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    statusFilter === 'confirmed'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Подтверждено ({bookings.filter(b => b.status === 'confirmed').length})
                </button>
                <button
                  onClick={() => setStatusFilter('cancelled')}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    statusFilter === 'cancelled'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Отменено ({bookings.filter(b => b.status === 'cancelled').length})
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    statusFilter === 'completed'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Завершено ({bookings.filter(b => b.status === 'completed').length})
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">
                  {statusFilter === 'all' ? 'Нет бронирований' : `Нет бронирований со статусом "${getStatusText(statusFilter)}"`}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                    data-testid="booking-item"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.room_name || `Комната ${booking.room_id}`}
                        </h3>
                        {booking.studio_name && (
                          <p className="text-sm text-gray-500 mt-1">
                            {booking.studio_name}
                            {booking.studio_id && ` #${booking.studio_id}`}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(booking.start_time)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`} data-testid="booking-status">
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <div className="flex items-center mr-6">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </div>
                      <div className="flex items-center mr-6">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {booking.room_id}
                      </div>
                      {booking.price && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {booking.price} ₸
                        </div>
                      )}
                    </div>
                    
                    {booking.status === 'pending' && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancelling === booking.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancelling === booking.id ? 'Отмена...' : 'Отменить бронирование'}
                        </button>
                      </div>
                    )}
                    
                    {booking.status === 'confirmed' && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancelling === booking.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancelling === booking.id ? 'Отмена...' : 'Отменить'}
                        </button>
                      </div>
                    )}
                    
                    {booking.status === 'completed' && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => window.location.href = '/write-review'}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                          Оставить отзыв
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
