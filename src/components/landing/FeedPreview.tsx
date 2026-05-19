'use client';

import React from 'react';
import { Heart, MessageSquare, Bookmark, CheckCircle2, Share2 } from 'lucide-react';

interface MockPost {
  id: string;
  author: {
    name: string;
    username: string;
    role: string;
    avatar: string;
    online?: boolean;
  };
  timestamp: string;
  content: string;
  hashtags: string[];
  metrics: {
    likes: number;
    comments: number;
  };
  isLiked?: boolean;
}

export function FeedPreview() {
  const mockPosts: MockPost[] = [
    {
      id: '1',
      author: {
        name: 'Sarah Jenkins',
        username: 'sarah_dev',
        role: 'Infrastructure Lead',
        avatar: 'SJ',
        online: true,
      },
      timestamp: '2h ago',
      content: 'Just deployed our dynamic Redis-backed Fanout queue to cluster-us-east. Timeline latency checks are solid—write actions propagate in under 22ms concurrently across 10,000+ test followers. Heavy DB lockouts are now down to absolute zero.',
      hashtags: ['BullMQ', 'Infrastructure', 'RedisZSet'],
      metrics: { likes: 342, comments: 24 },
      isLiked: true,
    },
    {
      id: '2',
      author: {
        name: 'Alex Rivera',
        username: 'alex_sys',
        role: 'Systems Architect',
        avatar: 'AR',
        online: true,
      },
      timestamp: '5h ago',
      content: 'Using index offsets for infinite scroll is a silent killer for relational DBs. By swapping our pagination over to cursor-based keys (`where id < last_seen_id`), feed retrieval is strictly O(1) B-tree matched. Keeping Postgres CPU utilization flat even under high page depth fetches.',
      hashtags: ['PostgreSQL', 'Databases', 'Indexing'],
      metrics: { likes: 189, comments: 12 },
    },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-16 z-10 border-b border-neutral-900 bg-[#08090a]">
      <div className="max-w-3xl mx-auto">
        
        {/* Section Header: Handcrafted and minimal */}
        <div className="flex flex-col items-start mb-10 text-left">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">// client_feed_preview</span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
            The Social Pipeline
          </h2>
          <p className="text-xs md:text-sm text-neutral-450 max-w-md leading-relaxed font-light">
            An ultra-dense feed rhythm designed for developer collaboration, built directly on pre-compiled Redis timeline indices.
          </p>
        </div>

        {/* Mock Post List */}
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-[#0c0d12]/50 border border-neutral-800/80 rounded-xl p-5 hover:border-neutral-800 hover:bg-[#0c0d12]/80 transition duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Avatar wrapper with indicator */}
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-mono text-xs text-neutral-400 font-bold">
                      {post.author.avatar}
                    </div>
                    {post.author.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-[#0c0d12] rounded-full"></span>
                    )}
                  </div>
                  
                  <div className="leading-tight">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-neutral-200 text-xs md:text-sm">
                        {post.author.name}
                      </span>
                      <span className="text-neutral-500 text-[10px] md:text-xs">
                        @{post.author.username}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {post.author.role}
                    </span>
                  </div>
                </div>
                <span className="text-neutral-500 text-[10px] font-mono">{post.timestamp}</span>
              </div>

              {/* Content */}
              <p className="text-neutral-300 text-xs md:text-sm leading-relaxed mb-4 font-light max-w-2xl">
                {post.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-mono px-2 py-0.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-500 hover:text-neutral-300 transition duration-150 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-900 text-neutral-500 text-[10px] md:text-xs font-mono">
                <div className="flex items-center gap-4">
                  <button className={`flex items-center gap-1.5 transition duration-150 group cursor-pointer ${post.isLiked ? 'text-red-400' : 'hover:text-neutral-300'}`}>
                    <Heart className={`w-3.5 h-3.5 group-hover:scale-105 transition-transform ${post.isLiked ? 'fill-red-500/10 text-red-500' : ''}`} />
                    <span>{post.metrics.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-neutral-300 transition duration-150 group cursor-pointer">
                    <MessageSquare className="w-3.5 h-3.5 group-hover:scale-105 transition-transform" />
                    <span>{post.metrics.comments} replies</span>
                  </button>
                </div>
                
                <button className="flex items-center gap-1.5 hover:text-neutral-350 transition duration-150 group cursor-pointer">
                  <Bookmark className="w-3.5 h-3.5 group-hover:scale-105 transition-transform" />
                  <span>Save</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
