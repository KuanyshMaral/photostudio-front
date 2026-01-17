<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStatistics, type Statistics } from './admin.api';
import PendingStudios from './PendingStudios';
import AdminStats from './AdminStats';
import LoadingSpinner from '../../components/LoadingSpinner';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { token, user } = useAuth();
    const [stats, setStats] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Admin role guard
    if (user?.role !== 'admin') {
        return (
            <div className="admin-access-denied">
                <h2>Access Denied</h2>
                <p>This page is only available to administrators.</p>
            </div>
        );
    }
    
    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;
            try {
                const data = await getStatistics(token);
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchStats();
    }, [token]);
    
    if (loading) return <LoadingSpinner />;
    
    return (
        <div className="admin-dashboard">
            <h1>Admin Panel</h1>
            
            {stats && <AdminStats stats={stats} />}
            
            <section className="admin-section">
                <h2>Verification Requests ({stats?.pending_studios || 0})</h2>
                <PendingStudios onUpdate={() => {
                    // Refresh statistics after an action is taken
                    getStatistics(token!).then(setStats);
                }} />
            </section>
        </div>
    );
}
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
