import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { refreshTokens } from '../../api/authApi';
import './RefreshTest.css';

export default function RefreshTestPage() {
  const { token, refreshToken, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testManualRefresh = async () => {
    if (!refreshToken) {
      addLog('❌ No refresh token available');
      return;
    }

    setLoading(true);
    addLog('🔄 Starting manual refresh test...');
    
    try {
      addLog(`📤 Sending refresh token: ${refreshToken.substring(0, 20)}...`);
      
      const newTokens = await refreshTokens(refreshToken);
      
      addLog('✅ Refresh successful!');
      addLog(`📥 New access token: ${newTokens.access_token.substring(0, 20)}...`);
      addLog(`📥 New refresh token: ${newTokens.refresh_token.substring(0, 20)}...`);
      
      // Update tokens in context
      login(newTokens.access_token, newTokens.refresh_token);
      
      addLog('✅ Tokens updated in context');
    } catch (error) {
      addLog(`❌ Refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testApiCall = async () => {
    if (!token) {
      addLog('❌ No access token available');
      return;
    }

    setLoading(true);
    addLog('🔄 Testing API call with current token...');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://89.35.125.136:8090/api/v1'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        addLog('✅ API call successful!');
        addLog(`👤 User: ${JSON.stringify(data, null, 2)}`);
      } else {
        const error = await response.json();
        addLog(`❌ API call failed: ${response.status}`);
        addLog(`📄 Error: ${JSON.stringify(error, null, 2)}`);
      }
    } catch (error) {
      addLog(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const clearTokens = () => {
    logout();
    addLog('🗑️ Tokens cleared');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="refresh-test-container">
      <h1>Refresh Token Debug</h1>
      
      <div className="token-status">
        <h3>Current Status</h3>
        <div className="status-item">
          <strong>Access Token:</strong> 
          <span className={token ? 'valid' : 'invalid'}>
            {token ? `${token.substring(0, 50)}...` : 'Not available'}
          </span>
        </div>
        <div className="status-item">
          <strong>Refresh Token:</strong> 
          <span className={refreshToken ? 'valid' : 'invalid'}>
            {refreshToken ? `${refreshToken.substring(0, 50)}...` : 'Not available'}
          </span>
        </div>
      </div>

      <div className="test-buttons">
        <button 
          onClick={testManualRefresh}
          disabled={loading || !refreshToken}
          className="test-button refresh"
        >
          {loading ? 'Testing...' : '🔄 Test Refresh'}
        </button>

        <button 
          onClick={testApiCall}
          disabled={loading || !token}
          className="test-button api"
        >
          {loading ? 'Testing...' : '🔍 Test API Call'}
        </button>

        <button 
          onClick={clearTokens}
          disabled={loading}
          className="test-button clear"
        >
          🗑️ Clear Tokens
        </button>

        <button 
          onClick={clearLogs}
          disabled={loading}
          className="test-button logs"
        >
          📋 Clear Logs
        </button>
      </div>

      <div className="logs-container">
        <h3>Debug Logs</h3>
        <div className="logs">
          {logs.length === 0 ? (
            <div className="no-logs">No logs yet. Run a test to see logs.</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="log-entry">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
