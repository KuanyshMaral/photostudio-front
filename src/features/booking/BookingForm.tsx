import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createBooking } from "../../api/bookingApi";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import type { BookingData } from "../../api/bookingApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import PriceCalculator from "./PriceCalculator";
import type { Studio, Room } from "../../types/index";
import { getProfile } from "../auth/auth.api";

const BookingForm: React.FC = () => {
  const { token, user, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get pre-selected studio and rooms from navigation state
  const [studio, setStudio] = useState<Studio | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  // Fetch user data if not available but token exists
  useEffect(() => {
    const fetchUserData = async () => {
      if (token && !user) {
        setIsLoadingUser(true);
        try {
          const userProfile = await getProfile(token);
          login(token, userProfile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          toast.error("Failed to load user information. Please login again.");
          navigate("/login");
        } finally {
          setIsLoadingUser(false);
        }
      }
    };

    fetchUserData();
  }, [token, user, login, navigate, toast]);

  useEffect(() => {
    if (location.state?.studio && location.state?.rooms) {
      setStudio(location.state.studio);
      setRooms(location.state.rooms);
    } else {
      // If no studio/rooms data, redirect back to studios
      toast.error("Please select a studio first");
      navigate("/studios");
    }
  }, [location.state, navigate, toast]);

  const validateForm = (): string[] => {
    const newErrors: string[] = [];
    
    if (!selectedRoom) {
      newErrors.push("Room information is missing");
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
    
    if (!token) {
      toast.error("Please login to book a room");
      return;
    }
    
    if (!user) {
      toast.error("User information not available. Please login again.");
      return;
    }
    
    const formErrors = validateForm();
    setErrors(formErrors);
    
    if (formErrors.length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    setMessage("");
    
    const data: BookingData = { 
      room_id: selectedRoom!.id.toString(), 
      studio_id: studio!.id,
      user_id: user.id,
      start_time: startTime!.toISOString(), 
      end_time: endTime!.toISOString() 
    };

    try {
      const result = await createBooking(data, token);
      toast.success(`Booking created! ID: ${result.id}`);
      setMessage(`Booking created! ID: ${result.id}`);
      // Reset form on success
      setStartTime(null);
      setEndTime(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create booking";
      toast.error(errorMessage);
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while fetching user data
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading user information..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Book a Room</h2>
            <p className="text-blue-100 mt-1">Schedule your photoshoot session</p>
          </div>
          
          {/* Studio Info */}
          {studio && (
            <div className="px-8 py-6 bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{studio.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{studio.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} available
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Room Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Room
                </label>
                <select
                  value={selectedRoom?.id || ''}
                  onChange={(e) => {
                    const room = rooms.find(r => r.id === Number(e.target.value));
                    setSelectedRoom(room || null);
                  }}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Choose a room...</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.name} - {room.price_per_hour_min.toLocaleString()} ₸/час
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Room Details */}
              {selectedRoom && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-blue-900">{selectedRoom.name}</h4>
                    <p className="text-blue-600 font-bold">
                      {selectedRoom.price_per_hour_min.toLocaleString()} ₸/час
                    </p>
                  </div>
                  {selectedRoom.description && (
                    <p className="text-sm text-blue-700 mb-2">{selectedRoom.description}</p>
                  )}
                  <div className="flex gap-4 text-sm text-blue-600">
                    <span>{selectedRoom.area_sqm} м²</span>
                    <span>до {selectedRoom.capacity} чел</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                      {selectedRoom.room_type}
                    </span>
                  </div>
                </div>
              )}
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

              {/* Price Calculator */}
              {selectedRoom && (
                <PriceCalculator 
                  room={selectedRoom} 
                  startTime={startTime} 
                  endTime={endTime} 
                />
              )}
              
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
