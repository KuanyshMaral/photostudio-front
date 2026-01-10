import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Studio {
  id: number;
  name: string;
  email: string;
  address: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export default function StudioManagement() {
  const { token } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockStudios: Studio[] = [
      {
        id: 1,
        name: 'Photo Studio Pro',
        email: 'studio@example.com',
        address: '123 Main St, City',
        status: 'verified',
        created_at: '2024-01-01'
      },
      {
        id: 2,
        name: 'Creative Space',
        email: 'creative@example.com',
        address: '456 Oak Ave, Town',
        status: 'pending',
        created_at: '2024-01-02'
      }
    ];
    
    setTimeout(() => {
      setStudios(mockStudios);
      setLoading(false);
    }, 1000);
  }, [token]);

  const handleStatusChange = (studioId: number, newStatus: Studio['status']) => {
    setStudios(prev => prev.map(studio => 
      studio.id === studioId ? { ...studio, status: newStatus } : studio
    ));
  };

  if (loading) {
    return <div className="p-8">Loading studios...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Studio Management</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Studio Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studios.map((studio) => (
                <tr key={studio.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {studio.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {studio.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {studio.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {studio.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      studio.status === 'verified' ? 'bg-green-100 text-green-800' :
                      studio.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {studio.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(studio.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      View
                    </button>
                    {studio.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(studio.id, 'verified')}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusChange(studio.id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
