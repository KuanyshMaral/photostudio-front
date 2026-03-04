import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { refreshTokens } from '../../api/authApi';
import './TestRefresh.css';

export default function TestRefreshPage() {
  const { token, refreshToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleTestRefresh = async () => {
    if (!refreshToken) {
      setResult('No refresh token available');
      return;
    }

    setLoading(true);
    try {
      console.log('Testing refresh with token:', refreshToken.substring(0, 20) + '...');
      
      const newTokens = await refreshTokens(refreshToken);
      
      setResult(`Success! New tokens:\nAccess: ${newTokens.access_token.substring(0, 50)}...\nRefresh: ${newTokens.refresh_token.substring(0, 50)}...`);
    } catch (error) {
      console.error('Refresh test error:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestApiCall = async () => {
    if (!token) {
      setResult('No access token available');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://89.35.125.136:8090/api/v1'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResult(`API call successful! User: ${JSON.stringify(data, null, 2)}`);
      } else {
        const error = await response.json();
        setResult(`API call failed: ${response.status} - ${JSON.stringify(error)}`);
      }
    } catch (error) {
      console.error('API test error:', error);
      setResult(`API test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-refresh-container">
      <h1>Refresh Token Test</h1>
      
      <div className="token-status">
        <h3>Current Token Status:</h3>
        <p><strong>Access Token:</strong> {token ? `${token.substring(0, 50)}...` : 'Not available'}</p>
        <p><strong>Refresh Token:</strong> {refreshToken ? `${refreshToken.substring(0, 50)}...` : 'Not available'}</p>
      </div>

      <div className="test-buttons">
        <button 
          onClick={handleTestRefresh}
          disabled={loading || !refreshToken}
          className="test-button"
        >
          {loading ? 'Testing...' : 'Test Refresh Token'}
        </button>

        <button 
          onClick={handleTestApiCall}
          disabled={loading || !token}
          className="test-button"
        >
          {loading ? 'Testing...' : 'Test API Call'}
        </button>
      </div>

      {result && (
        <div className="test-result">
          <h3>Result:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
