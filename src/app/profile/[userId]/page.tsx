'use client';

import { ProtectedRoute } from '@/providers/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { useUser, useFollowUser, useUnfollowUser } from '@/hooks/useUser';
import { useUserPosts } from '@/hooks/useFeed';
import { AuthStore } from '@/store/auth.store';
import { PostCard } from '@/components/post/PostCard';
import { PostCardSkeleton } from '@/components/common/Skeleton';
import { formatNumber } from '@/lib/utils';
import Link from 'next/link';
import { Settings } from 'lucide-react';

interface ProfilePageProps {
  params: { userId: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { user: currentUser } = AuthStore();
  const { data: user, isLoading: userLoading } = useUser(params.userId);
  const { data: postsData, isLoading: postsLoading } = useUserPosts(params.userId);
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const isOwnProfile = currentUser?.id === params.userId;
  const posts = postsData?.pages.flatMap((page) => page.items) || [];

  if (userLoading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="max-w-2xl mx-auto border-l border-r border-gray-200 dark:border-gray-700 min-h-screen">
            <PostCardSkeleton />
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="max-w-2xl mx-auto border-l border-r border-gray-200 dark:border-gray-700 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">User not found</h3>
              <Link href="/feed" className="text-blue-500 hover:underline">
                Go back to feed
              </Link>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-2xl mx-auto border-l border-r border-gray-200 dark:border-gray-700 min-h-screen">
          {/* Profile Header */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            {/* Cover Image */}
            <div className="h-32 bg-linear-to-r from-blue-500 to-purple-500"></div>

            {/* Profile Info */}
            <div className="px-4 pb-4">
              <div className="flex justify-between items-start -mt-16 mb-4">
                <div className="w-24 h-24 rounded-full bg-linear-to-r from-blue-500 to-purple-500 border-4 border-white dark:border-black flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {user.username[0].toUpperCase()}
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
                  {isOwnProfile && (
                    <Link href="/profile/edit">
                      <button className="px-6 py-2 rounded-full font-bold transition bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Edit
                      </button>
                    </Link>
                  )}

                  {!isOwnProfile && (
                    <button
                      onClick={() => {
                        if (user.isFollowing) {
                          unfollowUser.mutate(user.id);
                        } else {
                          followUser.mutate(user.id);
                        }
                      }}
                      disabled={followUser.isPending || unfollowUser.isPending}
                      className={`px-6 py-2 rounded-full font-bold transition ${
                        user.isFollowing
                          ? 'bg-gray-200 dark:bg-gray-800 hover:bg-red-100'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold">@{user.username}</h1>
                {user.bio && <p className="text-gray-600 dark:text-gray-400 mt-2">{user.bio}</p>}

                <div className="flex gap-6 mt-4 text-gray-500">
                  <Link href={`/profile/${user.id}/following`} className="hover:underline">
                    <span className="font-bold text-black dark:text-white">
                      {formatNumber(user.followingCount)}
                    </span>{' '}
                    Following
                  </Link>
                  <Link href={`/profile/${user.id}/followers`} className="hover:underline">
                    <span className="font-bold text-black dark:text-white">
                      {formatNumber(user.followersCount)}
                    </span>{' '}
                    Followers
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div>
            {postsLoading ? (
              <>
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </>
            ) : posts.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">No posts yet</h3>
                  <p className="text-gray-500">This user hasn't posted anything</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
