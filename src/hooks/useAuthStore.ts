import { useEffect, useState } from 'react';
import { AuthStore } from '@/store/auth.store';

export function useAuthStore() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLoading = AuthStore((state) => state.isLoading);
  const isAuthenticated = AuthStore((state) => state.isAuthenticated);
  const user = AuthStore((state) => state.user);

  return {
    isMounted,
    isLoading,
    isAuthenticated,
    user,
  };
}
