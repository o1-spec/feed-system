'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Share, Trash2, CheckCircle2, Bookmark } from 'lucide-react';
import { Post } from '@/types';
import { formatDate, formatNumber } from '@/lib/utils';
import { useLikePost, useUnlikePost, useDeletePost } from '@/hooks/usePost';
import { useBookmarkMutation, useUnbookmarkMutation } from '@/hooks/useBookmarks';
import { useAuthStore } from '@/hooks/useAuthStore';

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const { user: currentUser } = useAuthStore();
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const deletePost = useDeletePost();
  const bookmarkMutation = useBookmarkMutation();
  const unbookmarkMutation = useUnbookmarkMutation();

  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isAuthor = currentUser?.id === post.author.id;

  useEffect(() => {
    setIsBookmarked(post.isBookmarked || false);
  }, [post.isBookmarked]);

  useEffect(() => {
    setIsLiked(post.isLiked || false);
    setLikesCount(post.likesCount);
  }, [post.isLiked, post.likesCount]);

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

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarked) {
      setIsBookmarked(false);
      unbookmarkMutation.mutate(post.id);
    } else {
      setIsBookmarked(true);
      bookmarkMutation.mutate(post.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deletePost.mutate(post.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        onDelete?.();
      },
      onError: () => {
        setShowDeleteModal(false);
      }
    });
  };

  return (
    <article className="border-b border-neutral-900 p-5 hover:bg-[#0c0d12]/40 transition duration-150 cursor-pointer bg-[#08090a]">
      
      <div className="flex gap-3 mb-3">
        
        <div className="w-8 h-8 rounded-lg border border-neutral-800 bg-[#0d0e11] flex items-center justify-center font-mono text-xs text-neutral-450 font-bold shrink-0 overflow-hidden">
          {post.author.avatarUrl ? (
            <img src={post.author.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            post.author.username[0].toUpperCase()
          )}
        </div>

        
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

        
        {isAuthor && (
          <button
            onClick={handleDeleteClick}
            disabled={deletePost.isPending}
            className="p-1.5 bg-neutral-900/50 border border-neutral-850 hover:bg-red-950/20 hover:border-red-900/30 text-neutral-500 hover:text-red-400 rounded-lg transition cursor-pointer"
            title="Delete post"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      
      <Link href={`/posts/${post.id}`} className="block mb-4">
        <p className="text-neutral-300 text-xs md:text-sm font-light leading-relaxed wrap-break-word mb-3">
          {post.content}
        </p>
        {post.imageUrl && (
          <div className="border border-neutral-900 bg-neutral-950/45 rounded-lg overflow-hidden transition-all duration-300 hover:opacity-90 hover:scale-[1.002]">
            <img
              src={post.imageUrl}
              alt="Post asset"
              className="w-full max-h-96 object-cover"
              loading="lazy"
            />
          </div>
        )}
      </Link>

      
      <div className="flex justify-between text-neutral-500 max-w-sm text-[10px] md:text-xs font-mono pt-3 border-t border-neutral-900/80">
        
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

        
        <button className="flex items-center gap-2 hover:text-white transition group cursor-pointer">
          <div className="p-1.5 bg-neutral-900 border border-neutral-850 group-hover:bg-neutral-800 rounded-lg transition">
            <Share className="w-3.5 h-3.5" />
          </div>
        </button>

        <button
          onClick={handleBookmark}
          disabled={bookmarkMutation.isPending || unbookmarkMutation.isPending}
          className="flex items-center gap-2 hover:text-white transition group cursor-pointer"
        >
          <div className="p-1.5 bg-neutral-900 border border-neutral-850 group-hover:bg-neutral-800 rounded-lg transition">
            <Bookmark
              className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-blue-500/10 text-blue-500' : ''}`}
            />
          </div>
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <div className="bg-[#0c0d12] border border-neutral-800 rounded-xl max-w-sm w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-2">Delete post?</h3>
            <p className="text-sm text-neutral-400 mb-6 font-light">
              This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                disabled={deletePost.isPending}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition disabled:opacity-50"
              >
                {deletePost.isPending ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDeleteModal(false);
                }}
                disabled={deletePost.isPending}
                className="w-full py-3 border border-neutral-700 hover:bg-neutral-900 text-white font-bold rounded-full transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
