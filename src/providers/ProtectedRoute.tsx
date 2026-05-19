'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthStore } from '@/store/auth.store';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [needsRedirect, setNeedsRedirect] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const state = AuthStore.getState();
    if (!state.isAuthenticated && !state.isLoading) {
      setNeedsRedirect(true);
    }
  }, [isReady]);

  useEffect(() => {
    if (needsRedirect) {
      router.push('/auth/login');
    }
  }, [needsRedirect, router]);

  if (!isReady) {
    return null;
  }

  const state = AuthStore.getState();
  if (state.isLoading) {
    return null;
  }

  if (!state.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
