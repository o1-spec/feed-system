'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Home, Terminal, Server, Shield } from 'lucide-react';

export default function RegisterPage() {
  const [logs, setLogs] = useState<string[]>([
    '[auth] initialized sandbox workspace listener',
    '[db] migrations catalog synchronizing...',
    '[redis] cache subscription warm: timeline_event_stream'
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const operations = ['auth:register_session', 'prisma:schema_validation', 'redis:session_lock'];
      const randomOp = operations[Math.floor(Math.random() * operations.length)];
      const time = new Date().toTimeString().split(' ')[0];

      const log = `[${time}] keypair: ${randomOp} status=OK`;
      setLogs((prev) => [...prev.slice(-6), log]);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#08090a] text-white selection:bg-neutral-800 grid grid-cols-1 lg:grid-cols-12 items-stretch overflow-hidden">

      
      <div className="lg:col-span-5 flex flex-col justify-between p-8 md:p-12 border-r border-neutral-900 bg-[#08090a] overflow-y-auto">

        
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-bold text-xs tracking-widest text-neutral-450 hover:text-white transition uppercase font-mono"
        >
          <Home className="w-3.5 h-3.5" />
          <span>timeline.sys</span>
        </Link>

        
        <div className="w-full max-w-sm mx-auto my-12">
          <div className="mb-8">
            <h1 className="text-xl font-bold tracking-tight text-white mb-2">Create Account</h1>
            <p className="text-xs text-neutral-450 leading-relaxed font-light">
              Register a test profile to trigger distributed fanout jobs.
            </p>
          </div>

          <div className="bg-[#0c0d12]/45 border border-neutral-850 p-6 rounded-xl shadow-xl">
            <RegisterForm />
          </div>
        </div>

        
        <div className="text-[10px] text-neutral-600 font-light font-mono pt-4 border-t border-neutral-900">
          <span>SECURE PROTOCOL ACTIVE • SHARDING ENGINE</span>
        </div>

      </div>

      
      <div className="hidden lg:col-span-7 bg-black/60 relative lg:flex flex-col justify-center items-center p-12">
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-size-[2rem_2rem] pointer-events-none z-0"></div>

        <div className="w-full max-w-lg bg-[#0c0d12] border border-neutral-850 rounded-xl shadow-2xl p-6 font-mono text-xs text-neutral-300 relative z-10">
          
          <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Terminal className="w-4 h-4 text-blue-500 animate-pulse" />
              <span className="font-bold text-[10px] tracking-wide uppercase">register_gateway_terminal</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>LISTENER_OK</span>
            </div>
          </div>

          
          <div className="space-y-2 h-44 flex flex-col justify-end text-[10px] text-neutral-400">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-neutral-600 select-none">&gt;</span>
                <span className={`leading-relaxed truncate ${log.includes('auth') ? 'text-blue-400' :
                    log.includes('db') ? 'text-indigo-400' :
                      log.includes('redis') ? 'text-emerald-400' : 'text-neutral-450'
                  }`}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          
          <div className="mt-5 pt-4 border-t border-neutral-900 grid grid-cols-2 gap-4 text-[10px] text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-neutral-600" />
              <span>Prisma schema checks: <strong>100% OK</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-neutral-600" />
              <span>TLS handshake: <strong>ECDHE-RSA</strong></span>
            </div>
          </div>
        </div>

        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      </div>

    </div>
  );
}
