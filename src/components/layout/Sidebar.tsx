'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Bell,
  Mail,
  Bookmark,
  Users,
  X,
  Sparkles,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useCreatePost } from '@/hooks/usePost';
import { useUploadImage } from '@/hooks/useUpload';
import { useLayoutStore } from '@/store/layout.store';

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
  const [imageUrl, setImageUrl] = useState('');
  const createPost = useCreatePost();
  const uploadMutation = useUploadImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isDesktopCollapsed, isMobileOpen, toggleDesktopCollapsed, setMobileOpen } = useLayoutStore();

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadMutation.mutateAsync(file);
        setImageUrl(url);
      } catch (err) {

      }
    }
  };

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (composeContent.trim()) {
      createPost.mutate(
        { content: composeContent, imageUrl: imageUrl || undefined },
        {
          onSuccess: () => {
            setComposeContent('');
            setImageUrl('');
            setIsComposeOpen(false);
            setMobileOpen(false);
          },
        }
      );
    }
  };

  const remainingChars = 280 - composeContent.length;
  const isOverLimit = remainingChars < 0;

  return (
    <>
      
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-neutral-900 bg-[#08090a] transition-all duration-300 transform md:sticky md:top-0 md:h-screen md:translate-x-0',
          isMobileOpen ? 'translate-x-0 w-60' : '-translate-x-full md:translate-x-0',
          isDesktopCollapsed ? 'md:w-18' : 'md:w-60'
        )}
      >
        
        <div className="md:hidden flex justify-end p-2 border-b border-neutral-900/60">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded-md transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-6">
            <Link
              href="/feed"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-2 font-bold text-xs tracking-wider uppercase font-mono text-white',
                isDesktopCollapsed && 'md:justify-center'
              )}
            >
              <div className="w-5 h-5 rounded bg-neutral-900 border border-neutral-850 flex items-center justify-center shrink-0">
                <Home className="w-3 h-3 text-neutral-355" />
              </div>
              <span className={cn('inline', isDesktopCollapsed && 'md:hidden')}>
                timeline.sys
              </span>
            </Link>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition text-xs font-semibold duration-150',
                  isActive(link.href)
                    ? 'bg-neutral-900 border border-neutral-800 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50',
                  isDesktopCollapsed && 'md:justify-center md:px-2'
                )}
                title={isDesktopCollapsed ? link.label : undefined}
              >
                <div className="text-neutral-455 shrink-0">{link.icon}</div>
                <span className={cn('inline', isDesktopCollapsed && 'md:hidden')}>
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setIsComposeOpen(true)}
            className={cn(
              'w-full bg-white hover:bg-neutral-100 text-black font-bold transition duration-150 cursor-pointer text-center active:scale-98 shadow-sm flex items-center justify-center',
              isDesktopCollapsed
                ? 'md:w-9 md:h-9 md:p-0 md:rounded-lg mx-auto mt-6'
                : 'mt-6 px-3 py-2 text-xs rounded-lg'
            )}
          >
            {isDesktopCollapsed ? (
              <Sparkles className="w-4 h-4 text-black" />
            ) : (
              'Create Post'
            )}
          </button>
        </div>

        
        <div className="p-4 border-t border-neutral-900/60 hidden md:block">
          <button
            onClick={toggleDesktopCollapsed}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 text-neutral-500 hover:text-white rounded-lg hover:bg-neutral-900/40 transition duration-150 cursor-pointer font-mono text-[9px] tracking-wider uppercase',
              isDesktopCollapsed && 'justify-center px-2'
            )}
          >
            <div className="shrink-0 text-neutral-455">
              {isDesktopCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </div>
            <span className={cn('inline', isDesktopCollapsed && 'hidden')}>

            </span>
          </button>
        </div>

        {user && (
          <div className="border-t border-neutral-900 p-4 shrink-0">
            <Link href={`/profile/${user.id}`} onClick={() => setMobileOpen(false)} className="w-full">
              <button
                className={cn(
                  'w-full flex items-center p-2 rounded-lg hover:bg-neutral-900/50 transition cursor-pointer',
                  isDesktopCollapsed ? 'md:justify-center md:p-1' : 'justify-between'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg border border-neutral-800 bg-[#0d0e11] flex items-center justify-center font-mono text-xs text-neutral-400 font-bold shrink-0 overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user.username[0].toUpperCase()
                    )}
                  </div>
                  <div className={cn('text-left leading-none', isDesktopCollapsed && 'md:hidden')}>
                    <p className="text-xs font-bold text-neutral-200">@{user.username}</p>
                    <span className="text-[9px] font-mono text-neutral-500 mt-0.5 inline-block">
                      NODE_OK
                    </span>
                  </div>
                </div>
              </button>
            </Link>
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
                <span className="text-[10px] font-mono text-neutral-450 uppercase tracking-widest">

                </span>
              </div>
              <button
                onClick={() => {
                  setImageUrl('');
                  setIsComposeOpen(false);
                }}
                className="p-1 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded-md transition cursor-pointer"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleComposeSubmit} className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg border border-neutral-800 bg-[#0d0e11] flex items-center justify-center font-mono text-xs text-neutral-455 font-bold shrink-0">
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

              {uploadMutation.isPending && (
                <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest animate-pulse ml-12">

                </div>
              )}

              {imageUrl && (
                <div className="ml-12 relative inline-block">
                  <div className="border border-neutral-900 bg-neutral-950/40 rounded-lg p-1.5 max-w-[200px]">
                    <img src={imageUrl} alt="Uploaded asset" className="rounded-md max-h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="mt-1.5 w-full text-center text-[9px] font-mono text-red-500 hover:text-red-400 uppercase tracking-wider block border border-red-950/20 py-0.5 rounded bg-red-950/5 cursor-pointer"
                    >
                      [X] REMOVE
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-900 flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                    className="p-1.5 bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-neutral-450 hover:text-white rounded-lg transition cursor-pointer disabled:opacity-40"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {composeContent && (
                    <span className="text-[10px] font-mono text-neutral-550">
                      {Math.abs(remainingChars)} chars
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setComposeContent('');
                        setImageUrl('');
                        setIsComposeOpen(false);
                      }}
                      className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-neutral-400 text-xs font-semibold rounded-lg transition cursor-pointer font-mono text-[10px]"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={
                        !composeContent.trim() ||
                        isOverLimit ||
                        createPost.isPending ||
                        uploadMutation.isPending
                      }
                      className="px-4 py-1.5 bg-white disabled:opacity-40 text-black text-xs font-semibold rounded-lg hover:bg-neutral-100 transition active:scale-98 shadow-sm cursor-pointer font-mono text-[10px]"
                    >
                      {createPost.isPending ? 'PUBLISHING...' : 'PUBLISH'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
