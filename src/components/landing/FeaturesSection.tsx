'use client';

import React from 'react';
import { ArrowDownCircle, Heart, UserPlus, Bell, Flame, Gauge } from 'lucide-react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export function FeaturesSection() {
  const features: FeatureItem[] = [
    {
      icon: <ArrowDownCircle className="w-4 h-4 text-neutral-400" />,
      title: 'Infinite Scroll Feed',
      desc: 'Seamless timeline pagination leveraging seek filters to prevent database index exhaustion.',
    },
    {
      icon: <Heart className="w-4 h-4 text-neutral-400" />,
      title: 'Relational Reactions',
      desc: 'Concurrent like and comment operations secured via relational isolation locks.',
    },
    {
      icon: <UserPlus className="w-4 h-4 text-neutral-400" />,
      title: 'Follow Matrices',
      desc: 'Alters fanout write routes dynamically to ensure live follower timeline compiles.',
    },
    {
      icon: <Bell className="w-4 h-4 text-neutral-400" />,
      title: 'Transactional Alerts',
      desc: 'Relational triggers capture action states and propagate notifications instantly.',
    },
    {
      icon: <Flame className="w-4 h-4 text-neutral-400" />,
      title: 'Event Loops',
      desc: 'Timeline pre-generations run in independent node worker processes.',
    },
    {
      icon: <Gauge className="w-4 h-4 text-neutral-400" />,
      title: 'Benchmarked Speeds',
      desc: 'Pre-warmed sorted sets deliver in-memory responses in sub-15ms benchmarks.',
    },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-20 z-10 border-b border-neutral-900 bg-[#08090a]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Asymmetric Sticky Heading */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-2">// capability_catalog</span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-3">
            Core capabilities
          </h2>
          <p className="text-xs md:text-sm text-neutral-450 leading-relaxed font-light">
            All user operations are engineered around distributed scalability rules. No redundant SQL joins, no blocking application event loops.
          </p>
        </div>

        {/* Right Column: Clean micro grid lists */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#0c0d12]/20 border border-neutral-900 p-5 rounded-xl hover:border-neutral-800 transition duration-150 flex gap-4 items-start"
            >
              <div className="w-7 h-7 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-white text-xs mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-neutral-450 text-xs leading-relaxed font-light">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
