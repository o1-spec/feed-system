'use client';

import React from 'react';
import { Globe, Briefcase, FileText, Home, Link2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative max-w-7xl mx-auto px-6 py-12 border-t border-neutral-900 bg-[#08090a] z-10 text-neutral-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Brand Column */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-bold text-white text-sm mb-3">
            <div className="w-5 h-5 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <Home className="w-3 text-neutral-200" />
            </div>
            <span className="font-mono text-xs tracking-wider uppercase">timeline.sys</span>
          </div>
          <p className="text-[11px] text-neutral-450 max-w-sm leading-relaxed mb-4 font-light">
            A production-ready technical sandbox demonstrating hybrid write-fanouts, multi-threaded BullMQ background queue tasks, and constant O(1) timeline caching algorithms.
          </p>
        </div>

        {/* Resources Column */}
        <div>
          <h4 className="text-[10px] font-mono font-bold text-white tracking-widest uppercase mb-3">
            Architecture
          </h4>
          <ul className="space-y-1.5 text-xs font-light text-neutral-450">
            <li>
              <a
                href="#architecture"
                className="hover:text-neutral-200 transition duration-150"
              >
                Data Pipeline Flow
              </a>
            </li>
            <li>
              <span className="opacity-50">API Spec (REST / JSON)</span>
            </li>
            <li>
              <span className="opacity-50">Redis Cache Schemas</span>
            </li>
            <li>
              <span className="opacity-50">BullMQ Fanout Design</span>
            </li>
          </ul>
        </div>

        {/* Links Column */}
        <div>
          <h4 className="text-[10px] font-mono font-bold text-white tracking-widest uppercase mb-3">
            Developer Info
          </h4>
          <ul className="space-y-1.5 text-xs font-light text-neutral-450">
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-neutral-200 transition duration-150"
              >
                <Link2 className="w-3 h-3" />
                GitHub Repo
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-neutral-200 transition duration-150"
              >
                <Globe className="w-3 h-3" />
                LinkedIn Profile
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-1.5 hover:text-neutral-200 transition duration-150"
              >
                <Briefcase className="w-3 h-3" />
                Portfolio Website
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-[10px] font-light text-neutral-600 gap-4">
        <span>&copy; {new Date().getFullYear()} Feed System Project. All systems operational.</span>
        <div className="flex gap-4">
          <span className="hover:text-neutral-450 transition cursor-pointer">Security Spec</span>
          <span>•</span>
          <span className="hover:text-neutral-450 transition cursor-pointer">API Agreement</span>
        </div>
      </div>
    </footer>
  );
}
