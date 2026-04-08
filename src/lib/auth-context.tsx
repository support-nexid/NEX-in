"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { syncGetDoc, syncSetDoc, syncAuth as auth } from '@/lib/db-sync';

/* ─── Types ─── */
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  username: string;
  avatar: string;
  tagline: string;
  bio: string;
  location: string;
  tier: 'free' | 'pro' | 'enterprise';
  theme: string;
  onboardingComplete: boolean;
  createdAt: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, username: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/* ─── Provider ─── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Dual Firestore
  const fetchProfile = async (uid: string) => {
    try {
      const snap = await syncGetDoc('users', uid);
      if (snap) {
        setProfile(snap as unknown as UserProfile);
      }
    } catch (e) {
      console.error('[Auth] Profile fetch error:', e);
    }
  };

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await fetchProfile(cred.user.uid);
  };

  // Sign up with email/password
  const signUp = async (email: string, password: string, name: string, username: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Create user profile in active-active Firestore DBs
    const safeUsername = username.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const userDoc: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      name,
      username: safeUsername,
      avatar: '',
      tagline: '',
      bio: '',
      location: '',
      tier: 'free',
      theme: 'minimal-dark',
      onboardingComplete: false,
      createdAt: Date.now(),
    };

    await syncSetDoc('users', cred.user.uid, userDoc);
    
    // Wire up the Subdomain map
    await syncSetDoc('subdomains', safeUsername, {
        userId: cred.user.uid,
        createdAt: Date.now()
    });

    setProfile(userDoc);
  };

  // Google Sign-In
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    
    // Check if profile exists, if not create
    const existSnap = await syncGetDoc('users', cred.user.uid);
    
    if (!existSnap) {
      const safeUsername = (cred.user.email?.split('@')[0] || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
      const userDoc: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || '',
        name: cred.user.displayName || '',
        username: safeUsername,
        avatar: cred.user.photoURL || '',
        tagline: '',
        bio: '',
        location: '',
        tier: 'free',
        theme: 'minimal-dark',
        onboardingComplete: false,
        createdAt: Date.now(),
      };
      
      await syncSetDoc('users', cred.user.uid, userDoc);
      // Map Subdomain
      await syncSetDoc('subdomains', safeUsername, {
          userId: cred.user.uid,
          createdAt: Date.now()
      });

      setProfile(userDoc);
    } else {
      setProfile(existSnap as unknown as UserProfile);
    }
  };

  // Sign Out
  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  // Refresh profile
  const refreshProfile = async () => {
    if (user) await fetchProfile(user.uid);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
