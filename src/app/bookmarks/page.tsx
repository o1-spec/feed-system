'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/providers/ProtectedRoute';
import { PostCard } from '@/components/post/PostCard';
import { PostCardSkeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { useBookmarksQuery } from '@/hooks/useBookmarks';
import { Bookmark, Sparkles } from 'lucide-react';

export default function BookmarksPage() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useBookmarksQuery(20);

  const posts = data?.pages.flatMap((page) => page.items) || [];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-2xl mx-auto border-l border-r border-neutral-900 min-h-screen bg-[#08090a]">
          {}
          <div className="sticky top-0 z-10 bg-[#08090a]/80 backdrop-blur-md border-b border-neutral-900 py-4 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-neutral-850 flex items-center justify-center">
                  <Bookmark className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white tracking-tight uppercase font-mono leading-none">
                    Saved Index
                  </h1>
                  <span className="text-[9px] font-mono text-neutral-550 mt-1 inline-block uppercase tracking-wider">
                    
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-950 border border-neutral-850 rounded-lg text-[9px] font-mono text-neutral-500">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>SYNC_OK</span>
              </div>
            </div>
          </div>

          {}
          <div className="divide-y divide-neutral-900">
            {isLoading && (
              <div className="p-4 space-y-4">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </div>
            )}

            {isError && (
              <div className="p-8">
                <ErrorState
                  title="Failed to load index"
                  message="An issue occurred connecting to bookmarks.sys database nodes."
                  onRetry={() => refetch()}
                />
              </div>
            )}

            {!isLoading && !isError && posts.length === 0 && (
              <div className="p-8">
                <EmptyState
                  icon={
                    <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-900 flex items-center justify-center mb-4">
                      <Bookmark className="w-6 h-6 text-neutral-600" />
                    </div>
                  }
                  title="Index is empty"
                  message="Bookmark logs from the main timeline feed to save them in your workspace."
                />
              </div>
            )}

            {!isLoading &&
              !isError &&
              posts.map((post) => (
                <PostCard key={post.id} post={{ ...post, isBookmarked: true }} />
              ))}

            {}
            {hasNextPage && (
              <div className="p-6 text-center bg-[#08090a]">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-6 py-2 bg-neutral-950 border border-neutral-850 hover:bg-neutral-900 text-neutral-400 hover:text-white text-xs font-mono rounded-lg transition duration-150 active:scale-98"
                >
                  {isFetchingNextPage ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>SCANNING_DATABASE...</span>
                    </span>
                  ) : (
                    'LOAD_MORE_NODES.EXE'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
