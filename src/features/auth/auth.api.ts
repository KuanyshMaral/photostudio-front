import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ApiError } from './auth.types';

const API_BASE = '/api'; // Adjust if needed

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
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
