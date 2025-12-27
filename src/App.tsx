import React, { useState } from "react";
import BookingForm from "./features/booking/BookingForm";
import AvailabilityCalendar from "./features/booking/AvailabilityCalendar";
import MyBookings from "./features/booking/MyBookings..tsx";
import ReviewForm from "./features/booking/ReviewForm";
import ReviewList from "./features/booking/ReviewList";
import "./index.css";

function App() {
  const [currentView, setCurrentView] = useState<'form' | 'calendar' | 'mybookings' | 'review' | 'reviews'>('form');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PhotoStudio
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('form')}
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                  currentView === 'form'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Book Room
              </button>
              <button
                onClick={() => setCurrentView('calendar')}
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                  currentView === 'calendar'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                View Availability
              </button>
              <button
                onClick={() => setCurrentView('mybookings')}
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                  currentView === 'mybookings'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setCurrentView('review')}
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                  currentView === 'review'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Write Review
              </button>
              <button
                onClick={() => setCurrentView('reviews')}
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                  currentView === 'reviews'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                View Reviews
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        {currentView === 'form' ? (
          <BookingForm />
        ) : currentView === 'calendar' ? (
          <AvailabilityCalendar 
            roomId={selectedRoom || 'demo-room'} 
            selectedDate={selectedDate} 
          />
        ) : currentView === 'mybookings' ? (
          <MyBookings />
        ) : currentView === 'review' ? (
          <ReviewForm />
        ) : (
          <ReviewList roomId={selectedRoom || 'demo-room'} roomName="Demo Room" />
        )}
      </main>
    </div>
  );
}

export default App;
