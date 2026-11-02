'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginDevSuperAdmin, user, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login Error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ieee-blue/20 text-ieee-cyan mb-3">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">IEEE STB Admin Portal</h1>
          <p className="text-sm text-slate-400 mt-1">
            Sign in with Super Admin or Sub-Admin credentials
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300 leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ieee.org"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ieee-blue focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ieee-blue focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-ieee-blue hover:bg-ieee-electric text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Admin Panel</span>
            )}
          </button>
        </form>

        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-slate-700 w-full" />
          <span className="bg-slate-800 px-3 text-[11px] text-slate-400 uppercase font-semibold">or</span>
        </div>

        <button
          type="button"
          onClick={async () => {
            setSubmitting(true);
            try {
              await loginDevSuperAdmin();
              router.push('/dashboard');
            } catch (err: any) {
              setError(err.message || 'Demo session login failed');
            } finally {
              setSubmitting(false);
            }
          }}
          className="w-full bg-slate-700/60 hover:bg-slate-700 text-ieee-cyan font-semibold py-2.5 px-4 rounded-lg text-xs transition border border-slate-600 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>One-Click Explore Session (Super Admin)</span>
        </button>

        <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-400">
            Initial setup? Run the seed script: <code className="text-ieee-cyan">npm run seed:superadmin</code>
          </p>
        </div>
      </div>
    </div>
  );
}

