import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { AuthStore } from '@/store/auth.store';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { showSuccess, showError } from '@/lib/toast';

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      username,
      password,
      displayName,
    }: {
      email: string;
      username: string;
      password: string;
      displayName: string;
    }) => authService.register(email, username, password, displayName),
    onSuccess: (data) => {
      AuthStore.getState().setAuth(data.user, data.accessToken, data.refreshToken);
      queryClient.setQueryData(['currentUser'], data.user);
      router.push('/feed');
      showSuccess('Registration successful. Welcome!');
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || 'Registration failed');
    }
  });
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      AuthStore.getState().setAuth(data.user, data.accessToken, data.refreshToken);
      queryClient.setQueryData(['currentUser'], data.user);
      router.push('/feed');
      showSuccess(`Welcome back, ${data.user.username}!`);
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      AuthStore.getState().logout();
      queryClient.clear();
      router.push('/auth/login');
      showSuccess('Logged out successfully');
    },
  });
};

export const useCurrentUser = () => {
  const isAuthenticated = typeof window !== 'undefined' && AuthStore.getState().isAuthenticated;

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      AuthStore.getState().setUser(user);
      return user;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
