import { useState } from 'react';
import { createBooking } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Props {
  roomId: number;
  roomName: string;
  studioName: string;
<<<<<<< HEAD
=======
  studioId: number;
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f
  date: Date;
  startTime: string;
  endTime: string;
  pricePerHour: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BookingForm({
<<<<<<< HEAD
  roomId, roomName, studioName, date, startTime, endTime, pricePerHour,
=======
  roomId, roomName, studioName, studioId, date, startTime, endTime, pricePerHour,
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f
  onSuccess, onCancel
}: Props) {
  const { token, user } = useAuth();
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Расчёт стоимости
  const hours = calculateHours(startTime, endTime);
  const totalPrice = hours * pricePerHour;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!token || !user) {
        toast.error('Требуется авторизация');
        return;
      }

<<<<<<< HEAD
      await createBooking({
        room_id: roomId.toString(),
        studio_id: 0, // Will be set by API based on room
        user_id: user.id,
        start_time: combineDateAndTime(date, startTime),
        end_time: combineDateAndTime(date, endTime),
        comment
      }, token);
=======
      const startDateTime = combineDateAndTime(date, startTime);
      const endDateTime = combineDateAndTime(date, endTime);
      
      console.log('BookingForm times:', {
        startDateTime,
        endDateTime,
        startTime,
        endTime,
        roomId,
        studioId,
        userId: user.id
      });

      const bookingData = {
        room_id: roomId.toString(),
        studio_id: studioId,
        user_id: user.id,
        start_time: startDateTime,
        end_time: endDateTime,
        comment
      };
      
      console.log('Sending booking request:', bookingData);

      await createBooking(bookingData, token);
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f

      toast.success('Бронирование создано!');
      onSuccess();
    } catch (error: any) {
<<<<<<< HEAD
=======
      console.log('Booking error details:', error);
      console.log('Error response:', error.response);
      console.log('Error data:', error.response?.data);
      
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f
      const message = error.response?.data?.error?.message || error.message || 'Ошибка бронирования';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Подтверждение бронирования</h2>

      {/* Details */}
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

      {/* Comment */}
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

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isLoading}
          onClick={handleSubmit}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     disabled:opacity-50"
        >
          {isLoading ? 'Создание...' : 'Забронировать'}
        </button>
      </div>
    </div>
  );
}

// Helper functions
function calculateHours(startTime: string, endTime: string): number {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return (endMinutes - startMinutes) / 60;
}

function combineDateAndTime(date: Date, time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
<<<<<<< HEAD
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined.toISOString();
=======
  // Create date at midnight local time
  const combined = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  combined.setHours(hours, minutes, 0, 0);
  
  // Return ISO string but preserve local hours by adjusting for timezone
  const localOffset = combined.getTimezoneOffset() * 60000; // offset in milliseconds
  const localTime = new Date(combined.getTime() - localOffset);
  return localTime.toISOString();
>>>>>>> 84f6a53614713bc954b547877d42a54b6bd4022f
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
