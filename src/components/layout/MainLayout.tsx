'use client';

import React, { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useCurrentUser } from '@/hooks/useAuth';
import { SocketProvider } from '@/providers/SocketProvider';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/users?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  useCurrentUser();
  return (
    <SocketProvider>
      <div className="flex h-screen flex-col md:flex-row">
        <div className="md:hidden">
          <Navbar />
        </div>

        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="hidden md:block">
            <Navbar />
          </div>
          {children}
        </main>

        <div className="hidden xl:flex flex-col w-80 h-screen border-l border-neutral-900 bg-[#08090a] sticky top-0">
          <div className="p-4">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="bg-[#0c0d12] border border-neutral-850 rounded-lg px-3 py-1.5 flex items-center">
                <input
                  type="text"
                  placeholder="Search platform..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-neutral-550 focus:outline-none"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </SocketProvider>
  );
}
