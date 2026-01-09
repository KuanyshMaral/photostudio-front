import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext.tsx';
import { getStatistics, getPendingStudios } from '../../api/adminApi';
import { PendingStudioCard } from './PendingStudioCard';
import LoadingSpinner from '../../components/LoadingSpinner';

export const AdminDashboard: React.FC = () => {
    const { token } = useAuth();

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: () => getStatistics(token!),
        enabled: !!token,
    });

    const { data: pending, isLoading: pendingLoading } = useQuery({
        queryKey: ['pending-studios'],
        queryFn: () => getPendingStudios(token!),
        enabled: !!token,
    });

    if (statsLoading || pendingLoading) {
        return <div className="p-8 flex justify-center"><LoadingSpinner /></div>;
    }

    return (
        <div className="admin-dashboard container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Админ панель</h1>

            <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="stat-card bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Пользователей</h3>
                    <p className="text-3xl font-bold text-blue-900">{stats?.total_users || 0}</p>
                </div>
                <div className="stat-card bg-purple-50 p-6 rounded-lg border border-purple-100">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Студий</h3>
                    <p className="text-3xl font-bold text-purple-900">{stats?.total_studios || 0}</p>
                </div>
                <div className="stat-card bg-green-50 p-6 rounded-lg border border-green-100">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Бронирований</h3>
                    <p className="text-3xl font-bold text-green-900">{stats?.total_bookings || 0}</p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Ожидают верификации ({pending?.length || 0})</h2>
            <div className="pending-list space-y-4">
                {pending?.length === 0 && <p className="text-gray-500">Нет заявок на рассмотрении</p>}
                {pending?.map((studio: any) => (
                    <PendingStudioCard key={studio.id} studio={studio} />
                ))}
            </div>
        </div>
    );
};