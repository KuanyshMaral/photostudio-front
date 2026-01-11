const API_BASE = 'http://localhost:3001/api/v1';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'client' | 'studio_owner' | 'admin';
  created_at: string;
}

// Получаем ВСЕХ пользователей из базы данных
export const getAllUsers = async (token: string): Promise<User[]> => {
  try {
    console.log('getAllUsers: Making API call to:', `${API_BASE}/admin/users`);
    
    const response = await fetch(`${API_BASE}/admin/users`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('getAllUsers: Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('getAllUsers: Error response:', errorText);
      throw new Error('Failed to fetch users');
    }
    
    const json = await response.json();
    console.log('getAllUsers: Response JSON:', json);
    
    // Проверяем разные форматы ответа
    const users = json.data?.users || json.data || json || [];
    console.log('getAllUsers: Users count:', users.length);
    
    return users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
};

export const updateUser = async (token: string, userId: number, userData: Partial<User>): Promise<void> => {
  // TODO: Реализовать когда API будет готов
  console.log('Update user:', userId, userData);
};

export const deleteUser = async (token: string, userId: number): Promise<void> => {
  // TODO: Реализовать когда API будет готов
  console.log('Delete user:', userId);
};
