import apiClient from '@/lib/axios';
import { User, PaginatedResponse } from '@/types';

interface UpdateUserPayload {
  username?: string;
  bio?: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  coverUrl?: string;
}

export const usersService = {
  getUserById: async (userId: string): Promise<User> => {
    const { data } = await apiClient.get(`/users/${userId}`);
    return data.data;
  },

  followUser: async (userId: string): Promise<User> => {
    const { data } = await apiClient.post(`/users/${userId}/follow`);
    return data.data;
  },

  unfollowUser: async (userId: string): Promise<User> => {
    const { data } = await apiClient.delete(`/users/${userId}/follow`);
    return data.data;
  },

  getFollowers: async (
    userId: string,
    cursor?: string,
    limit: number = 20
  ): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get(`/users/${userId}/followers`, {
      params: { cursor, limit },
    });
    return data.data;
  },

  getFollowing: async (
    userId: string,
    cursor?: string,
    limit: number = 20
  ): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get(`/users/${userId}/following`, {
      params: { cursor, limit },
    });
    return data.data;
  },

  searchUsers: async (query: string, limit: number = 10): Promise<User[]> => {
    const { data } = await apiClient.get('/users/search', {
      params: { q: query, limit },
    });
    return data.data;
  },

  getSuggestedUsers: async (
    limit: number = 20,
    cursor?: string
  ): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get('/users/suggested', {
      params: { limit, cursor },
    });
    return data.data;
  },

  updateUser: async (payload: UpdateUserPayload): Promise<User> => {
    const { data } = await apiClient.patch('/users/me', payload);
    return data.data;
  },
};
