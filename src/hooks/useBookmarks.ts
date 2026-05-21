import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarksService } from '@/services/bookmarks.service';
import { showSuccess } from '@/lib/toast';

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
      showSuccess('Post bookmarked');
    },
  });
};

export const useUnbookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => bookmarksService.unbookmarkPost(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['bookmarks'] });

      const previousBookmarks = queryClient.getQueryData(['bookmarks']);

      queryClient.setQueryData(['bookmarks'], (old: any) => {
        if (!old || !old.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            items: page.items.filter((post: any) => post.id !== postId),
          })),
        };
      });

      return { previousBookmarks };
    },
    onError: (err, postId, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(['bookmarks'], context.previousBookmarks);
      }
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      showSuccess('Post removed from bookmarks');
    },
  });
};
