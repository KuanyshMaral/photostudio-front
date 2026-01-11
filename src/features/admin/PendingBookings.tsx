import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPendingBookings, approveBooking, rejectBooking, type PendingBooking } from './admin.api';
import BookingCard from './BookingCard';
import toast from 'react-hot-toast';

interface Props {
    onUpdate: () => void;
}

export default function PendingBookings({ onUpdate }: Props) {
    const { token } = useAuth();
    const [bookings, setBookings] = useState<PendingBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [rejectModal, setRejectModal] = useState<{ bookingId: number; studioName: string } | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    
    const fetchBookings = async () => {
        if (!token) return;
        try {
            const data = await getPendingBookings(token);
            setBookings(data);
        } catch (error) {
            toast.error('Не удалось загрузить заявки на бронирование');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchBookings();
    }, [token]);
    
    const handleApprove = async (bookingId: number) => {
        if (!token) return;
        setActionLoading(bookingId);
        
        try {
            await approveBooking(token, bookingId);
            toast.success('Бронирование одобрено');
            setBookings(prev => prev.filter(b => b.id !== bookingId));
            onUpdate();
        } catch (error) {
            toast.error('Ошибка при одобрении бронирования');
        } finally {
            setActionLoading(null);
        }
    };
    
    const handleReject = async (bookingId: number) => {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
            setRejectModal({ bookingId: booking.id, studioName: booking.studio_name });
        }
    };
    
    const handleRejectSubmit = async () => {
        if (!token || !rejectModal || !rejectReason.trim()) return;
        setActionLoading(rejectModal.bookingId);
        
        try {
            await rejectBooking(token, rejectModal.bookingId, rejectReason);
            toast.success('Бронирование отклонено');
            setBookings(prev => prev.filter(b => b.id !== rejectModal.bookingId));
            setRejectModal(null);
            setRejectReason('');
            onUpdate();
        } catch (error) {
            toast.error('Ошибка при отклонении бронирования');
        } finally {
            setActionLoading(null);
        }
    };
    
    if (loading) return <p>Загрузка...</p>;
    if (bookings.length === 0) return <p>Нет заявок на бронирование</p>;
    
    return (
        <>
            <div className="pending-list">
                {bookings.map(booking => (
                    <BookingCard
                        key={booking.id}
                        booking={booking}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        actionLoading={actionLoading}
                    />
                ))}
            </div>
            
            {/* Reject Modal */}
            {rejectModal && (
                <div className="modal-overlay" onClick={() => setRejectModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Отклонить бронирование</h3>
                        <p>Студия: {rejectModal.studioName}</p>
                        <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Укажите причину отклонения..."
                            rows={4}
                        />
                        <div className="modal-actions">
                            <button onClick={() => setRejectModal(null)} className="btn-cancel">
                                Отмена
                            </button>
                            <button 
                                onClick={handleRejectSubmit} 
                                disabled={!rejectReason.trim() || actionLoading === rejectModal.bookingId}
                                className="btn-reject"
                            >
                                {actionLoading === rejectModal.bookingId ? '...' : 'Отклонить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
