'use client';

import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/providers/ProtectedRoute';
import { UserList } from '@/components/user/UserList';
import { useFollowing } from '@/hooks/useUser';
import { ChevronLeft, Users } from 'lucide-react';
import Link from 'next/link';

export default function FollowingPage() {
  const params = useParams();
  const userId = params.userId as string;

  const { data: followingData, isLoading, error, refetch } = useFollowing(userId);
  const following = followingData?.data ?? [];

  const handleFollowChange = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 backdrop-blur border-b border-gray-200 dark:border-gray-700 py-4 px-6 flex items-center gap-4">
            <Link href={`/profile/${userId}`}>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Following
              </h1>
            </div>
          </div>

          {/* User List */}
          <UserList
            users={following}
            isLoading={isLoading}
            error={error}
            isEmpty={following.length === 0}
            emptyTitle="Not following anyone yet"
            emptyMessage="This user is not following anyone yet"
            onRetry={() => refetch()}
            onFollowChange={handleFollowChange}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
