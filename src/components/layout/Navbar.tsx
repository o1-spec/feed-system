'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Home, X, ShieldAlert, Menu } from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';
import { AuthStore } from '@/store/auth.store';
import { useLayoutStore } from '@/store/layout.store';

export function Navbar() {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [authState, setAuthState] = useState<{ isAuthenticated: boolean; user: any }>({
    isAuthenticated: false,
    user: null,
  });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const logout = useLogout();
  const { toggleMobileOpen } = useLayoutStore();

  useEffect(() => {
    setIsMounted(true);
    const state = AuthStore.getState();
    setAuthState({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
    });

    const unsubscribe = AuthStore.subscribe((state) => {
      setAuthState({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      });
    });

    return () => unsubscribe();
  }, []);

  const { isAuthenticated, user } = authState;

  const handleLogoutConfirm = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setIsLogoutModalOpen(false);
      }
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/users?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-neutral-900 bg-[#08090a]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 md:px-6">
          <div className="flex items-center justify-between h-14">

            <div className="flex items-center gap-3">
              {isMounted && isAuthenticated && user && (
                <button
                  onClick={toggleMobileOpen}
                  className="p-1.5 md:hidden text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition cursor-pointer"
                  title="Open Navigation Menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
              )}
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-sm tracking-tight text-white hover:opacity-80 transition duration-200"
              >
                <div className="w-6 h-6 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <Home className="w-3.5 h-3.5 text-neutral-200" />
                </div>
                <span className="font-mono tracking-wider text-xs font-bold uppercase hidden sm:inline">timeline.sys</span>
              </Link>
            </div>


            <div className="flex flex-1 max-w-30 xs:max-w-[160px] sm:max-w-xs mx-2 sm:mx-4">
              {isAuthenticated && user && (
                <form onSubmit={handleSearchSubmit} className="w-full">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0d0e11] border border-neutral-800 text-[10px] sm:text-xs text-white placeholder-neutral-550 focus:outline-none focus:border-neutral-700 transition"
                  />
                </form>
              )}
            </div>


            <div className="flex items-center gap-4">
              {isMounted ? (
                (isAuthenticated && user) ? (
                  <>
                    <Link
                      href="/notifications"
                      className="relative p-2 hover:bg-neutral-900 rounded-lg transition duration-200 text-neutral-400 hover:text-white"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    </Link>

                    {user && (
                      <div className="flex items-center gap-2">
                        <div className="hidden sm:flex flex-col items-end leading-none">
                          <p className="text-xs font-semibold text-neutral-200">
                            @{user.username}
                          </p>
                          <span className="text-[10px] font-mono text-neutral-500 mt-0.5">{user.email}</span>
                        </div>
                        <div className="w-7 h-7 rounded-lg border border-neutral-800 bg-[#0d0e11] flex items-center justify-center font-mono text-xs text-neutral-350 overflow-hidden">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            user.username[0].toUpperCase()
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setIsLogoutModalOpen(true)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-950/40 border border-red-900/30 hover:bg-red-900/20 text-red-400 hover:text-red-300 transition duration-200 cursor-pointer disabled:opacity-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white transition duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="relative px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white text-black hover:bg-neutral-100 transition duration-200 shadow-sm active:scale-98"
                    >
                      Get Started
                    </Link>
                  </>
                )
              ) : (

                <div className="h-6 w-16 bg-neutral-900 border border-neutral-800 rounded-lg animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </nav>


      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div
            className="w-full max-w-md bg-[#0c0d12] border border-neutral-850 rounded-xl shadow-2xl p-6 relative overflow-hidden font-sans animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/2 rounded-full blur-xl pointer-events-none"></div>


            <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-5">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">// disconnect_cluster_session</span>
              </div>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="p-1 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded-md transition cursor-pointer"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>


            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-bold text-white leading-snug">Confirm connection teardown?</h3>
              <p className="text-neutral-450 text-xs font-light leading-relaxed">
                This will invalidate your current JWT authentication credentials, clear the timeline subscription tokens, and return you to the public portal shell.
              </p>
            </div>


            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-neutral-450 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Keep Connected
              </button>
              <button
                type="button"
                onClick={handleLogoutConfirm}
                disabled={logout.isPending}
                className="px-4 py-1.5 bg-red-950/40 border border-red-900/30 hover:bg-red-900/20 text-red-400 text-xs font-semibold rounded-lg transition active:scale-98 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {logout.isPending ? 'Teardown...' : 'Teardown Connection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
