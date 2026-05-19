'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import { AuthStore } from '@/store/auth.store';
import { Navbar } from '@/components/layout/Navbar';


import { HeroSection } from '@/components/landing/HeroSection';
import { FeedPreview } from '@/components/landing/FeedPreview';
import { SystemDesignSection } from '@/components/landing/SystemDesignSection';
import { ArchitectureSection } from '@/components/landing/ArchitectureSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TechStackSection } from '@/components/landing/TechStackSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const state = AuthStore.getState();
    if (state.isAuthenticated) {
      setIsAuthenticated(true);
      router.push('/feed');
    }
  }, [router]);


  if (!isMounted || isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08090a] flex flex-col items-center justify-center text-white">
        <div className="relative flex flex-col items-center gap-4 font-mono text-xs">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <Home className="w-4 h-4 text-neutral-400 animate-pulse" />
          </div>
          <p className="text-[10px] tracking-widest text-neutral-500 uppercase mt-2">
            session.verify()
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090a] text-white selection:bg-neutral-800 selection:text-neutral-200 overflow-x-hidden">
      
      <Navbar />

      
      <main>
        
        <HeroSection />

        
        <FeedPreview />

        
        <SystemDesignSection />

        
        <ArchitectureSection />

        
        <FeaturesSection />

        
        <HowItWorksSection />

        
        <TechStackSection />

        
        <CTASection />
      </main>

      
      <Footer />
    </div>
  );
}
