import { serverConfig } from '../config/server';

// Utility to display server configuration information
export const displayServerInfo = () => {
  const info = {
    environment: process.env.NODE_ENV || 'development',
    serverUrl: serverConfig.serverUrl,
    apiUrl: serverConfig.apiUrl,
    socketUrl: serverConfig.socketUrl,
    reactAppServerUrl: process.env.REACT_APP_SERVER_URL,
    windowLocation: typeof window !== 'undefined' ? window.location.origin : 'N/A'
  };

  console.log('🔧 Server Configuration:', info);
  return info;
};

// Check if server is reachable
export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${serverConfig.apiUrl}/health`);
    const data = await response.json();
    console.log('✅ Server Health Check:', data);
    return { status: 'healthy', data };
  } catch (error) {
    console.error('❌ Server Health Check Failed:', error);
    return { status: 'unhealthy', error: error.message };
  }
};

export default { displayServerInfo, checkServerHealth };
