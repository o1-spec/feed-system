import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthStore } from '@/store/auth.store';

// Singleton socket instance to avoid multiple connections across re-renders
let socketInstance: Socket | null = null;

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(socketInstance);
  const [isConnected, setIsConnected] = useState(socketInstance?.connected || false);

  useEffect(() => {
    const state = AuthStore.getState();
    const token = state.accessToken;

    if (!token) {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    if (!socketInstance) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';
      socketInstance = io(apiUrl, {
        auth: { token },
        transports: ['websocket'],
      });

      socketInstance.on('connect', () => setIsConnected(true));
      socketInstance.on('disconnect', () => setIsConnected(false));
      setSocket(socketInstance);
    } else {
      // Ensure the token is up to date if reconnecting
      socketInstance.auth = { token };
      if (socketInstance.disconnected) {
        socketInstance.connect();
      }
    }

    const unsubscribe = AuthStore.subscribe((newState) => {
      if (!newState.accessToken && socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
        setSocket(null);
        setIsConnected(false);
      } else if (newState.accessToken && socketInstance) {
        socketInstance.auth = { token: newState.accessToken };
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { socket, isConnected };
};
