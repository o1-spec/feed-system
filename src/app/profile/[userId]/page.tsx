'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/providers/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { useUser, useFollowUser, useUnfollowUser, useFollowers, useFollowing } from '@/hooks/useUser';
import { useUserPosts } from '@/hooks/useFeed';
import { AuthStore } from '@/store/auth.store';
import { PostCard } from '@/components/post/PostCard';
import { PostCardSkeleton } from '@/components/common/Skeleton';
import { formatNumber } from '@/lib/utils';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Settings, Mail } from 'lucide-react';
import { UserList } from '@/components/user/UserList';
import { showError } from '@/lib/toast';

export default function ProfilePage() {
  const routerParams = useParams();
  const userId = routerParams.userId as string;
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'following' | 'followers'>('posts');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    setCurrentUser(AuthStore.getState().user);
    return AuthStore.subscribe((state) => {
      setCurrentUser(state.user);
    });
  }, []);

  const { data: user, isLoading: userLoading, refetch: refetchUser } = useUser(userId);
  const { data: postsData, isLoading: postsLoading } = useUserPosts(userId);
  const { data: followersData, isLoading: followersLoading, error: followersError, refetch: refetchFollowers } = useFollowers(userId);
  const { data: followingData, isLoading: followingLoading, error: followingError, refetch: refetchFollowing } = useFollowing(userId);

  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const isOwnProfile = currentUser?.id === userId;
  const posts = postsData?.pages.flatMap((page) => page.items) || [];
  const followers = followersData?.items || [];
  const following = followingData?.items || [];

  const handleFollowChange = () => {
    refetchUser();
    refetchFollowers();
    refetchFollowing();
  };

  if (userLoading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="max-w-2xl mx-auto border-l border-r border-neutral-900 min-h-screen bg-[#08090a]">
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
          <div className="max-w-2xl mx-auto border-l border-r border-neutral-900 min-h-screen bg-[#08090a] flex items-center justify-center font-mono">
            <div className="text-center">
              <h3 className="text-sm font-bold text-red-500 mb-2">// error: user_node_not_found</h3>
              <Link href="/feed" className="text-xs text-neutral-400 hover:text-white hover:underline transition">
                return_to_main_node
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
        <div className="max-w-2xl mx-auto border-l border-r border-neutral-900 min-h-screen bg-[#08090a] pb-12">

          <div className="border-b border-neutral-900 pb-4">

            <div className="h-32 bg-neutral-950 border-b border-neutral-900 relative overflow-hidden flex items-center justify-center">
              {user.coverUrl ? (
                <img src={user.coverUrl} alt="Cover" className="w-full h-full object-cover opacity-75" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-size-[16px_16px] opacity-20"></div>
                  <span className="text-[8px] font-mono text-neutral-800 tracking-widest uppercase">// cluster_cover_sys</span>
                </>
              )}
            </div>


            <div className="px-4">
              <div className="flex justify-between items-end -mt-10 mb-4">
                <div 
                  onClick={() => user.avatarUrl && setShowAvatarModal(true)}
                  className={`w-20 h-20 rounded-lg border border-neutral-800 bg-[#0d0e11] flex items-center justify-center font-mono text-xl text-neutral-450 font-bold shrink-0 shadow-2xl overflow-hidden ${user.avatarUrl ? 'cursor-pointer hover:opacity-80 transition' : ''}`}
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user.username[0].toUpperCase()
                  )}
                </div>

                <div className="flex gap-2">
                  {isOwnProfile && (
                    <Link href="/profile/edit">
                      <button className="px-4 py-2 border border-neutral-800 rounded-lg text-[10px] font-mono hover:bg-neutral-900/60 hover:text-white transition duration-150 cursor-pointer flex items-center gap-2 text-neutral-300">
                        <Settings className="w-3.5 h-3.5" />
                        EDIT_PARAMETERS
                      </button>
                    </Link>
                  )}

                  {!isOwnProfile && (
                    <>
                      <Link href={`/messages?userId=${user.id}`}>
                        <button className="px-4 py-2 border border-neutral-800 rounded-lg text-[10px] font-mono hover:bg-neutral-900/60 hover:text-white transition duration-150 cursor-pointer flex items-center gap-2 text-neutral-300">
                          <Mail className="w-3.5 h-3.5" />
                          MESSAGE
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          if (user.isFollowing) {
                            unfollowUser.mutate(user.id, {
                              onSuccess: () => {
                                handleFollowChange();
                              },
                              onError: () => {
                                showError('Failed to update follow status');
                              }
                            });
                          } else {
                            followUser.mutate(user.id, {
                              onSuccess: () => {
                                handleFollowChange();
                              },
                              onError: () => {
                                showError('Failed to update follow status');
                              }
                            });
                          }
                        }}
                        className={`px-4 py-2 border rounded-lg text-[10px] font-mono transition duration-150 cursor-pointer ${
                          user.isFollowing
                            ? 'border-neutral-850 text-neutral-500 hover:bg-neutral-900/60 hover:text-white'
                            : 'bg-white text-black hover:bg-neutral-200'
                        }`}
                      >
                        {user.isFollowing ? 'CONNECTED' : 'CONNECT'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-neutral-200">{user.username}</h1>
                  <span className="text-xs font-mono text-neutral-600">@{user.username}</span>
                </div>
                {user.bio && <p className="text-xs text-neutral-400 mt-2 font-light">{user.bio}</p>}

                <div className="flex gap-6 mt-4">
                  <button
                    onClick={() => setActiveTab('following')}
                    className="hover:underline flex items-center gap-1"
                  >
                    <span className="font-mono font-bold text-neutral-200 text-xs">
                      {formatNumber(user.followingCount)}
                    </span>{' '}
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">following</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('followers')}
                    className="hover:underline flex items-center gap-1"
                  >
                    <span className="font-mono font-bold text-neutral-200 text-xs">
                      {formatNumber(user.followerCount ?? user.followersCount ?? 0)}
                    </span>{' '}
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">followers</span>
                  </button>
                </div>
              </div>
            </div>


            <div className="flex border-b border-neutral-900 mt-6 font-mono text-[9px] tracking-widest uppercase">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 py-3 text-center cursor-pointer transition ${activeTab === 'posts'
                    ? 'border-b border-white text-white font-bold'
                    : 'text-neutral-500 hover:text-neutral-300'
                  }`}
              >
                / timeline_stream
              </button>
              <button
                onClick={() => setActiveTab('following')}
                className={`flex-1 py-3 text-center cursor-pointer transition ${activeTab === 'following'
                    ? 'border-b border-white text-white font-bold'
                    : 'text-neutral-500 hover:text-neutral-300'
                  }`}
              >
                / outbound_links
              </button>
              <button
                onClick={() => setActiveTab('followers')}
                className={`flex-1 py-3 text-center cursor-pointer transition ${activeTab === 'followers'
                    ? 'border-b border-white text-white font-bold'
                    : 'text-neutral-500 hover:text-neutral-300'
                  }`}
              >
                / inbound_links
              </button>
            </div>
          </div>


          <div className="mt-4">
            {activeTab === 'posts' && (
              postsLoading ? (
                <>
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </>
              ) : posts.length === 0 ? (
                <div className="flex items-center justify-center h-64 font-mono">
                  <div className="text-center">
                    <h3 className="text-xs font-bold text-neutral-400 mb-1">// empty_posts_log</h3>
                    <p className="text-[10px] text-neutral-600">no parameter updates published</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-neutral-900">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )
            )}

            {activeTab === 'following' && (
              <UserList
                users={following}
                isLoading={followingLoading}
                error={followingError}
                isEmpty={following.length === 0}
                emptyTitle="// empty_following_nodes"
                emptyMessage="no outbound data links established"
                onRetry={refetchFollowing}
                onFollowChange={handleFollowChange}
              />
            )}

            {activeTab === 'followers' && (
              <UserList
                users={followers}
                isLoading={followersLoading}
                error={followersError}
                isEmpty={followers.length === 0}
                emptyTitle="// empty_follower_clusters"
                emptyMessage="no inbound data links requesting connection"
                onRetry={refetchFollowers}
                onFollowChange={handleFollowChange}
              />
            )}
          </div>
        </div>

        {showAvatarModal && user?.avatarUrl && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" 
            onClick={() => setShowAvatarModal(false)}
          >
            <div className="relative max-w-lg w-full aspect-square bg-[#0d0e11] rounded-full overflow-hidden border border-neutral-800 shadow-2xl animate-in fade-in zoom-in duration-200">
              <img 
                src={user.avatarUrl} 
                alt={`${user.username}'s avatar`} 
                className="w-full h-full object-cover" 
              />
            </div>
            <button 
              className="absolute top-6 right-6 text-neutral-400 hover:text-white bg-black/50 hover:bg-black rounded-full p-2 transition"
              onClick={() => setShowAvatarModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        )}
      </MainLayout>
    </ProtectedRoute>
  );
}
