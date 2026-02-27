import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, Ban, UserCheck } from 'lucide-react';
import { getAllUsers, banUser, unbanUser, type UserListResponse } from './users.api';
import './UserManagement.css';

export default function UserManagement() {
  const { token, user } = useAuth();
  const [userList, setUserList] = useState<UserListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        console.log('UserManagement: No token available, skipping fetch');
        setLoading(false);
        return;
      }
      
      console.log('UserManagement: Fetching users...');
      console.log('UserManagement: Current user from auth:', user);
      console.log('UserManagement: User role:', user?.role);
      console.log('UserManagement: Token length:', token.length);
      console.log('UserManagement: Token starts with:', token.substring(0, 20) + '...');
      
      try {
        const data = await getAllUsers(token, 1, 50, statusFilter !== 'all' ? statusFilter : undefined);
        console.log('UserManagement: Received data:', data);
        setUserList(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        // Show user-friendly message for backend access issues
        if (error instanceof Error && error.message.includes('Admin token validation failed')) {
          // Don't show error for token validation issues - let the auth system handle it
        } else {
          // For other errors, we could show a notification
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [token, statusFilter, user]);

  const handleBanUser = async (userId: number, reason: string) => {
    if (!token) return;
    
    try {
      await banUser(token, userId, reason);
      // Refresh users list
      const data = await getAllUsers(token, 1, 50, statusFilter !== 'all' ? statusFilter : undefined);
      setUserList(data);
    } catch (error) {
      console.error('Failed to ban user:', error);
      alert('Не удалось заблокировать пользователя');
    }
  };

  const handleUnbanUser = async (userId: number) => {
    if (!token) return;
    
    try {
      await unbanUser(token, userId);
      // Refresh users list
      const data = await getAllUsers(token, 1, 50, statusFilter !== 'all' ? statusFilter : undefined);
      setUserList(data);
    } catch (error) {
      console.error('Failed to unban user:', error);
      alert('Не удалось разблокировать пользователя');
    }
  };

  const filteredUsers = userList?.users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return <div className="user-management--loading">Загрузка пользователей...</div>;
  }

  return (
    <div className="user-management">
      <div className="user-management__header">
        <h1>
          <Users size={28} />
          Управление пользователями
        </h1>
        <div className="user-management__filters">
          <div className="filter-group">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Поиск пользователей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="banned">Заблокированные</option>
          </select>
          <select>
            <option value="all">Все роли</option>
            <option value="admin">Администраторы</option>
            <option value="studio_owner">Владельцы студий</option>
            <option value="client">Клиенты</option>
          </select>
        </div>
      </div>
      
      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Роль</th>
              <th>Статус</th>
              <th>Создан</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className={user.is_banned ? 'banned-user' : ''}>
                <td>{user.id}</td>
                <td>
                  <div className="user-info">
                    {user.avatar_url && (
                      <img src={user.avatar_url} alt={user.name} className="user-avatar" />
                    )}
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || '-'}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'admin' ? 'Администратор' :
                     user.role === 'studio_owner' ? 'Владелец студии' :
                     'Клиент'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.is_banned ? 'banned' : 'active'}`}>
                    {user.is_banned ? 'Заблокирован' : 'Активен'}
                  </span>
                  {user.email_verified && (
                    <span className="verified-badge">✓ Подтвержден</span>
                  )}
                </td>
                <td>{new Date(user.created_at).toLocaleDateString('ru-RU')}</td>
                <td>
                  <div className="action-buttons">
                    {user.is_banned ? (
                      <button 
                        className="action-button unban"
                        onClick={() => handleUnbanUser(user.id)}
                      >
                        <UserCheck size={16} />
                        Разблокировать
                      </button>
                    ) : (
                      <button 
                        className="action-button ban"
                        onClick={() => {
                          const reason = prompt('Причина блокировки:');
                          if (reason) {
                            handleBanUser(user.id, reason);
                          }
                        }}
                      >
                        <Ban size={16} />
                        Заблокировать
                      </button>
                    )}
                    <button className="action-button edit">
                      Редактировать
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="no-users">
            <Users size={48} />
            <p>Пользователи не найдены</p>
          </div>
        )}
        
        {userList && (
          <div className="pagination-info">
            Показано {filteredUsers.length} из {userList.total} пользователей
          </div>
        )}
      </div>
    </div>
  );
}
