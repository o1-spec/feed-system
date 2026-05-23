'use client';

import { ProtectedRoute } from '@/providers/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { CreatePostBox } from '@/components/post/CreatePostBox';
import { FeedList } from '@/components/feed/FeedList';

export default function FeedPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="w-full min-h-screen pb-20">
          
          <CreatePostBox />

          
          <FeedList />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
