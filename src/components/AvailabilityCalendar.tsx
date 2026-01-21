import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAvailability } from '../api/availabilityApi';
import DatePicker from 'react-datepicker';
<<<<<<< HEAD
=======
import { useAuth } from '../context/AuthContext';
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f

interface Props {
  roomId: number;
  pricePerHour: number;
  onSlotSelect: (start: string, end: string) => void;
}

export default function AvailabilityCalendar({ roomId, pricePerHour, onSlotSelect }: Props) {
<<<<<<< HEAD
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data, isLoading } = useQuery({
    queryKey: ['availability', roomId, selectedDate.toISOString().split('T')[0]],
    queryFn: () => getAvailability(roomId, selectedDate),
  });

  // Генерируем слоты (09:00 - 22:00)
  const allSlots = generateTimeSlots('09:00', '22:00', 60); // каждый час
=======
  const { token } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data, isLoading, error } = useQuery({
    queryKey: ['availability', roomId, selectedDate.toISOString().split('T')[0]],
    queryFn: () => getAvailability(roomId, selectedDate, token || undefined),
    enabled: !!token,
  });

  // Use backend's available slots, but fallback to slots from 12:00 onwards if API fails
  const allSlots = data?.available_slots?.map(slot => `${slot.hour.toString().padStart(2, '0')}:00`) || generateTimeSlots('12:00', '22:00', 60);

  console.log('Calendar state:', { data, isLoading, error, allSlots });
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f

  // Определяем занятые слоты
  const isSlotBooked = (slot: string) => {
    return data?.booked_slots?.some(
      (booked: { start: string }) => booked.start === slot
    );
  };
<<<<<<< HEAD
=======
  
  // Check if slot is actually available from backend (only if data exists)
  const isSlotAvailable = (slot: string) => {
    // If no data from backend, assume all slots are available
    if (!data || !data.available_slots) return true;
    
    const hour = parseInt(slot.split(':')[0]);
    return data?.available_slots?.some(availableSlot => availableSlot.hour === hour && availableSlot.available) || false;
  };
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold text-lg mb-4">Выберите дату и время</h3>

      {/* Date Picker */}
      <div className="mb-6">
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => date && setSelectedDate(date)}
          minDate={new Date()}
          className="w-full p-3 border rounded-lg"
          dateFormat="dd.MM.yyyy"
        />
      </div>

<<<<<<< HEAD
=======
      {/* Error State */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-yellow-700 font-medium">
            Не удалось загрузить доступное время
          </div>
          <div className="text-yellow-600 text-sm mt-1">
            Показаны слоты с 12:00. Время работы студии: 12:00 - 22:00
          </div>
        </div>
      )}

>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f
      {/* Time Slots */}
      {isLoading ? (
        <div className="animate-pulse space-y-2">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {allSlots.map(slot => (
            <button
              key={slot}
<<<<<<< HEAD
              disabled={isSlotBooked(slot)}
=======
              disabled={isSlotBooked(slot) || !isSlotAvailable(slot)}
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f
              onClick={() => {
                const end = addHour(slot);
                onSlotSelect(slot, end);
              }}
              className={`
                p-3 rounded-lg text-center font-medium transition
<<<<<<< HEAD
                ${isSlotBooked(slot)
=======
                ${isSlotBooked(slot) || !isSlotAvailable(slot)
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f
                  ? 'bg-red-100 text-red-400 cursor-not-allowed'
                  : 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer'
                }
              `}
            >
              {slot}
              {!isSlotBooked(slot) && (
                <span className="block text-xs text-gray-500">
                  {pricePerHour.toLocaleString()} ₸
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-100 rounded" />
          Свободно
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-100 rounded" />
          Занято
        </div>
      </div>
    </div>
  );
}

// Helpers
function generateTimeSlots(start: string, end: string, intervalMinutes: number): string[] {
  const slots = [];
  let current = parseTime(start);
  const endTime = parseTime(end);
  
  while (current < endTime) {
    slots.push(formatTime(current));
    current += intervalMinutes;
  }
  
  return slots;
}

function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function addHour(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + 60;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}
