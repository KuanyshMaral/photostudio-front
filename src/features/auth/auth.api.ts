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
    console.log('Login error response:', errorData);
    const errorMessage = errorData.error?.message || errorData.message || 'Login failed';
    const error = new Error(errorMessage) as any;
    error.response = { data: errorData };
    throw error;
  }
  
  const json = await response.json();
  console.log('Login success response:', json);
  console.log('json.data:', json.data);
  
  // Проверяем разные возможные структуры ответа
  let token, user;
  
  if (json.data) {
    console.log('Found json.data structure');
    // Проверяем разные варианты расположения токена
    if (json.data.tokens) {
      console.log('Found tokens object:', json.data.tokens);
      token = json.data.tokens.access_token || json.data.tokens.token;
      console.log('Extracted token from tokens:', !!token);
    } else {
      token = json.data.token;
    }
    user = json.data.user;
  } else if (json.token) {
    console.log('Found direct token structure');
    token = json.token;
    user = json.user;
  } else if (json.access_token) {
    console.log('Found access_token structure');
    token = json.access_token;
    user = json.user;
  } else {
    console.log('Unknown structure, logging all keys:', Object.keys(json));
    // Ищем токен в любом поле
    const tokenKeys = Object.keys(json).filter(key => key.toLowerCase().includes('token'));
    console.log('Possible token keys:', tokenKeys);
    if (tokenKeys.length > 0) {
      token = json[tokenKeys[0]];
    }
    user = json.user || json.userData || json.profile;
  }
  
  console.log('Extracted token:', !!token, 'user:', user);
  return { token, user };
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const endpoint = data.role === 'client' ? `${API_BASE}/auth/register/client` : `${API_BASE}/auth/register/studio`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
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
  return { token: json.data?.token || json.token, user: json.data?.user || json.user, message: json.message };
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
  console.log('getProfile called with token:', !!token);
  console.log('Token value:', token);
  console.log('Token length:', token?.length);
  console.log('Authorization header:', `Bearer ${token}`);
  
  const response = await fetch('http://89.35.125.136:8090/api/v1/users/me?include_stats=true', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  console.log('getProfile response status:', response.status);
  console.log('getProfile response headers:', response.headers);
  
  if (!response.ok) throw new Error('Failed to fetch profile');
  
  const json = await response.json();
  console.log('getProfile response data:', json);
  return json.data.user;
}

export async function updateProfile(token: string, data: Partial<Pick<Profile, 'name' | 'phone'>>): Promise<Profile> {
  const response = await fetch('http://89.35.125.136:8090/api/v1/users/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to update profile');
  }

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
}): Promise<{ user: { id: number }; token?: string }> {
  console.log('Registering studio owner with data:', JSON.stringify(data, null, 2));
  console.log('Full URL:', 'http://89.35.125.136:8090/api/v1/auth/register/studio');
  const response = await fetch('http://89.35.125.136:8090/api/v1/auth/register/studio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log('Studio registration response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Error response from server:', errorData);
    const errorMessage = errorData.error?.message || errorData.message || 'Registration failed';
    const error = new Error(errorMessage) as any;
    error.response = { data: errorData };
    throw error;
  }

  const json = await response.json();
  console.log('Studio registration response data:', json);
  // Согласно Swagger, при успешной регистрации должен возвращаться JWT токен
  return { 
    user: json.data?.user || json.user, 
    token: json.data?.token || json.token || json.access_token
  };
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

// Updated uploadVerificationDocs to match Swagger API
export async function uploadVerificationDocs(token: string, documents: File[]): Promise<{ message: string; uploaded_urls: string[] }> {
  console.log('Uploading verification documents:', documents.length, 'files');
  
  const formData = new FormData();
  // Согласно Swagger, файлы должны быть добавлены с ключом 'documents'
  documents.forEach((file) => {
    formData.append('documents', file);
  });

  console.log('FormData contents:');
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  const response = await fetch('http://89.35.125.136:8090/api/v1/users/verification/documents', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // НЕ устанавливаем Content-Type для FormData - браузер сделает это автоматически с boundary
    },
    body: formData,
  });

  console.log('Upload documents response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Upload documents error:', errorData);
    const errorMessage = errorData.error?.message || errorData.message || 'Document upload failed';
    const error = new Error(errorMessage) as any;
    error.response = { data: errorData };
    throw error;
  }

  const json = await response.json();
  console.log('Upload documents response:', json);
  return json.data || json;
}
