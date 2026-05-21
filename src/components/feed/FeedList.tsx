'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useFeed } from '@/hooks/useFeed';
import { PostCard } from '@/components/post/PostCard';
import { PostCardSkeleton } from '@/components/common/Skeleton';

export function FeedList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFeed();
  const observerTarget = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  // Sync ref with React Query fetching state to reset when fetching finishes
  useEffect(() => {
    if (!isFetchingNextPage) {
      isFetchingRef.current = false;
    }
  }, [isFetchingNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isFetchingRef.current
        ) {
          isFetchingRef.current = true; // Synchronously block multiple triggers in the same render cycle
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const posts = data?.pages.flatMap((page) => page.items) || [];

  if (isLoading) {
    return (
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {[1, 2, 3, 4, 5].map((i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">No posts yet</h3>
          <p className="text-gray-500">Be the first to post something!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      
      <div ref={observerTarget} className="py-8">
        {isFetchingNextPage && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {!hasNextPage && posts.length > 0 && (
        <div className="py-8 text-center text-gray-500">
          <p>You've reached the end of the feed</p>
        </div>
      )}
    </>
  );
}
