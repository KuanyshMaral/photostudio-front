import type { Statistics } from './admin.api';

interface Props {
    stats: Statistics;
}

export default function AdminStats({ stats }: Props) {
    const cards = [
        { label: 'Total Users', value: stats.total_users, color: '#3b82f6' },
        { label: 'Total Studios', value: stats.total_studios, color: '#10b981' },
        { label: 'Total Bookings', value: stats.total_bookings, color: '#8b5cf6' },
        { label: 'Pending Verification', value: stats.pending_studios, color: '#f59e0b' },
        { label: 'Bookings Today', value: stats.today_bookings, color: '#ef4444' },
    ];
    
    return (
        <div className="stats-grid">
            {cards.map((card, index) => (
                <div 
                    key={index} 
                    className="stat-card"
                    style={{ borderLeftColor: card.color }}
                >
                    <span className="stat-value">{card.value}</span>
                    <span className="stat-label">{card.label}</span>
                </div>
            ))}
        </div>
    );
}
