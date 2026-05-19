import apiClient from '@/lib/axios';
import { Post, Comment, PaginatedResponse } from '@/types';

export const postsService = {
  getPostById: async (postId: string): Promise<Post> => {
    const { data } = await apiClient.get(`/posts/${postId}`);
    return data.data;
  },

  createPost: async (content: string): Promise<Post> => {
    const { data } = await apiClient.post('/posts', { content });
    return data.data;
  },

  likePost: async (postId: string): Promise<Post> => {
    const { data } = await apiClient.post(`/posts/${postId}/like`);
    return data.data;
  },

  unlikePost: async (postId: string): Promise<Post> => {
    const { data } = await apiClient.delete(`/posts/${postId}/like`);
    return data.data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await apiClient.delete(`/posts/${postId}`);
  },

  createComment: async (postId: string, content: string): Promise<Comment> => {
    const { data } = await apiClient.post(`/posts/${postId}/comments`, {
      content,
    });
    return data.data;
  },

  getComments: async (
    postId: string,
    cursor?: string,
    limit: number = 20
  ): Promise<PaginatedResponse<Comment>> => {
    const { data } = await apiClient.get(`/posts/${postId}/comments`, {
      params: { cursor, limit },
    });
    return data.data;
  },

  likeComment: async (commentId: string): Promise<Comment> => {
    const { data } = await apiClient.post(`/comments/${commentId}/like`);
    return data.data;
  },

  unlikeComment: async (commentId: string): Promise<Comment> => {
    const { data } = await apiClient.post(`/comments/${commentId}/unlike`);
    return data.data;
  },
};
