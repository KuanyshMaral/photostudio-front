import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPendingStudios, verifyStudio, rejectStudio, type PendingStudio } from './admin.api';
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
            toast.error('Failed to load verification requests');
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
            toast.success('Studio verified successfully');
            setStudios(prev => prev.filter(s => s.id !== studioId));
            onUpdate();
        } catch (error) {
            toast.error('Error during verification');
        } finally {
            setActionLoading(null);
        }
    };
    
    const handleReject = async () => {
        if (!token || !rejectModal || !rejectReason.trim()) return;
        setActionLoading(rejectModal.studioId);
        
        try {
            await rejectStudio(token, rejectModal.studioId, rejectReason);
            toast.success('Request rejected');
            setStudios(prev => prev.filter(s => s.id !== rejectModal.studioId));
            setRejectModal(null);
            setRejectReason('');
            onUpdate();
        } catch (error) {
            toast.error('Error rejecting request');
        } finally {
            setActionLoading(null);
        }
    };
    
    if (loading) return <p>Loading...</p>;
    if (studios.length === 0) return <p>No pending verification requests</p>;
    
    return (
        <>
            <div className="pending-list">
                {studios.map(studio => (
                    <div key={studio.id} className="pending-card">
                        <div className="pending-info">
                            <h3>{studio.name}</h3>
                            <p>{studio.address}, {studio.city}</p>
                            <p className="owner-info">
                                Owner: {studio.owner_name} ({studio.owner_email})
                            </p>
                            <p className="date">
                                Requested on: {new Date(studio.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="pending-actions">
                            <button
                                onClick={() => handleVerify(studio.id)}
                                disabled={actionLoading === studio.id}
                                className="btn-verify"
                            >
                                {actionLoading === studio.id ? '...' : 'Approve'}
                            </button>
                            <button
                                onClick={() => setRejectModal({ studioId: studio.id, name: studio.name })}
                                disabled={actionLoading === studio.id}
                                className="btn-reject"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Reject Modal */}
            {rejectModal && (
                <div className="modal-overlay" onClick={() => setRejectModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Reject Request</h3>
                        <p>Studio: {rejectModal.name}</p>
                        <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Please provide a reason for rejection..."
                            rows={4}
                        />
                        <div className="modal-actions">
                            <button onClick={() => setRejectModal(null)} className="btn-cancel">
                                Cancel
                            </button>
                            <button 
                                onClick={handleReject} 
                                disabled={!rejectReason.trim()}
                                className="btn-reject"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
