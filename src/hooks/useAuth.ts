import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { AuthStore } from '@/store/auth.store';
import { User } from '@/types';
import { useRouter } from 'next/navigation';

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      username,
      password,
    }: {
      email: string;
      username: string;
      password: string;
    }) => authService.register(email, username, password),
    onSuccess: (data) => {
      AuthStore.getState().setAuth(data.user, data.accessToken, data.refreshToken);
      queryClient.setQueryData(['currentUser'], data.user);
      router.push('/feed');
    },
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
    },
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
    },
  });
};

export const useCurrentUser = () => {
  const authStore = AuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
