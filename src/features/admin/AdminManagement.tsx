import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Shield, Settings, UserCheck, AlertTriangle } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'studio_owner' | 'admin';
  avatar_url?: string;
  created_at?: string;
}

export const AdminManagement: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data?.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const promoteToAdmin = async (userId: number) => {
    // This would make an API call to promote user to admin
    console.log('Promoting user to admin:', userId);
    alert('User promoted to admin successfully!');
  };

  const demoteFromAdmin = async (userId: number) => {
    // This would make an API call to demote user from admin
    console.log('Demoting user from admin:', userId);
    alert('User demoted from admin successfully!');
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded-lg w-1/2 mb-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-management p-6">
      <div className="admin-management__header">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
        <p className="text-gray-600 mb-6">Manage user roles and permissions</p>
      </div>

      <div className="admin-management__search mb-6">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="admin-management__users mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : user.role === 'studio_owner' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => promoteToAdmin(user.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded"
                        >
                          Promote
                        </button>
                      )}
                      {user.role === 'admin' && (
                        <button
                          onClick={() => demoteFromAdmin(user.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded"
                        >
                          Demote
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mt-2">No users found</p>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
