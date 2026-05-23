'use client';

import React, { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useCurrentUser } from '@/hooks/useAuth';
import { SocketProvider } from '@/providers/SocketProvider';
import { useSearchPosts } from '@/hooks/usePost';

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
  const [debouncedSearch, setDebouncedSearch] = useState('');

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchVal]);

  const { data, isLoading } = useSearchPosts(debouncedSearch, 10);

  return (
    <SocketProvider>
      <div className="flex h-screen w-full bg-[#08090a] justify-center">
        <div className="flex flex-col md:flex-row w-full max-w-[1248px] h-full md:justify-between relative">
          <div className="md:hidden w-full">
            <Navbar />
          </div>

          <Sidebar />

          <main className="flex-1 w-full max-w-2xl border-l border-r border-neutral-900 overflow-y-auto hide-scrollbar relative">
            <div className="hidden md:block">
              <Navbar />
            </div>
            {children}
          </main>

          <div className="hidden xl:flex flex-col w-80 h-screen border-l border-neutral-900 bg-[#08090a] sticky top-0 overflow-y-auto">
            <div className="p-4 sticky top-0 bg-[#08090a] z-10">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="bg-[#0c0d12] border border-neutral-850 rounded-lg px-3 py-1.5 flex items-center">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full bg-transparent text-xs text-white placeholder-neutral-550 focus:outline-none"
                  />
                </div>
              </form>
            </div>

            <div className="px-4 pb-4 space-y-4">
              {debouncedSearch && isLoading && (
                <div className="text-xs text-neutral-500 text-center py-4">Searching posts...</div>
              )}
              
              {debouncedSearch && !isLoading && data?.items?.length === 0 && (
                <div className="text-xs text-neutral-500 text-center py-4">No posts found for "{debouncedSearch}"</div>
              )}

              {debouncedSearch && !isLoading && data?.items?.map((post: any) => (
                <div 
                  key={post.id} 
                  onClick={() => router.push(`/posts/${post.id}`)}
                  className="p-3 border border-neutral-850 rounded-lg bg-[#0c0d12]/50 hover:bg-[#0c0d12] transition cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img src={post.author.avatarUrl} alt={post.author.username} className="w-5 h-5 rounded-full bg-neutral-800" />
                    <span className="text-xs font-semibold text-neutral-200">{post.author.displayName}</span>
                    <span className="text-[10px] text-neutral-500">@{post.author.username}</span>
                  </div>
                  <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SocketProvider>
  );
}
