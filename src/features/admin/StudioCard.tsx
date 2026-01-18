import type { PendingStudio } from './admin.api';

interface Props {
    studio: PendingStudio;
    onVerify: (id: number) => void;
    onReject: (id: number) => void;
    actionLoading: number | null;
}

export default function StudioCard({ studio, onVerify, onReject, actionLoading }: Props) {
    return (
        <div className="pending-card">
            <div className="pending-info">
                <h3>{studio.name}</h3>
                <p>{studio.address}, {studio.city}</p>
                <p className="owner-info">
                    Владелец: {studio.owner_name} ({studio.owner_email})
                </p>
                <p className="date">
                    Заявка от: {new Date(studio.created_at).toLocaleDateString()}
                </p>
            </div>
            <div className="pending-actions">
                <button
                    onClick={() => onVerify(studio.id)}
                    disabled={actionLoading === studio.id}
                    className="btn-verify"
                >
                    {actionLoading === studio.id ? '...' : 'Одобрить'}
                </button>
                <button
                    onClick={() => onReject(studio.id)}
                    disabled={actionLoading === studio.id}
                    className="btn-reject"
                >
                    Отклонить
                </button>
            </div>
        </div>
    );
}
