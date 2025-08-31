// Server configuration for different environments
const config = {
  development: {
    serverUrl: process.env.REACT_APP_SERVER_URL ,
    apiUrl: process.env.REACT_APP_API_URL ,
    socketUrl: process.env.REACT_APP_SOCKET_URL
  },
  production: {
    serverUrl: process.env.REACT_APP_SERVER_URL || window.location.origin,
    apiUrl: process.env.REACT_APP_API_URL || `${window.location.origin}/api`,
    socketUrl: process.env.REACT_APP_SOCKET_URL || window.location.origin
  }
};

// Get current environment
const env = process.env.NODE_ENV || 'development';

// Export configuration for current environment
export const serverConfig = config[env];

// Helper functions
export const getServerUrl = () => serverConfig.serverUrl;
export const getApiUrl = () => serverConfig.apiUrl;
export const getSocketUrl = () => serverConfig.socketUrl;

// Log configuration in development
if (env === 'development') {
  console.log('Server Configuration:', serverConfig);
}

export default serverConfig;
