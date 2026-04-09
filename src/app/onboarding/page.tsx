"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { syncSetDoc } from '@/lib/db-sync';
import ImageUpload from '@/components/ImageUpload';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [avatar, setAvatar] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.onboardingComplete) {
      router.replace('/app');
    }
  }, [profile, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/50 animate-pulse">Loading...</div>;
  }

  const handleFinish = async () => {
    setSaving(true);
    try {
      await syncSetDoc('users', user.uid, {
        avatar,
        tagline,
        phone,
        onboardingComplete: true
      });
      // Need a slight delay for context to re-hydrate, then route to app
      setTimeout(() => {
        window.location.href = '/app';
      }, 500);
    } catch (e) {
       console.error(e);
       alert("Failed to save details. Try again.");
       setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2">Almost there!</h1>
          <p className="text-gray-500">Let's complete your profile to finish setting up your portfolio.</p>
        </div>

        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 space-y-6">
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Profile Photo</span>
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-white/20 hover:border-indigo-500/50 transition-colors relative mb-2">
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500 text-xs">No Photo</div>
              )}
              {/* Overlay ImageUpload to let them pick */}
              <ImageUpload
                 preset="nexid_avatars"
                 className="absolute inset-0"
                 onSuccess={(url) => setAvatar(url)}
              />
            </div>
            <p className="text-[10px] text-gray-500">Tap to upload</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div>
              <label className="text-sm text-gray-400 font-semibold block mb-2">Tagline or Profession</label>
              <input 
                type="text" 
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="e.g. Senior Software Engineer" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors text-sm" 
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 font-semibold block mb-2">Phone Number</label>
              <input 
                type="text" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 9876543210" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors text-sm" 
              />
            </div>
          </div>

          <button 
            onClick={handleFinish}
            disabled={saving || !tagline || !phone} 
            className="w-full mt-4 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl transition-all hover:shadow-xl hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {saving ? 'Finalizing Setup...' : 'Complete Registration'}
          </button>
        </div>
      </div>
    </div>
  );
}
