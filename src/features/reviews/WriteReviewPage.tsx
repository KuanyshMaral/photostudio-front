import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewForm from '../booking/ReviewForm';
import { getMyBookings } from '../../api/bookingApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Booking {
  id: number;
  room_id: string;
  room_name?: string;
  studio_id?: number;
  studio_name?: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'finished';
  created_at: string;
  updated_at?: string;
  price?: number;
}

const WriteReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;
      
      try {
        const bookingsData = await getMyBookings(token);
        
        // Filter only completed bookings that can be reviewed
        const completedBookings = bookingsData.filter((booking: any) => 
          booking.status === 'completed' || booking.status === 'finished'
        );
        
        setBookings(completedBookings);
      } catch (error) {
        console.error('Failed to load bookings:', error);
        toast.error('Failed to load your bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const handleBookingSelect = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowReviewForm(true);
  };

  const handleReviewSubmitted = () => {
    toast.success('Review submitted successfully!');
    navigate('/reviews');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <span className="ml-3 text-gray-600">Loading your bookings...</span>
        </div>
      </div>
    );
  }

  if (showReviewForm && selectedBooking) {
    return (
      <ReviewForm
        bookingId={selectedBooking.id}
        studioId={selectedBooking.studio_id || 0}
        roomId={selectedBooking.room_id}
        roomName={selectedBooking.room_name}
        onReviewSubmitted={handleReviewSubmitted}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Оставить отзыв</h1>
          <p className="text-gray-600 mt-1">Выберите бронирование, которое вы хотите оценить</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-lg mb-4">У вас нет завершенных бронирований</div>
            <p className="text-gray-500 mb-6">Вы можете оставить отзыв только после посещения студии</p>
            <button
              onClick={() => navigate('/studios')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Найти студию
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ваши завершенные бронирования:</h2>
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {booking.studio_name || 'Studio'}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {booking.room_name || `Room ${booking.room_id}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatDate(booking.start_time)} - {formatDate(booking.end_time)}
                    </p>
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2">
                      {booking.status === 'completed' ? 'Завершено' : 
                       booking.status === 'finished' ? 'Завершено' : 
                       booking.status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBookingSelect(booking)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Оставить отзыв
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteReviewPage;
