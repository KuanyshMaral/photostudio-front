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
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to refresh tokens');
  }

  const result: RefreshTokenResponse = await response.json();
  return result.data.tokens;
};
