const API_BASE = '/api/v1';

// Types
export interface CompanyProfile {
  id?: number;
  owner_id?: number;
  company_name: string;
  company_type?: string;
  specialization?: string;
  description?: string;
  contact_person: string;
  phone: string;
  email?: string;
  website?: string;
  city: string;
  work_hours?: string;
  years_experience?: number;
  team_size?: number;
  logo?: string;
  services?: string[];
  socials?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyProfileResponse {
  data: {
    profile: CompanyProfile;
  };
  success: boolean;
}

export interface Analytics {
  total_bookings: number;
  total_revenue: number;
  average_booking_value: number;
  monthly_revenue: number;
  active_clients: number;
  conversion_rate: number;
  // Add more fields as needed
}

export interface PinStatus {
  data: {
    has_pin: boolean;
  };
  success: boolean;
}

export interface MaintenanceRecord {
  id: number;
  owner_id?: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface MaintenanceListResponse {
  data: {
    count: number;
    items: MaintenanceRecord[];
  };
  success: boolean;
}

export interface ProcurementRecord {
  id: number;
  owner_id?: number;
  title: string;
  description: string;
  quantity: number;
  est_cost: number;
  priority: 'low' | 'medium' | 'high';
  status?: 'pending' | 'ordered' | 'delivered' | 'completed';
  is_completed?: boolean;
  due_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProcurementListResponse {
  data: {
    count: number;
    items: ProcurementRecord[];
  };
  success: boolean;
}

export interface PinRequest {
  pin: string;
}

// Studio Types
export interface Studio {
  id: number;
  owner_id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  district?: string;
  phone: string;
  email?: string;
  website?: string;
  rating?: number;
  total_reviews?: number;
  working_hours?: Record<string, { open: string; close: string }>;
  price_per_hour?: number;
  images?: string[];
  created_at: string;
  updated_at?: string;
}

export interface StudioListResponse {
  data?: {
    count?: number;
    items?: Studio[];
  };
  success?: boolean;
  // API might return array directly or wrapped in data
}

export interface StudioCreateRequest {
  name: string;
  description: string;
  address: string;
  city: string;
  district?: string;
  phone?: string;
  email?: string;
  website?: string;
  working_hours: Record<string, { open: string; close: string }>;
  images?: string[];
}

export interface StudioUpdateRequest extends Partial<StudioCreateRequest> {}

// Company Profile API
export const getCompanyProfile = async (token: string): Promise<CompanyProfileResponse> => {
  const response = await fetch(`${API_BASE}/company/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch company profile');
  }

  return response.json();
};

export const updateCompanyProfile = async (token: string, profileData: Partial<CompanyProfile>): Promise<CompanyProfileResponse> => {
  const response = await fetch(`${API_BASE}/company/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to update company profile');
  }

  return response.json();
};

// Analytics API
export const getOwnerAnalytics = async (token: string): Promise<Analytics> => {
  const response = await fetch(`${API_BASE}/owner/analytics`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch analytics');
  }

  return response.json();
};

// PIN Management API
export const hasPin = async (token: string): Promise<PinStatus> => {
  const response = await fetch(`${API_BASE}/owner/has-pin`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to check PIN status');
  }

  return response.json();
};

export const setPin = async (token: string, pin: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/owner/set-pin`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pin }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to set PIN');
  }
};

export const verifyPin = async (token: string, pin: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/owner/verify-pin`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pin }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'PIN verification failed');
  }
};

// Maintenance API
export const getMaintenanceRecords = async (token: string, status?: 'all' | 'pending' | 'in_progress' | 'completed'): Promise<MaintenanceListResponse> => {
  const url = status && status !== 'all' 
    ? `${API_BASE}/owner/maintenance?status=${status}`
    : `${API_BASE}/owner/maintenance`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch maintenance records');
  }

  return response.json();
};

export const createMaintenanceRecord = async (token: string, recordData: Omit<MaintenanceRecord, 'id' | 'created_at' | 'updated_at'>): Promise<MaintenanceRecord> => {
  const response = await fetch(`${API_BASE}/owner/maintenance`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recordData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create maintenance record');
  }

  return response.json();
};

export const updateMaintenanceRecord = async (token: string, id: number, updates: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> => {
  const response = await fetch(`${API_BASE}/owner/maintenance/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to update maintenance record');
  }

  return response.json();
};

export const deleteMaintenanceRecord = async (token: string, id: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/owner/maintenance/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to delete maintenance record');
  }
};

// Procurement API
export const getProcurementRecords = async (token: string, showCompleted: boolean = false): Promise<ProcurementListResponse> => {
  const url = showCompleted 
    ? `${API_BASE}/owner/procurement?show_completed=true`
    : `${API_BASE}/owner/procurement`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch procurement records');
  }

  return response.json();
};

export const createProcurementRecord = async (token: string, recordData: Omit<ProcurementRecord, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<ProcurementRecord> => {
  const response = await fetch(`${API_BASE}/owner/procurement`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recordData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create procurement record');
  }

  return response.json();
};

export const updateProcurementRecord = async (token: string, id: number, updates: Partial<ProcurementRecord>): Promise<ProcurementRecord> => {
  const response = await fetch(`${API_BASE}/owner/procurement/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to update procurement record');
  }

  return response.json();
};

export const deleteProcurementRecord = async (token: string, id: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/owner/procurement/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to delete procurement record');
  }
};

// Studio API
export const getMyStudios = async (token: string): Promise<StudioListResponse> => {
  const response = await fetch(`${API_BASE}/studios/my`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch studios');
  }

  return response.json();
};

export const createStudio = async (token: string, studioData: StudioCreateRequest): Promise<Studio> => {
  const response = await fetch(`${API_BASE}/studios`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studioData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create studio');
  }

  return response.json();
};

export const updateStudio = async (token: string, id: number, studioData: StudioUpdateRequest): Promise<Studio> => {
  const response = await fetch(`${API_BASE}/studios/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studioData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to update studio');
  }

  return response.json();
};

export const deleteStudio = async (token: string, id: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/studios/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to delete studio');
  }
};