import apiClient from '@/lib/axios';
import { User, PaginatedResponse } from '@/types';

interface UpdateUserPayload {
  username?: string;
  bio?: string;
  email?: string;
}

export const usersService = {
  getUserById: async (userId: string): Promise<User> => {
    const { data } = await apiClient.get(`/users/${userId}`);
    return data;
  },

  followUser: async (userId: string): Promise<User> => {
    const { data } = await apiClient.post(`/users/${userId}/follow`);
    return data;
  },

  unfollowUser: async (userId: string): Promise<User> => {
    const { data } = await apiClient.post(`/users/${userId}/unfollow`);
    return data;
  },

  getFollowers: async (
    userId: string,
    cursor?: string,
    limit: number = 20
  ): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get(`/users/${userId}/followers`, {
      params: { cursor, limit },
    });
    return data;
  },

  getFollowing: async (
    userId: string,
    cursor?: string,
    limit: number = 20
  ): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get(`/users/${userId}/following`, {
      params: { cursor, limit },
    });
    return data;
  },

  searchUsers: async (query: string, limit: number = 10): Promise<User[]> => {
    const { data } = await apiClient.get('/users/search', {
      params: { q: query, limit },
    });
    return data;
  },

  getSuggestedUsers: async (
    limit: number = 20,
    cursor?: string
  ): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get('/users/suggested', {
      params: { limit, cursor },
    });
    return data;
  },

  updateUser: async (payload: UpdateUserPayload): Promise<User> => {
    const { data } = await apiClient.patch('/users/profile', payload);
    return data;
  },
};
