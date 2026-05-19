'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Bell,
  Mail,
  Bookmark,
  Users,
  MoreHorizontal,
  X,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useCreatePost } from '@/hooks/usePost';

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeContent, setComposeContent] = useState('');
  const createPost = useCreatePost();

  const navLinks: NavLink[] = [
    { href: '/feed', label: 'Timeline Feed', icon: <Home className="w-4 h-4" /> },
    {
      href: '/notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
    },
    { href: '/messages', label: 'Direct Logs', icon: <Mail className="w-4 h-4" /> },
    {
      href: '/bookmarks',
      label: 'Saved Index',
      icon: <Bookmark className="w-4 h-4" />,
    },
    {
      href: '/users',
      label: 'Discover Nodes',
      icon: <Users className="w-4 h-4" />,
    },
  ];

  const isActive = (href: string) => pathname === href;

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (composeContent.trim()) {
      createPost.mutate(composeContent, {
        onSuccess: () => {
          setComposeContent('');
          setIsComposeOpen(false);
        },
      });
    }
  };

  const remainingChars = 280 - composeContent.length;
  const isOverLimit = remainingChars < 0;

  return (
    <>
      <aside className="hidden md:flex flex-col w-60 h-screen border-r border-neutral-900 bg-[#08090a] sticky top-0">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          
          <div className="mb-6">
            <Link href="/feed" className="flex items-center gap-2 font-bold text-xs tracking-wider uppercase font-mono text-white">
              <div className="w-5 h-5 rounded bg-neutral-900 border border-neutral-850 flex items-center justify-center">
                <Home className="w-3 h-3 text-neutral-355" />
              </div>
              <span>timeline.sys</span>
            </Link>
          </div>

          
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition text-xs font-semibold duration-150',
                  isActive(link.href)
                    ? 'bg-neutral-900 border border-neutral-800 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                )}
              >
                <div className="text-neutral-455">{link.icon}</div>
                <span className="inline">{link.label}</span>
              </Link>
            ))}
          </nav>

          
          <button 
            onClick={() => setIsComposeOpen(true)}
            className="w-full mt-6 bg-white hover:bg-neutral-100 text-black text-xs font-bold py-2 px-3 rounded-lg transition duration-150 cursor-pointer text-center active:scale-98 shadow-sm"
          >
            Create Post
          </button>
        </div>

        
        {user && (
          <div className="border-t border-neutral-900 p-4">
            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-neutral-900/50 transition cursor-pointer">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg border border-neutral-800 bg-[#0d0e11] flex items-center justify-center font-mono text-xs text-neutral-400 font-bold">
                  {user.username[0].toUpperCase()}
                </div>
                <div className="text-left leading-none">
                  <p className="text-xs font-bold text-neutral-200">@{user.username}</p>
                  <span className="text-[9px] font-mono text-neutral-500 mt-0.5 inline-block">NODE_OK</span>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        )}
      </aside>

      
      {isComposeOpen && user && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="w-full max-w-lg bg-[#0c0d12] border border-neutral-800 rounded-xl shadow-2xl p-6 relative overflow-hidden font-sans animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/2 rounded-full blur-xl pointer-events-none"></div>

            
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] font-mono text-neutral-450 uppercase tracking-widest">// compose_timeline_node</span>
              </div>
              <button 
                onClick={() => setIsComposeOpen(false)}
                className="p-1 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded-md transition cursor-pointer"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            
            <form onSubmit={handleComposeSubmit} className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg border border-neutral-800 bg-[#0d0e11] flex items-center justify-center font-mono text-xs text-neutral-450 font-bold shrink-0">
                  {user.username[0].toUpperCase()}
                </div>
                <textarea
                  value={composeContent}
                  onChange={(e) => setComposeContent(e.target.value)}
                  placeholder="Publishing new parameters to follower feed cluster..."
                  className="w-full text-xs md:text-sm bg-transparent resize-none focus:outline-none placeholder-neutral-600 text-white font-light min-h-25"
                  autoFocus
                />
              </div>

              
              <div className="pt-4 border-t border-neutral-900 flex items-center justify-end gap-4">
                {composeContent && (
                  <span className={`text-[10px] font-mono ${isOverLimit ? 'text-red-500 font-bold' : 'text-neutral-550'}`}>
                    {Math.abs(remainingChars)} chars remaining
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setComposeContent('');
                      setIsComposeOpen(false);
                    }}
                    className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-neutral-400 text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!composeContent.trim() || isOverLimit || createPost.isPending}
                    className="px-4 py-1.5 bg-white disabled:opacity-40 text-black text-xs font-semibold rounded-lg hover:bg-neutral-100 transition active:scale-98 shadow-sm cursor-pointer"
                  >
                    {createPost.isPending ? 'Publishing...' : 'Publish'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
