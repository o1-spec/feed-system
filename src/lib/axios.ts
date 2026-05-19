/**
 * Centralized Axios instance with auth interceptors
 * Handles automatic token refresh and request/response interception
 */

import axios, { AxiosError, AxiosInstance } from 'axios';
import { AuthStore } from '@/store/auth.store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach access token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = AuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Only retry once and only for 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = AuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token available');

        // Refresh the token using a new axios instance to avoid interceptor loops
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update store with new tokens
        AuthStore.getState().setTokens(accessToken, newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token refresh failed, logout user
        AuthStore.getState().logout();
        
        // Redirect to login if in browser
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
