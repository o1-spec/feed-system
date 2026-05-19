'use client';

import { UserCard } from './UserCard';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { PostCardSkeleton } from '@/components/common/Skeleton';
import { User, PaginatedResponse } from '@/types';
import { Users } from 'lucide-react';

interface UserListProps {
  users: User[];
  isLoading: boolean;
  error: Error | null;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  onFollowChange?: () => void;
}

export const UserList = ({
  users,
  isLoading,
  error,
  isEmpty = false,
  emptyTitle = 'No users found',
  emptyMessage = 'No users to display',
  onRetry,
  onFollowChange,
}: UserListProps) => {
  if (isLoading) {
    return (
      <div className="divide-y divide-gray-200 dark:divide-gray-700 p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load users"
        message="Unable to load the user list. Please try again."
        onRetry={onRetry}
      />
    );
  }

  if (isEmpty || users.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-12 h-12 text-gray-400 mb-4" />}
        title={emptyTitle}
        message={emptyMessage}
      />
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {users.map((user) => (
        <div key={user.id} className="p-4">
          <UserCard user={user} onFollowChange={onFollowChange} />
        </div>
      ))}
    </div>
  );
};
