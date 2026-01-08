import React, { useState, useEffect } from 'react';
import type { TimeSlot as TimeSlotType } from '../../types/booking';

interface TimeSlotPickerProps {
  slots: TimeSlotType[];
  onSelect: (start: number, end: number) => void;
  className?: string;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ 
  slots, 
  onSelect,
  className = ''
}) => {
  const [selection, setSelection] = useState<{
    start: number | null;
    end: number | null;
  }>({ start: null, end: null });

  // Reset selection when slots change
  useEffect(() => {
    setSelection({ start: null, end: null });
  }, [slots]);

  const handleSlotClick = (hour: number, available: boolean) => {
    if (!available) return;

    const { start, end } = selection;

    // If no start time selected or both start and end are selected, set new start
    if (start === null || (start !== null && end !== null)) {
      setSelection({ start: hour, end: null });
    } 
    // If start is selected but end is not
    else if (start !== null && end === null) {
      // If clicked time is before start, set it as new start
      if (hour < start) {
        setSelection({ start: hour, end: null });
      } 
      // If clicked time is after start, set it as end
      else if (hour > start) {
        const newEnd = hour;
        setSelection({ start, end: newEnd });
        onSelect(start, newEnd);
      }
      // If same hour is clicked again, clear selection
      else {
        setSelection({ start: null, end: null });
      }
    }
  };

  const isSlotInSelection = (hour: number) => {
    const { start, end } = selection;
    if (start === null || end === null) return false;
    return hour >= start && hour <= end;
  };

  const isStartSlot = (hour: number) => hour === selection.start;
  const isEndSlot = (hour: number) => hour === selection.end;

  return (
    <div className={`grid grid-cols-4 gap-2 ${className}`}>
      {slots.map((slot) => {
        const isSelected = isSlotInSelection(slot.hour);
        const isStart = isStartSlot(slot.hour);
        const isEnd = isEndSlot(slot.hour);
        
        let className = 'p-2 text-center rounded border cursor-pointer transition-colors ';
        
        if (!slot.available) {
          className += 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200';
        } else if (isStart) {
          className += 'bg-blue-500 text-white border-blue-600 rounded-r-none';
        } else if (isEnd) {
          className += 'bg-blue-500 text-white border-blue-600 rounded-l-none';
        } else if (isSelected) {
          className += 'bg-blue-300 text-white border-blue-400 rounded-none';
        } else {
          className += 'bg-white hover:bg-blue-50 border-gray-200';
        }

        return (
          <div
            key={slot.hour}
            className={className}
            onClick={() => handleSlotClick(slot.hour, slot.available)}
          >
            {`${slot.hour}:00`}
          </div>
        );
      })}
    </div>
  );
};

export default TimeSlotPicker;
