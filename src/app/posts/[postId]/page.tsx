'use client';

import { ProtectedRoute } from '@/providers/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePost, usePostComments, useCreateComment } from '@/hooks/usePost';
import { PostCard } from '@/components/post/PostCard';
import { PostCardSkeleton, CommentSkeleton } from '@/components/common/Skeleton';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function PostPage() {
  const routerParams = useParams();
  const router = useRouter();
  const postId = routerParams.postId as string;
  const { data: post, isLoading: postLoading } = usePost(postId);
  const { data: comments, isLoading: commentsLoading } = usePostComments(postId);
  const createComment = useCreateComment();
  const [commentContent, setCommentContent] = useState('');
  const { user: currentUser } = useAuthStore();

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim()) {
      createComment.mutate(
        { postId, content: commentContent },
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
          <div className="max-w-2xl mx-auto border-l border-r border-neutral-900 min-h-screen bg-[#08090a]">
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
          <div className="max-w-2xl mx-auto border-l border-r border-neutral-900 min-h-screen bg-[#08090a] flex items-center justify-center font-mono text-xs">
            <div className="text-center">
              <h3 className="text-sm font-bold text-red-500 mb-2">// error: post_not_found</h3>
              <Link href="/feed" className="text-neutral-450 hover:text-white hover:underline transition">
                return_to_main_node
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
        <div className="max-w-2xl mx-auto border-l border-r border-neutral-900 min-h-screen bg-[#08090a] pb-12">

          <PostCard post={post} onDelete={() => router.push(currentUser?.id ? `/profile/${currentUser.id}` : '/feed')} />


          <form onSubmit={handleComment} className="border-b border-neutral-900 p-4 space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg border border-neutral-800 bg-[#0d0e11] flex items-center justify-center font-mono text-xs text-neutral-400 font-bold shrink-0 uppercase">
                {currentUser?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Post a reply..."
                  className="w-full text-xs bg-transparent resize-none focus:outline-none placeholder-neutral-600 text-white font-light mt-1.5 min-h-15"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!commentContent.trim() || createComment.isPending}
                className="px-4 py-1.5 bg-white disabled:opacity-40 text-black text-xs font-semibold rounded-lg hover:bg-neutral-100 transition active:scale-98 shadow-sm cursor-pointer font-mono"
              >
                {createComment.isPending ? 'SYNCING...' : 'REPLY'}
              </button>
            </div>
          </form>


          <div>
            {commentsLoading ? (
              <>
                <CommentSkeleton />
                <CommentSkeleton />
              </>
            ) : comments?.items.length === 0 ? (
              <div className="flex items-center justify-center h-64 font-mono">
                <div className="text-center">
                  <h3 className="text-xs font-bold text-neutral-400 mb-1">// empty_replies_stream</h3>
                  <p className="text-[10px] text-neutral-600">be the first to initialize reply log</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-neutral-900">
                {comments?.items.map((comment) => {
                  const author = comment.author || comment.user;
                  return (
                  <div
                    key={comment.id}
                    className="p-4 hover:bg-neutral-900/10 transition"
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg border border-neutral-800 bg-[#0d0e11] flex items-center justify-center font-mono text-xs text-neutral-400 font-bold shrink-0 uppercase">
                        {author?.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/profile/${author?.id || '#'}`}
                            className="text-xs font-bold text-neutral-200 hover:underline truncate"
                          >
                            {author?.username || 'Unknown'}
                          </Link>
                          <span className="text-[9px] font-mono text-neutral-600">@{author?.username || 'unknown'}</span>
                          <span className="text-[9px] font-mono text-neutral-600">·</span>
                          <span className="text-[9px] font-mono text-neutral-600">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-neutral-300 font-light leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
