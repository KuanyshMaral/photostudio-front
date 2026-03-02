import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import type { EventClickArg, DateSelectArg } from '@fullcalendar/core';
import { useAuth } from '../../context/AuthContext';
import { ManagerBookingModal } from './ManagerBookingModal';
import { CreateBookingModal } from './CreateBookingModal';
import './ManagerCalendar.css';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    bookingId: number;
    clientName: string;
    clientPhone: string;
    roomName: string;
    studioName: string;
    status: string;
    totalPrice: number;
    depositAmount: number;
  };
}

interface ManagerCalendarProps {
  // No props needed for manager endpoint
}

/**
 * ManagerCalendar — календарь бронирований для менеджера.
 * 
 * Фичи:
 * - Три вида: месяц, неделя, день
 * - Цветовая кодировка по статусу
 * - Клик по бронированию → модалка с деталями
 * - Drag & drop для переноса (если нужно)
 * - Выделение временного диапазона → создание бронирования
 */
export const ManagerCalendar: React.FC<ManagerCalendarProps> = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{start: Date, end: Date} | null>(null);
  const [dateRange, setDateRange] = useState<{start: string, end: string}>(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      start: startOfMonth.toISOString().split('T')[0],
      end: endOfMonth.toISOString().split('T')[0]
    };
  });
  const [error, setError] = useState<string | null>(null);

  // Загрузка бронирований
  const fetchBookings = useCallback(async () => {
    if (!dateRange.start || !dateRange.end) return;

    console.log('Fetching bookings for date range:', dateRange);
    setIsLoading(true);
    setError(null);
    
    try {
      // Используем manager эндпоинт с фильтрами по датам
      const params = new URLSearchParams();
      params.append('date_from', dateRange.start);
      params.append('date_to', dateRange.end);
      params.append('per_page', '200');
      
      const url = `${import.meta.env.VITE_API_URL || 'http://89.35.125.136:8090/api/v1'}/manager/bookings?${params.toString()}`;
      console.log('Request URL:', url);
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('Response status:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        const bookings = data.data?.bookings || [];
        console.log('Extracted bookings:', bookings);
        
        // Преобразуем в события FullCalendar
        const calendarEvents: CalendarEvent[] = bookings.map((booking: any) => ({
          id: String(booking.id),
          title: `${booking.room_name || `Комната ${booking.room_id}`} - ${booking.client_name || `Клиент ${booking.client_id}`}`,
          start: booking.start_time,
          end: booking.end_time,
          ...getEventColors(booking.status),
          extendedProps: {
            bookingId: booking.id,
            clientName: booking.client_name || `Клиент ${booking.client_id}`,
            clientPhone: booking.client_phone || '',
            roomName: booking.room_name || `Комната ${booking.room_id}`,
            studioName: booking.studio_name || `Студия ${booking.studio_id}`,
            status: booking.status,
            totalPrice: booking.total_price || 0,
            depositAmount: booking.deposit_amount || 0
          }
        }));

        setEvents(calendarEvents);
      } else {
        console.error('Failed to fetch studio bookings:', response.status, response.statusText);
        
        // Try to get more error details
        let errorMessage = `Failed to fetch bookings (${response.status})`;
        try {
          const errorData = await response.json();
          console.error('Error details:', errorData);
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
          }
        } catch (e) {
          // If we can't parse error response, use status text
        }
        
        setError(errorMessage);
        setEvents([]);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setEvents([]);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [token, dateRange]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Цвета по статусу
  const getEventColors = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          backgroundColor: '#FEF3C7',
          borderColor: '#F59E0B',
          textColor: '#92400E'
        };
      case 'confirmed':
        return {
          backgroundColor: '#D1FAE5',
          borderColor: '#10B981',
          textColor: '#065F46'
        };
      case 'completed':
        return {
          backgroundColor: '#DBEAFE',
          borderColor: '#3B82F6',
          textColor: '#1E3A8A'
        };
      case 'cancelled':
        return {
          backgroundColor: '#FEE2E2',
          borderColor: '#EF4444',
          textColor: '#991B1B'
        };
      default:
        return {
          backgroundColor: '#F3F4F6',
          borderColor: '#9CA3AF',
          textColor: '#374151'
        };
    }
  };

  // Обработчик клика по событию
  const handleEventClick = (info: EventClickArg) => {
    const bookingId = info.event.extendedProps.bookingId;
    setSelectedBooking(bookingId);
  };

  // Обработчик выделения диапазона (для создания)
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedRange({
      start: selectInfo.start,
      end: selectInfo.end
    });
    setShowCreateModal(true);
  };

  // Обработчик изменения вида/дат
  const handleDatesSet = (dateInfo: any) => {
    setDateRange({
      start: dateInfo.startStr.split('T')[0],
      end: dateInfo.endStr.split('T')[0]
    });
  };

  // Кастомный рендеринг события
  const renderEventContent = (eventInfo: any) => {
    const { extendedProps } = eventInfo.event;
    const isPaid = extendedProps.depositAmount >= extendedProps.totalPrice;

    return (
      <div className="manager-calendar__event">
        <div className="manager-calendar__event-time">
          {eventInfo.timeText}
        </div>
        <div className="manager-calendar__event-title">
          {extendedProps.roomName}
        </div>
        <div className="manager-calendar__event-client">
          {extendedProps.clientName}
        </div>
        {extendedProps.depositAmount > 0 && (
          <div className={`manager-calendar__event-deposit ${isPaid ? 'paid' : 'partial'}`}>
            {isPaid ? '✓ Оплачено' : `₸${extendedProps.depositAmount.toLocaleString()}`}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="manager-calendar">
      <div className="manager-calendar__header">
        <h1>Календарь бронирований</h1>
        <div className="manager-calendar__legend">
          <span className="legend-item legend-pending">Ожидает</span>
          <span className="legend-item legend-confirmed">Подтверждено</span>
          <span className="legend-item legend-completed">Завершено</span>
          <span className="legend-item legend-cancelled">Отменено</span>
        </div>
      </div>

      {error && (
        <div className="manager-calendar__error">
          <div className="error-message">
            <strong>Ошибка загрузки бронирований:</strong> {error}
          </div>
          <button 
            className="retry-button" 
            onClick={() => {
              setError(null);
              fetchBookings();
            }}
          >
            Попробовать снова
          </button>
        </div>
      )}

      <div className="manager-calendar__container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          locale="ru"
          firstDay={1} // Понедельник
          slotMinTime="08:00:00"
          slotMaxTime="22:00:00"
          slotDuration="00:30:00"
          allDaySlot={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          eventClick={handleEventClick}
          select={handleDateSelect}
          datesSet={handleDatesSet}
          eventContent={renderEventContent}
          loading={(loading) => setIsLoading(loading)}
          height="auto"
          stickyHeaderDates={true}
          nowIndicator={true}
          buttonText={{
            today: 'Сегодня',
            month: 'Месяц',
            week: 'Неделя',
            day: 'День',
            list: 'Список'
          }}
        />
      </div>

      {isLoading && (
        <div className="manager-calendar__loading">
          <div className="manager-calendar__spinner" />
        </div>
      )}

      {/* Модалка деталей бронирования */}
      {selectedBooking && (
        <ManagerBookingModal
          bookingId={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={fetchBookings}
        />
      )}

      {/* Модалка создания бронирования */}
      {showCreateModal && selectedRange && (
        <CreateBookingModal
          startTime={selectedRange.start}
          endTime={selectedRange.end}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedRange(null);
          }}
          onCreate={fetchBookings}
        />
      )}
    </div>
  );
};

export default ManagerCalendar;
