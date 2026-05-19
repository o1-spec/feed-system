'use client';

import { ProtectedRoute } from '@/providers/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePost, usePostComments, useCreateComment } from '@/hooks/usePost';
import { PostCard } from '@/components/post/PostCard';
import { PostCardSkeleton, CommentSkeleton } from '@/components/common/Skeleton';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';

interface PostPageProps {
  params: { postId: string };
}

export default function PostPage({ params }: PostPageProps) {
  const { data: post, isLoading: postLoading } = usePost(params.postId);
  const { data: comments, isLoading: commentsLoading } = usePostComments(params.postId);
  const createComment = useCreateComment();
  const [commentContent, setCommentContent] = useState('');

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim()) {
      createComment.mutate(
        { postId: params.postId, content: commentContent },
        {
          onSuccess: () => {
            setCommentContent('');
          },
        }
      );
    }
  };

  if (postLoading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="max-w-2xl mx-auto border-l border-r border-gray-200 dark:border-gray-700 min-h-screen">
            <PostCardSkeleton />
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!post) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="max-w-2xl mx-auto border-l border-r border-gray-200 dark:border-gray-700 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Post not found</h3>
              <Link href="/feed" className="text-blue-500 hover:underline">
                Go back to feed
              </Link>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-2xl mx-auto border-l border-r border-gray-200 dark:border-gray-700 min-h-screen">
          
          <PostCard post={post} />

          
          <form onSubmit={handleComment} className="border-b border-gray-200 dark:border-gray-700 p-4 space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-purple-500 shrink-0"></div>
              <div className="flex-1">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Post a reply..."
                  className="w-full text-xl bg-transparent resize-none focus:outline-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="ml-16 flex justify-end">
              <button
                type="submit"
                disabled={!commentContent.trim() || createComment.isPending}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold rounded-full transition"
              >
                {createComment.isPending ? 'Posting...' : 'Reply'}
              </button>
            </div>
          </form>

          
          <div>
            {commentsLoading ? (
              <>
                <CommentSkeleton />
                <CommentSkeleton />
                <CommentSkeleton />
              </>
            ) : comments?.items.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">No replies yet</h3>
                  <p className="text-gray-500">Be the first to reply to this post</p>
                </div>
              </div>
            ) : (
              comments?.items.map((comment) => (
                <div
                  key={comment.id}
                  className="border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-r from-green-500 to-blue-500 shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/profile/${comment.author.id}`}
                          className="font-bold hover:underline"
                        >
                          {comment.author.username}
                        </Link>
                        <span className="text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-base">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
