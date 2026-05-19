'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 py-20 z-10 border-b border-neutral-900 bg-[#08090a]">
      <div className="max-w-4xl mx-auto bg-[#0c0d12]/50 border border-neutral-800/80 rounded-xl p-8 md:p-12 text-center flex flex-col items-center relative overflow-hidden">
        
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

        
        <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-450 mb-5">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>

        
        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight max-w-lg leading-tight">
          Experience Next-Gen Feed Speed
        </h2>

        
        <p className="text-neutral-450 text-xs md:text-sm max-w-md mb-8 font-light leading-relaxed">
          Create a test account today to verify asynchronous write fanouts, celebrity pull mechanisms, and high-performance O(1) in-memory timeline generation.
        </p>

        
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <Link
            href="/auth/register"
            className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-white text-black hover:bg-neutral-100 transition duration-200 shadow-sm active:scale-98 flex items-center gap-1.5 group cursor-pointer"
          >
            Create Test Account
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/feed"
            className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white transition duration-200 active:scale-98 cursor-pointer"
          >
            Explore Live Feed
          </Link>
        </div>

      </div>
    </section>
  );
}
