"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function VisitorAuthModal({ isOpen, onClose, title = "Sign in to interact", description = "You need to verify your identity to perform this action." }: Props) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Sign in failed. Please try again or check pop-up settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-8 overflow-hidden rounded-3xl glass-card animate-fade-in-up">
        {/* Glow Effects */}
        <div className="absolute top-0 w-full h-1 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"></div>
        <div className="absolute w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -top-10 -left-10"></div>
        
        <button onClick={onClose} className="absolute text-gray-400 top-4 right-4 hover:text-white transition-colors">
          ✕
        </button>

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
            <span className="text-2xl">🔒</span>
          </div>
          
          <h2 className="mb-2 text-2xl font-bold text-white">{title}</h2>
          <p className="mb-8 text-sm text-gray-400">{description}</p>

          <button 
            onClick={handleGoogleSignIn} 
            disabled={loading}
            className="flex items-center justify-center w-full gap-3 py-4 text-sm font-bold text-white transition-all duration-300 border bg-white/5 border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="animate-pulse">Connecting...</span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>
          
          <p className="mt-6 text-xs text-gray-500">
            By continuing, you verify your identity to prevent spam on the platform.
          </p>
        </div>
      </div>
    </div>
  );
}
