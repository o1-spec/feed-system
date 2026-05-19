'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Share, Trash2 } from 'lucide-react';
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

  const handleLike = () => {
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

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost.mutate(post.id, {
        onSuccess: () => {
          onDelete?.();
        },
      });
    }
  };

  return (
    <article className="border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-pointer">
      {/* Header */}
      <div className="flex gap-3 mb-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-lg">
            {post.author.username[0].toUpperCase()}
          </span>
        </div>

        {/* Author Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${post.author.id}`}
              className="font-bold hover:underline"
            >
              {post.author.username}
            </Link>
            <span className="text-gray-500">@{post.author.username}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500 text-sm">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>

        {/* Delete Button */}
        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={deletePost.isPending}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition text-red-500"
            title="Delete post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <Link href={`/posts/${post.id}`}>
        <p className="mb-3 text-base leading-normal wrap-break-word">
          {post.content}
        </p>
      </Link>

      {/* Actions */}
      <div className="flex justify-between text-gray-500 max-w-md text-sm py-2 group">
        {/* Comments */}
        <Link
          href={`/posts/${post.id}`}
          className="flex items-center gap-2 group/item hover:text-blue-500 transition"
        >
          <div className="group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-900 rounded-full p-2 transition">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="group-hover/item:text-blue-500 text-xs">
            {formatNumber(post.commentsCount)}
          </span>
        </Link>

        {/* Likes */}
        <button
          onClick={handleLike}
          disabled={likePost.isPending || unlikePost.isPending}
          className="flex items-center gap-2 group/item hover:text-red-500 transition"
        >
          <div className="group-hover/item:bg-red-100 dark:group-hover/item:bg-red-900 rounded-full p-2 transition">
            <Heart
              className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
            />
          </div>
          <span className={`text-xs ${isLiked ? 'text-red-500' : ''}`}>
            {formatNumber(likesCount)}
          </span>
        </button>

        {/* Share */}
        <button className="flex items-center gap-2 group/item hover:text-blue-500 transition">
          <div className="group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-900 rounded-full p-2 transition">
            <Share className="w-4 h-4" />
          </div>
        </button>
      </div>
    </article>
  );
}
