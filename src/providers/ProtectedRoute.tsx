'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthStore } from '@/store/auth.store';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    setIsMounted(true);

    const state = AuthStore.getState();
    setAuthState({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
    });

    const unsubscribe = AuthStore.subscribe((state) => {
      setAuthState({
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
      });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isMounted && !authState.isAuthenticated && !authState.isLoading) {
      router.push('/auth/login');
    }
  }, [isMounted, authState.isAuthenticated, authState.isLoading, router]);


  if (!isMounted || authState.isLoading) {
    return (
      <div className="min-h-screen bg-[#08090a] flex flex-col items-center justify-center text-white">
        <div className="relative flex flex-col items-center gap-4 font-mono text-xs">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-850 flex items-center justify-center">
            <span className="w-3.5 h-3.5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></span>
          </div>
          <p className="text-[10px] tracking-widest text-neutral-500 uppercase mt-2">
            sec_verify.exe
          </p>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
