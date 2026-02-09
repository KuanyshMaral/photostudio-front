import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Search } from 'lucide-react';
import { getAllUsers, type User } from './users.api';
import './UserManagement.css';

export default function UserManagement() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      console.log('UserManagement: Fetching users...');
      try {
        const data = await getAllUsers(token);
        console.log('UserManagement: Received data:', data);
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [token]);

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
              onChange={() => {
                // Add search functionality here
              }}
            />
          </div>
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
              <th>Роль</th>
              <th>Создан</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'admin' ? 'Администратор' :
                     user.role === 'studio_owner' ? 'Владелец студии' :
                     'Клиент'}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString('ru-RU')}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-button edit">
                      Редактировать
                    </button>
                    <button className="action-button delete">
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
