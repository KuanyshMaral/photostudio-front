const API_BASE = '/api/v1';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'client' | 'studio_owner' | 'admin';
  phone?: string;
  avatar_url?: string;
  email_verified: boolean;
  email_verified_at?: string;
  is_banned: boolean;
  ban_reason?: string;
  banned_at?: string;
  locked_until?: string;
  failed_login_attempts: number;
  studio_status?: string;
  created_at: string;
  updated_at: string;
}

export interface UserListResponse {
  limit: number;
  page: number;
  total: number;
  users: User[];
}

// Получаем ВСЕХ пользователей из базы данных
export const getAllUsers = async (token: string, page: number = 1, limit: number = 20, status?: string): Promise<UserListResponse> => {
  try {
    console.log('getAllUsers: Making API call to:', `${API_BASE}/admin/users`);
    console.log('getAllUsers: Token provided:', !!token);
    console.log('getAllUsers: Token length:', token?.length);
    console.log('getAllUsers: Token starts with:', token?.substring(0, 20) + '...');
    
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) {
      params.append('status', status);
    }
    
    const headers: Record<string, string> = {
      'accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('getAllUsers: Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.error('getAllUsers: No token provided!');
    }
    
    console.log('getAllUsers: Request headers:', headers);
    
    const response = await fetch(`${API_BASE}/admin/users?${params.toString()}`, {
      headers: headers
    });
    
    console.log('getAllUsers: Response status:', response.status);
    console.log('getAllUsers: Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('getAllUsers: Error response:', errorText);
      
      // If backend returns 403, provide mock data for development
      if (response.status === 403) {
        console.warn('Backend admin access issue - providing mock data for development');
        return {
          limit: limit,
          page: page,
          total: 0,
          users: []
        };
      }
      
      throw new Error('Failed to fetch users');
    }
    
    const json = await response.json();
    console.log('getAllUsers: Response JSON:', json);
    
    // Согласно Swagger API, ответ должен содержать { limit, page, total, users }
    return json.data || json;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

export const banUser = async (token: string, userId: number, reason: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/admin/users/${userId}/ban`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || errorData.message || 'Failed to ban user';
    throw new Error(errorMessage);
  }
};

export const unbanUser = async (token: string, userId: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/admin/users/${userId}/unban`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || errorData.message || 'Failed to unban user';
    throw new Error(errorMessage);
  }
};

export const updateUser = async (_token: string, userId: number, userData: Partial<User>): Promise<void> => {
  // TODO: Реализовать когда API будет готов
  console.log('Update user:', userId, userData);
};

export const deleteUser = async (_token: string, userId: number): Promise<void> => {
  // TODO: Реализовать когда API будет готов
  console.log('Delete user:', userId);
};
