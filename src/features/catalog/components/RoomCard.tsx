import React, { useState } from 'react';
import type { Room } from '../../../types/index';

interface RoomCardProps {
    room: Room;
    studioId: number;
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
                    pricePerHour={room.price_per_hour_min}
                    onClose={() => setShowBooking(false)}
                />
            )}
        </div>
    );
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
