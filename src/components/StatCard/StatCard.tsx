import React from 'react';
import './StatCard.css';

interface StatCardProps {
  value: number | string;
  label: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
}

/**
 * StatCard — карточка со статистикой.
 * Используется в ProfileDashboard и AdminDashboard.
 */
export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  color = 'primary',
  loading = false,
}) => {
  return (
    <div className={`stat-card stat-card--${color}`}>
      {icon && <div className="stat-card__icon">{icon}</div>}
      <div className="stat-card__content">
        {loading ? (
          <div className="stat-card__value-skeleton" />
        ) : (
          <div className="stat-card__value">{value}</div>
        )}
        <div className="stat-card__label">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
