'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, user, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in was cancelled.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not yet authorized in Firebase Console. Please add this domain under Firebase Authentication > Settings > Authorized Domains.');
      } else {
        setError(err.message || 'Google sign-in failed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

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
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email sign-in was recently enabled. Please refresh the page and try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not yet authorized in Firebase Console. Please add this domain under Firebase Authentication > Settings > Authorized Domains.');
      } else if (err.code === 'auth/api-key-not-valid' || err.message?.includes('api-key-not-valid')) {
        setError('Firebase API Key error. Please verify your Firebase project setup.');
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
    <div className="min-h-screen flex items-center justify-center bg-[#e8edf5] px-4">
      <div className="max-w-md w-full neu-card-lg rounded-3xl p-8 sm:p-10 border border-white/80">
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="inline-block p-2 neu-card-sm rounded-2xl mb-4 border border-white/70">
            <img
              src="/logo.jpg"
              alt="IEEE Logo"
              className="h-14 w-auto object-contain rounded-xl"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">IEEE STB Admin Portal</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Sign in with Super Admin or Sub-Admin credentials
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl neu-inset text-red-600 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative neu-inset rounded-2xl">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ieee.org"
                required
                className="w-full bg-transparent pl-11 pr-4 py-3 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Password
            </label>
            <div className="relative neu-inset rounded-2xl">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-transparent pl-11 pr-4 py-3 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="neu-btn-primary w-full mt-3 py-3.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
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

        <div className="relative my-6 flex items-center justify-center">
          <div className="neu-inset h-[2px] w-full" />
          <span className="bg-[#e8edf5] px-3 text-[10px] text-slate-400 uppercase font-bold absolute">or</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="neu-btn w-full py-3 px-4 rounded-xl text-slate-700 font-bold text-xs transition flex items-center justify-center gap-2.5 disabled:opacity-50"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
