import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "@tanstack/react-query";
import { getRoomAvailability } from "../../api/availabilityApi";
import { createBooking } from "../../api/bookingApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import type { TimeSlot } from "../../api/availabilityApi";

// Inline TimeSlotPicker component to resolve import issues
interface TimeSlotPickerProps {
    slots: TimeSlot[];
    onSelect: (startHour: number, endHour: number) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ slots, onSelect }) => {
    const [startHour, setStartHour] = useState<number | null>(null);
    const [endHour, setEndHour] = useState<number | null>(null);
    
    const handleSlotClick = (hour: number, available: boolean) => {
        console.log('Slot clicked:', { hour, available });
        
        if (!available) {
            console.log('Slot not available, ignoring');
            return;
        }
        
        if (!startHour) {
            setStartHour(hour);
            setEndHour(null);
            console.log('Set start hour:', hour);
        } else if (!endHour && hour > startHour) {
            setEndHour(hour);
            console.log('Set end hour:', hour, 'Range:', startHour, '-', hour);
            onSelect(startHour, hour);
        } else {
            console.log('Resetting selection, new start hour:', hour);
            setStartHour(hour);
            setEndHour(null);
        }
    };
    
    const isInRange = (hour: number): boolean => {
        if (!startHour || !endHour) return false;
        return hour > startHour && hour < endHour;
    };
    
    const formatHour = (hour: number): string => {
        return `${hour.toString().padStart(2, '0')}:00`;
    };
    
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
                {slots.map(slot => (
                    <button
                        key={slot.hour}
                        data-testid="time-slot"
                        className={`
                            relative p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium
                            ${slot.available 
                                ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer' 
                                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                            }
                            ${startHour === slot.hour 
                                ? 'border-blue-500 bg-blue-100 text-blue-700' 
                                : ''
                            }
                            ${endHour === slot.hour 
                                ? 'border-blue-500 bg-blue-100 text-blue-700' 
                                : ''
                            }
                            ${isInRange(slot.hour) 
                                ? 'border-blue-300 bg-blue-50' 
                                : ''
                            }
                        `}
                        onClick={() => handleSlotClick(slot.hour, slot.available)}
                        disabled={!slot.available}
                        title={slot.available ? formatHour(slot.hour) : 'Занято'}
                    >
                        <div className="text-center">
                            <div className="font-semibold">
                                {formatHour(slot.hour)}
                            </div>
                            {slot.booking && (
                                <div className="text-xs text-red-600 mt-1">
                                    Занято
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded mr-2"></div>
                        <span>Выбрано</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-50 border-2 border-blue-300 rounded mr-2"></div>
                        <span>В диапазоне</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-50 border-2 border-gray-200 rounded opacity-50 mr-2"></div>
                        <span>Недоступно</span>
                    </div>
                </div>
                
                {startHour && !endHour && (
                    <div className="text-blue-600 font-medium">
                        Выбрано начало: {formatHour(startHour)}
                    </div>
                )}
                
                {startHour && endHour && (
                    <div className="text-green-600 font-medium">
                        {formatHour(startHour)} - {formatHour(endHour)}
                    </div>
                )}
            </div>
        </div>
    );
};

interface BookingModalProps {
    roomId: number;
    studioId: number;
    pricePerHour: number;
    onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
    roomId, studioId, pricePerHour, onClose
}) => {
    const { token, user } = useAuth();
    const [date, setDate] = useState<Date>(new Date());
    const [startHour, setStartHour] = useState<number | null>(null);
    const [endHour, setEndHour] = useState<number | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    
    const { data: slots, isLoading, error } = useQuery({
        queryKey: ['availability', roomId, date.toISOString().split('T')[0]],
        queryFn: () => getRoomAvailability(roomId, date.toISOString().split('T')[0], token || undefined),
        enabled: !!roomId && !!token,
    });
    
    // Debug logging
    useEffect(() => {
        if (slots) {
            console.log('Available slots loaded:', slots);
            console.log('Available slots (available_slots):', slots.available_slots);
            console.log('Booked slots:', slots.booked_slots);
        }
    }, [slots]);
    
    useEffect(() => {
        if (error) {
            console.log('Error loading slots:', error);
        }
    }, [error]);
    
    const handleBook = async () => {
        if (!startHour || !endHour || !token || !user) return;
        
        setIsBooking(true);
        
        // Create date at midnight to avoid timezone issues
        const startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        startTime.setHours(startHour, 0, 0, 0);
        
        const endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        endTime.setHours(endHour, 0, 0, 0);
        
        // Adjust for timezone to preserve local hours in ISO string
        const adjustForTimezone = (date: Date) => {
            const localOffset = date.getTimezoneOffset() * 60000;
            return new Date(date.getTime() - localOffset).toISOString();
        };
        
        const startDateTime = adjustForTimezone(startTime);
        const endDateTime = adjustForTimezone(endTime);
        
        console.log('Booking times:', {
            startDateTime,
            endDateTime,
            startHour,
            endHour
        });
        
        try {
            await createBooking({
                room_id: String(roomId),
                studio_id: studioId,
                user_id: user.id,
                start_time: startDateTime,
                end_time: endDateTime,
            }, token);
            
            toast.success('Бронирование создано!');
            onClose();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
            toast.error(errorMessage);
        } finally {
            setIsBooking(false);
        }
    };
    
    const handleSlotSelect = (start: number, end: number) => {
        setStartHour(start);
        setEndHour(end);
    };
    
    const hours = endHour && startHour ? endHour - startHour : 0;
    const totalPrice = hours * pricePerHour;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-testid="booking-modal">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Бронирование</h2>
                            <p className="text-blue-100 mt-1">Комната #{roomId} • Студия #{studioId}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-blue-200 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Дата бронирования
                        </label>
                        <DatePicker
                            selected={date}
                            onChange={(date: Date | null) => date && setDate(date)}
                            minDate={new Date()}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            data-testid="date-picker"
                        />
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Выберите время</h3>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-600">Загрузка слотов...</span>
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 font-medium">Не удалось загрузить доступное время</p>
                                <p className="text-red-600 text-sm mt-1">Пожалуйста, попробуйте позже или свяжитесь с поддержкой</p>
                            </div>
                        ) : (
                            <TimeSlotPicker 
                                slots={slots?.available_slots || []} 
                                onSelect={handleSlotSelect}
                            />
                        )}
                    </div>
                    
                    {hours > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">
                                    {hours} ч × {pricePerHour} ₸
                                </span>
                                <span className="text-2xl font-bold text-gray-900" data-testid="total-price">
                                    {totalPrice} ₸
                                </span>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleBook}
                            disabled={!startHour || !endHour || !token || isBooking}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isBooking ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Бронирование...
                                </div>
                            ) : (
                                'Забронировать'
                            )}
                        </button>
                    </div>
                    
                    {!token && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg" data-testid="auth-error">
                            <p className="text-yellow-700 text-sm">
                                Пожалуйста, войдите в систему для бронирования
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
