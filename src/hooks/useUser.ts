import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/users.service';
import { User } from '@/types';
import { AuthStore } from '@/store/auth.store';

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersService.getUserById(userId),
    enabled: !!userId,
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersService.followUser(userId),
    onMutate: async (userId: string) => {
      await queryClient.cancelQueries({ queryKey: ['user', userId] });

      const previousUser = queryClient.getQueryData(['user', userId]);

      queryClient.setQueryData(['user', userId], (old: User | undefined) => {
        if (!old) return old;
        return {
          ...old,
          isFollowing: true,
          followerCount: (old.followerCount ?? old.followersCount ?? 0) + 1,
          followersCount: (old.followerCount ?? old.followersCount ?? 0) + 1,
        };
      });

      return { previousUser };
    },
    onError: (err, userId, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['user', userId], context.previousUser);
      }
    },
    onSettled: (_, __, userId) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersService.unfollowUser(userId),
    onMutate: async (userId: string) => {
      await queryClient.cancelQueries({ queryKey: ['user', userId] });

      const previousUser = queryClient.getQueryData(['user', userId]);

      queryClient.setQueryData(['user', userId], (old: User | undefined) => {
        if (!old) return old;
        return {
          ...old,
          isFollowing: false,
          followerCount: Math.max(0, (old.followerCount ?? old.followersCount ?? 0) - 1),
          followersCount: Math.max(0, (old.followerCount ?? old.followersCount ?? 0) - 1),
        };
      });

      return { previousUser };
    },
    onError: (err, userId, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['user', userId], context.previousUser);
      }
    },
    onSettled: (_, __, userId) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
};

export const useFollowers = (userId: string, limit: number = 20) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () => usersService.getFollowers(userId, undefined, limit),
    enabled: !!userId,
  });
};

export const useFollowing = (userId: string, limit: number = 20) => {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: () => usersService.getFollowing(userId, undefined, limit),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { username?: string; bio?: string; email?: string; coverUrl?: string; avatarUrl?: string }) =>
      usersService.updateUser(payload),
    onSuccess: (data) => {
      AuthStore.getState().setUser(data);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};
