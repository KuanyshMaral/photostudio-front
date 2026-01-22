import React from 'react';
import './StatCard.css';

export interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  value, 
  label, 
  icon, 
  color = 'primary',
  subValue,
  trend
}) => {
  return (
    <div className={`stat-card stat-card--${color}`}>
      {icon && <div className="stat-card__icon">{icon}</div>}
      <div className="stat-card__content">
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__label">{label}</div>
        {subValue && (
          <div className={`stat-card__sub-value ${trend ? `stat-card__sub-value--${trend}` : ''}`}>
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
};