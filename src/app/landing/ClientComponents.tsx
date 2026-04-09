"use client";

import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

/* ─────── Subdomain Search ─────── */
export function SubdomainSearch() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<{available?: boolean; message?: string; loading?: boolean}>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const checkAvailability = async (subdomain: string) => {
    if (!subdomain || subdomain.length < 3) {
      setStatus(subdomain.length > 0 && subdomain.length < 3 ? { available: false, message: 'Minimum 3 characters required' } : {});
      return;
    }
    setStatus({ loading: true });
    try {
      const res = await fetch('/api/system/public/check-subdomain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomain }),
      });
      const data = await res.json();
      setStatus({ available: data.available, message: data.message, loading: false });
    } catch {
      setStatus({ available: false, message: 'Connection error. Try again.', loading: false });
    }
  };

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => checkAvailability(query), 500);
    return () => clearTimeout(timerRef.current!);
  }, [query]);

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up-delay-2">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 rounded-2xl opacity-20 group-hover:opacity-40 blur-lg transition-all duration-500"></div>
        <div className="relative flex items-center bg-[#111] border border-white/10 rounded-2xl p-2 focus-within:border-indigo-500/50 transition-all shadow-2xl">
          <span className="pl-6 text-gray-500 font-semibold select-none whitespace-nowrap text-lg">nexid.in /</span>
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white pl-2 pr-4 py-4 w-full font-bold text-xl tracking-tight"
            placeholder="yourname"
            value={query}
            onChange={(e) => setQuery(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase())}
            maxLength={30}
          />
          <button
            disabled={!status.available}
            className={`px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
              status.available
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:-translate-y-0.5'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
          >
            Claim It
          </button>
        </div>
      </div>
      <div className={`text-center mt-5 h-6 text-sm font-semibold tracking-wide transition-all duration-300 ${status.message ? 'opacity-100' : 'opacity-0'}`}>
        {status.loading ? (
          <span className="text-gray-400 animate-pulse">Scanning registry...</span>
        ) : status.available === true ? (
          <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">✓ {status.message}</span>
        ) : status.available === false ? (
          <span className="text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]">✗ {status.message}</span>
        ) : null}
      </div>
    </div>
  );
}

/* ─────── FAQ Item ─────── */
export function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-6 text-left group">
        <span className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors pr-4">{question}</span>
        <span className={`text-2xl text-gray-500 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-60 pb-6' : 'max-h-0'}`}>
        <p className="text-gray-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

/* ─────── Nav Menu (Auth-Aware) ─────── */
export function NavMenu() {
  const [scrollY, setScrollY] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setDropdownOpen(false);
    window.location.href = '/';
  };

  const initial = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/5' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-500/20">N</div>
          <span className="text-xl font-bold tracking-tight">NexId</span>
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
          <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Reviews</a>
        </div>

        {/* Auth section */}
        <div className="flex items-center gap-3">
          {authLoading ? (
            <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse" />
          ) : user ? (
            /* Logged in → Avatar + Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-white/10 transition-all"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Avatar'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm">
                    {initial}
                  </div>
                )}
                <span className="text-sm font-semibold text-white hidden sm:block max-w-[100px] truncate">
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{user.email}</p>
                  </div>
                  <div className="p-2 space-y-0.5">
                    <a href="/app" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                      <span>🏠</span> Dashboard
                    </a>
                    <a href="/app" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                      <span>⚙️</span> Settings
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged out → Sign In + Get Started */
            <>
              <a href="/auth" className="text-sm text-gray-400 hover:text-white font-medium transition-colors px-4 py-2">Sign In</a>
              <a href="/auth" className="btn-primary text-sm !py-2.5 !px-6">Get Started Free</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
