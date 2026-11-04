'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError('This domain is not authorized in Firebase Console. Please add this domain under Firebase Authentication > Settings > Authorized Domains.');
      } else {
        setError(err.message || 'Google sign-in failed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill out all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await register(email, password, name);
      router.push('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please log in.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized in Firebase Console. Please add this domain under Firebase Authentication > Settings > Authorized Domains.');
      } else if (err.code === 'auth/api-key-not-valid' || err.message?.includes('api-key-not-valid')) {
        setError('Firebase API Key error. Please verify your Firebase project setup.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email sign-in was recently enabled. Please refresh the page and try again.');
      } else {
        setError(err.message || 'Registration failed.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-20 bg-[#e8edf5] min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#e8edf5] rounded-3xl shadow-[12px_12px_28px_#c5d0e0,-12px_-12px_28px_#ffffff] border border-white/80 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-block p-2 rounded-2xl bg-[#e8edf5] shadow-[4px_4px_10px_#c5d0e0,-4px_-4px_10px_#ffffff] border border-white/80 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="IEEE Logo"
              className="h-12 w-auto object-contain mx-auto rounded-xl"
            />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Member Account</h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Access your verified membership status, event certificates, and participation records
          </p>
          <div className="mt-3.5 inline-block px-3.5 py-1 rounded-full bg-[#e8edf5] shadow-[inset_2px_2px_5px_#c5d0e0,inset_-2px_-2px_5px_#ffffff] border border-white/60 text-[11px] text-ieee-blue font-bold">
            Restricted to verified IEEE STB Members
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-[#e8edf5] shadow-[inset_3px_3px_6px_#fca5a5,inset_-3px_-3px_6px_#ffffff] border border-red-300 space-y-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-red-800 leading-relaxed">{error}</p>
            </div>
            {error.includes('not a registered member') && (
              <div className="pt-2 border-t border-red-200 flex items-center justify-between">
                <span className="text-[11px] text-red-700">Want to join IEEE STB?</span>
                <Link
                  href="/recruitment"
                  className="text-xs font-bold text-ieee-blue hover:underline inline-flex items-center gap-1"
                >
                  Join Branch ↗
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ankit Sharma"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#e8edf5] shadow-[inset_3px_3px_6px_#c5d0e0,inset_-3px_-3px_6px_#ffffff] border border-white/60 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#e8edf5] shadow-[inset_3px_3px_6px_#c5d0e0,inset_-3px_-3px_6px_#ffffff] border border-white/60 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#e8edf5] shadow-[inset_3px_3px_6px_#c5d0e0,inset_-3px_-3px_6px_#ffffff] border border-white/60 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ieee-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white neu-btn-primary transition-all flex items-center justify-center gap-2 shadow-neu-primary disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-slate-300 w-full" />
          <span className="bg-[#e8edf5] px-3 text-[11px] text-slate-500 uppercase font-bold">or continue with</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-800 bg-[#e8edf5] shadow-[5px_5px_12px_#c5d0e0,-5px_-5px_12px_#ffffff] hover:shadow-[3px_3px_6px_#c5d0e0,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#c5d0e0,inset_-2px_-2px_4px_#ffffff] border border-white/80 transition flex items-center justify-center gap-2.5 disabled:opacity-50"
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
          <span>Sign up with Google</span>
        </button>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-ieee-blue hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
