import React, { useState, useEffect } from 'react';
import './LiveStatusBadge.css';

interface LiveStatusBadgeProps {
  studioId: number;
  compact?: boolean;
}

interface StatusData {
  is_open_now: boolean;
  status_text: string;
  compact_text: string;
}

/**
 * LiveStatusBadge — показывает текущий статус работы студии.
 * Загружает данные с /api/v1/studios/:id/working-hours
 */
export const LiveStatusBadge: React.FC<LiveStatusBadgeProps> = ({
  studioId,
  compact = false,
}) => {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/v1/studios/${studioId}/working-hours`);
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
        }
      } catch (error) {
        console.error('Failed to fetch working hours:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [studioId]);

  if (isLoading) {
    return <div className="live-status-badge live-status-badge--loading">...</div>;
  }

  if (!status) {
    return null;
  }

  return (
    <div 
      className={`live-status-badge ${
        status.is_open_now ? 'live-status-badge--open' : 'live-status-badge--closed'
      } ${compact ? 'live-status-badge--compact' : ''}`}
    >
      <span className="live-status-badge__indicator" />
      <span className="live-status-badge__text">
        {compact ? (status.is_open_now ? 'Открыто' : 'Закрыто') : status.status_text}
      </span>
    </div>
  );
};

export default LiveStatusBadge;
