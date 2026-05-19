'use client';

/**
 * Skeleton Loader Components
 * Used while data is being fetched
 */

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-800',
        className
      )}
    />
  );
}

/**
 * Post card skeleton loader
 */
export function PostCardSkeleton() {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4 space-y-4">
      {/* Header */}
      <div className="flex gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

/**
 * Feed skeleton (multiple post skeletons)
 */
export function FeedSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <PostCardSkeleton key={i} />
      ))}
    </>
  );
}

/**
 * User profile skeleton
 */
export function UserCardSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-24 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

/**
 * Comment skeleton
 */
export function CommentSkeleton() {
  return (
    <div className="space-y-3 p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}
