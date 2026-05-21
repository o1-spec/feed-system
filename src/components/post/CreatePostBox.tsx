'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ImageIcon, SmileIcon } from 'lucide-react';
import { useCreatePost } from '@/hooks/usePost';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useUploadImage } from '@/hooks/useUpload';

const EMOJIS = [
  '😀', '😂', '🔥', '❤️', '👍', '🙌', '🎉', '💡',
  '🤔', '👀', '✨', '💯', '🚀', '💥', '🌟', '🎯',
  '💻', '🧠', '👽', '🤖', '🛸', '⚡', '🔒', '📡',
  '💾', '💿', '📶', '🛡️', '⚙️', '🌌', '👾', '🧪'
];

export function CreatePostBox() {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const createPost = useCreatePost();
  const { user } = useAuthStore();
  const uploadMutation = useUploadImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + emoji);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    setContent(before + emoji + after);

    const newCursorPos = start + emoji.length;

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

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
              ref={textareaRef}
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
            <div className="relative" ref={emojiPickerRef}>
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className={`p-1.5 border rounded-lg transition cursor-pointer ${showEmojiPicker
                    ? 'bg-neutral-800 border-neutral-700 text-white'
                    : 'bg-neutral-900 border-neutral-850 hover:bg-neutral-800 text-neutral-450 hover:text-white'
                  }`}
              >
                <SmileIcon className="w-3.5 h-3.5" />
              </button>

              {showEmojiPicker && (
                <div className="absolute top-full left-0 mt-2 w-56 p-3 rounded-lg border border-neutral-900 bg-neutral-950/95 backdrop-blur-md shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest mb-2 border-b border-neutral-900/60 pb-1">
                    // select_input_icon
                  </div>
                  <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="w-7 h-7 flex items-center justify-center text-sm rounded hover:bg-neutral-800/80 transition active:scale-90 cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>


          <div className="flex items-center gap-4">
            {content && (
              <span
                className={`text-[10px] font-mono ${isOverLimit
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
