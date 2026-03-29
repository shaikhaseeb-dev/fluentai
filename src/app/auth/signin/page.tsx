'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mic, Mail, Lock, Chrome } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid email or password.');
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-display text-surface-900">Welcome back</h1>
          <p className="text-surface-500 text-sm mt-1">Sign in to continue your practice</p>
        </div>

        <div className="card">
          {/* Google OAuth */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="btn-secondary w-full justify-center mb-4"
          >
            <Chrome className="w-4 h-4" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-surface-200" />
            <span className="text-xs text-surface-400">or</span>
            <div className="flex-1 h-px bg-surface-200" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSignIn} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 text-sm transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 text-sm transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-correction bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-surface-500 mt-4">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-primary-700 font-medium hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
