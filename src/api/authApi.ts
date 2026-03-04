const API_BASE = import.meta.env.VITE_API_URL || 'http://89.35.125.136:8090/api/v1';

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  data: {
    tokens: {
      access_token: string;
      refresh_token: string;
    };
  };
  success: boolean;
  error?: {
    code: string;
    message: string;
    details: string;
    error_trace: string;
  };
}

export const refreshTokens = async (refreshToken: string): Promise<{ access_token: string; refresh_token: string }> => {
  console.log('refreshTokens called with:', refreshToken.substring(0, 20) + '...');
  
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  console.log('Refresh API response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Refresh API error:', errorData);
    throw new Error(errorData.error?.message || 'Failed to refresh tokens');
  }

  const result: RefreshTokenResponse = await response.json();
  console.log('Refresh API response:', result);
  
  if (!result.success || !result.data || !result.data.tokens) {
    console.error('Invalid refresh response structure:', result);
    throw new Error('Invalid refresh response structure');
  }
  
  const tokens = result.data.tokens;
  console.log('Extracted tokens:', {
    access_token: tokens.access_token.substring(0, 20) + '...',
    refresh_token: tokens.refresh_token.substring(0, 20) + '...'
  });
  
  return tokens;
};
