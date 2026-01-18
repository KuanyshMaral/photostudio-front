import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAvailability } from '../api/availabilityApi';
import DatePicker from 'react-datepicker';

interface Props {
  roomId: number;
  pricePerHour: number;
  onSlotSelect: (start: string, end: string) => void;
}

export default function AvailabilityCalendar({ roomId, pricePerHour, onSlotSelect }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data, isLoading } = useQuery({
    queryKey: ['availability', roomId, selectedDate.toISOString().split('T')[0]],
    queryFn: () => getAvailability(roomId, selectedDate),
  });

  // Генерируем слоты (09:00 - 22:00)
  const allSlots = generateTimeSlots('09:00', '22:00', 60); // каждый час

  // Определяем занятые слоты
  const isSlotBooked = (slot: string) => {
    return data?.booked_slots?.some(
      (booked: { start: string }) => booked.start === slot
    );
  };

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
              disabled={isSlotBooked(slot)}
              onClick={() => {
                const end = addHour(slot);
                onSlotSelect(slot, end);
              }}
              className={`
                p-3 rounded-lg text-center font-medium transition
                ${isSlotBooked(slot)
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
