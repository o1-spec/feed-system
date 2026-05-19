import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { usersService } from '@/services/users.service';
import { User, PaginatedResponse } from '@/types';

export const useSuggestedUsers = (limit: number = 20) => {
  return useInfiniteQuery<PaginatedResponse<User>>({
    queryKey: ['users', 'suggested', { limit }],
    queryFn: async ({ pageParam = undefined }) => {
      return usersService.getSuggestedUsers(limit, pageParam as string);
    },
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextCursor : undefined,
    initialPageParam: undefined,
    staleTime: 0,
  });
};

export const useSearchUsers = (query: string, limit: number = 10) => {
  return useQuery({
    queryKey: ['users', 'search', { query, limit }],
    queryFn: () => usersService.searchUsers(query, limit),
    enabled: query.length > 0,
    staleTime: 0,
  });
};
