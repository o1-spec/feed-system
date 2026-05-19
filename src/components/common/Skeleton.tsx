'use client';

/**
 * Skeleton Loader Components
 * Redesigned to match the high-density premium dark systems dashboard
 */

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-neutral-900',
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
    <div className="border-b border-neutral-900 p-5 space-y-4 bg-[#08090a]">
      {/* Header */}
      <div className="flex gap-3">
        <Skeleton className="w-8 h-8 rounded-lg border border-neutral-850" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Skeleton className="h-6 w-12 rounded-lg" />
        <Skeleton className="h-6 w-12 rounded-lg" />
        <Skeleton className="h-6 w-12 rounded-lg" />
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
    <div className="space-y-4 p-5 bg-[#08090a]">
      <Skeleton className="h-24 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Comment skeleton
 */
export function CommentSkeleton() {
  return (
    <div className="space-y-3 p-5 border-b border-neutral-900 bg-[#08090a]">
      <div className="flex gap-3">
        <Skeleton className="w-8 h-8 rounded-lg border border-neutral-850" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
    </div>
  );
}
