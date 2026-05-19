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
    mutationFn: (content: string) => postsService.createPost(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
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
            data: page.data.map((post: Post) =>
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
            data: page.data.map((post: Post) =>
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
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
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      postsService.createComment(postId, content),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};
