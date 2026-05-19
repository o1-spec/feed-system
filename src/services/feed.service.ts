import apiClient from '@/lib/axios';
import { Post, PaginatedResponse } from '@/types';

export const feedService = {
  getFeed: async (
    cursor?: string,
    limit: number = 10
  ): Promise<PaginatedResponse<Post>> => {
    const { data } = await apiClient.get('/feed', {
      params: {
        cursor,
        limit,
      },
    });
    return data;
  },

  getPostById: async (postId: string): Promise<Post> => {
    const { data } = await apiClient.get(`/posts/${postId}`);
    return data;
  },

  getUserPosts: async (
    userId: string,
    cursor?: string,
    limit: number = 10
  ): Promise<PaginatedResponse<Post>> => {
    const { data } = await apiClient.get(`/users/${userId}/posts`, {
      params: { cursor, limit },
    });
    return data;
  },
};
