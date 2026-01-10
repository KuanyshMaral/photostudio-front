import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPendingStudios, verifyStudio, rejectStudio, type PendingStudio } from './admin.api';
import StudioCard from './StudioCard';
import toast from 'react-hot-toast';

interface Props {
    onUpdate: () => void;
}

export default function PendingStudios({ onUpdate }: Props) {
    const { token } = useAuth();
    const [studios, setStudios] = useState<PendingStudio[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [rejectModal, setRejectModal] = useState<{ studioId: number; name: string } | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    
    const fetchStudios = async () => {
        if (!token) return;
        try {
            const data = await getPendingStudios(token);
            setStudios(data);
        } catch (error) {
            toast.error('Не удалось загрузить заявки');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchStudios();
    }, [token]);
    
    const handleVerify = async (studioId: number) => {
        if (!token) return;
        setActionLoading(studioId);
        
        try {
            await verifyStudio(token, studioId);
            toast.success('Студия верифицирована');
            setStudios(prev => prev.filter(s => s.id !== studioId));
            onUpdate();
        } catch (error) {
            toast.error('Ошибка при верификации');
        } finally {
            setActionLoading(null);
        }
    };
    
    const handleReject = async (studioId: number) => {
        const studio = studios.find(s => s.id === studioId);
        if (studio) {
            setRejectModal({ studioId: studio.id, name: studio.name });
        }
    };
    
    const handleRejectSubmit = async () => {
        if (!token || !rejectModal || !rejectReason.trim()) return;
        setActionLoading(rejectModal.studioId);
        
        try {
            await rejectStudio(token, rejectModal.studioId, rejectReason);
            toast.success('Заявка отклонена');
            setStudios(prev => prev.filter(s => s.id !== rejectModal.studioId));
            setRejectModal(null);
            setRejectReason('');
            onUpdate();
        } catch (error) {
            toast.error('Ошибка при отклонении');
        } finally {
            setActionLoading(null);
        }
    };
    
    if (loading) return <p>Загрузка...</p>;
    if (studios.length === 0) return <p>Нет заявок на верификацию</p>;
    
    return (
        <>
            <div className="pending-list">
                {studios.map(studio => (
                    <StudioCard
                        key={studio.id}
                        studio={studio}
                        onVerify={handleVerify}
                        onReject={handleReject}
                        actionLoading={actionLoading}
                    />
                ))}
            </div>
            
            {/* Reject Modal */}
            {rejectModal && (
                <div className="modal-overlay" onClick={() => setRejectModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Отклонить заявку</h3>
                        <p>Студия: {rejectModal.name}</p>
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
                                disabled={!rejectReason.trim() || actionLoading === rejectModal.studioId}
                                className="btn-reject"
                            >
                                {actionLoading === rejectModal.studioId ? '...' : 'Отклонить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
