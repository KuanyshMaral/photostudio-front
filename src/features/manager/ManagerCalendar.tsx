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
  studioId?: number;
  roomId?: number;
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
export const ManagerCalendar: React.FC<ManagerCalendarProps> = ({
  studioId,
  roomId
}) => {
  const { token } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{start: Date, end: Date} | null>(null);
  const [currentView, setCurrentView] = useState<string>('timeGridWeek');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: '',
    end: ''
  });

  // Загрузка бронирований
  const fetchBookings = useCallback(async () => {
    if (!dateRange.start || !dateRange.end) return;

    setIsLoading(true);
    try {
      // Пробуем сначала получить бронирования через manager API
      let url = `/api/v1/manager/bookings?date_from=${dateRange.start}&date_to=${dateRange.end}&per_page=200`;
      if (studioId) url += `&studio_id=${studioId}`;
      if (roomId) url += `&room_id=${roomId}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const bookings = data.data?.bookings || [];
        
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
        // Пробуем альтернативный эндпоинт
        let altUrl = `/api/v1/bookings?date_from=${dateRange.start}&date_to=${dateRange.end}&per_page=200`;
        if (studioId) altUrl += `&studio_id=${studioId}`;
        if (roomId) altUrl += `&room_id=${roomId}`;

        const altResponse = await fetch(altUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (altResponse.ok) {
          const data = await altResponse.json();
          const bookings = data.data?.bookings || [];
          
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
        }
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token, dateRange, studioId, roomId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Цвета по статусу
  const getEventColors = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          backgroundColor: '#fef3c7',
          borderColor: '#f59e0b',
          textColor: '#92400e'
        };
      case 'confirmed':
        return {
          backgroundColor: '#dbeafe',
          borderColor: '#3b82f6',
          textColor: '#1e40af'
        };
      case 'completed':
        return {
          backgroundColor: '#d1fae5',
          borderColor: '#10b981',
          textColor: '#065f46'
        };
      case 'cancelled':
        return {
          backgroundColor: '#fee2e2',
          borderColor: '#ef4444',
          textColor: '#991b1b'
        };
      default:
        return {
          backgroundColor: '#f3f4f6',
          borderColor: '#9ca3af',
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
    setCurrentView(dateInfo.view.type);
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
