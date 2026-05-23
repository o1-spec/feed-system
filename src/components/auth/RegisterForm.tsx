'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRegister } from '@/hooks/useAuth';
import { ShieldAlert, Eye, EyeOff } from 'lucide-react';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    register.mutate({ email, username, password, displayName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
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

      
      <div>
        <label htmlFor="username" className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-2">
          Username
        </label>
        <input
          id="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-neutral-850 bg-black/45 hover:border-neutral-800 focus:border-neutral-700 text-xs text-white placeholder-neutral-600 focus:outline-none transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] font-sans"
          placeholder="username"
        />
      </div>

      
      <div>
        <label htmlFor="displayName" className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-2">
          Display Name
        </label>
        <input
          id="displayName"
          type="text"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-neutral-850 bg-black/45 hover:border-neutral-800 focus:border-neutral-700 text-xs text-white placeholder-neutral-600 focus:outline-none transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] font-sans"
          placeholder="Sarah Jenkins"
        />
      </div>

      
      <div>
        <label htmlFor="password" className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-2">
          Password (min 6 characters)
        </label>
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

      
      <div>
        <label htmlFor="confirmPassword" className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-3 pr-10 py-2 rounded-lg border border-neutral-850 bg-black/45 hover:border-neutral-800 focus:border-neutral-700 text-xs text-white placeholder-neutral-600 focus:outline-none transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] font-sans"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition duration-150 cursor-pointer focus:outline-none"
            title={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      
      {passwordError && (
        <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 rounded-lg text-[10px] font-mono flex items-start gap-2">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>VALIDATION_ERROR: {passwordError}</span>
        </div>
      )}

      
      {register.isError && (
        <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 rounded-lg text-[10px] font-mono flex items-start gap-2">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>AUTH_ERROR: {((register.error as any)?.response?.data?.message) || 'Registration failed. Email or username might be occupied.'}</span>
        </div>
      )}

      
      <button
        type="submit"
        disabled={register.isPending}
        className="w-full bg-white hover:bg-neutral-100 disabled:opacity-50 text-black font-semibold text-xs py-2 rounded-lg transition duration-200 active:scale-[0.99] cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
      >
        {register.isPending ? 'Creating Account...' : 'Register'}
      </button>

      
      <div className="pt-4 border-t border-neutral-900 text-center text-xs">
        <p className="text-neutral-550 leading-normal font-light">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-neutral-300 hover:text-white font-medium hover:underline transition">
            Login here
          </Link>
        </p>
      </div>
    </form>
  );
}
