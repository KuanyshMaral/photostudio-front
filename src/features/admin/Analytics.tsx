import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStatistics, type Statistics } from './admin.api';

export default function Analytics() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="p-8">Loading analytics...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Platform Analytics</h1>
      
      {/* Simple test content */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
        <h2>Test: Analytics Page Working!</h2>
        <p>Total Users: {stats?.total_users || 0}</p>
        <p>Total Studios: {stats?.total_studios || 0}</p>
        <p>Total Bookings: {stats?.total_bookings || 0}</p>
        <p>Pending Studios: {stats?.pending_studios || 0}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.total_users || 0}</p>
          <p className="text-sm text-gray-600 mt-2">+12% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Studios</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.total_studios || 0}</p>
          <p className="text-sm text-gray-600 mt-2">+8% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.total_bookings || 0}</p>
          <p className="text-sm text-gray-600 mt-2">+25% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Studios</h3>
          <p className="text-3xl font-bold text-orange-600">{stats?.pending_studios || 0}</p>
          <p className="text-sm text-gray-600 mt-2">Need review</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-gray-600">New studio registration: Photo Studio Pro</span>
            <span className="text-gray-400 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-gray-600">New user registration: john@example.com</span>
            <span className="text-gray-400 ml-auto">3 hours ago</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
            <span className="text-gray-600">New booking: Studio A → Client B</span>
            <span className="text-gray-400 ml-auto">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
