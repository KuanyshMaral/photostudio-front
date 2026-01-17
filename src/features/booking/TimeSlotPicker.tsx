import React, { useState } from "react";
import type { TimeSlot } from "../../api/availabilityApi";

interface TimeSlotPickerProps {
    slots: TimeSlot[];
    onSelect: (startHour: number, endHour: number) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ slots, onSelect }) => {
    const [startHour, setStartHour] = useState<number | null>(null);
    const [endHour, setEndHour] = useState<number | null>(null);
    
    const handleSlotClick = (hour: number, available: boolean) => {
        if (!available) return;
        
        if (!startHour) {
            setStartHour(hour);
            setEndHour(null);
        } else if (!endHour && hour > startHour) {
            setEndHour(hour);
            onSelect(startHour, hour);
        } else {
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

export default TimeSlotPicker;
