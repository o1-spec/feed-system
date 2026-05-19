'use client';

import React from 'react';
import { Terminal, Shield, Workflow, Layers, Server, Cpu, Database, Layout } from 'lucide-react';

interface TechItem {
  name: string;
  role: string;
  icon: React.ReactNode;
  desc: string;
  badge: string;
}

export function TechStackSection() {
  const stack: TechItem[] = [
    {
      name: 'Next.js 16',
      role: 'Client App framework',
      icon: <Layout className="w-4 h-4 text-neutral-400" />,
      desc: 'Enforces type-safe App Router paths, dynamic hooks, and pre-renders static shells.',
      badge: 'FRONTEND',
    },
    {
      name: 'NestJS cluster',
      role: 'Backend REST API',
      icon: <Server className="w-4 h-4 text-neutral-400" />,
      desc: 'Decoupled, modular MVC controller endpoints configured for gateway protection.',
      badge: 'GATEWAY',
    },
    {
      name: 'PostgreSQL DB',
      role: 'Primary storage',
      icon: <Database className="w-4 h-4 text-neutral-400" />,
      desc: 'Handles ACID transactions, master entities persistence, and indexes relational seek keys.',
      badge: 'PERSISTENCE',
    },
    {
      name: 'Redis Cluster',
      role: 'In-Memory timeline cache',
      icon: <Workflow className="w-4 h-4 text-neutral-400" />,
      desc: 'Stores sorted sets (ZSET) to pre-warm timeline pages and handles BullMQ state events.',
      badge: 'MEMORY',
    },
    {
      name: 'Prisma Client',
      role: 'Type-Safe ORM client',
      icon: <Layers className="w-4 h-4 text-neutral-400" />,
      desc: 'Saves type checked models, auto-configures migrations, and isolates pooling scopes.',
      badge: 'ORM BRIDGE',
    },
    {
      name: 'BullMQ queues',
      role: 'Asynchronous event worker',
      icon: <Cpu className="w-4 h-4 text-neutral-400" />,
      desc: 'Powers multi-worker thread pools dispatching async post timeline distributions.',
      badge: 'EVENT BROKER',
    },
    {
      name: 'Docker containers',
      role: 'Microservices sandbox',
      icon: <Shield className="w-4 h-4 text-neutral-400" />,
      desc: 'Orchestrates decoupled REST servers, Redis instances, and BullMQ worker nodes.',
      badge: 'SANDBOX',
    },
    {
      name: 'TypeScript core',
      role: 'Strict compilation type check',
      icon: <Terminal className="w-4 h-4 text-neutral-400" />,
      desc: 'Guarantees shared payload models between client queries and server gateway controllers.',
      badge: 'TYPESAFE',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-b border-neutral-900 bg-[#08090a]">
      
      
      <div className="flex flex-col items-start mb-12 text-left">
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">// architecture_dependencies</span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
          System Stack Specifications
        </h2>
        <p className="text-xs md:text-sm text-neutral-450 max-w-md font-light leading-relaxed">
          The production tech stack supporting sub-15ms feeds and concurrent write loops.
        </p>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stack.map((tech) => (
          <div
            key={tech.name}
            className="bg-[#0c0d12]/20 border border-neutral-900 p-5 rounded-xl flex flex-col justify-between hover:border-neutral-800 transition duration-150 group"
          >
            <div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="w-6 h-6 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                  {tech.icon}
                </div>
                <span className="text-[8px] font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-900">
                  {tech.badge}
                </span>
              </div>

              
              <h3 className="font-bold text-white text-xs mb-0.5 group-hover:text-neutral-200 transition duration-150">
                {tech.name}
              </h3>
              <span className="text-neutral-500 text-[10px] block mb-3 font-mono leading-none">
                {tech.role}
              </span>
              
              
              <p className="text-neutral-450 text-xs leading-relaxed font-light">
                {tech.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
