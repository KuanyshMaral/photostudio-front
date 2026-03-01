const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export interface ClientProfile {
  id: number;
  user_id: number;
  name: string;
  nickname: string;
  phone: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface ClientProfileUpdateRequest {
  name?: string;
  nickname?: string;
  phone?: string;
  avatar_url?: string;
}

export interface ClientProfileResponse {
  data: ClientProfile;
  success: boolean;
  error?: {
    code: string;
    message: string;
    details: string;
    error_trace: string;
  };
}

export const getClientProfile = async (token: string): Promise<ClientProfile> => {
  const response = await fetch(`${API_BASE}/profile/client`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch client profile');
  }

  const result: ClientProfileResponse = await response.json();
  return result.data;
};

export const updateClientProfile = async (token: string, profileData: ClientProfileUpdateRequest): Promise<ClientProfile> => {
  const response = await fetch(`${API_BASE}/profile/client`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to update client profile');
  }

  const result: ClientProfileResponse = await response.json();
  return result.data;
};
