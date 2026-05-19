'use client';

import { ProtectedRoute } from '@/providers/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { CreatePostBox } from '@/components/post/CreatePostBox';
import { FeedList } from '@/components/feed/FeedList';

export default function FeedPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-2xl mx-auto border-l border-r border-gray-200 dark:border-gray-700 min-h-screen">
          
          <CreatePostBox />

          
          <FeedList />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
