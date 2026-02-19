'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AdminAuthProps {
  children: ReactNode;
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('profile_admin_key');
    if (stored) {
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/profile/admin', {
        headers: { 'x-admin-key': password },
      });

      if (res.ok) {
        sessionStorage.setItem('profile_admin_key', password);
        setIsAuthenticated(true);
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Connection error');
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm p-8 rounded-2xl bg-white/[0.03] border border-white/10"
        >
          <h1 className="text-xl font-bold text-white mb-2">Flow Profile Admin</h1>
          <p className="text-sm text-gray-500 mb-6">Enter the admin password to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10"
              autoFocus
            />

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-[#6BA292] to-[#7A4DA4] text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Enter
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
