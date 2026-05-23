import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postsService } from '@/services/posts.service';
import { Post, Comment, PaginatedResponse } from '@/types';
import { useCallback } from 'react';

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => postsService.getPostById(postId),
    enabled: !!postId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content, imageUrl }: { content: string; imageUrl?: string }) =>
      postsService.createPost(content, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content, removeImage }: { postId: string; content?: string; removeImage?: boolean }) =>
      postsService.updatePost(postId, content, removeImage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsService.likePost(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });

      const previousFeed = queryClient.getQueryData(['feed']);
      queryClient.setQueryData(['feed'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: PaginatedResponse<Post>) => ({
            ...page,
            items: page.items.map((post: Post) =>
              post.id === postId
                ? { ...post, isLiked: true, likesCount: post.likesCount + 1 }
                : post
            ),
          })),
        };
      });

      return { previousFeed };
    },
    onError: (err, postId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};

export const useUnlikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsService.unlikePost(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });

      const previousFeed = queryClient.getQueryData(['feed']);

      queryClient.setQueryData(['feed'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: PaginatedResponse<Post>) => ({
            ...page,
            items: page.items.map((post: Post) =>
              post.id === postId
                ? { ...post, isLiked: false, likesCount: post.likesCount - 1 }
                : post
            ),
          })),
        };
      });

      return { previousFeed };
    },
    onError: (err, postId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsService.deletePost(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      await queryClient.cancelQueries({ queryKey: ['userPosts'] });

      const removeFromPages = (old: any) => {
        if (!old || !old.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: PaginatedResponse<Post>) => ({
            ...page,
            items: page.items.filter((post: Post) => post.id !== postId),
          })),
        };
      };

      queryClient.setQueryData(['feed'], removeFromPages);
      queryClient.setQueriesData({ queryKey: ['userPosts'] }, removeFromPages);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
  });
};

export const usePostComments = (postId: string, limit: number = 20) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => postsService.getComments(postId, undefined, limit),
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content, imageUrl }: { postId: string; content: string; imageUrl?: string }) =>
      postsService.createComment(postId, content, imageUrl),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};

export const useSearchPosts = (query: string, limit: number = 20) => {
  return useQuery({
    queryKey: ['searchPosts', query],
    queryFn: () => postsService.searchPosts(query, limit),
    enabled: !!query,
  });
};
