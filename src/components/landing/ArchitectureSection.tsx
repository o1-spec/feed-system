'use client';

import React, { useState } from 'react';
import { Send, Eye, Terminal, ChevronRight, Activity, Cpu, Database, Layers, Server } from 'lucide-react';

interface PipelineNode {
  id: string;
  name: string;
  sub: string;
  role: string;
  metric: string;
  input: string;
  output: string;
  desc: string;
  icon: React.ReactNode;
}

export function ArchitectureSection() {
  const [activePath, setActivePath] = useState<'write' | 'read'>('write');

  const writePipeline: PipelineNode[] = [
    {
      id: 'ui',
      name: 'Client View',
      sub: 'Next.js App Router',
      role: 'UI TRIGGER',
      metric: '0.2ms',
      input: 'User payload: { content, author_id }',
      output: 'HTTP POST /api/posts',
      desc: 'Form payload is dispatched under standard type safety bindings directly to the NestJS cluster gateway.',
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: 'api_gateway',
      name: 'REST Controller',
      sub: 'NestJS Gateway',
      role: 'VALIDATOR',
      metric: '4.8ms',
      input: 'HTTP POST /api/posts',
      output: 'SQL INSERT event & Dispatch Job',
      desc: 'Checks session JWT, executes ClassValidator schemas, and triggers relational persistence.',
      icon: <Server className="w-3.5 h-3.5" />,
    },
    {
      id: 'postgres',
      name: 'PostgreSQL Relational',
      sub: 'Prisma Client ORM',
      role: 'RELATIONAL SOURCE',
      metric: '12.4ms',
      input: 'Prisma.$transaction()',
      output: 'Saved Post Row (pst_984)',
      desc: 'Relational database commits the new post row with B-tree index bindings for absolute relational safety.',
      icon: <Database className="w-3.5 h-3.5" />,
    },
    {
      id: 'bullmq',
      name: 'BullMQ Event Loop',
      sub: 'Redis Event Broker',
      icon: <Cpu className="w-3.5 h-3.5" />,
      role: 'ASYNC JOB BROKER',
      metric: '2.1ms',
      input: 'Timeline job payload',
      output: 'Thread pool concurrent tasks',
      desc: 'Pushes post fanout task to an in-memory queue. Offloads background executions to standard workers immediately.',
    },
    {
      id: 'redis_timeline',
      name: 'Redis Timeline Cache',
      sub: 'In-Memory ZSET',
      role: 'RAM PERSISTENCE',
      metric: '0.8ms',
      input: 'Follower user IDs stream',
      output: 'Warm Cache lists status=ready',
      desc: 'Pre-generates follower feeds. Post ID is concurrently inserted into followers’ timeline sorted sets.',
      icon: <Activity className="w-3.5 h-3.5" />,
    },
  ];

  const readPipeline: PipelineNode[] = [
    {
      id: 'ui_read',
      name: 'Client View',
      sub: 'Next.js App Router',
      role: 'UI TRIGGER',
      metric: '0.1ms',
      input: 'Feed Mount event',
      output: 'HTTP GET /api/feed?cursor=x',
      desc: 'Triggers timeline pull using standard cursor indices to prevent db exhaustion.',
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: 'api_read',
      name: 'REST Controller',
      sub: 'NestJS Gateway',
      role: 'GATEWAY ROUTER',
      metric: '1.2ms',
      input: 'HTTP GET /api/feed',
      output: 'Redis in-memory query',
      desc: 'Verifies user session and instantly targets cached sorted sets directly in memory.',
      icon: <Server className="w-3.5 h-3.5" />,
    },
    {
      id: 'redis_read',
      name: 'Redis Timeline Cache',
      sub: 'In-Memory ZSET',
      role: 'O(1) CACHE FETCH',
      metric: '0.4ms',
      input: 'timeline:user_id range key',
      output: 'JSON pre-compiled list',
      desc: 'Instantly returns active post ID lists. Completely bypasses slow relational joins.',
      icon: <Activity className="w-3.5 h-3.5" />,
    },
  ];

  const activeNodes = activePath === 'write' ? writePipeline : readPipeline;

  return (
    <section id="architecture" className="relative max-w-7xl mx-auto px-6 py-20 z-10 border-b border-neutral-900 bg-[#08090a] scroll-mt-12">

      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="text-left">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">// dynamic_pipeline_trace</span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
            System Data Architecture
          </h2>
          <p className="text-xs md:text-sm text-neutral-450 max-w-md font-light leading-relaxed">
            Trace the live data flow across separate relational, memory, and queue threads. Toggle the shell scripts below to trace the pathways.
          </p>
        </div>

        
        <div className="inline-flex p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs">
          <button
            onClick={() => setActivePath('write')}
            className={`px-3 py-1.5 rounded-md transition duration-150 flex items-center gap-1.5 cursor-pointer ${activePath === 'write' ? 'bg-[#0c0d12] border border-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'
              }`}
          >
            <Send className="w-3 h-3 text-indigo-400" />
            <span>sh routes/write.sh</span>
          </button>
          <button
            onClick={() => setActivePath('read')}
            className={`px-3 py-1.5 rounded-md transition duration-150 flex items-center gap-1.5 cursor-pointer ${activePath === 'read' ? 'bg-[#0c0d12] border border-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'
              }`}
          >
            <Eye className="w-3 h-3 text-emerald-400" />
            <span>sh routes/read.sh</span>
          </button>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch mb-8">
        {activeNodes.map((node, idx) => (
          <React.Fragment key={node.id}>

            
            <div className="bg-[#0c0d12]/50 border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-750 transition duration-150">

              <div>
                
                <div className="flex items-center justify-between border-b border-neutral-900 pb-2 mb-3 text-[9px] font-mono text-neutral-500">
                  <span>{node.role}</span>
                  <span className="text-neutral-400">{node.metric}</span>
                </div>

                
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-450">
                    {node.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs leading-none">{node.name}</h4>
                    <span className="text-neutral-650 text-[9px] font-mono">{node.sub}</span>
                  </div>
                </div>

                <p className="text-neutral-400 text-xs leading-relaxed font-light mb-4">
                  {node.desc}
                </p>
              </div>

              
              <div className="pt-3 border-t border-neutral-900 text-[8px] font-mono text-neutral-500 space-y-1">
                <div className="truncate">
                  <span className="text-neutral-600">IN:</span> {node.input}
                </div>
                <div className="truncate">
                  <span className="text-neutral-600">OUT:</span> {node.output}
                </div>
              </div>

            </div>

            
            {idx < activeNodes.length - 1 && (
              <div className="hidden lg:flex items-center justify-center text-neutral-800 select-none">
                <ChevronRight className="w-4 h-4 text-neutral-700" />
              </div>
            )}

          </React.Fragment>
        ))}
      </div>

      
      <div className="bg-black/35 border border-neutral-900 p-4 rounded-xl font-mono text-[10px] text-neutral-400 flex items-start gap-3">
        <Terminal className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-white font-bold block mb-1 uppercase tracking-wider text-[8px]">// trace execution signature</span>
          {activePath === 'write' ? (
            <p className="leading-relaxed">
              [write_pipeline] User inserts pst_984 into postgresql shard ➔ dispatches queue job ➔ 8 concurrent background workers warm redis timeline zset. Execution overhead latency metrics average under 22ms concurrently.
            </p>
          ) : (
            <p className="leading-relaxed">
              [read_pipeline] Client loads feed route ➔ controller bypasses slow relational indexes ➔ queries redis timeline sorted set directly. timeline list responded in O(1) in-memory range lookup. Database workload: 0.0ms.
            </p>
          )}
        </div>
      </div>

    </section>
  );
}
