import apiClient from '@/lib/axios';
import { Notification, PaginatedResponse } from '@/types';

export const notificationsService = {
  getNotifications: async (
    cursor?: string,
    limit: number = 20
  ): Promise<PaginatedResponse<Notification>> => {
    const { data } = await apiClient.get('/notifications', {
      params: { cursor, limit },
    });
    return data;
  },

  markAsRead: async (notificationId: string): Promise<Notification> => {
    const { data } = await apiClient.patch(
      `/notifications/${notificationId}/read`
    );
    return data;
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  },

  getUnreadCount: async (): Promise<{ unreadCount: number }> => {
    const { data } = await apiClient.get('/notifications/unread-count');
    return data;
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}`);
  },
};
