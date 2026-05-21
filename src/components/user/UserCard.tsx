'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User } from '@/types';
import { useFollowUser, useUnfollowUser } from '@/hooks/useUser';
import { useAuthStore } from '@/hooks/useAuthStore';
import { showError } from '@/lib/toast';

interface UserCardProps {
  user: User;
  onFollowChange?: () => void;
}

export const UserCard = ({ user, onFollowChange }: UserCardProps) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing ?? false);
  const [followersCount, setFollowersCount] = useState(user.followerCount ?? user.followersCount ?? 0);
  const { user: currentUser } = useAuthStore();
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  useEffect(() => {
    setIsFollowing(user.isFollowing ?? false);
    setFollowersCount(user.followerCount ?? user.followersCount ?? 0);
  }, [user]);

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const originalFollowing = isFollowing;
    const originalFollowersCount = followersCount;

    const nextFollowing = !originalFollowing;
    setIsFollowing(nextFollowing);
    setFollowersCount((prev) => (nextFollowing ? prev + 1 : Math.max(0, prev - 1)));

    const mutation = nextFollowing ? followMutation : unfollowMutation;

    mutation.mutate(user.id, {
      onSuccess: () => {
        onFollowChange?.();
      },
      onError: () => {
        setIsFollowing(originalFollowing);
        setFollowersCount(originalFollowersCount);
        showError('Failed to update follow status');
      }
    });
  };

  return (
    <Link href={`/profile/${user.id}`}>
      <div className="flex items-center justify-between p-4 border border-neutral-900 rounded-lg bg-[#0d0e11]/40 hover:bg-neutral-900/40 transition duration-150 cursor-pointer">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="shrink-0 w-10 h-10 rounded-lg border border-neutral-800 bg-[#08090a] flex items-center justify-center font-mono text-sm text-neutral-400 font-bold overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user.username?.[0]?.toUpperCase() ?? 'U'
            )}
          </div>
 
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-neutral-250 truncate">
                {user.username}
              </p>
              <span className="text-[9px] font-mono text-neutral-600">@{user.username}</span>
            </div>
            <p className="text-[10px] text-neutral-500 truncate mt-0.5 font-light">
              {user.bio || 'no biography log'}
            </p>
            <p className="text-[8px] font-mono text-neutral-600 mt-1 uppercase tracking-wider">
              {followersCount} FOLLOWERS // {user.followingCount ?? 0} FOLLOWING
            </p>
          </div>
        </div>
 
        {currentUser?.id !== user.id && (
          <button
            onClick={handleFollowClick}
            className={`shrink-0 ml-4 px-3.5 py-1.5 border rounded-lg text-[10px] font-mono transition duration-150 cursor-pointer ${
              isFollowing
                ? 'border-neutral-800 text-neutral-500 hover:bg-neutral-900/60 hover:text-white'
                : 'bg-white text-black hover:bg-neutral-200'
            }`}
          >
            {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
          </button>
        )}
      </div>
    </Link>
  );
};
