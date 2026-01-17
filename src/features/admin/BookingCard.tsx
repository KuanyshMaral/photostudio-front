import type { PendingBooking } from './admin.api';

interface Props {
    booking: PendingBooking;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
    actionLoading: number | null;
}

export default function BookingCard({ booking, onApprove, onReject, actionLoading }: Props) {
    return (
        <div className="pending-card booking-card">
            <div className="pending-info">
                <h3>{booking.studio_name} - {booking.room_name}</h3>
                <p><strong>Клиент:</strong> {booking.client_name} ({booking.client_email})</p>
                <p><strong>Дата:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Время:</strong> {booking.start_time} - {booking.end_time}</p>
                <p><strong>Стоимость:</strong> {booking.total_price} ₸</p>
                <p className="date">
                    Заявка от: {new Date(booking.created_at).toLocaleDateString()}
                </p>
            </div>
            <div className="pending-actions">
                <button
                    onClick={() => onApprove(booking.id)}
                    disabled={actionLoading === booking.id}
                    className="btn-approve"
                >
                    {actionLoading === booking.id ? '...' : 'Одобрить'}
                </button>
                <button
                    onClick={() => onReject(booking.id)}
                    disabled={actionLoading === booking.id}
                    className="btn-reject"
                >
                    Отклонить
                </button>
            </div>
        </div>
    );
}
