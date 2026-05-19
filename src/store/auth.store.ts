/**
 * Zustand store for authentication state
 * Persists tokens and user info in localStorage
 * Single source of truth for auth state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthStoreState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const AuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: !!accessToken,
        }),

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      setAuth: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: 'auth-store',
      // Only persist these fields
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
