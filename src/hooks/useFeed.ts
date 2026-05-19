import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { feedService } from '@/services/feed.service';
import { Post, PaginatedResponse } from '@/types';

export const useFeed = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      feedService.getFeed(pageParam, limit),
    getNextPageParam: (lastPage: PaginatedResponse<Post>) => {
      return lastPage.hasMore ? lastPage.cursor : undefined;
    },
    initialPageParam: undefined,
  });
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => feedService.getPostById(postId),
    enabled: !!postId,
  });
};

export const useUserPosts = (userId: string, limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ['userPosts', userId],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      feedService.getUserPosts(userId, pageParam, limit),
    getNextPageParam: (lastPage: PaginatedResponse<Post>) => {
      return lastPage.hasMore ? lastPage.cursor : undefined;
    },
    initialPageParam: undefined,
    enabled: !!userId,
  });
};
