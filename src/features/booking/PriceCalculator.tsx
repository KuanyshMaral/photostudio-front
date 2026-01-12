import React from 'react';
import { Clock, DollarSign } from 'lucide-react';
import type { Room } from '../../types/index';

interface PriceCalculatorProps {
  room: Room;
  startTime: Date | null;
  endTime: Date | null;
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ 
  room, 
  startTime, 
  endTime 
}) => {
  const calculateDuration = () => {
    if (!startTime || !endTime) return 0;
    
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // Round up to the nearest hour (or partial hour)
    return Math.max(0, diffHours);
  };

  const calculatePrice = () => {
    const duration = calculateDuration();
    if (duration === 0) return 0;
    
    // Use minimum price per hour, could be enhanced to use max price for longer bookings
    const hourlyRate = room.price_per_hour_min;
    return Math.ceil(duration * hourlyRate);
  };

  const duration = calculateDuration();
  const totalPrice = calculatePrice();

  const formatDuration = () => {
    if (duration === 0) return '0 часов';
    if (duration < 1) return `${Math.round(duration * 60)} минут`;
    if (duration === 1) return '1 час';
    if (duration < 24) return `${Math.ceil(duration)} часов`;
    
    const days = Math.floor(duration / 24);
    const hours = Math.ceil(duration % 24);
    return `${days} ${days === 1 ? 'день' : 'дня'} ${hours > 0 ? `${hours} часов` : ''}`;
  };

  if (!startTime || !endTime) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center text-gray-500">
          <Clock className="w-5 h-5 mr-2" />
          <span>Выберите время для расчета стоимости</span>
        </div>
      </div>
    );
  }

  if (endTime <= startTime) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center text-red-600">
          <Clock className="w-5 h-5 mr-2" />
          <span>Время окончания должно быть позже начала</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-blue-700">
            <Clock className="w-5 h-5 mr-2" />
            <span className="font-medium">Длительность:</span>
          </div>
          <span className="font-semibold text-blue-900">{formatDuration()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-blue-700">
            <DollarSign className="w-5 h-5 mr-2" />
            <span className="font-medium">Ставка:</span>
          </div>
          <span className="font-semibold text-blue-900">
            {room.price_per_hour_min.toLocaleString()} ₸/час
          </span>
        </div>
        
        <div className="border-t border-blue-200 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-900">Итого:</span>
            <span className="text-2xl font-bold text-blue-900">
              {totalPrice.toLocaleString()} ₸
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
