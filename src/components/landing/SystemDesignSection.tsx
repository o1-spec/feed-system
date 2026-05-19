'use client';

import React from 'react';
import { Zap, Cpu, Layers, ChevronsDown, Database, Users } from 'lucide-react';

interface DesignCard {
  icon: React.ReactNode;
  title: string;
  badge: string;
  description: string;
  configMock: string;
}

export function SystemDesignSection() {
  const cards: DesignCard[] = [
    {
      icon: <Zap className="w-4 h-4" />,
      title: 'Redis Timeline Cache',
      badge: 'ZSET Pre-Gen',
      description: 'Followers retrieve compiled feeds directly from in-memory Redis sorted sets, completely bypassing heavy database query compilation.',
      configMock: `{\n  "cache": "redis-cluster",\n  "eviction": "volatile-lru",\n  "max_length": 500\n}`,
    },
    {
      icon: <Cpu className="w-4 h-4" />,
      title: 'BullMQ Fanout Workers',
      badge: 'Queue Thread Pool',
      description: 'Leverages Redis-backed queue workers to run asynchronous write-fanouts. Distributes post IDs to followers’ timeline caches in background threads.',
      configMock: `{\n  "concurrency": 8,\n  "backpressure": true,\n  "auto_retry": 3\n}`,
    },
    {
      icon: <Layers className="w-4 h-4" />,
      title: 'Hybrid Feed Generation',
      badge: 'Pull-on-Read Fallback',
      description: 'Avoids write bottlenecks. Uses active fanout-on-write for standard users, and fallbacks to dynamic pull-on-read for highly followed celebrity users.',
      configMock: `{\n  "celebrity_limit": 5000,\n  "strategy": "hybrid-write"\n}`,
    },
    {
      icon: <ChevronsDown className="w-4 h-4" />,
      title: 'Cursor Pagination',
      badge: 'Constant Time O(1)',
      description: 'Ensures query efficiency during deep pagination. Uses item IDs as cursors instead of offset index scanning to prevent database performance decay.',
      configMock: `{\n  "query_strategy": "seek",\n  "index": "post_id_btree",\n  "offset": 0\n}`,
    },
    {
      icon: <Database className="w-4 h-4" />,
      title: 'PostgreSQL Store',
      badge: 'ACID Persistent',
      description: 'Houses persistent entities (Users, Posts, Followers) with relational integrity. Handles transactional locking and absolute consistency.',
      configMock: `{\n  "orm": "prisma",\n  "pool_size": 20,\n  "isolation": "serializable"\n}`,
    },
    {
      icon: <Users className="w-4 h-4" />,
      title: 'Celebrity Shield',
      badge: 'Queue Isolation',
      description: 'Detects high-impact users dynamically. Isolates celebrity fanouts from standard workers to keep standard message queues entirely clear.',
      configMock: `{\n  "shards": 4,\n  "isolated_queue": "celebrity-jobs"\n}`,
    },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-20 z-10 border-b border-neutral-900 bg-[#08090a]">
      
      
      <div className="flex flex-col items-start mb-14 text-left max-w-2xl">
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">// sys_design_specification</span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-3">
          Distributed Pipeline Specifications
        </h2>
        <p className="text-xs md:text-sm text-neutral-450 leading-relaxed font-light">
          A high-performance news feed is not just a standard database select. Here is how the backend architecture is configured to scale under heavy concurrent load.
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-[#0c0d12]/50 border border-neutral-800/80 p-5 rounded-xl flex flex-col justify-between hover:border-neutral-750 transition duration-200"
          >
            <div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-400">
                    {card.icon}
                  </div>
                  <h3 className="text-xs font-bold text-white tracking-wide">
                    {card.title}
                  </h3>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-400">
                  {card.badge}
                </span>
              </div>

              
              <p className="text-neutral-400 text-xs leading-relaxed mb-4 font-light">
                {card.description}
              </p>
            </div>

            
            <div className="bg-black/30 border border-neutral-900 rounded-lg p-2.5 font-mono text-[9px] text-neutral-500">
              <span className="text-[8px] font-mono text-neutral-600 block mb-1 uppercase tracking-wider">// configuration</span>
              <pre className="overflow-x-auto leading-tight">{card.configMock}</pre>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
