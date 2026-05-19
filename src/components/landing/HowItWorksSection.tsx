'use client';

import React from 'react';
import { PenTool, ArrowRightLeft, Radio, ChevronRight } from 'lucide-react';

interface Step {
  num: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
  desc: string;
  annotation: string;
}

export function HowItWorksSection() {
  const steps: Step[] = [
    {
      num: '01',
      icon: <PenTool className="w-3.5 h-3.5 text-neutral-400" />,
      title: 'Publish Post',
      sub: 'WRITE INITIATION',
      desc: 'The user creates a post. NestJS gateway performs relational inserts into SQL persistent rows.',
      annotation: 'PG Transaction: Indexed seek',
    },
    {
      num: '02',
      icon: <ArrowRightLeft className="w-3.5 h-3.5 text-neutral-400" />,
      title: 'Queue Fanout',
      sub: 'ASYNC JOB BROKER',
      desc: 'BullMQ queue worker triggers thread pools. Post IDs are distributed to followers concurrently.',
      annotation: 'BullMQ: Redis event loop active',
    },
    {
      num: '03',
      icon: <Radio className="w-3.5 h-3.5 text-neutral-400" />,
      title: 'Timeline Deliver',
      sub: 'O(1) CACHED PULL',
      desc: 'Followers view timelines instantly. API pulls compiled ZSET keys from Redis cluster directly.',
      annotation: 'Sorted Set ranges: latency < 1.2ms',
    },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-20 z-10 border-b border-neutral-900 bg-[#08090a]">
      
      
      <div className="flex flex-col items-start mb-12 text-left">
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">// task_execution_trace</span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
          Timeline Lifecycle Flow
        </h2>
        <p className="text-xs md:text-sm text-neutral-450 max-w-md font-light leading-relaxed">
          How database transactions, queue shards, and memory allocations align to deliver instant timelines.
        </p>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        {steps.map((step, idx) => (
          <React.Fragment key={step.title}>
            
            
            <div className="bg-[#0c0d12]/20 border border-neutral-900 p-5 rounded-xl flex flex-col justify-between hover:border-neutral-800 transition duration-150 relative">
              <span className="absolute top-4 right-4 text-xs font-mono font-bold text-neutral-800">
                {step.num}
              </span>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs leading-none">{step.title}</h3>
                    <span className="text-[8px] font-mono text-neutral-500 block mt-0.5">{step.sub}</span>
                  </div>
                </div>

                <p className="text-neutral-450 text-xs leading-relaxed font-light mb-6">
                  {step.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-900">
                <span className="text-[9px] font-mono text-indigo-400">
                  {step.annotation}
                </span>
              </div>

            </div>

            
            {idx < steps.length - 1 && (
              <div className="hidden lg:flex items-center justify-center text-neutral-800 select-none">
                <ChevronRight className="w-4 h-4 text-neutral-800" />
              </div>
            )}

          </React.Fragment>
        ))}
      </div>

    </section>
  );
}
