import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, StudioRegisterRequest, Profile, ApiError } from './auth.types';

const API_BASE = '/api/v1';

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || errorData.message || 'Login failed';
    const error = new Error(errorMessage) as any;
    error.response = { data: errorData };
    throw error;
  }
  
  const json = await response.json();
  return { token: json.data.token, user: json.data.user };
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const endpoint = data.role === 'client' ? `${API_BASE}/auth/register/client` : `${API_BASE}/auth/register/studio_owner`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
}

export async function registerStudio(data: StudioRegisterRequest, token?: string): Promise<RegisterResponse> {
  const requestData = {
    name: data.contactPerson, // Using contact person as the name
    email: data.email,
    phone: data.phone, // Include phone field
    password: data.password,
    company_name: data.companyName,
    bin: data.bin,
    legal_address: data.address,
    contact_person: data.contactPerson,
    contact_position: '', // Add if needed
  };

  const response = await fetch(`${API_BASE}/auth/register/studio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Studio registration failed');
  }

  return response.json();
}

export async function getProfile(token: string): Promise<Profile> {
  const response = await fetch(`${API_BASE}/users/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok) throw new Error('Failed to fetch profile');
  
  const json = await response.json();
  return json.data.user;
}

export async function updateProfile(token: string, data: Partial<Pick<Profile, 'name' | 'phone'>>): Promise<Profile> {
  const response = await fetch(`${API_BASE}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) throw new Error('Failed to update');
  
  const json = await response.json();
  return json.data.user;
}

export async function uploadFiles(token: string, files: File[]): Promise<{ message: string }> {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
}

// Additional API functions for studio registration workflow
export async function registerStudioOwner(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  company_name: string;
  bin: string;
  legal_address?: string;
  contact_person?: string;
  contact_position?: string;
}): Promise<{ user: { id: number } }> {
  const response = await fetch(`${API_BASE}/auth/register/studio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || errorData.message || 'Registration failed';
    const error = new Error(errorMessage) as any;
    error.response = { data: errorData };
    throw error;
  }

  const json = await response.json();
  return { user: json.data.user };
}

export async function createStudioOwner(data: { userId: number; bin: string; companyName: string; address: string; contactPerson: string }): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/studio-owner`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || errorData.message || 'Studio creation failed';
    const error = new Error(errorMessage) as any;
    error.response = { data: errorData };
    throw error;
  }

  return response.json();
}

// Password change function
export async function changePassword(token: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || errorData.message || 'Password change failed';
    const error = new Error(errorMessage) as any;
    error.response = { data: errorData };
    throw error;
  }

  return response.json();
}

// Avatar upload function
export async function uploadAvatar(token: string, avatarFile: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append('avatar', avatarFile);

  const response = await fetch(`${API_BASE}/users/avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || errorData.message || 'Avatar upload failed';
    const error = new Error(errorMessage) as any;
    error.response = { data: errorData };
    throw error;
  }

  return response.json();
}

// Updated uploadVerificationDocs to match backend
export async function uploadVerificationDocs(token: string, documents: File[]): Promise<{ message: string; uploaded_urls: string[] }> {
  const formData = new FormData();
  documents.forEach((file, index) => {
    formData.append(`documents[${index}]`, file);
  });

  const response = await fetch(`${API_BASE}/users/verification/documents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || errorData.message || 'Document upload failed';
    const error = new Error(errorMessage) as any;
    error.response = { data: errorData };
    throw error;
  }

  return response.json();
}
