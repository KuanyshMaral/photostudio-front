import React, { useState } from 'react';
import type { Room } from '../../../types/index';
<<<<<<< HEAD
import BookingModal from '../../booking/BookingModal';
=======
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410

interface RoomCardProps {
    room: Room;
    studioId: number;
<<<<<<< HEAD
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
=======
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, studioId }) => {
    const [showBooking, setShowBooking] = useState(false);
    
    return (
        <div className="room-card">
            <h3>{room.name}</h3>
            <p>{room.description}</p>
            <p>Площадь: {room.area_sqm} м²</p>
            <p>Вместимость: {room.capacity} человек</p>
            <p>Цена: от {room.price_per_hour_min} ₸/час</p>
            
            <button onClick={() => setShowBooking(true)}>
                Забронировать
            </button>
            
            {showBooking && (
                <BookingModal 
                    roomId={room.id}
                    studioId={studioId}
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
                    pricePerHour={room.price_per_hour_min}
                    onClose={() => setShowBooking(false)}
                />
            )}
        </div>
    );
<<<<<<< HEAD
};
=======
};

interface BookingModalProps {
    roomId: number;
    studioId: number;
    pricePerHour: number;
    onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ 
    roomId, 
    studioId, 
    pricePerHour, 
    onClose 
}) => {
    return (
        <div className="booking-modal">
            <div className="modal-content">
                <h3>Бронирование комнаты</h3>
                <p>Комната ID: {roomId}</p>
                <p>Студия ID: {studioId}</p>
                <p>Цена: {pricePerHour} ₸/час</p>
                
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
