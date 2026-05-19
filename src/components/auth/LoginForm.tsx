'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
        />
      </div>

      {login.isError && (
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm">
          Login failed. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={login.isPending}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        {login.isPending ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link href="/auth/register" className="text-blue-500 hover:underline">
          Register here
        </Link>
      </p>
    </form>
  );
}
