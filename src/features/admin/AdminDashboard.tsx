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
