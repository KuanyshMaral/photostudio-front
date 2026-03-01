const API_BASE = import.meta.env.VITE_API_URL || 'http://89.35.125.136:8090';

export interface OwnerProfile {
  id: number;
  user_id: number;
  email: string;
  company_name: string;
  contact_person: string;
  contact_position: string;
  phone: string;
  legal_address: string;
  website: string;
  bin: string;
  verification_status: string;
  verification_docs: string[];
  verified_at?: string;
  verified_by?: number;
  admin_notes?: string;
  rejected_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface OwnerProfileUpdateRequest {
  company_name?: string;
  contact_person?: string;
  contact_position?: string;
  email?: string;
  legal_address?: string;
  phone?: string;
  website?: string;
  bin?: string;
}

export interface OwnerProfileResponse {
  data: OwnerProfile;
  success: boolean;
  error?: {
    code: string;
    message: string;
    details: string;
    error_trace: string;
  };
}

export const getOwnerProfile = async (token: string): Promise<OwnerProfile> => {
  const response = await fetch(`${API_BASE}/profile/owner`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch owner profile');
  }

  const result: OwnerProfileResponse = await response.json();
  return result.data;
};

export const updateOwnerProfile = async (token: string, profileData: OwnerProfileUpdateRequest): Promise<OwnerProfile> => {
  const response = await fetch(`${API_BASE}/profile/owner`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to update owner profile');
  }

  const result: OwnerProfileResponse = await response.json();
  return result.data;
};
