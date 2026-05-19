import apiClient from '@/lib/axios';
import { AuthResponse, User } from '@/types';

export const authService = {
  register: async (
    email: string,
    username: string,
    password: string,
    displayName: string
  ): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', {
      email,
      username,
      password,
      displayName,
    });
    return data.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get('/users/me');
    return data.data;
  },
};
