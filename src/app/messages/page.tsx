'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/providers/ProtectedRoute';
import {
  useConversationsQuery,
  useConversationThreadQuery,
  useSendMessageMutation,
} from '@/hooks/useMessages';
import { AuthStore } from '@/store/auth.store';
import { Mail, Send, Terminal, Sparkles, MessageSquare, Cpu } from 'lucide-react';
import { Message } from '@/services/messages.service';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { formatDate } from '@/lib/utils';

import { User } from '@/types';

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const initUserId = searchParams.get('userId');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(initUserId);
  const [inputContent, setInputContent] = useState('');

  const { data: targetUser } = useUser(selectedUserId || '');

  useEffect(() => {
    setCurrentUser(AuthStore.getState().user);
    const unsubscribe = AuthStore.subscribe((state) => {
      setCurrentUser(state.user);
    });
    return () => unsubscribe();
  }, []);

  
  const { data: conversations = [], isLoading: isConvosLoading } = useConversationsQuery();

  
  const {
    data: threadData,
    isLoading: isThreadLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useConversationThreadQuery(selectedUserId || '', 50);

  const sendMessage = useSendMessageMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const existingConvo = conversations.find((c) => c.partner.id === selectedUserId);
  const activeConversation = existingConvo || (targetUser && selectedUserId ? { partner: targetUser, lastMessage: null } : null);
  const threadMessages = threadData?.pages.flatMap((page) => page.items) || [];

  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (threadMessages.length > 0) {
      scrollToBottom();
    }
  }, [threadMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId && inputContent.trim()) {
      sendMessage.mutate(
        { receiverId: selectedUserId, content: inputContent.trim() },
        {
          onSuccess: () => {
            setInputContent('');
            setTimeout(scrollToBottom, 100);
          },
        }
      );
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-5xl mx-auto min-h-[85vh] flex border-l border-r border-neutral-900 bg-[#08090a]">
          
          {}
          <div className="w-80 border-r border-neutral-900 flex flex-col shrink-0">
            {}
            <div className="p-4 border-b border-neutral-900 bg-[#08090a]/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                    Convo Directory
                  </span>
                </div>
                <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">
                  dmsg.sys
                </span>
              </div>
            </div>

            {}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {isConvosLoading ? (
                <div className="p-4 text-center text-[10px] font-mono text-neutral-600 animate-pulse">
                  SCANNING_CHANNELS...
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-neutral-600">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-neutral-800" />
                  <p className="text-[10px] font-mono leading-relaxed">NO_ACTIVE_CHANNELS</p>
                  <p className="text-[9px] text-neutral-600 leading-relaxed mt-1">
                    Follow users and click their profile logs to start communications.
                  </p>
                </div>
              ) : (
                conversations.map((convo) => {
                  const isSelected = convo.partner.id === selectedUserId;
                  const firstChar = convo.partner.username[0].toUpperCase();
                  return (
                    <button
                      key={convo.partner.id}
                      onClick={() => setSelectedUserId(convo.partner.id)}
                      className={`w-full p-2.5 rounded-lg flex items-start gap-3 transition text-left cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-900 border border-neutral-800 text-white'
                          : 'hover:bg-neutral-900/40 border border-transparent text-neutral-400 hover:text-white'
                      }`}
                    >
                      {}
                      <div className="w-8 h-8 rounded-lg border border-neutral-800 bg-[#0d0e11] flex items-center justify-center font-mono text-xs text-neutral-450 font-bold shrink-0">
                        {firstChar}
                      </div>

                      {}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold truncate leading-none mb-1">
                            @{convo.partner.username}
                          </p>
                          <span className="text-[8px] font-mono text-neutral-600">
                            {convo.lastMessage ? formatDate(convo.lastMessage.createdAt) : ''}
                          </span>
                        </div>
                        <p className="text-[10px] font-light text-neutral-500 truncate mt-0.5">
                          {convo.lastMessage ? convo.lastMessage.content : '// empty conversation'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {}
          <div className="flex-1 flex flex-col bg-[#07080a]">
            {selectedUserId && activeConversation ? (
              <>
                {}
                <div className="p-4 border-b border-neutral-900 bg-[#08090a]/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg border border-neutral-800 bg-[#0d0e11] flex items-center justify-center font-mono text-xs text-neutral-450 font-bold">
                      {activeConversation.partner.username[0].toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xs font-bold text-white tracking-tight uppercase leading-none">
                        @{activeConversation.partner.username}
                      </h2>
                      <span className="text-[9px] font-mono text-neutral-550 mt-1 inline-block">
                        ONLINE_LINK_SECURE
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-neutral-950 border border-neutral-850 rounded text-[8px] font-mono text-neutral-500">
                    <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                    <span>CHANNEL_OK</span>
                  </div>
                </div>

                {}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs leading-relaxed"
                >
                  {}
                  {hasNextPage && (
                    <div className="text-center py-2">
                      <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="px-3.5 py-1.5 bg-neutral-950 border border-neutral-850 hover:bg-neutral-900 text-neutral-500 hover:text-white text-[9px] font-mono rounded-md transition duration-150 active:scale-98"
                      >
                        {isFetchingNextPage ? 'RETRIEVING_OLDER_LOGS...' : 'RETRIEVE_OLDER_LOGS.EXE'}
                      </button>
                    </div>
                  )}

                  {isThreadLoading ? (
                    <div className="text-center p-8 text-neutral-600 animate-pulse text-[10px]">
                      ESTABLISHING_DATA_LINK...
                    </div>
                  ) : threadMessages.length === 0 ? (
                    <div className="text-center p-8 text-neutral-600">
                      <p className="text-[10px]">NO_LOGS_RECORDED</p>
                      <p className="text-[9px] text-neutral-700 mt-1">Send a message to open this communication node.</p>
                    </div>
                  ) : (
                    threadMessages.map((msg) => {
                      const isOwn = msg.senderId === currentUser?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-md rounded-lg px-3 py-2 border text-[11px] leading-relaxed shadow-sm font-sans ${
                              isOwn
                                ? 'bg-neutral-900 border-neutral-800 text-white'
                                : 'bg-neutral-950 border-neutral-900 text-neutral-350'
                            }`}
                          >
                            <p className="wrap-break-word font-light">{msg.content}</p>
                            <span className="text-[8px] font-mono text-neutral-600 mt-1.5 block text-right">
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {}
                <form
                  onSubmit={handleSend}
                  className="p-4 border-t border-neutral-900 bg-[#08090a]/50"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputContent}
                      onChange={(e) => setInputContent(e.target.value)}
                      placeholder="Input pipeline data packet..."
                      className="flex-1 bg-neutral-950 border border-neutral-850 focus:border-neutral-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-700 focus:outline-none font-mono"
                    />
                    <button
                      type="submit"
                      disabled={!inputContent.trim() || sendMessage.isPending}
                      className="px-4 bg-white text-black hover:bg-neutral-100 rounded-lg transition duration-150 flex items-center justify-center shrink-0 active:scale-98 cursor-pointer disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-500">
                <div className="border border-neutral-900 bg-[#08090a] rounded-xl p-8 max-w-sm shadow-2xl relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-850 flex items-center justify-center mb-6 shadow-inner">
                      <Cpu className="w-5 h-5 text-neutral-400" />
                    </div>

                    <h1 className="text-xs font-bold text-white uppercase font-mono tracking-wider mb-2">
                      Secure Messaging Console
                    </h1>
                    <p className="text-[10px] text-neutral-600 leading-relaxed max-w-xs mb-6">
                      Select a conversational node from the directory list on the left side to establish a secure, high-speed data stream link.
                    </p>

                    <div className="w-full bg-[#050507] border border-neutral-900 rounded-lg p-3 font-mono text-[9px] text-neutral-500 text-left mb-2">
                      <div className="flex items-center gap-1.5 border-b border-neutral-900 pb-1.5 mb-2">
                        <Terminal className="w-3 h-3 text-blue-500" />
                        <span className="text-neutral-500 uppercase font-semibold">Diagnostics</span>
                      </div>
                      <div className="space-y-0.5 leading-normal">
                        <p className="text-neutral-700">[$] init_link: secure_messages</p>
                        <p className="text-blue-500/80">LINK: awaiting_channel_selection</p>
                        <p className="text-neutral-700">[$] state: ready.exe</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
