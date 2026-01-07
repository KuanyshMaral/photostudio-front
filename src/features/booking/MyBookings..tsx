import React, { useState, useEffect } from "react";
import { getMyBookings, cancelBooking } from "../../api/bookingApi";
import type { Booking } from "../../api/myBookingsApi";
import { useAuth } from "../../context/AuthContext";
import toast from 'react-hot-toast';

const MyBookings: React.FC = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getMyBookings(token);
        setBookings(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch bookings";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  const handleCancelBooking = async (bookingId: number) => {
    if (!token) {
      toast.error("You must be logged in");
      return;
    }
    
    try {
      await cancelBooking(bookingId, token);
      toast.success("Booking cancelled successfully");
      // Refresh bookings after cancellation
      const data = await getMyBookings(token);
      setBookings(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to cancel booking";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading bookings...</span>
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
            <h2 className="text-2xl font-bold text-white">My Bookings</h2>
            <p className="text-teal-100 mt-1">Manage your room reservations</p>
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
                  All ({bookings.length})
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    statusFilter === 'pending'
                      ? 'bg-yellow-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending ({bookings.filter(b => b.status === 'pending').length})
                </button>
                <button
                  onClick={() => setStatusFilter('confirmed')}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    statusFilter === 'confirmed'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
                </button>
                <button
                  onClick={() => setStatusFilter('cancelled')}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    statusFilter === 'cancelled'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
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
                <div className="text-gray-400 text-lg">No bookings found</div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.room_name || booking.room_id}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(booking.start_time)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <div className="flex items-center mr-6">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {booking.room_id}
                      </div>
                    </div>
                    
                    {booking.status === 'pending' && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                        >
                          Cancel Booking
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
