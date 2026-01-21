import React from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import './RecentActivityItem.css';

interface RecentActivityItemProps {
  studioName: string;
  roomName: string;
  date: string;
  status: 'completed' | 'cancelled' | 'pending' | 'confirmed';
}

const STATUS_CONFIG = {
  completed: { icon: CheckCircle, color: 'success', label: 'Завершено' },
  confirmed: { icon: CheckCircle, color: 'primary', label: 'Подтверждено' },
  pending: { icon: Clock, color: 'warning', label: 'Ожидает' },
  cancelled: { icon: XCircle, color: 'danger', label: 'Отменено' },
};

export const RecentActivityItem: React.FC<RecentActivityItemProps> = ({
  studioName,
  roomName,
  date,
  status,
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <div className="recent-activity-item">
      <div className="recent-activity-item__icon">
        <Calendar size={18} />
      </div>
      
      <div className="recent-activity-item__content">
        <div className="recent-activity-item__title">
          {studioName} — {roomName}
        </div>
        <div className="recent-activity-item__date">{date}</div>
      </div>

      <div className={`recent-activity-item__status status--${config.color}`}>
        <Icon size={14} />
        <span>{config.label}</span>
      </div>
    </div>
  );
};

export default RecentActivityItem;
