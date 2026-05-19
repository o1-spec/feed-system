'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/useAuth';

export function Navbar() {
  const { user } = AuthStore();
  const logout = useLogout();

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/feed" className="flex items-center gap-2 font-bold text-xl">
            <Home className="w-6 h-6" />
            <span className="hidden sm:inline">Feed</span>
          </Link>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Right - User Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/notifications"
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition"
            >
              <Heart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            {user && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end">
                  <p className="text-sm font-medium">@{user.username}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {user.username[0].toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => logout.mutate()}
              className="px-4 py-2 text-sm font-medium rounded-full bg-red-500 hover:bg-red-600 text-white transition"
              disabled={logout.isPending}
            >
              {logout.isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
