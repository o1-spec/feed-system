import apiClient from '@/lib/axios';
import { User, PaginatedResponse } from '@/types';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  partner: User;
  lastMessage: Message;
}

export const messagesService = {
  sendMessage: async (receiverId: string, content: string): Promise<Message> => {
    const { data } = await apiClient.post('/messages', { receiverId, content });
    return data.data;
  },

  getConversations: async (): Promise<Conversation[]> => {
    const { data } = await apiClient.get('/messages/conversations');
    return data.data;
  },

  getConversationThread: async (
    userId: string,
    limit: number = 20,
    cursor?: string
  ): Promise<PaginatedResponse<Message>> => {
    const { data } = await apiClient.get(`/messages/conversation/${userId}`, {
      params: { limit, cursor },
    });
    return data.data;
  },
};
