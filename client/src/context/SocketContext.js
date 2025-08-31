import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const serverUrl = process.env.REACT_APP_SERVER_URL || 
      (process.env.NODE_ENV === 'production' 
        ? window.location.origin  // Use same domain for VPS deployment
        : 'http://localhost:5000');
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: true
    });
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const value = {
    socket,
    isConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
