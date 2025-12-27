import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createBooking } from "../../api/bookingApi";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import type { BookingData } from "../../api/bookingApi"; // только тип

const BookingForm: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): string[] => {
    const newErrors: string[] = [];
    
    if (!roomId.trim()) {
      newErrors.push("Room ID is required");
    }
    
    if (!startTime) {
      newErrors.push("Start time is required");
    }
    
    if (!endTime) {
      newErrors.push("End time is required");
    }
    
    if (startTime && endTime && endTime <= startTime) {
      newErrors.push("End time must be after start time");
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    setErrors(formErrors);
    
    if (formErrors.length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    setMessage("");
    
    const data: BookingData = { 
      room_id: roomId, 
      start_time: startTime!.toISOString(), 
      end_time: endTime!.toISOString() 
    };

    try {
      const result = await createBooking(data);
      setMessage(`Booking created! ID: ${result.booking.id}, Status: ${result.booking.status}`);
      // Reset form on success
      setRoomId("");
      setStartTime(null);
      setEndTime(null);
    } catch (error) {
      setMessage("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Book a Room</h2>
            <p className="text-blue-100 mt-1">Schedule your meeting space</p>
          </div>
          
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room ID
                </label>
                <input
                  type="text"
                  placeholder="Enter room identifier"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Time
                </label>
                <DatePicker
                  selected={startTime}
                  onChange={setStartTime}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholderText="Select start time"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Time
                </label>
                <DatePicker
                  selected={endTime}
                  onChange={setEndTime}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholderText="Select end time"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" color="white" text="Booking..." />
                ) : (
                  "Book Room"
                )}
              </button>
            </form>
            
            {errors.length > 0 && (
              <ErrorMessage 
                message={errors.join('. ')} 
                onDismiss={() => setErrors([])}
                type="error"
              />
            )}
            
            {message && (
              <div className={`mt-4 p-4 rounded-lg border ${
                message.includes('created') 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
