'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User } from '@/types';
import { useFollowUser, useUnfollowUser } from '@/hooks/useUser';
import { showError } from '@/lib/toast';

interface UserCardProps {
  user: User;
  onFollowChange?: () => void;
}

export const UserCard = ({ user, onFollowChange }: UserCardProps) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing ?? false);
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const handleFollowClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      if (isFollowing) {
        await unfollowMutation.mutateAsync(user.id);
        setIsFollowing(false);
      } else {
        await followMutation.mutateAsync(user.id);
        setIsFollowing(true);
      }
      onFollowChange?.();
    } catch (error) {
      showError('Failed to update follow status');
    }
  };

  return (
    <Link href={`/profile/${user.id}`}>
      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200 cursor-pointer">
        
        <div className="flex items-center gap-3 flex-1 min-w-0">
          
          <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
            {user.username?.[0]?.toUpperCase() ?? 'U'}
          </div>

          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user.username}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {user.bio || 'No bio'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {user.followersCount ?? 0} followers
            </p>
          </div>
        </div>

        
        <button
          onClick={handleFollowClick}
          disabled={followMutation.isPending || unfollowMutation.isPending}
          className={`shrink-0 ml-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
            isFollowing
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {followMutation.isPending || unfollowMutation.isPending
            ? 'Loading...'
            : isFollowing
              ? 'Following'
              : 'Follow'}
        </button>
      </div>
    </Link>
  );
};
