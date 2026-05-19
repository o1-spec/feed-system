import apiClient from '@/lib/axios';
import { Post, PaginatedResponse } from '@/types';

export const bookmarksService = {
  bookmarkPost: async (postId: string): Promise<any> => {
    const { data } = await apiClient.post(`/bookmarks/${postId}`);
    return data.data;
  },

  unbookmarkPost: async (postId: string): Promise<any> => {
    const { data } = await apiClient.delete(`/bookmarks/${postId}`);
    return data.data;
  },

  getBookmarks: async (
    limit: number = 20,
    cursor?: string
  ): Promise<PaginatedResponse<Post>> => {
    const { data } = await apiClient.get('/bookmarks', {
      params: { limit, cursor },
    });
    return data.data;
  },
};
