import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

import { getMyBookings, cancelBooking as cancelBookingApi } from '../../api/bookingApi';
import { useAuth } from '../../context/AuthContext.tsx';
import type { Booking } from '../../types/booking';

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
      toast.success(`Successfully cancelled booking for ${roomName}`);
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel booking. Please try again.');
    },
  });

  // Filter bookings based on status
  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === 'ALL') return true;
    return booking.status === statusFilter;
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPp');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!token) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Please sign in to view your bookings.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">Error loading bookings. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <div className="flex space-x-2">
          <label htmlFor="status-filter" className="sr-only">
            Filter by status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {statusFilters.map((filter) => (
              <option key={filter} value={filter}>
                {filter.charAt(0) + filter.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No bookings found{statusFilter !== 'ALL' ? ` with status ${statusFilter.toLowerCase()}` : ''}.</p>
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
                        {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-medium">${booking.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(booking.startTime)} - {formatDate(booking.endTime)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                    Booked on {formatDate(booking.createdAt)}
                  </div>
                  <div className="space-x-2">
                    {booking.status === 'PENDING' || booking.status === 'CONFIRMED' ? (
                      <button
                        onClick={() => {
                          const confirmed = window.confirm(
                            `Are you sure you want to cancel your booking for ${booking.roomName} on ${format(new Date(booking.startTime), 'PPp')}?`
                          );
                          if (confirmed) {
                            cancelBookingMutation.mutate(booking.id);
                          }
                        }}
                        disabled={cancelBookingMutation.isPending}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancelBookingMutation.isPending && cancelBookingMutation.variables === booking.id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cancelling...
                          </>
                        ) : 'Cancel Booking'}
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
