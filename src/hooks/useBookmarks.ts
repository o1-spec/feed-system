import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarksService } from '@/services/bookmarks.service';

export const useBookmarksQuery = (limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['bookmarks'],
    queryFn: ({ pageParam }) => bookmarksService.getBookmarks(limit, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};

export const useBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => bookmarksService.bookmarkPost(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
};

export const useUnbookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => bookmarksService.unbookmarkPost(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
};
