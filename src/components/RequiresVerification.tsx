"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { auth } from '@/lib/firebase';
import { sendEmailVerification } from 'firebase/auth';

export default function RequiresVerification({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  if (loading) return null;

  // We are not blocking users entirely if they haven't authenticated yet since 
  // auth-wrapper handles standard unauthenticated redirection.
  // But if there IS a user, and their email is NOT verified, we block them.
  if (user && !user.emailVerified) {
    const handleResend = async () => {
      setResending(true);
      try {
        await sendEmailVerification(user);
        setMessage('Verification email sent! Check your inbox.');
      } catch (e: any) {
        if (e.code === 'auth/too-many-requests') {
           setMessage('Too many requests. Please wait a bit before trying again.');
        } else {
           setMessage('Failed to send verification email. Try again later.');
        }
      } finally {
        setResending(false);
      }
    };

    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md text-center">
          <div className="w-16 h-16 mx-auto bg-rose-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6">
            ✉️
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Verify your email</h2>
          <p className="text-gray-400 text-sm mb-8">
            Click the verification link we sent to <span className="text-white font-bold">{user.email}</span> to activate your dashboard access.
          </p>

          <button 
            onClick={handleResend} 
            disabled={resending}
            className="btn-primary !rounded-xl w-full !py-3.5 mb-4 disabled:opacity-50"
          >
            {resending ? 'Sending...' : 'Resend Verification Link'}
          </button>
          
          {message && (
             <p className={`text-xs font-bold ${message.includes('sent') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {message}
             </p>
          )}

          <button onClick={() => auth.signOut()} className="mt-6 text-xs text-gray-500 hover:text-white transition-colors">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
