'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Share, Trash2, CheckCircle2 } from 'lucide-react';
import { Post } from '@/types';
import { formatDate, formatNumber } from '@/lib/utils';
import { useLikePost, useUnlikePost, useDeletePost } from '@/hooks/usePost';
import { AuthStore } from '@/store/auth.store';

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const { user: currentUser } = AuthStore();
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const deletePost = useDeletePost();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const isAuthor = currentUser?.id === post.author.id;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      setIsLiked(false);
      setLikesCount(likesCount - 1);
      unlikePost.mutate(post.id);
    } else {
      setIsLiked(true);
      setLikesCount(likesCount + 1);
      likePost.mutate(post.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost.mutate(post.id, {
        onSuccess: () => {
          onDelete?.();
        },
      });
    }
  };

  return (
    <article className="border-b border-neutral-900 p-5 hover:bg-[#0c0d12]/40 transition duration-150 cursor-pointer bg-[#08090a]">
      {/* Header */}
      <div className="flex gap-3 mb-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-lg border border-neutral-800 bg-[#0d0e11] flex items-center justify-center font-mono text-xs text-neutral-400 font-bold shrink-0">
          {post.author.username[0].toUpperCase()}
        </div>

        {/* Author Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              href={`/profile/${post.author.id}`}
              className="font-bold text-xs md:text-sm text-neutral-200 hover:text-white hover:underline transition leading-none"
            >
              {post.author.username}
            </Link>
            <span className="text-neutral-550 text-[10px] md:text-xs">@{post.author.username}</span>
            <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-500/10 shrink-0" />
            <span className="text-neutral-600 select-none">&middot;</span>
            <span className="text-neutral-500 text-[10px] font-mono">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>

        {/* Delete Button */}
        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={deletePost.isPending}
            className="p-1.5 bg-neutral-900/50 border border-neutral-850 hover:bg-red-950/20 hover:border-red-900/30 text-neutral-500 hover:text-red-400 rounded-lg transition cursor-pointer"
            title="Delete post"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content */}
      <Link href={`/posts/${post.id}`} className="block mb-4">
        <p className="text-neutral-300 text-xs md:text-sm font-light leading-relaxed wrap-break-word">
          {post.content}
        </p>
      </Link>

      {/* Actions */}
      <div className="flex justify-between text-neutral-500 max-w-sm text-[10px] md:text-xs font-mono pt-3 border-t border-neutral-900/80">
        {/* Comments */}
        <Link
          href={`/posts/${post.id}`}
          className="flex items-center gap-2 hover:text-white transition group cursor-pointer"
        >
          <div className="p-1.5 bg-neutral-900 border border-neutral-850 group-hover:bg-neutral-800 rounded-lg transition">
            <MessageCircle className="w-3.5 h-3.5" />
          </div>
          <span className="text-neutral-500 group-hover:text-neutral-300">
            {formatNumber(post.commentsCount)}
          </span>
        </Link>

        {/* Likes */}
        <button
          onClick={handleLike}
          disabled={likePost.isPending || unlikePost.isPending}
          className="flex items-center gap-2 hover:text-white transition group cursor-pointer"
        >
          <div className="p-1.5 bg-neutral-900 border border-neutral-850 group-hover:bg-neutral-800 rounded-lg transition">
            <Heart
              className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500/10 text-red-500' : ''}`}
            />
          </div>
          <span className={`group-hover:text-neutral-300 ${isLiked ? 'text-red-500 font-semibold' : ''}`}>
            {formatNumber(likesCount)}
          </span>
        </button>

        {/* Share */}
        <button className="flex items-center gap-2 hover:text-white transition group cursor-pointer">
          <div className="p-1.5 bg-neutral-900 border border-neutral-850 group-hover:bg-neutral-800 rounded-lg transition">
            <Share className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>
    </article>
  );
}
