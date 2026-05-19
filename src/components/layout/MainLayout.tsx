'use client';

import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
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

      <div className="hidden xl:flex flex-col w-80 h-screen border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-black sticky top-0">
        <div className="p-4">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
