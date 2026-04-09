"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { syncSetDoc } from '@/lib/db-sync';
import ImageUpload from '@/components/ImageUpload';
import NexAiIcon from '@/components/NexAiIcon';
import { useRouter } from 'next/navigation';
import MobileBlocker from '@/components/MobileBlocker';

export default function OnboardingPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [avatar, setAvatar] = useState(user?.photoURL || '');
  const [prompt, setPrompt] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Finalizing Setup...');

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
    setLoadingMsg("AI is thinking...");
    
    try {
      // 1. Generate full portfolio with AI
      const aiRes = await fetch('/api/system/ai/generate-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      if (!aiRes.ok) {
        let errStr = "Failed to generate portfolio from AI";
        try {
          const errData = await aiRes.json();
          errStr = errData?.error || errStr;
        } catch(e) {}
        throw new Error(errStr);
      }
      
      const { data: generatedData } = await aiRes.json();
      
      setLoadingMsg("Saving to database...");

      // 2. Save Portfolio to DB
      const portfolioPayload = {
        name: user.displayName || "Unknown User",
        tagline: generatedData.tagline || "",
        bio: generatedData.bio || "",
        location: "Planet Earth",
        avatar: avatar,
        theme: "dark",
        tier: "free",
        stats: { views: 0, projects: generatedData.projects?.length || 0, experience: generatedData.experience?.length || 0 },
        skills: generatedData.skills || [],
        projects: generatedData.projects || [],
        experience: generatedData.experience || [],
        certifications: [],
        socials: { github: "#", linkedin: "#" },
        is_active: false, // Must explicitly publish to show
        is_published: false
      };
      
      await syncSetDoc('portfolios', user.uid, portfolioPayload);

      // 3. Mark User as Onboarded
      await syncSetDoc('users', user.uid, {
        avatar,
        onboardingComplete: true
      });

      // Need a slight delay for context to re-hydrate, then route to app
      setTimeout(() => {
        window.location.href = '/app';
      }, 500);

    } catch (e: any) {
       console.error("AI Generation Error:", e);
       alert("Failed to build portfolio.\nReason: " + (e.message || "Unknown error"));
       setSaving(false);
    }
  };

  return (
    <>
    <MobileBlocker />
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative w-full max-w-xl z-20">
        <div className="text-center mb-10 flex flex-col items-center">
          <NexAiIcon className="w-20 h-20 mb-6" isProcessing={saving} />
          <h1 className="text-4xl font-black text-white mb-3">Let's build your portfolio.</h1>
          <p className="text-gray-400">Describe who you are, and NEX-Ai will instantly generate your entire layout, skills, and dummy projects.</p>
        </div>

        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-white/20 hover:border-indigo-500/50 transition-colors relative mb-2">
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500 text-xs">No Photo</div>
              )}
              {/* Overlay ImageUpload to let them pick */}
              <ImageUpload
                 folder="avatars"
                 className="absolute inset-0 z-10"
                 onSuccess={(url) => setAvatar(url)}
              />
            </div>
            <p className="text-xs text-gray-500 font-medium">Profile Photo (Optional)</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div>
              <label className="text-sm font-bold text-gray-300 block mb-3">Describe Yourself</label>
              <textarea 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="I am a Graphic Designer who loves 3D rendering and dark mode aesthetics..." 
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:bg-white/10 focus:-translate-y-1 focus:outline-none transition-all text-sm resize-none" 
              />
              {/* Quick Prompt Suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { label: "🧑‍💻 Web Developer", text: `I am ${user?.displayName?.split(' ')[0] || 'a'}, a Full Stack Developer specializing in React, Next.js, and clean UI design.` },
                  { label: "🎨 Designer", text: `I am ${user?.displayName?.split(' ')[0] || 'a'}, a UI/UX & Graphic Designer passionate about modern layouts and 3D aesthetics.` },
                  { label: "📈 Marketer", text: `I am ${user?.displayName?.split(' ')[0] || 'a'}, a Digital Marketer focusing on SEO, growth hacking, and conversion optimization.` }
                ].map((suggestion) => (
                  <button 
                    key={suggestion.label} 
                    onClick={() => setPrompt(suggestion.text)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 hover:text-white hover:border-indigo-500/50 hover:bg-white/10 transition-all font-medium"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleFinish}
            disabled={saving || prompt.trim().length < 10} 
            className="group w-full mt-4 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl transition-all hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-3"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {loadingMsg}
              </>
            ) : (
              <>
                Generate My Portfolio 🚀
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
