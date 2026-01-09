import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays } from 'date-fns';
import { toast } from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';

import { createBooking } from '../../api/bookingApi';
import { getRoomAvailability } from '../../api/availabilityApi';
import { useAuth } from '../../context/AuthContext.tsx';
import type { TimeSlot } from '../../types/booking';
import TimeSlotPicker from './TimeSlotPicker';

interface BookingModalProps {
  roomId: number;
  pricePerHour: number;
  roomName: string;
  studioName: string;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  roomId,
  pricePerHour,
  roomName,
  studioName,
  onClose,
}) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<{ start: number | null; end: number | null }>({
    start: null,
    end: null,
  });

  // Format date to YYYY-MM-DD for API
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  // Fetch available time slots for the selected date
  const {
    data: timeSlots = [],
    isLoading,
    error,
  } = useQuery<TimeSlot[]>({
    queryKey: ['room-availability', roomId, formattedDate],
    queryFn: () => getRoomAvailability(roomId, formattedDate),
    enabled: !!roomId,
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async () => {
      if (!timeRange.start || !timeRange.end) {
        throw new Error('Please select a time range');
      }
      
      if (!token) {
        throw new Error('You must be logged in to book a room');
      }

      const startTime = new Date(selectedDate);
      startTime.setHours(timeRange.start, 0, 0, 0);
      
      const endTime = new Date(selectedDate);
      endTime.setHours(timeRange.end, 0, 0, 0);

      return createBooking(
        {
          room_id: roomId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
        },
        token
      );
    },
    onSuccess: () => {
      toast.success('Booking created successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create booking');
    },
  });

  const handleTimeSelect = (start: number, end: number) => {
    setTimeRange({ start, end });
  };

  const calculateTotalPrice = () => {
    if (!timeRange.start || !timeRange.end) return 0;
    return (timeRange.end - timeRange.start) * pricePerHour;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBookingMutation.mutate();
  };

  // Generate an array of available dates (next 30 days)
  const availableDates = Array.from({ length: 30 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Book {roomName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">{studioName}</p>
          <p className="text-lg font-semibold">${pricePerHour} / hour</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableDates.map((date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const isSelected = format(selectedDate, 'yyyy-MM-dd') === dateStr;
                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`p-2 rounded border ${
                      isSelected
                        ? 'bg-blue-500 text-white border-blue-600'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="text-sm font-medium">{format(date, 'EEE')}</div>
                    <div className="text-sm">{format(date, 'MMM d')}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Time Slots
            </label>
            {isLoading ? (
              <div className="text-center py-4">Loading available slots...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">
                Error loading availability. Please try again.
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No available time slots for this date. Please select another date.
              </div>
            ) : (
              <TimeSlotPicker
                slots={timeSlots}
                onSelect={handleTimeSelect}
                className="mb-4"
              />
            )}
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold">${calculateTotalPrice()}</p>
              {timeRange.start !== null && timeRange.end !== null && (
                <p className="text-sm text-gray-600">
                  {timeRange.start}:00 - {timeRange.end}:00 ({timeRange.end - timeRange.start} hours)
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!timeRange.start || !timeRange.end || createBookingMutation.isPending}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                !timeRange.start || !timeRange.end || createBookingMutation.isPending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {createBookingMutation.isPending ? 'Booking...' : 'Book Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;