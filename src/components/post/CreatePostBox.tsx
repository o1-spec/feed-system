'use client';

import React, { useState } from 'react';
import { Heart, ImageIcon, SmileIcon } from 'lucide-react';
import { useCreatePost } from '@/hooks/usePost';
import { useAuthStore } from '@/hooks/useAuthStore';

export function CreatePostBox() {
  const [content, setContent] = useState('');
  const createPost = useCreatePost();
  const { user } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      createPost.mutate(content, {
        onSuccess: () => {
          setContent('');
        },
      });
    }
  };

  const remainingChars = 280 - content.length;
  const isOverLimit = remainingChars < 0;

  if (!user) return null;

  return (
    <div className="border-b border-neutral-900 p-5 bg-[#08090a]">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="flex gap-4">
          
          <div className="w-8 h-8 rounded-lg border border-neutral-800 bg-[#0d0e11] flex items-center justify-center font-mono text-xs text-neutral-400 font-bold shrink-0">
            {user.username[0].toUpperCase()}
          </div>

          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening inside the cluster today?!"
              className="w-full text-xs md:text-sm bg-transparent resize-none focus:outline-none placeholder-neutral-600 text-white font-light"
              rows={3}
            />
          </div>
        </div>

        
        <div className="ml-12 border-t border-neutral-900 pt-4 flex items-center justify-between">
          
          <div className="flex gap-2">
            <button
              type="button"
              className="p-1.5 bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-neutral-450 hover:text-white rounded-lg transition cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1.5 bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-neutral-450 hover:text-white rounded-lg transition cursor-pointer"
            >
              <SmileIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          
          <div className="flex items-center gap-4">
            {content && (
              <span
                className={`text-[10px] font-mono ${
                  isOverLimit
                    ? 'text-red-500 font-bold'
                    : 'text-neutral-500'
                }`}
              >
                {Math.abs(remainingChars)}
              </span>
            )}
            <button
              type="submit"
              disabled={
                !content.trim() || isOverLimit || createPost.isPending
              }
              className="px-4 py-1.5 bg-white disabled:opacity-40 text-black text-xs font-semibold rounded-lg hover:bg-neutral-100 transition duration-150 active:scale-98 shadow-sm cursor-pointer"
            >
              {createPost.isPending ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
