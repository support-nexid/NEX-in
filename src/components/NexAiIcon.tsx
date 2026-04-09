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
        
        {/* Stylized Glowing 'N' */}
        <div className={`relative z-10 flex items-center justify-center w-full h-full transition-all duration-500 ${isProcessing ? 'scale-110' : 'scale-100'}`}>
          <span className={`font-black text-3xl italic tracking-tighter ${
            isProcessing 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
              : 'text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
            }`}
             style={{ WebkitTextStroke: isProcessing ? '0.5px rgba(255,255,255,0.5)' : 'none' }}>
            N
          </span>
          {/* Subtle accent mark on the N to make it look like a logo */}
          <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-white animate-ping' : 'bg-indigo-400'}`}></span>
        </div>
      </div>
    </div>
  );
}
