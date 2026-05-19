import apiClient from '@/lib/axios';
import { AuthResponse, User } from '@/types';

export const authService = {
  register: async (
    email: string,
    username: string,
    password: string
  ): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', {
      email,
      username,
      password,
    });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
};
