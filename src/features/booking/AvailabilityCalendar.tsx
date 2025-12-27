import React, { useState, useEffect } from "react";

interface TimeSlot {
  hour: number;
  available: boolean;
  booking?: {
    id: number;
    start_time: string;
    end_time: string;
  };
}

interface AvailabilityCalendarProps {
  roomId: string;
  selectedDate: Date;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ roomId, selectedDate }) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;
    
    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Mock API call - replace with actual API when backend is ready
        // const response = await axios.get(`/rooms/${roomId}/availability?date=${selectedDate.toISOString()}`);
        
        // Mock data for demonstration
        const mockSlots: TimeSlot[] = Array.from({ length: 24 }, (_, hour) => ({
          hour,
          available: hour % 3 !== 0, // Every 3rd hour is booked
          booking: hour % 3 === 0 ? {
            id: Math.floor(Math.random() * 1000),
            start_time: `${hour.toString().padStart(2, '0')}:00`,
            end_time: `${(hour + 1).toString().padStart(2, '0')}:00`
          } : undefined
        }));
        
        setTimeSlots(mockSlots);
      } catch (err) {
        setError("Failed to fetch availability");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [roomId, selectedDate]);

  const formatHour = (hour: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading availability...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-red-700 font-semibold">{error}</div>
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
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
            <h3 className="text-2xl font-bold text-white">
              Room Availability
            </h3>
            <p className="text-purple-100 mt-1">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {timeSlots.map((slot) => (
                <div
                  key={slot.hour}
                  className={`relative group transition-all duration-200 transform hover:scale-105 ${
                    slot.available
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-300 hover:shadow-md cursor-pointer'
                      : 'bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 cursor-not-allowed opacity-75'
                  } rounded-lg p-3 text-center`}
                  title={slot.booking ? `Booked: ${slot.booking.start_time} - ${slot.booking.end_time}` : 'Available for booking'}
                >
                  <div className={`text-sm font-bold ${
                    slot.available ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {formatHour(slot.hour)}
                  </div>
                  {slot.booking && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      !
                    </div>
                  )}
                  <div className={`text-xs mt-1 ${
                    slot.available ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {slot.available ? 'Free' : 'Booked'}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="text-green-700 font-medium">Available</span>
              </div>
              <div className="flex items-center bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <span className="text-red-700 font-medium">Booked</span>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Click on available time slots to book them
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
