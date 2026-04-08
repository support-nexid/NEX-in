"use client";

import React, { useState } from 'react';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Dynamic import to avoid SSR issues
      const { auth, db } = await import('@/lib/firebase');
      const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import('firebase/auth');
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');

      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = '/';
      } else {
        if (!name || !username) {
          setError('Name and username are required.');
          setLoading(false);
          return;
        }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', cred.user.uid), {
          email,
          name,
          username: username.toLowerCase().replace(/[^a-z0-9-]/g, ''),
          avatar: '',
          tagline: '',
          bio: '',
          location: '',
          tier: 'free',
          theme: 'minimal-dark',
          onboardingComplete: false,
          subdomain: username.toLowerCase().replace(/[^a-z0-9-]/g, ''),
          is_active: true,
          createdAt: serverTimestamp(),
        });
        window.location.href = '/';
      }
    } catch (err: any) {
      const msg = err?.code === 'auth/email-already-in-use' ? 'This email is already registered.'
        : err?.code === 'auth/invalid-credential' ? 'Invalid email or password.'
        : err?.code === 'auth/weak-password' ? 'Password must be at least 6 characters.'
        : err?.code === 'auth/invalid-email' ? 'Please enter a valid email address.'
        : 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { auth, db } = await import('@/lib/firebase');
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore');

      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);

      const docRef = doc(db, 'users', cred.user.uid);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        await setDoc(docRef, {
          email: cred.user.email || '',
          name: cred.user.displayName || '',
          username: (cred.user.email?.split('@')[0] || '').toLowerCase().replace(/[^a-z0-9-]/g, ''),
          avatar: cred.user.photoURL || '',
          tagline: '',
          bio: '',
          location: '',
          tier: 'free',
          theme: 'minimal-dark',
          onboardingComplete: false,
          subdomain: (cred.user.email?.split('@')[0] || '').toLowerCase().replace(/[^a-z0-9-]/g, ''),
          is_active: true,
          createdAt: serverTimestamp(),
        });
      }
      window.location.href = '/';
    } catch (err: any) {
      setError('Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <a href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-xl shadow-indigo-500/20">N</div>
            <span className="text-2xl font-black text-white tracking-tight">NexId</span>
          </a>
          <h1 className="text-3xl font-black text-white mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create your identity'}
          </h1>
          <p className="text-gray-500">
            {mode === 'login' ? 'Sign in to manage your portfolio.' : 'Build your professional portfolio in minutes.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8">
          {/* Google Sign In */}
          <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-white/5 border border-white/10 rounded-2xl text-white font-semibold text-sm hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="text-sm text-gray-400 font-semibold block mb-2">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors text-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-semibold block mb-2">Username</label>
                  <div className="relative">
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="yourname" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors text-sm pr-24 font-mono" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">.nexid.in</span>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-sm text-gray-400 font-semibold block mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors text-sm" />
            </div>

            <div>
              <label className="text-sm text-gray-400 font-semibold block mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors text-sm" />
            </div>

            {error && (
              <div className="px-4 py-3 bg-rose-500/10 border border-rose-500/15 rounded-xl text-rose-400 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl transition-all hover:shadow-xl hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {mode === 'login' && (
            <button className="w-full text-center text-xs text-gray-500 hover:text-indigo-400 transition-colors mt-4 font-medium">
              Forgot your password?
            </button>
          )}
        </div>

        {/* Toggle Mode */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Terms */}
        <p className="text-center text-[11px] text-gray-600 mt-6">
          By continuing, you agree to NexId&apos;s Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
