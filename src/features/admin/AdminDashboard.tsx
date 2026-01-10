import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStatistics, type Statistics } from './admin.api';
import PendingStudios from './PendingStudios';
import PendingBookings from './PendingBookings';
import AdminStats from './AdminStats';
import LoadingSpinner from '../../components/LoadingSpinner';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { token, user } = useAuth();
    const [stats, setStats] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Проверка роли админа или владельца студии
    if (user?.role !== 'admin' && user?.role !== 'studio_owner') {
        return (
            <div className="admin-access-denied">
                <h2>Доступ запрещён</h2>
                <p>Эта страница доступна только администраторам и владельцам студий.</p>
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
            <h1>{user?.role === 'admin' ? 'Панель администратора' : 'Панель владельца студии'}</h1>
            
            {stats && <AdminStats stats={stats} />}
            
            {user?.role === 'admin' && (
                <section className="admin-section">
                    <h2>Заявки на верификацию ({stats?.pending_studios || 0})</h2>
                    <PendingStudios onUpdate={() => {
                        // Обновить статистику после действия
                        getStatistics(token!).then(setStats);
                    }} />
                </section>
            )}
            
            <section className="admin-section">
                <h2>Заявки на бронирование ({stats?.pending_bookings || 0})</h2>
                <PendingBookings onUpdate={() => {
                    // Обновить статистику после действия
                    getStatistics(token!).then(setStats);
                }} />
            </section>
        </div>
    );
}
