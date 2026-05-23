import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messagesService, Message } from '@/services/messages.service';
import { AuthStore } from '@/store/auth.store';

export const useConversationsQuery = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagesService.getConversations(),
    refetchInterval: 5000,
  });
};

export const useConversationThreadQuery = (userId: string, limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['conversation', userId],
    queryFn: ({ pageParam }) => messagesService.getConversationThread(userId, limit, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!userId,
    refetchInterval: 3000,
  });
};

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ receiverId, content }: { receiverId: string; content: string }) =>
      messagesService.sendMessage(receiverId, content),
    onMutate: async ({ receiverId, content }) => {
      await queryClient.cancelQueries({ queryKey: ['conversation', receiverId] });
      const previousThread = queryClient.getQueryData(['conversation', receiverId]);
      const currentUser = AuthStore.getState().user;

      if (currentUser) {
        const optimisticMessage: Message = {
          id: `optimistic-${Date.now()}`,
          senderId: currentUser.id,
          receiverId,
          content,
          createdAt: new Date().toISOString(),
        };

        queryClient.setQueryData(['conversation', receiverId], (old: any) => {
          if (!old) {
            return {
              pages: [{ items: [optimisticMessage], nextCursor: null, hasNextPage: false }],
              pageParams: [undefined],
            };
          }

          const updatedPages = [...old.pages];
          const lastPageIndex = updatedPages.length - 1;
          updatedPages[lastPageIndex] = {
            ...updatedPages[lastPageIndex],
            items: [...updatedPages[lastPageIndex].items, optimisticMessage],
          };

          return {
            ...old,
            pages: updatedPages,
          };
        });
      }

      return { previousThread };
    },
    onError: (err, { receiverId }, context) => {
      if (context?.previousThread) {
        queryClient.setQueryData(['conversation', receiverId], context.previousThread);
      }
    },
    onSuccess: (data, { receiverId }) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onSettled: (_, __, { receiverId }) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', receiverId] });
    },
  });
};
