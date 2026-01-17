import { useState } from 'react';
import toast from 'react-hot-toast';
import { createBooking } from '../../api/bookingApi';

interface Props {
  roomId: number;
  roomName: string;
  studioName: string;
  date: Date;
  startTime: string;
  endTime: string;
  pricePerHour: number;
  onSuccess: () => void;
  onCancel: () => void;
}

// Helpers
function calculateHours(start: string, end: string): number {
  const [h1, m1] = start.split(':').map(Number);
  const [h2, m2] = end.split(':').map(Number);
  return (h2 * 60 + m2 - (h1 * 60 + m1)) / 60;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU');
}

function combineDateAndTime(date: Date, time: string): string {
  const dateStr = date.toISOString().split('T')[0];
  return `${dateStr}T${time}:00`;
}

export default function BookingForm({
  roomId, roomName, studioName, date,
  startTime, endTime, pricePerHour,
  onSuccess, onCancel
}: Props) {
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const hours = calculateHours(startTime, endTime);
  const totalPrice = hours * pricePerHour;

  const handleSubmit = async () => { // Removed e.preventDefault as strictly speaking button type="submit" inside form is better, but here simple onClick
    setIsLoading(true);

    try {
      await createBooking({
        room_id: roomId,
        start_time: combineDateAndTime(date, startTime),
        end_time: combineDateAndTime(date, endTime),
        comment
      });

      toast.success('Бронирование создано!');
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Ошибка бронирования';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Подтверждение бронирования</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-500">Студия</span>
          <span className="font-medium">{studioName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Зал</span>
          <span className="font-medium">{roomName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Дата</span>
          <span className="font-medium">{formatDate(date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Время</span>
          <span className="font-medium">{startTime} — {endTime}</span>
        </div>
        <hr />
        <div className="flex justify-between">
          <span className="text-gray-500">Длительность</span>
          <span className="font-medium">{hours} ч.</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Итого</span>
          <span className="text-blue-600">{totalPrice.toLocaleString()} ₸</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Комментарий (опционально)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Особые пожелания..."
          className="w-full p-3 border rounded-lg resize-none h-24"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Отмена
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Создание...' : 'Забронировать'}
        </button>
      </div>
    </div>
  );
}