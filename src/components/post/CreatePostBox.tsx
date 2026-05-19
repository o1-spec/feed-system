'use client';

import React, { useState } from 'react';
import { Heart, ImageIcon, SmileIcon } from 'lucide-react';
import { useCreatePost } from '@/hooks/usePost';
import { AuthStore } from '@/store/auth.store';

export function CreatePostBox() {
  const [content, setContent] = useState('');
  const createPost = useCreatePost();
  const { user } = AuthStore();

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
    <div className="border-b border-gray-200 dark:border-gray-700 p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header */}
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
            <span className="text-white font-bold">
              {user.username[0].toUpperCase()}
            </span>
          </div>

          {/* Input */}
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?!"
              className="w-full text-xl bg-transparent resize-none focus:outline-none"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="ml-16 border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
          {/* Icons */}
          <div className="flex gap-2 text-blue-500">
            <button
              type="button"
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition"
            >
              <SmileIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Character count and submit */}
          <div className="flex items-center gap-4">
            {content && (
              <span
                className={`text-sm ${
                  isOverLimit
                    ? 'text-red-500 font-bold'
                    : 'text-gray-500'
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
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold rounded-full transition"
            >
              {createPost.isPending ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
