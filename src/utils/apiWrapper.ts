// Simple API wrapper with automatic token refresh
import { useAuth } from '../context/AuthContext';

let authContext: ReturnType<typeof useAuth> | null = null;

export const setAuthContext = (context: ReturnType<typeof useAuth>) => {
  authContext = context;
};

export const apiCall = async (url: string, options: RequestInit = {}): Promise<Response> => {
  if (!authContext) {
    throw new Error('Auth context not available');
  }

  const makeRequest = async (token: string): Promise<Response> => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };

  // First attempt with current token
  let response = await makeRequest(authContext.token || '');

  // If 401, try to refresh token and retry
  if (response.status === 401 && authContext.refreshToken) {
    console.log('Token expired, attempting refresh...');
    const refreshSuccess = await authContext.refreshAccessToken();
    
    if (refreshSuccess && authContext.token) {
      console.log('Token refreshed, retrying request...');
      response = await makeRequest(authContext.token);
    }
  }

  return response;
};
