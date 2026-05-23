import { useEffect, useState } from 'react';
import { AuthStore } from '@/store/auth.store';
import { User } from '@/types';

export function useAuthStore() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setUser(AuthStore.getState().user);
    setIsLoading(AuthStore.getState().isLoading);
    setIsAuthenticated(AuthStore.getState().isAuthenticated);
    setToken(AuthStore.getState().accessToken);

    return AuthStore.subscribe((state) => {
      setUser(state.user);
      setIsLoading(state.isLoading);
      setIsAuthenticated(state.isAuthenticated);
      setToken(state.accessToken);
    });
  }, []);

  return {
    isMounted,
    isLoading,
    isAuthenticated,
    user,
    token,
  };
}
