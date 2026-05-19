'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Server, Cpu, Database, Play, Sparkles } from 'lucide-react';

export function HeroSection() {
  const [logs, setLogs] = useState<string[]>([
    '[system] fanout workers loaded (8 threads)',
    '[redis] cluster timeline:warm status=ready',
    '[nest] service listener bound to port 3001'
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const paths = ['/api/posts', '/api/users/follow', '/api/feed/timeline'];
      const users = ['usr_928', 'usr_102', 'usr_394', 'usr_502'];
      const randomPath = paths[Math.floor(Math.random() * paths.length)];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const time = new Date().toTimeString().split(' ')[0];

      let log = `[${time}] nest: ${randomUser} hit ${randomPath} - 200 OK (8ms)`;
      if (Math.random() > 0.5) {
        log = `[${time}] bullmq: fanout triggered for post_id=pst_${Math.floor(Math.random() * 900 + 100)}`;
      } else if (Math.random() > 0.8) {
        log = `[${time}] redis: pre-compiled zset compiled for follower_id=${randomUser}`;
      }

      setLogs((prev) => [...prev.slice(-4), log]);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const scrollToArchitecture = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('architecture');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative w-full max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden z-10 border-b border-neutral-900 bg-[#08090a]">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none z-0"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

        
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] font-mono tracking-widest uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>sys_engine v1.0.4</span>
          </div>

          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.1] max-w-lg">
            Distributed timeline engine.{' '}
            <span className="bg-linear-to-r from-neutral-200 via-neutral-400 to-neutral-500 bg-clip-text text-transparent block mt-1">
              Built for hyper-concurrency.
            </span>
          </h1>

          
          <p className="text-sm md:text-base text-neutral-400 max-w-md mb-8 leading-relaxed font-light">
            A production-grade, highly-optimized news feed architecture. Combines memory-resident Redis sorted sets, multi-threaded BullMQ write fanouts, and a hybrid pull model to prevent celebrity database exhaustion.
          </p>

          
          <div className="flex flex-wrap items-center gap-3 w-full">
            <Link
              href="/auth/register"
              className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-white text-black hover:bg-neutral-100 transition duration-200 shadow-sm active:scale-98 flex items-center gap-1.5 group"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/feed"
              className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white transition duration-200 active:scale-98"
            >
              Explore Feed
            </Link>
            <a
              href="#architecture"
              onClick={scrollToArchitecture}
              className="px-4 py-2.5 text-xs font-semibold rounded-lg text-neutral-400 hover:text-neutral-200 transition duration-200 font-mono"
            >
              /architecture.json
            </a>
          </div>
        </div>

        
        <div className="lg:col-span-6 w-full flex justify-center">
          <div className="w-full max-w-md bg-[#0c0d12] border border-neutral-800/80 rounded-xl shadow-2xl p-5 font-mono text-xs text-neutral-300 relative overflow-hidden">

            
            <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-semibold text-neutral-400 text-[10px] tracking-wide uppercase">node_cluster_A</span>
              </div>
              <div className="flex gap-4 text-neutral-500 text-[10px]">
                <span>REDIS: <strong className="text-neutral-300">1.2ms</strong></span>
                <span>CACHE HIT: <strong className="text-neutral-300">99.4%</strong></span>
              </div>
            </div>

            
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-lg p-2.5 text-center">
                <span className="text-neutral-500 text-[9px] block mb-1">WRITE LATENCY</span>
                <span className="text-white font-bold text-sm">42ms</span>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-lg p-2.5 text-center">
                <span className="text-neutral-500 text-[9px] block mb-1">QUEUE CONCURRENCY</span>
                <span className="text-white font-bold text-sm">8 threads</span>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-lg p-2.5 text-center">
                <span className="text-neutral-500 text-[9px] block mb-1">MEMORY (ZSET)</span>
                <span className="text-white font-bold text-sm">144.2 MB</span>
              </div>
            </div>

            
            <div className="bg-black/40 border border-neutral-900 rounded-lg p-3 h-32 overflow-hidden flex flex-col justify-end gap-1.5 text-[10px] text-neutral-400">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-1.5 transition-all duration-300">
                  <span className="text-neutral-600 select-none">&gt;</span>
                  <span className={`leading-tight truncate ${log.includes('bullmq') ? 'text-indigo-400' :
                      log.includes('redis') ? 'text-emerald-400' :
                        log.includes('system') ? 'text-neutral-300' : 'text-neutral-450'
                    }`}>
                    {log}
                  </span>
                </div>
              ))}
            </div>

            
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/2 rounded-full blur-2xl pointer-events-none"></div>
          </div>
        </div>

      </div>
    </header>
  );
}
