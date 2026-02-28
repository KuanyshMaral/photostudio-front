import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAvailability } from '../api/availabilityApi';
import DatePicker from 'react-datepicker';
import { useAuth } from '../context/AuthContext';

interface Props {
  roomId: number;
  pricePerHour: number;
  onSlotSelect: (date: Date, start: string, end: string) => void;
}

export default function AvailabilityCalendar({ roomId, pricePerHour, onSlotSelect }: Props) {
  const { token } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDateKey = formatLocalDate(selectedDate);

  const { data, isLoading, error } = useQuery({
    queryKey: ['availability', roomId, selectedDateKey],
    queryFn: () => getAvailability(roomId, selectedDate, token || undefined),
    enabled: !!token,
  });

  const normalizedAvailableSlots = normalizeAvailableSlots(data?.available_slots);
  const normalizedBookedSlots = normalizeBookedSlots(data?.booked_slots);

  // Use backend slots if present, otherwise fallback to default working window
  const allSlots = normalizedAvailableSlots.length > 0
    ? normalizedAvailableSlots.map((slot) => slot.time)
    : generateTimeSlots('10:00', '20:00', 60);

  console.log('Calendar state:', { data, isLoading, error, allSlots });

  // Определяем занятые слоты
  const isSlotBooked = (slot: string) => {
    return normalizedBookedSlots.includes(slot);
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

      {/* Error State */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-yellow-700 font-medium">
            Не удалось загрузить доступное время
          </div>
          <div className="text-yellow-600 text-sm mt-1">
            Показаны слоты с 10:00. Время работы студии: 10:00 - 20:00
          </div>
        </div>
      )}

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
                onSlotSelect(new Date(selectedDate), slot, end);
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

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toTimeLabel(value: unknown): string | null {
  if (typeof value !== 'string' || value.length === 0) {
    return null;
  }

  // Supports "HH:mm", "HH:mm:ss", and ISO strings
  const isoCandidate = new Date(value);
  if (!Number.isNaN(isoCandidate.getTime()) && value.includes('T')) {
    const hh = isoCandidate.getHours().toString().padStart(2, '0');
    const mm = isoCandidate.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }

  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) {
    return null;
  }

  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

function normalizeAvailableSlots(rawSlots: any): Array<{ time: string; available: boolean }> {
  if (!Array.isArray(rawSlots)) {
    return [];
  }

  const normalized = rawSlots
    .map((slot) => {
      if (typeof slot === 'string') {
        const time = toTimeLabel(slot);
        return time ? { time, available: true } : null;
      }

      if (typeof slot === 'object' && slot !== null) {
        if (typeof slot.hour === 'number') {
          const time = `${slot.hour.toString().padStart(2, '0')}:00`;
          return { time, available: slot.available !== false };
        }

        const time = toTimeLabel(slot.start) || toTimeLabel(slot.time);
        if (!time) {
          return null;
        }

        const available = slot.available ?? slot.is_available;
        return { time, available: available !== false };
      }

      return null;
    })
    .filter((slot): slot is { time: string; available: boolean } => Boolean(slot));

  return Array.from(new Map(normalized.map((slot) => [slot.time, slot])).values());
}

function normalizeBookedSlots(rawSlots: any): string[] {
  if (!Array.isArray(rawSlots)) {
    return [];
  }

  const times = rawSlots
    .map((slot) => {
      if (typeof slot === 'string') {
        return toTimeLabel(slot);
      }

      if (typeof slot === 'object' && slot !== null) {
        return toTimeLabel(slot.start) || toTimeLabel(slot.time);
      }

      return null;
    })
    .filter((time): time is string => Boolean(time));

  return Array.from(new Set(times));
}
