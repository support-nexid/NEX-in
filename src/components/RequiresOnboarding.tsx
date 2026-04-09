"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function RequiresOnboarding({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (user && profile) {
        if (!profile.onboardingComplete) {
          router.replace('/onboarding');
        } else {
          setChecking(false);
        }
      } else if (!user) {
         // Rely on auth-wrapper to catch no-user state
         setChecking(false);
      }
    }
  }, [user, profile, loading, router]);

  if (loading || checking) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/50 animate-pulse">Checking profile...</div>;
  }

  return <>{children}</>;
}
