'use client';

import { ProtectedRoute } from '@/providers/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-2xl mx-auto border-l border-r border-gray-200 dark:border-gray-700 min-h-screen">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>

          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">No notifications yet</h3>
              <p className="text-gray-500">When you get likes or comments, you'll see them here</p>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
