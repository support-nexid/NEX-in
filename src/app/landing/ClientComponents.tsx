"use client";

import React, { useState, useEffect, useRef } from 'react';

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

export function NavMenu() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/5' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-500/20">N</div>
          <span className="text-xl font-bold tracking-tight">NexId</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
          <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Reviews</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="/auth" className="text-sm text-gray-400 hover:text-white font-medium transition-colors px-4 py-2">Sign In</a>
          <a href="/app" className="btn-primary text-sm !py-2.5 !px-6">Get Started Free</a>
        </div>
      </div>
    </nav>
  );
}
