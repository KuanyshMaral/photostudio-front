import { useAuth } from '../context/AuthContext';

// Create a custom fetch wrapper that handles token refresh
export const createAuthenticatedFetch = () => {
  let isRefreshing = false;
  let refreshPromise: Promise<boolean> | null = null;

  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    // Get current auth context
    const auth = getAuthContext(); // We'll need to implement this
    
    if (!auth.token) {
      throw new Error('No token available');
    }

    // Make initial request
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
    });

    // If 401, try to refresh token
    if (response.status === 401 && auth.refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = auth.refreshAccessToken();
      }

      const refreshSuccess = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      if (refreshSuccess) {
        // Retry the original request with new token
        const newAuth = getAuthContext();
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newAuth.token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    }

    return response;
  };

  return fetchWithAuth;
};

// This is a workaround to get auth context outside of React
let authContext: ReturnType<typeof useAuth> | null = null;

export const setAuthContext = (context: ReturnType<typeof useAuth>) => {
  authContext = context;
};

const getAuthContext = () => {
  if (!authContext) {
    throw new Error('Auth context not set. Make sure to call setAuthContext in your app root.');
  }
  return authContext;
};

// Export a singleton instance
export const authenticatedFetch = createAuthenticatedFetch();
