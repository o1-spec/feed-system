'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuth';
import { ShieldAlert, Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email input field */}
      <div>
        <label htmlFor="email" className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-2">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-neutral-850 bg-black/45 hover:border-neutral-800 focus:border-neutral-700 text-xs text-white placeholder-neutral-600 focus:outline-none transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] font-sans"
          placeholder="your@email.com"
        />
      </div>

      {/* Password input field */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
            Password
          </label>
          <span className="text-[9px] font-mono text-neutral-600 hover:text-neutral-400 transition cursor-pointer">
            Forgot password?
          </span>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-3 pr-10 py-2 rounded-lg border border-neutral-850 bg-black/45 hover:border-neutral-800 focus:border-neutral-700 text-xs text-white placeholder-neutral-600 focus:outline-none transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] font-sans"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition duration-150 cursor-pointer focus:outline-none"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Error Block */}
      {login.isError && (
        <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 rounded-lg text-[10px] font-mono flex items-start gap-2">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>AUTH_ERROR: Invalid username or credentials. Please try again.</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={login.isPending}
        className="w-full bg-white hover:bg-neutral-100 disabled:opacity-50 text-black font-semibold text-xs py-2 rounded-lg transition duration-200 active:scale-[0.99] cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
      >
        {login.isPending ? 'Connecting...' : 'Sign In'}
      </button>

      {/* Footer Info */}
      <div className="pt-4 border-t border-neutral-900 text-center text-xs">
        <p className="text-neutral-550 leading-normal font-light">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-neutral-300 hover:text-white font-medium hover:underline transition">
            Register here
          </Link>
        </p>
      </div>
    </form>
  );
}
