'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/providers/ProtectedRoute';
import { UserCard } from '@/components/user/UserCard';
import { SearchInput } from '@/components/common/SearchInput';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { PostCardSkeleton } from '@/components/common/Skeleton';
import { useSuggestedUsers, useSearchUsers } from '@/hooks/useUsers';
import { Users } from 'lucide-react';

function UsersContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const suggestedQuery = useSuggestedUsers(20);
  const searchQueryResult = useSearchUsers(searchQuery, 20);

  const handleFollowChange = useCallback(() => {

  }, []);

  const showSearch = searchQuery.length > 0;
  const isSearching = showSearch && searchQueryResult.isLoading;
  const searchResults = showSearch ? searchQueryResult.data ?? [] : [];

  const suggestedUsers = showSearch
    ? []
    : suggestedQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const isSuggestedLoading = showSearch ? false : suggestedQuery.isLoading;
  const suggestedError = showSearch ? null : suggestedQuery.error;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 z-10 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 backdrop-blur border-b border-gray-200 dark:border-gray-700 py-4 px-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Discover Users
          </h1>
        </div>

        <SearchInput
          placeholder="Search users by name or username..."
          onSearch={setSearchQuery}
          defaultValue={searchQuery}
        />
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {showSearch && (
          <>
            {isSearching && (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            )}

            {searchQueryResult.error && (
              <ErrorState
                title="Failed to search users"
                message="Unable to search for users. Please try again."
                onRetry={() => searchQueryResult.refetch()}
              />
            )}

            {!isSearching && !searchQueryResult.error && searchResults.length === 0 && (
              <EmptyState
                icon={<Users className="w-12 h-12 text-gray-400 mb-4" />}
                title="No users found"
                message={`No users found matching "${searchQuery}"`}
              />
            )}

            {searchResults.map((user) => (
              <div key={user.id} className="p-4">
                <UserCard
                  user={user}
                  onFollowChange={handleFollowChange}
                />
              </div>
            ))}
          </>
        )}

        {!showSearch && (
          <>
            {isSuggestedLoading && (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            )}

            {suggestedError && (
              <ErrorState
                title="Failed to load users"
                message="Unable to load suggested users. Please try again."
                onRetry={() => suggestedQuery.refetch()}
              />
            )}

            {!isSuggestedLoading && !suggestedError && suggestedUsers.length === 0 && (
              <EmptyState
                icon={<Users className="w-12 h-12 text-gray-400 mb-4" />}
                title="No users available"
                message="Check back later for more users to follow"
              />
            )}

            {suggestedUsers.map((user) => (
              <div key={user.id} className="p-4">
                <UserCard
                  user={user}
                  onFollowChange={handleFollowChange}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Suspense fallback={
          <div className="max-w-2xl mx-auto p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        }>
          <UsersContent />
        </Suspense>
      </MainLayout>
    </ProtectedRoute>
  );
}
