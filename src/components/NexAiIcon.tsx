import React from 'react';

interface NexAiIconProps {
  className?: string;
  isProcessing?: boolean;
}

export default function NexAiIcon({ className = "w-16 h-16", isProcessing = false }: NexAiIconProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Core Backglow */}
      <div className={`absolute inset-0 bg-indigo-500/20 rounded-full blur-xl transition-all duration-1000 ${isProcessing ? 'bg-purple-500/50 scale-150 animate-pulse' : 'animate-pulse'}`}></div>
      
      {/* Outer Orbit */}
      <div className={`absolute inset-0 rounded-full border border-indigo-500/20 transition-all duration-500 ${isProcessing ? 'animate-[spin_2s_linear_infinite] border-t-indigo-400 border-l-transparent' : 'animate-[spin_6s_linear_infinite] border-dashed'}`}></div>
      
      {/* Inner Orbit */}
      <div className={`absolute inset-2 rounded-full border border-purple-500/30 transition-all duration-500 ${isProcessing ? 'animate-[spin_1.5s_linear_infinite_reverse] border-b-purple-400 border-r-transparent' : 'animate-[spin_4s_linear_infinite_reverse]'}`}></div>
      
      {/* Center Core */}
      <div className={`relative w-2/3 h-2/3 bg-gradient-to-br from-[#050505] to-[#111] rounded-full border border-white/10 flex items-center justify-center shadow-inner transition-all duration-500 ${isProcessing ? 'shadow-[0_0_30px_rgba(139,92,246,0.3)] border-indigo-500/50 scale-105' : ''}`}>
        
        {/* Core Gradient Diamond/Sparkle */}
        <div className={`absolute inset-0 bg-gradient-to-tr from-indigo-500/40 to-purple-600/40 rounded-full blur-sm transition-all duration-300 ${isProcessing ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
        
        <svg viewBox="0 0 24 24" fill="currentColor" className={`w-1/2 h-1/2 transition-colors relative z-10 ${isProcessing ? 'text-white' : 'text-indigo-400'}`}>
          <path d="M11 2.206l-2.227 5.093-5.093 2.227 5.093 2.227 2.227 5.093 2.227-5.093 5.093-2.227-5.093-2.227-2.227-5.093zm8.5 12.5l-1.113 2.547-2.547 1.113 2.547 1.113 1.113 2.547 1.113-2.547 2.547-1.113-2.547-1.113-1.113-2.547z" />
        </svg>
      </div>
    </div>
  );
}
