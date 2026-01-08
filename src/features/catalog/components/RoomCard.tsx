import React, { useState } from 'react';
import type { Room } from '../../../types/index';
import BookingModal from '../../booking/BookingModal';

interface RoomCardProps {
    room: Room;
    studioId: number;
    studioName: string;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, studioName }) => {
    const [showBooking, setShowBooking] = useState(false);

    return (
        <div className="room-card border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
            <p className="text-gray-600 mb-2">{room.description}</p>
            <div className="text-sm text-gray-500 space-y-1 mb-4">
                <p>Площадь: {room.area_sqm} м²</p>
                <p>Вместимость: {room.capacity} человек</p>
                <p className="font-medium text-black">Цена: от {room.price_per_hour_min} ₸/час</p>
            </div>

            <button 
                onClick={() => setShowBooking(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
                Забронировать
            </button>

            {showBooking && (
                <BookingModal
                    roomId={room.id}
                    roomName={room.name}
                    studioName={studioName}
                    pricePerHour={room.price_per_hour_min}
                    onClose={() => setShowBooking(false)}
                />
            )}
        </div>
    );
};