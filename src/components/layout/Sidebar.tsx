'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Bell,
  Mail,
  Bookmark,
  Users,
  MoreHorizontal,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthStore } from '@/store/auth.store';

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = AuthStore();

  const navLinks: NavLink[] = [
    { href: '/feed', label: 'Feed', icon: <Home className="w-5 h-5" /> },
    {
      href: '/notifications',
      label: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
    },
    { href: '/messages', label: 'Messages', icon: <Mail className="w-5 h-5" /> },
    {
      href: '/bookmarks',
      label: 'Bookmarks',
      icon: <Bookmark className="w-5 h-5" />,
    },
    {
      href: '/users',
      label: 'Discover',
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-black sticky top-0">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/feed" className="flex items-center gap-2 font-bold text-xl">
            <Home className="w-6 h-6" />
            <span>Feed</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-4 px-4 py-3 rounded-full transition font-medium',
                isActive(link.href)
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-900'
              )}
            >
              {link.icon}
              <span className="hidden lg:inline">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Compose Button */}
        <button className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition">
          Create Post
        </button>
      </div>

      {/* User Footer */}
      {user && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <button className="w-full flex items-center justify-between p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user.username[0].toUpperCase()}
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-bold">@{user.username}</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
