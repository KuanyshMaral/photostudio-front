// Simple API wrapper with automatic token refresh
import { useAuth } from '../context/AuthContext';

let authContext: ReturnType<typeof useAuth> | null = null;

export const setAuthContext = (context: ReturnType<typeof useAuth>) => {
  authContext = context;
};

export const apiCall = async (url: string, options: RequestInit = {}, retryCount = 0): Promise<Response> => {
  if (!authContext) {
    throw new Error('Auth context not available');
  }

  const makeRequest = async (token: string): Promise<Response> => {
    console.log('Making API call to:', url);
    console.log('With token:', token.substring(0, 20) + '...');
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
  console.log('API response status:', response.status, 'for URL:', url);

  // If 401, try to refresh token and retry (but only once)
  if (response.status === 401 && authContext.refreshToken && retryCount === 0) {
    console.log('Token expired, attempting refresh...');
    console.log('Current refresh token available:', !!authContext.refreshToken);
    
    const refreshSuccess = await authContext.refreshAccessToken();
    
    if (refreshSuccess && authContext.token) {
      console.log('Token refreshed, retrying request...');
      console.log('New token:', authContext.token.substring(0, 20) + '...');
      response = await makeRequest(authContext.token);
      console.log('Retry response status:', response.status);
    } else {
      console.log('Token refresh failed or no new token available');
    }
  } else if (response.status === 401 && retryCount > 0) {
    console.log('Retry failed with refreshed token, giving up...');
  }

  return response;
};
