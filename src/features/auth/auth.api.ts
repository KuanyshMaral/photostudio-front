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
  
  const API_BASE = `${import.meta.env.VITE_API_URL}/api/v1`;
  const response = await fetch(`${API_BASE}/users/me?include_stats=true`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  console.log('getProfile response status:', response.status);
  console.log('getProfile response headers:', response.headers);
  
  if (!response.ok) throw new Error('Failed to fetch profile');
  
  const json = await response.json();
  console.log('getProfile response data:', json);
  return json.user; // Direct access, not json.data.user
}

export async function updateProfile(token: string, data: Partial<Pick<Profile, 'name' | 'phone'>>): Promise<Profile> {
  const API_BASE = `${import.meta.env.VITE_API_URL}/api/v1`;
  const response = await fetch(`${API_BASE}/users/me`, {
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

export async function uploadFiles(token: string, files: File[], contactInfo?: { contactName: string; contactEmail: string; contactPhone: string }): Promise<{ message: string }> {
  const formData = new FormData();
  
  // Append files with the correct field name
  files.forEach((file, index) => {
    formData.append('documents', file);
  });
  
  // Add required contact information if provided
  if (contactInfo) {
    formData.append('contact_name', contactInfo.contactName);
    formData.append('contact_email', contactInfo.contactEmail);
    formData.append('contact_phone', contactInfo.contactPhone);
  }

  const API_BASE = `${import.meta.env.VITE_API_URL}/api/v1`;
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
export async function registerStudioOwner(data: StudioRegisterRequest): Promise<{ user: { id: number }; token?: string }> {
  console.log('Registering studio owner with data:', JSON.stringify(data, null, 2));
  const API_BASE = `${import.meta.env.VITE_API_URL}/api/v1`;
  console.log('Full URL:', `${API_BASE}/leads/submit`);
  
  // Transform data to match backend SubmitLeadRequest format
  const leadData = {
    contact_name: data.contactPerson || '',
    contact_email: data.email || '',
    contact_phone: data.phone || '',
    contact_position: '', // Optional field
    company_name: data.companyName || '',
    bin: data.bin || '',
    legal_address: data.address || '',
    website: '', // Optional field
    use_case: '', // Optional field
    how_found_us: '', // Optional field
  };
  
  console.log('Transformed lead data:', JSON.stringify(leadData, null, 2));
  
  // Validate required fields before sending
  if (!leadData.contact_name.trim()) {
    throw new Error('Contact person name is required');
  }
  if (!leadData.contact_email.trim()) {
    throw new Error('Contact email is required');
  }
  if (!leadData.contact_phone.trim()) {
    throw new Error('Contact phone is required');
  }
  if (!leadData.company_name.trim()) {
    throw new Error('Company name is required');
  }
  
  const response = await fetch(`${API_BASE}/leads/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leadData),
  });

  console.log('Studio registration response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Error response from server:', errorData);
    
    // Handle lead submission response
    if (errorData.data && errorData.data.status === 'new') {
      // Lead submitted successfully, but requires admin approval
      throw new Error('Ваша заявка отправлена на модерацию. Мы свяжемся с вами в ближайшее время.');
    }
    
    const errorMessage = errorData.error?.message || errorData.message || 'Registration failed';
    const error = new Error(errorMessage) as any;
    error.response = { data: errorData };
    throw error;
  }
  
  const responseData = await response.json();
  console.log('Studio registration response:', responseData);
  
  // Lead submission doesn't return token/user directly
  // It returns a lead object that needs admin approval
  if (responseData.data && responseData.data.status === 'new') {
    return { user: { id: 0 }, token: undefined }; // No immediate token for lead submission
  }
  
  // Fallback for other cases
  return { user: { id: 0 }, token: undefined };
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

  const API_BASE = `${import.meta.env.VITE_API_URL}/api/v1`;
  const response = await fetch(`${API_BASE}/users/verification/documents`, {
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
