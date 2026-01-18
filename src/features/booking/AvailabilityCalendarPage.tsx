import { useParams } from 'react-router-dom';
import AvailabilityCalendar from './AvailabilityCalendar';

export default function AvailabilityCalendarPage() {
  const { roomId } = useParams<{ roomId: string }>();
  
  if (!roomId) {
    return <div>Room ID required</div>;
  }

  return (
    <div className="p-8">
      <AvailabilityCalendar roomId={roomId} selectedDate={new Date()} />
    </div>
  );
}
