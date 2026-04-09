'use client';
import { useEffect, useState } from 'react';

export default function MobileBlocker() {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Check initial screen width
    const handleResize = () => {
      // Lock for any screen smaller than 1024px (Mobile + Tablet)
      setIsLocked(window.innerWidth < 1024);
    };

    handleResize(); // Trigger immediately
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hydration safety: do not render anything on server for this component
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center p-8 text-center font-sans tracking-wide">
      {/* Animated Lock Icon Area */}
      <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
        {/* Pulsing rings */}
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping opacity-75"></div>
        <div className="absolute inset-2 bg-purple-500/20 rounded-full animate-pulse"></div>
        
        {/* Icon */}
        <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-[#111] to-[#222] border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)]">
          <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {/* Desktop Monitor SVG */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Desktop Experience Required</h2>
      <p className="text-gray-400 max-w-md mx-auto leading-relaxed text-sm">
        NEXID is a powerful workspace designed for precision. For the best experience while building and managing your portfolio, 
        <span className="text-white font-medium"> please access this platform on a desktop or laptop computer.</span>
      </p>
    </div>
  );
}
