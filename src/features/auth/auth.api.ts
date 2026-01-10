import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, StudioRegisterRequest, Profile, ApiError } from './auth.types';

const API_BASE = 'http://localhost:3001/api/v1';

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Login failed');
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
  const formData = new FormData();
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('companyName', data.companyName);
  formData.append('bin', data.bin);
  formData.append('address', data.address);
  formData.append('contactPerson', data.contactPerson);
  data.documents.forEach((file, index) => {
    formData.append(`documents[${index}]`, file);
  });

  const response = await fetch(`${API_BASE}/auth/register/studio`, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: formData,
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
