'use client';

import React, { useState, useRef } from 'react';
import { ImageIcon, SmileIcon } from 'lucide-react';
import { useCreatePost } from '@/hooks/usePost';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useUploadImage } from '@/hooks/useUpload';

export function CreatePostBox() {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const createPost = useCreatePost();
  const { user } = useAuthStore();
  const uploadMutation = useUploadImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadMutation.mutateAsync(file);
        setImageUrl(url);
      } catch (err) {

      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      createPost.mutate(
        { content, imageUrl: imageUrl || undefined },
        {
          onSuccess: () => {
            setContent('');
            setImageUrl('');
          },
        }
      );
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

        
        {uploadMutation.isPending && (
          <div className="ml-12 text-[9px] font-mono text-neutral-500 uppercase tracking-widest animate-pulse">

          </div>
        )}

        
        {imageUrl && (
          <div className="ml-12 relative inline-block">
            <div className="border border-neutral-900 bg-neutral-950/40 rounded-lg p-1.5 max-w-50">
              <img src={imageUrl} alt="Uploaded asset" className="rounded-md max-h-32 object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="mt-1.5 w-full text-center text-[9px] font-mono text-red-500 hover:text-red-400 uppercase tracking-wider block border border-red-950/20 py-0.5 rounded bg-red-950/5 cursor-pointer"
              >
                [X] REMOVE
              </button>
            </div>
          </div>
        )}

        
        <div className="ml-12 border-t border-neutral-900 pt-4 flex items-center justify-between">
          
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="p-1.5 bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-neutral-450 hover:text-white rounded-lg transition cursor-pointer disabled:opacity-40"
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
                !content.trim() || isOverLimit || createPost.isPending || uploadMutation.isPending
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
