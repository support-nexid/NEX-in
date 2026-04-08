"use client";

import React, { useState, useEffect } from 'react';
import { GithubIcon, GoogleIcon, InstagramIcon, FacebookIcon, XIcon } from '@/components/icons';
import { syncSetDoc, syncGetDocs, syncSubscribe } from '@/lib/db-sync';
import { where, orderBy } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';
import ImageUpload from '@/components/ImageUpload';

/* ─────── Sidebar Navigation ─────── */
const sidebarItems = [
  { icon: '📊', label: 'Dashboard', id: 'dashboard' },
  { icon: '✉️', label: 'Inbox', id: 'inbox' },
  { icon: '👤', label: 'Portfolio', id: 'portfolio' },
  { icon: '📁', label: 'Projects', id: 'projects' },
  { icon: '💼', label: 'Experience', id: 'experience' },
  { icon: '⚡', label: 'Skills', id: 'skills' },
  { icon: '🏆', label: 'Certifications', id: 'certifications' },
  { icon: '🎨', label: 'Animations', id: 'animations' },
  { icon: '🎭', label: 'Themes', id: 'themes' },
  { icon: '🌐', label: 'Domain', id: 'domain' },
  { icon: '💳', label: 'Billing', id: 'billing' },
  { icon: '⚙️', label: 'Settings', id: 'settings' },
];

/* ─────── Stat Card ─────── */
function StatCard({ icon, value, label, color }: { icon: string; value: string | number; label: string; color: string }) {
  return (
    <div className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:transform-none">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
      <div>
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-sm text-gray-500 font-medium">{label}</div>
      </div>
    </div>
  );
}

/* ─────── Progress Bar ─────── */
function UsageBar({ label, current, max }: { label: string; current: number; max: number }) {
  const pct = Math.round((current / max) * 100);
  return (
    <div className="flex-1">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-400">{label}</span>
        <span className="text-sm font-bold text-white">{current} / {max}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}

/* ─────── Checklist Item ─────── */
function ChecklistItem({ done, label, cta, onClick }: { done: boolean; label: string; cta: string; onClick?: () => void }) {
  return (
    <div className={`flex items-center justify-between py-4 px-5 rounded-xl transition-colors ${done ? 'bg-emerald-500/5' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20 text-transparent'}`}>✓</div>
        <span className={`font-medium ${done ? 'text-gray-500 line-through' : 'text-white'}`}>{label}</span>
      </div>
      {!done && (
        <button onClick={onClick} className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center gap-1 transition-colors">
          {cta} <span>→</span>
        </button>
      )}
    </div>
  );
}

/* ─────── Dashboard View ─────── */
function DashboardView({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { user } = useAuth();
  const [totalViews, setTotalViews] = useState("-");

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      try {
        const hits = await syncGetDocs('analytics');
        // Filter those matching our user
        const ourHits = hits.filter((h: any) => h.userId === user.uid);
        setTotalViews(ourHits.length.toString());
      } catch (e) {
        console.error("Dashboard Analytics Sync Error", e);
      }
    }
    loadStats();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Dashboard</h1>
        <p className="text-gray-500">Manage your portfolio and track your progress.</p>
      </div>

      {/* Plan Usage */}
      <div className="glass-card rounded-2xl p-8 hover:transform-none">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Plan Usage</h2>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-gray-400 border border-white/10">Free Plan</span>
        </div>
        <div className="flex gap-8 flex-wrap">
          <UsageBar label="Projects" current={0} max={3} />
          <UsageBar label="Skills" current={0} max={10} />
          <UsageBar label="Experiences" current={0} max={3} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon="📈" value={totalViews} label="Total Views" color="bg-indigo-500/20" />
        <StatCard icon="✉️" value={0} label="Unread Messages" color="bg-purple-500/20" />
        <StatCard icon="📁" value={0} label="Projects" color="bg-emerald-500/20" />
        <StatCard icon="💼" value={0} label="Experiences" color="bg-amber-500/20" />
        <StatCard icon="⚡" value={0} label="Skills" color="bg-rose-500/20" />
        <StatCard icon="🏆" value={0} label="Certifications" color="bg-cyan-500/20" />
      </div>

      {/* Get Started Checklist */}
      <div className="glass-card rounded-2xl p-8 hover:transform-none">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Get Started</h2>
          <span className="text-sm text-gray-500 font-medium">0% complete</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '0%' }}></div>
        </div>
        <div className="space-y-2">
          <ChecklistItem done={false} label="Complete your Hero section" cta="Edit Hero" onClick={() => setActiveTab('portfolio')} />
          <ChecklistItem done={false} label="Add About information" cta="Add Bio" onClick={() => setActiveTab('portfolio')} />
          <ChecklistItem done={false} label="Add at least one Skill" cta="Add Skill" onClick={() => setActiveTab('skills')} />
          <ChecklistItem done={false} label="Add at least one Project" cta="Add Project" onClick={() => setActiveTab('projects')} />
          <ChecklistItem done={false} label="Choose an Animation Style" cta="Pick Animation" onClick={() => setActiveTab('animations')} />
          <ChecklistItem done={false} label="Publish your portfolio" cta="Publish Now" />
        </div>
      </div>
    </div>
  );
}

/* ─────── Portfolio Editor View ─────── */
function PortfolioView() {
  const { user, profile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    tagline: profile?.tagline || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    avatar: profile?.avatar || ''
  });

  const handleSave = async () => {
    if (!user || isSaving) return;
    setIsSaving(true);
    try {
      // Save directly to the Dual DB Sync Engine
      await syncSetDoc('portfolios', user.uid, {
        ...formData,
        is_active: true,
        updatedAt: Date.now()
      });
      alert('Portfolio Updated Across Database Network!');
    } catch (e) {
      alert('Failed to sync changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Portfolio</h1>
        <p className="text-gray-500">Edit your profile information and social links.</p>
      </div>

      {/* Avatar Upload */}
      <div className="glass-card rounded-2xl p-8 hover:transform-none flex items-center gap-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden">
          {formData.avatar ? (
            <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-black text-white/30">?</span>
          )}
        </div>
        <div>
          <ImageUpload 
            buttonLabel="Upload Photo" 
            folder={`nexid_avatars/${user?.uid}`} 
            onSuccess={(url) => setFormData({ ...formData, avatar: url })} 
          />
          <p className="text-xs text-gray-600 mt-2">Recommended: Square image, at least 400×400px. Max 5MB.</p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="glass-card rounded-2xl p-8 hover:transform-none space-y-6">
        <h2 className="text-xl font-bold mb-2">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Name / Title</label>
            <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder="My Portfolio" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Tagline</label>
            <input value={formData.tagline} onChange={(e) => setFormData({...formData, tagline: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder="Full Stack Developer" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-2">Bio</label>
          <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 h-32 resize-none focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder="Tell your story..."></textarea>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-2">Location</label>
          <input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder="Mumbai, India" />
        </div>
      </div>

      {/* Social Links */}
      <div className="glass-card rounded-2xl p-8 hover:transform-none space-y-6">
        <h2 className="text-xl font-bold mb-2">Social Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Website', placeholder: 'https://yoursite.com', icon: <div className="w-5 h-5 flex items-center justify-center text-gray-500">🌐</div> },
            { label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...', icon: <div className="w-5 h-5 flex items-center justify-center text-gray-500">in</div> },
            { label: 'GitHub', placeholder: 'https://github.com/...', icon: <GithubIcon className="w-5 h-5 text-gray-400" /> },
            { label: 'Twitter / X', placeholder: 'https://twitter.com/...', icon: <XIcon className="w-4 h-4 text-gray-400" /> },
            { label: 'Instagram', placeholder: 'https://instagram.com/...', icon: <InstagramIcon className="w-5 h-5 text-gray-400" /> },
            { label: 'Facebook', placeholder: 'https://facebook.com/...', icon: <FacebookIcon className="w-5 h-5 text-gray-400" /> },
            { label: 'YouTube', placeholder: 'https://youtube.com/@...', icon: <div className="w-5 h-5 flex items-center justify-center text-gray-400">▶</div> },
            { label: 'Dribbble', placeholder: 'https://dribbble.com/...', icon: <div className="w-5 h-5 flex items-center justify-center text-gray-400">🏀</div> },
          ].map((s) => (
            <div key={s.label}>
              <label className="block text-sm font-semibold text-gray-400 mb-2">{s.label}</label>
              <div className="relative flex items-center">
                <div className="absolute left-4">
                  {s.icon}
                </div>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder={s.placeholder} />
              </div>
            </div>
          ))}
        </div>

        {/* Custom Social */}
        <div className="border-t border-white/5 pt-6">
          <h3 className="text-sm font-bold text-gray-400 mb-4">Custom Social Link</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-2">Label</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder="Discord, Slack, etc." />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">URL</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder="https://..." />
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={isSaving} className="btn-primary !rounded-xl flex items-center gap-2 !px-8 disabled:opacity-50">
        {isSaving ? "🔄 Syncing..." : "💾 Save Changes"}
      </button>
    </div>
  );
}

/* ─────── Projects View ─────── */
function ProjectsView() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Projects</h1>
          <p className="text-gray-500">Showcase your best work. Drag to reorder.</p>
        </div>
        <button className="btn-primary !rounded-xl flex items-center gap-2 text-sm">
          + Add Project
        </button>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
        Projects <span className="px-2 py-0.5 bg-white/5 rounded font-bold text-white">0 / 3</span>
      </div>

      {/* Empty State */}
      <div className="glass-card rounded-2xl p-16 hover:transform-none text-center">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-indigo-500/10 flex items-center justify-center text-4xl mb-6">📁</div>
        <h2 className="text-2xl font-bold mb-3">No projects yet</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">Showcase your best work by adding projects. Include case studies, demos, and key achievements.</p>
        <button className="btn-primary !rounded-xl">Add Your First Project</button>
      </div>
    </div>
  );
}

/* ─────── Skills View ─────── */
function SkillsView() {
  const presetSkills = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Firebase', 'Figma', 'TailwindCSS', 'Git', 'Docker', 'AWS'];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Skills</h1>
        <p className="text-gray-500">Highlight your technical expertise. Select or add custom skills.</p>
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
        Skills <span className="px-2 py-0.5 bg-white/5 rounded font-bold text-white">0 / 10</span>
      </div>
      <div className="glass-card rounded-2xl p-8 hover:transform-none">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Add</h3>
        <div className="flex flex-wrap gap-3">
          {presetSkills.map((skill) => (
            <button key={skill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:bg-indigo-500/20 hover:border-indigo-500/30 hover:text-indigo-300 transition-all">
              + {skill}
            </button>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-white/5">
          <label className="block text-sm font-semibold text-gray-400 mb-2">Custom Skill</label>
          <div className="flex gap-3">
            <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder="e.g., GraphQL" />
            <button className="btn-primary !rounded-xl !py-3 !px-6 text-sm">Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────── Animations View ─────── */
function AnimationsView() {
  const presets = [
    { id: 'fade', name: 'Fade In', desc: 'Elements gently appear with opacity transition', preview: 'opacity: 0 → 1' },
    { id: 'slide', name: 'Slide Up', desc: 'Content slides upward into view with momentum', preview: 'translateY: 40px → 0' },
    { id: 'bounce', name: 'Bounce', desc: 'Playful spring effect on entry', preview: 'scale: 0.8 → 1.1 → 1' },
    { id: 'stagger', name: 'Stagger', desc: 'Items appear sequentially with cascade delay', preview: 'delay: 0.1s increments', pro: true },
    { id: 'parallax', name: 'Parallax Scroll', desc: 'Multi-layer depth effect on scroll', preview: 'translateZ depth layers', pro: true },
    { id: 'cinema-timeline', name: 'Cinematic Timeline', desc: 'Advanced multi-step choreographed animations', preview: 'Custom cinematic sequence', pro: true },
  ];
  const [selected, setSelected] = useState('fade');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Animation Engine</h1>
        <p className="text-gray-500">Choose how your portfolio elements appear and animate.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => !p.pro && setSelected(p.id)}
            className={`text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
              selected === p.id
                ? 'bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.1)]'
                : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
            } ${p.pro ? 'opacity-60' : ''}`}
          >
            {p.pro && (
              <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2 py-1 rounded">Pro</span>
            )}
            <h3 className="font-bold text-white mb-1">{p.name}</h3>
            <p className="text-gray-500 text-sm mb-3">{p.desc}</p>
            <code className="text-xs text-indigo-400/70 font-mono">{p.preview}</code>
            {selected === p.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>}
          </button>
        ))}
      </div>
      <button className="btn-primary !rounded-xl">Apply Animation Preset</button>
    </div>
  );
}

/* ─────── Domain View ─────── */
function DomainView() {
  const currentTier: string = 'free'; // would come from user data
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Domain & URL Settings</h1>
        <p className="text-gray-500">Manage how your portfolio is accessed on the web.</p>
      </div>

      {/* Two-Tier URL Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Free Tier Card */}
        <div className={`rounded-2xl p-6 border transition-all ${currentTier === 'free' ? 'bg-white/[0.03] border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.05)]' : 'bg-white/[0.02] border-white/5'}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-gray-400 border border-white/10">Free Plan</span>
            {currentTier === 'free' && <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Current</span>}
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Your Portfolio URL</p>
            <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono">
              <span className="text-gray-500">nexid.in/</span><span className="text-white font-bold">yourname</span>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-gray-400"><span className="text-emerald-400">✓</span> Free forever</li>
            <li className="flex items-center gap-2 text-gray-400"><span className="text-emerald-400">✓</span> Path-based URL</li>
            <li className="flex items-center gap-2 text-gray-400"><span className="text-emerald-400">✓</span> Shareable link</li>
            <li className="flex items-center gap-2 text-gray-500"><span className="text-gray-700">✗</span> No custom subdomain</li>
            <li className="flex items-center gap-2 text-gray-500"><span className="text-gray-700">✗</span> No email forwarding</li>
            <li className="flex items-center gap-2 text-gray-500"><span className="text-gray-700">✗</span> "Made with NexId" badge</li>
          </ul>
        </div>

        {/* Pro Tier Card */}
        <div className={`rounded-2xl p-6 border transition-all relative overflow-hidden ${currentTier === 'pro' ? 'bg-indigo-500/5 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.08)]' : 'bg-gradient-to-br from-indigo-500/[0.04] to-purple-500/[0.04] border-indigo-500/10'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Pro / Premium</span>
            {currentTier === 'pro' && <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Current</span>}
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Your Subdomain URL</p>
            <div className="bg-black/40 rounded-xl p-4 border border-indigo-500/10 font-mono">
              <span className="text-indigo-400 font-bold">yourname</span><span className="text-gray-500">.nexid.in</span>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-gray-300"><span className="text-indigo-400">✓</span> Real subdomain URL</li>
            <li className="flex items-center gap-2 text-gray-300"><span className="text-indigo-400">✓</span> Professional identity</li>
            <li className="flex items-center gap-2 text-gray-300"><span className="text-indigo-400">✓</span> Email forwarding (you@name.nexid.in)</li>
            <li className="flex items-center gap-2 text-gray-300"><span className="text-indigo-400">✓</span> No watermark</li>
            <li className="flex items-center gap-2 text-gray-300"><span className="text-indigo-400">✓</span> Custom domain support</li>
            <li className="flex items-center gap-2 text-gray-300"><span className="text-indigo-400">✓</span> SEO & OG meta control</li>
          </ul>
          {currentTier === 'free' && (
            <button className="btn-primary !rounded-xl w-full mt-5 !py-3 text-sm font-bold">Upgrade to Pro — ₹299/yr →</button>
          )}
        </div>
      </div>

      {/* Active URL Status */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 hover:transform-none">
        <h2 className="text-lg font-bold mb-4">Your Active URL</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-black/30 rounded-xl p-4 border border-white/5">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
          <div className="flex-1 min-w-0">
            {currentTier === 'free' ? (
              <span className="text-white font-mono font-bold text-lg break-all">nexid.in/yourname</span>
            ) : (
              <span className="text-white font-mono font-bold text-lg break-all">yourname.nexid.in</span>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold">Live</span>
            <button className="text-xs bg-white/5 hover:bg-white/10 text-gray-400 px-3 py-1 rounded-full font-bold transition-colors">📋 Copy</button>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-3">
          {currentTier === 'free'
            ? 'You\'re on the Free plan. Your portfolio is accessible via a path-based URL. Upgrade to Pro for a premium subdomain.'
            : 'Your portfolio is live on a premium subdomain. Share it anywhere!'}
        </p>
      </div>

      {/* Email Forwarding (Pro only) */}
      <div className={`glass-card rounded-2xl p-6 sm:p-8 hover:transform-none relative ${currentTier === 'free' ? 'opacity-60' : ''}`}>
        {currentTier === 'free' && <div className="absolute inset-0 bg-black/20 z-10 rounded-2xl flex items-center justify-center"><span className="bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-xl text-sm font-bold border border-indigo-500/20">🔒 Pro Feature</span></div>}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold mb-1">Email Forwarding</h2>
            <p className="text-gray-500 text-sm">Receive emails at your NexId subdomain and forward them to your inbox.</p>
          </div>
          <button className="relative w-14 h-7 rounded-full bg-white/10 border border-white/10 transition-colors hover:bg-white/15 flex-shrink-0">
            <div className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-gray-500 transition-transform"></div>
          </button>
        </div>
        
        <div className="space-y-5 mt-4">
          <div className="bg-black/30 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg">📧</span>
              <span className="font-mono font-bold text-indigo-400 text-sm sm:text-base break-all">you@yourname.nexid.in</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>↳ forwards to</span>
              <span className="text-white font-medium break-all">your-real-email@gmail.com</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 font-semibold block mb-2">Forward Emails To</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder="yourrealemail@gmail.com" />
          </div>

          <div>
            <label className="text-sm text-gray-400 font-semibold block mb-2">Email Aliases</label>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
                  <span className="font-mono text-sm text-gray-300 truncate">contact@yourname.nexid.in</span>
                </div>
                <button className="text-rose-400 hover:text-rose-300 text-xs font-bold flex-shrink-0 ml-2">Remove</button>
              </div>
              <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
                  <span className="font-mono text-sm text-gray-300 truncate">hello@yourname.nexid.in</span>
                </div>
                <button className="text-rose-400 hover:text-rose-300 text-xs font-bold flex-shrink-0 ml-2">Remove</button>
              </div>
            </div>
            <div className="flex gap-3 mt-3 flex-wrap sm:flex-nowrap">
              <input className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors text-sm" placeholder="newalias" />
              <span className="flex items-center text-gray-500 font-mono text-sm whitespace-nowrap">@yourname.nexid.in</span>
              <button className="btn-primary !rounded-xl !py-3 !px-5 text-sm flex-shrink-0">Add</button>
            </div>
          </div>

          <button className="btn-primary !rounded-xl w-full !py-3">Save Email Settings</button>
          <p className="text-xs text-gray-600 text-center">Email forwarding is managed by NexId. Changes take effect within minutes.</p>
        </div>
      </div>

      {/* Custom Domain (Pro) */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 hover:transform-none relative overflow-hidden">
        <span className="absolute top-4 right-4 text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">Pro Feature</span>
        <h2 className="text-lg font-bold mb-2">Connect Custom Domain</h2>
        <p className="text-gray-500 text-sm mb-6">Map your own .com, .io, or .dev domain to your NexId portfolio via CNAME.</p>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 font-semibold block mb-2">Your Domain</label>
            <input disabled className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-600 placeholder-gray-700 cursor-not-allowed" placeholder="portfolio.yourdomain.com" />
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-2">Point this CNAME record to:</p>
            <code className="text-indigo-400 font-mono text-sm font-bold">cname.nexid.in</code>
          </div>
        </div>
        <button disabled className="mt-6 w-full py-3 bg-white/5 text-gray-500 rounded-xl font-bold cursor-not-allowed">Upgrade to Pro to Unlock</button>
      </div>

      {/* Buy Domain (Enterprise) */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 hover:transform-none">
        <h2 className="text-lg font-bold mb-2">Need a Domain? We&apos;ll Get You One.</h2>
        <p className="text-gray-500 text-sm mb-6">Don&apos;t have a domain yet? Our Enterprise plan includes domain purchase assistance. We&apos;ll register and configure it for you.</p>
        <button className="btn-secondary !rounded-xl w-full">Contact Us for Domain Purchase</button>
      </div>
    </div>
  );
}

/* ─────── Billing / Payment View ─────── */
function BillingView() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Billing</h1>
        <p className="text-gray-500">Manage your plan and submit payment for upgrades.</p>
      </div>

      {/* Current Plan */}
      <div className="glass-card rounded-2xl p-8 hover:transform-none">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Current Plan</h2>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-gray-400 border border-white/10">Free</span>
        </div>
        <p className="text-gray-500 text-sm">You're on the Free plan. Upgrade to unlock unlimited projects, all animation presets, and custom domains.</p>
      </div>

      {/* UTR Payment Form */}
      <div className="glass-card rounded-2xl p-8 hover:transform-none">
        <h2 className="text-lg font-bold mb-6">Submit Payment for Upgrade</h2>
        <div className="space-y-5">
          <div>
            <label className="text-sm text-gray-400 font-semibold block mb-2">Select Plan</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none">
              <option value="pro">Pro — ₹299/year</option>
              <option value="enterprise">Enterprise — ₹999/year</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 font-semibold block mb-2">UTR / Transaction Number</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder="SBIN00012345678" />
          </div>
          <div>
            <label className="text-sm text-gray-400 font-semibold block mb-2">Payment Screenshot</label>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-indigo-500/30 transition-colors cursor-pointer">
              <div className="text-3xl mb-3">📷</div>
              <p className="text-sm text-gray-500">Click to upload or drag screenshot here</p>
              <p className="text-xs text-gray-600 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>
          <button className="btn-primary !rounded-xl w-full !py-4">Submit Payment for Verification</button>
          <p className="text-xs text-gray-600 text-center">Our admin team will verify and activate your plan within a few hours.</p>
        </div>
      </div>
    </div>
  );
}

/* ─────── Inbox View ─────── */
function InboxView() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // Active WebSocket connection to Dual Database Sync Engine
    const unsub = syncSubscribe('messages', [
      where('room', '==', user.uid),
      orderBy('timestamp', 'desc')
    ], (data) => {
      setMessages(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Inbox</h1>
          <p className="text-gray-500">Real-time messages from your portfolio visitors.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden hover:transform-none border border-white/5">
        {loading ? (
          <div className="p-8 w-full space-y-4 animate-pulse"><div className="h-16 bg-white/5 rounded-xl w-full"></div><div className="h-16 bg-white/5 rounded-xl w-full"></div><div className="h-16 bg-white/5 rounded-xl w-full"></div></div>
        ) : messages.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-white mb-2">No messages yet</h3>
            <p className="text-gray-500">When visitors chat with you on your portfolio, their messages will securely appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {messages.map((msg) => (
              <div key={msg.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row gap-4 sm:items-center justify-between group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/20 flex-shrink-0">
                    V
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-0.5">Visitor</h4>
                    <p className="text-gray-400 text-sm">{msg.text}</p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-600 font-medium">
                    {new Date(msg.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button className="text-xs text-indigo-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Reply →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────── Experience View ─────── */
function ExperienceView() {
  const experiences = [
    { id: 1, title: 'Full Stack Developer', company: 'Freelance / Independent', period: '2024 — Present', type: 'work', description: 'Building premium web applications for clients worldwide.' },
    { id: 2, title: 'Web Developer Intern', company: 'TechStartup Labs', period: '2023 — 2024', type: 'work', description: 'Developed multiple production features for SaaS platforms.' },
    { id: 3, title: 'B.Tech Computer Science', company: 'Mumbai University', period: '2021 — 2025', type: 'education', description: 'Focus on Software Engineering and Cloud Computing.' },
  ];
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? experiences : experiences.filter(e => e.type === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Experience</h1>
          <p className="text-gray-500">Add your work history and education.</p>
        </div>
        <button className="btn-primary !rounded-xl !py-3 !px-6 text-sm font-bold flex-shrink-0">+ Add Experience</button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[{ id: 'all', label: 'All' }, { id: 'work', label: '💼 Work' }, { id: 'education', label: '🎓 Education' }].map((tab) => (
          <button key={tab.id} onClick={() => setFilter(tab.id)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${filter === tab.id ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20' : 'bg-white/[0.03] text-gray-500 border-white/5 hover:text-white'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {filtered.map((exp, i) => (
          <div key={exp.id} className="relative pl-8 pb-8 last:pb-0 group">
            <div className="absolute left-0 top-3 bottom-0 w-px bg-white/10 group-last:hidden"></div>
            <div className={`absolute left-[-4px] top-3 w-[9px] h-[9px] rounded-full border-2 border-[#050505] ${exp.type === 'work' ? 'bg-indigo-500' : 'bg-amber-400'}`}></div>
            <div className="glass-card rounded-2xl p-6 hover:transform-none hover:border-white/10 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                <span className="text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full flex-shrink-0">{exp.period}</span>
              </div>
              <p className="text-sm text-indigo-400/70 font-medium mb-2">{exp.company}</p>
              <p className="text-sm text-gray-500">{exp.description}</p>
              <div className="flex gap-2 mt-4">
                <button className="text-xs text-gray-500 hover:text-white px-3 py-1 bg-white/5 rounded-lg transition-colors">✏️ Edit</button>
                <button className="text-xs text-rose-500 hover:text-rose-400 px-3 py-1 bg-white/5 rounded-lg transition-colors">🗑 Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────── Certifications View ─────── */
function CertificationsView() {
  const certs = [
    { id: 1, title: 'Google Cloud Professional', issuer: 'Google', year: '2024', icon: '☁️', verified: true },
    { id: 2, title: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2024', icon: '🏗️', verified: true },
    { id: 3, title: 'Meta Front-End Developer', issuer: 'Meta / Coursera', year: '2023', icon: '⚛️', verified: false },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Certifications</h1>
          <p className="text-gray-500">Showcase your professional certifications and credentials.</p>
        </div>
        <button className="btn-primary !rounded-xl !py-3 !px-6 text-sm font-bold flex-shrink-0">+ Add Certificate</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((cert) => (
          <div key={cert.id} className="glass-card rounded-2xl p-6 hover:transform-none hover:border-indigo-500/15 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{cert.icon}</span>
              {cert.verified ? (
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20">✓ Verified</span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-full border border-amber-500/20">Pending</span>
              )}
            </div>
            <h3 className="font-bold text-white text-sm mb-1 group-hover:text-indigo-400 transition-colors">{cert.title}</h3>
            <p className="text-xs text-gray-500 mb-4">{cert.issuer} • {cert.year}</p>
            <div className="flex gap-2">
              <button className="text-xs text-gray-500 hover:text-white px-3 py-1 bg-white/5 rounded-lg transition-colors flex-1 text-center">✏️ Edit</button>
              <button className="text-xs text-rose-500 hover:text-rose-400 px-3 py-1 bg-white/5 rounded-lg transition-colors">🗑</button>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button className="rounded-2xl border-2 border-dashed border-white/10 p-6 flex flex-col items-center justify-center text-gray-500 hover:text-indigo-400 hover:border-indigo-500/20 transition-all min-h-[180px]">
          <span className="text-3xl mb-2">➕</span>
          <span className="text-sm font-medium">Add Certificate</span>
        </button>
      </div>
    </div>
  );
}



/* ─────── Settings View ─────── */
function SettingsView() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Settings</h1>
        <p className="text-gray-500">Manage your account, portfolio preferences, and privacy.</p>
      </div>

      {/* Account */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 hover:transform-none">
        <h2 className="text-lg font-bold mb-6">Account</h2>
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 font-semibold block mb-2">Full Name</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" defaultValue="Veer Bhanushali" />
            </div>
            <div>
              <label className="text-sm text-gray-400 font-semibold block mb-2">Email</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" defaultValue="veer@nexid.in" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 font-semibold block mb-2">Username / Subdomain</label>
            <div className="flex items-center gap-2">
              <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-indigo-500/50 focus:outline-none transition-colors" defaultValue="veer" />
              <span className="text-gray-500 font-mono text-sm">.nexid.in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Preferences */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 hover:transform-none">
        <h2 className="text-lg font-bold mb-6">Portfolio Preferences</h2>
        <div className="space-y-4">
          {[
            { label: 'Show profile views counter', desc: 'Display total view count on your portfolio', enabled: true },
            { label: 'Enable contact form', desc: 'Allow visitors to send you messages', enabled: true },
            { label: 'Show "Available for Work" badge', desc: 'Display availability status in hero section', enabled: true },
            { label: 'Allow search engine indexing', desc: 'Let Google and other search engines find your portfolio', enabled: false },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <p className="text-sm text-white font-medium">{setting.label}</p>
                <p className="text-xs text-gray-500">{setting.desc}</p>
              </div>
              <button className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${setting.enabled ? 'bg-indigo-500' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${setting.enabled ? 'left-[26px]' : 'left-0.5'}`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 hover:transform-none">
        <h2 className="text-lg font-bold mb-6">Privacy & Security</h2>
        <div className="space-y-4">
          <button className="w-full text-left px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/[0.07] transition-colors text-sm text-gray-400 hover:text-white flex justify-between items-center">
            <span>🔒 Change Password</span><span className="text-gray-600">→</span>
          </button>
          <button className="w-full text-left px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/[0.07] transition-colors text-sm text-gray-400 hover:text-white flex justify-between items-center">
            <span>📱 Two-Factor Authentication</span><span className="text-xs bg-white/5 px-2 py-0.5 rounded text-gray-500">Not Enabled</span>
          </button>
          <button className="w-full text-left px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/[0.07] transition-colors text-sm text-gray-400 hover:text-white flex justify-between items-center">
            <span>📦 Export My Data</span><span className="text-gray-600">→</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 hover:transform-none border-rose-500/10">
        <h2 className="text-lg font-bold mb-2 text-rose-400">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">These actions are irreversible. Please be careful.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-4 py-2.5 bg-rose-500/10 text-rose-400 rounded-xl text-sm font-bold hover:bg-rose-500/20 transition-colors border border-rose-500/10">Deactivate Portfolio</button>
          <button className="px-4 py-2.5 bg-rose-500/10 text-rose-400 rounded-xl text-sm font-bold hover:bg-rose-500/20 transition-colors border border-rose-500/10">Delete Account</button>
        </div>
      </div>

      <button className="btn-primary !rounded-xl w-full !py-3 font-bold">Save All Settings</button>
    </div>
  );
}

/* ─────── Empty Placeholder View (generic fallback) ─────── */
function PlaceholderView({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">{title}</h1>
        <p className="text-gray-500">{desc}</p>
      </div>
      <div className="glass-card rounded-2xl p-16 hover:transform-none text-center">
        <div className="text-5xl mb-4">{icon}</div>
        <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
        <p className="text-gray-500">This section is under active development.</p>
      </div>
    </div>
  );
}

/* ═══════════════ THEMES VIEW ═══════════════ */
function ThemesView() {
  const [filter, setFilter] = useState('all');
  const [previewTheme, setPreviewTheme] = useState<null | typeof themes[0]>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const currentTier: string = 'free';

  const themes = [
    { id: 'minimal-dark', name: 'Minimal Dark', category: 'minimal', tier: 'free', preview: '/themes/minimal-dark.png', colors: ['#0a0a0a', '#ffffff', '#333333'], description: 'Ultra-clean dark layout with white typography. Perfect for developers who love simplicity.', popularity: 4823 },
    { id: 'gradient-glow', name: 'Gradient Glow', category: 'creative', tier: 'free', preview: '/themes/gradient-glow.png', colors: ['#1a0533', '#6366f1', '#a855f7'], description: 'Vibrant purple gradients with glassmorphism cards and neon accents. Eye-catching and modern.', popularity: 6241 },
    { id: 'corporate-light', name: 'Corporate Light', category: 'professional', tier: 'free', preview: '/themes/corporate-light.png', colors: ['#ffffff', '#1e3a5f', '#e5e7eb'], description: 'Clean white theme with navy accents. Ideal for business professionals and executives.', popularity: 3567 },
    { id: 'terminal', name: 'Terminal Hacker', category: 'developer', tier: 'free', preview: '/themes/terminal.png', colors: ['#000000', '#00ff41', '#0d1117'], description: 'Green-on-black terminal aesthetic. Built for developers who breathe code.', popularity: 5891 },
    { id: 'creative-bold', name: 'Creative Bold', category: 'creative', tier: 'pro', preview: '/themes/creative-bold.png', colors: ['#1a1a2e', '#ff6b35', '#e91e8c'], description: 'Asymmetric layouts with bold typography. Made for designers and creatives.', popularity: 4102 },
    { id: 'neo-brutalist', name: 'Neo Brutalist', category: 'creative', tier: 'pro', preview: '/themes/neo-brutalist.png', colors: ['#ffffff', '#000000', '#ffdd00'], description: 'Raw, unpolished aesthetic with thick borders and vivid accent colors. Stand out differently.', popularity: 2834 },
    { id: 'glassmorphism', name: 'Glassmorphism', category: 'modern', tier: 'pro', preview: '/themes/glassmorphism.png', colors: ['#0f172a', '#94a3b8', '#e2e8f0'], description: 'Frosted glass cards on deep blue backgrounds. Dreamy, premium, and sophisticated.', popularity: 7120 },
    { id: 'retro-wave', name: 'Retro Wave', category: 'creative', tier: 'pro', preview: '/themes/retro-wave.png', colors: ['#2d1b69', '#ff6ec7', '#00d4ff'], description: '80s synthwave vibes with neon grids and chrome text. Nostalgia meets futurism.', popularity: 3456 },
    { id: 'nature-organic', name: 'Nature Organic', category: 'minimal', tier: 'pro', preview: '/themes/nature-organic.png', colors: ['#faf5f0', '#5f7a61', '#d4a373'], description: 'Warm earthy tones with organic shapes. For designers who value sustainability and calm.', popularity: 2190 },
    { id: '3d-depth', name: '3D Depth', category: 'modern', tier: 'pro', preview: '/themes/3d-depth.png', colors: ['#0c0c1d', '#4f46e5', '#818cf8'], description: 'Layered floating cards with 3D perspective and parallax effects. Immersive experience.', popularity: 4567 },
    { id: 'monochrome', name: 'Monochrome Elegant', category: 'minimal', tier: 'pro', preview: '/themes/minimal-dark.png', colors: ['#111111', '#888888', '#ffffff'], description: 'Sophisticated grayscale palette with elegant typography. Less is more.', popularity: 3890 },
    { id: 'aurora', name: 'Aurora Borealis', category: 'modern', tier: 'pro', preview: '/themes/gradient-glow.png', colors: ['#0a192f', '#64ffda', '#8892b0'], description: 'Northern lights-inspired with teal and navy. Magical and captivating.', popularity: 5234 },
  ];

  const categories = [
    { id: 'all', label: 'All Themes', count: themes.length },
    { id: 'minimal', label: 'Minimal', count: themes.filter(t => t.category === 'minimal').length },
    { id: 'creative', label: 'Creative', count: themes.filter(t => t.category === 'creative').length },
    { id: 'modern', label: 'Modern', count: themes.filter(t => t.category === 'modern').length },
    { id: 'professional', label: 'Professional', count: themes.filter(t => t.category === 'professional').length },
    { id: 'developer', label: 'Developer', count: themes.filter(t => t.category === 'developer').length },
  ];

  const filtered = filter === 'all' ? themes : themes.filter(t => t.category === filter);
  const freeCount = themes.filter(t => t.tier === 'free').length;
  const proCount = themes.filter(t => t.tier === 'pro').length;

  const deviceSizes = { desktop: 'w-full max-w-5xl', tablet: 'w-full max-w-lg', mobile: 'w-full max-w-xs' };

  return (
    <>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Portfolio Themes</h1>
          <p className="text-gray-500">Choose a theme to define your portfolio&apos;s look. {freeCount} free, {proCount} pro themes available.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/20">{freeCount} Free</span>
          <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-500/20">{proCount} Pro</span>
        </div>
      </div>

      {/* Free Tier Limits Banner */}
      {currentTier === 'free' && (
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/15 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <p className="text-white font-semibold text-sm">Free Plan — {freeCount} Themes Available</p>
              <p className="text-gray-400 text-xs">Upgrade to Pro to unlock all {themes.length} themes with premium animations.</p>
            </div>
          </div>
          <button className="btn-primary !rounded-xl !py-2 !px-5 text-xs font-bold flex-shrink-0">Upgrade to Pro →</button>
        </div>
      )}

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setFilter(cat.id)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${filter === cat.id ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.08)]' : 'bg-white/[0.03] text-gray-500 border-white/5 hover:text-white hover:bg-white/[0.06]'}`}>
            {cat.label} <span className="text-gray-600 ml-1">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((theme) => {
          const isLocked = theme.tier === 'pro' && currentTier === 'free';
          return (
            <div key={theme.id} className={`group rounded-2xl border overflow-hidden transition-all hover:shadow-xl hover:shadow-indigo-500/5 ${isLocked ? 'border-white/5 opacity-80 hover:opacity-100' : 'border-white/[0.06] hover:border-indigo-500/20'}`}>
              {/* Preview Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a0a]">
                <img src={theme.preview} alt={theme.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => setPreviewTheme(theme)} className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm font-bold hover:bg-white/20 transition-colors">
                    👁 Live Preview
                  </button>
                  {!isLocked && (
                    <button className="px-4 py-2 bg-indigo-500 rounded-xl text-white text-sm font-bold hover:bg-indigo-600 transition-colors">
                      Apply Theme
                    </button>
                  )}
                </div>

                {/* Tier Badge */}
                <div className="absolute top-3 right-3">
                  {theme.tier === 'free' ? (
                    <span className="px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider rounded-lg">Free</span>
                  ) : (
                    <span className="px-2.5 py-1 bg-indigo-500/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1">👑 Pro</span>
                  )}
                </div>

                {/* Lock overlay for pro themes */}
                {isLocked && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-0">
                    <span className="text-2xl">🔒</span>
                  </div>
                )}
              </div>

              {/* Theme Info */}
              <div className="p-4 bg-[#0a0a0a]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-sm">{theme.name}</h3>
                  <span className="text-[10px] text-gray-600 font-medium">{theme.popularity.toLocaleString()} users</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{theme.description}</p>
                <div className="flex items-center justify-between">
                  {/* Color Palette Preview */}
                  <div className="flex gap-1.5">
                    {theme.colors.map((c, i) => (
                      <div key={i} className="w-5 h-5 rounded-full border border-white/10" style={{ backgroundColor: c }}></div>
                    ))}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-400">{theme.category}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* ═════ LIVE PREVIEW MODAL ═════ */}
    {previewTheme && (
      <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
        {/* Preview Top Bar */}
        <div className="bg-[#0a0a0a] border-b border-white/5 px-4 sm:px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setPreviewTheme(null)} className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">← Back to Themes</button>
            <div className="hidden sm:block h-6 w-px bg-white/10"></div>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-sm">{previewTheme.name}</span>
              <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${previewTheme.tier === 'free' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>{previewTheme.tier}</span>
            </div>
          </div>
          
          {/* Device Switcher */}
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/5">
            {([['desktop', '🖥️'], ['tablet', '📱'], ['mobile', '📲']] as const).map(([device, icon]) => (
              <button key={device} onClick={() => setPreviewDevice(device)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${previewDevice === device ? 'bg-indigo-500/20 text-indigo-400 shadow-sm' : 'text-gray-500 hover:text-white'}`}>
                <span className="mr-1">{icon}</span><span className="hidden sm:inline capitalize">{device}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {previewTheme.tier === 'free' || currentTier === 'pro' ? (
              <button className="btn-primary !rounded-xl !py-2 !px-5 text-sm font-bold">✓ Apply This Theme</button>
            ) : (
              <button className="btn-primary !rounded-xl !py-2 !px-5 text-sm font-bold">👑 Upgrade to Apply</button>
            )}
            <button onClick={() => setPreviewTheme(null)} className="text-gray-500 hover:text-white text-xl transition-colors">✕</button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto flex items-start justify-center p-4 sm:p-8">
          <div className={`${deviceSizes[previewDevice]} transition-all duration-500 ease-out`}>
            {/* Device Frame */}
            <div className={`bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 ${previewDevice === 'mobile' ? 'rounded-[32px]' : ''}`}>
              {/* Browser Chrome */}
              <div className="bg-[#111] border-b border-white/5 px-4 py-2.5 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg px-3 py-1 text-xs text-gray-500 font-mono text-center">yourname.nexid.in</div>
              </div>
              {/* Theme Preview Image */}
              <div className="relative">
                <img src={previewTheme.preview} alt={previewTheme.name} className="w-full h-auto block" />
                {previewTheme.tier === 'pro' && currentTier === 'free' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-center">
                    <p className="text-white font-bold text-sm">🔒 This is a Pro theme</p>
                    <p className="text-gray-400 text-xs mt-1">Upgrade your plan to apply this theme to your portfolio.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Bottom Bar with Theme Details */}
        <div className="bg-[#0a0a0a] border-t border-white/5 px-4 sm:px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {previewTheme.colors.map((c, i) => (
                <div key={i} className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: c }}></div>
              ))}
            </div>
            <span className="hidden sm:inline text-xs text-gray-500">{previewTheme.description}</span>
          </div>
          <span className="text-xs text-gray-600">{previewTheme.popularity.toLocaleString()} portfolios using this theme</span>
        </div>
      </div>
    )}
    </>
  );
}

/* ═══════════════ ONBOARDING WIZARD ═══════════════ */
function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const stepInfo = [
    { title: 'Tell Us About You', desc: 'Let\'s start with the basics for your portfolio.', icon: '👋' },
    { title: 'Skills & Socials', desc: 'Highlight your expertise and connect your profiles.', icon: '⚡' },
    { title: 'Your First Project', desc: 'Showcase a project to make your portfolio shine.', icon: '🚀' },
  ];

  const presetSkills = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Figma', 'TailwindCSS', 'Firebase', 'Docker', 'AWS', 'Git'];
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (s: string) => setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center p-4 overflow-y-auto">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 font-medium">Step {step} of {totalSteps}</span>
            <button onClick={onComplete} className="text-sm text-gray-600 hover:text-gray-400 transition-colors">Skip Setup →</button>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
          </div>
          <div className="flex justify-between mt-3">
            {stepInfo.map((s, i) => (
              <div key={i} className={`flex items-center gap-2 text-xs font-medium transition-colors ${i + 1 <= step ? 'text-indigo-400' : 'text-gray-700'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${i + 1 < step ? 'bg-indigo-500 border-indigo-500 text-white' : i + 1 === step ? 'border-indigo-500 text-indigo-400' : 'border-white/10 text-gray-600'}`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className="hidden sm:inline">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 hover:transform-none border border-white/[0.06]">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{stepInfo[step - 1].icon}</div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{stepInfo[step - 1].title}</h1>
            <p className="text-gray-500">{stepInfo[step - 1].desc}</p>
          </div>

          {/* Step 1: Profile Basics & Niche */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-2">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border-2 border-dashed border-white/20 flex items-center justify-center text-3xl font-black text-white/30 flex-shrink-0 cursor-pointer hover:border-indigo-500/40 transition-colors">?</div>
                <div className="flex-1 w-full space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-1.5">Full Name</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder="e.g., Veer Bhanushali" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-1.5">Tagline / Title</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder="e.g., Full Stack Developer" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-emerald-400 mb-1.5">What are you making? (Your Niche)</label>
                <select className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors appearance-none">
                  <option value="" disabled selected>Select your industry</option>
                  <option value="startup">Startup Founder / CEO</option>
                  <option value="developer">Software Developer</option>
                  <option value="designer">UI/UX Designer</option>
                  <option value="creator">Content Creator / Influencer</option>
                  <option value="freelancer">Freelancer / Consultant</option>
                  <option value="student">Student / Job Seeker</option>
                </select>
                <p className="text-xs text-gray-500 mt-1.5">We will auto-apply a premium theme to match your niche.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">Location</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder="e.g., Mumbai, India" />
              </div>
            </div>
          )}

          {/* Step 2: Skills & Socials */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Select Your Skills</label>
                <div className="flex flex-wrap gap-2">
                  {presetSkills.map((skill) => (
                    <button key={skill} onClick={() => toggleSkill(skill)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${selectedSkills.includes(skill) ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                      {selectedSkills.includes(skill) ? '✓ ' : '+ '}{skill}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">{selectedSkills.length} selected · You can add more later</p>
              </div>
              <div className="border-t border-white/5 pt-6">
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Social Profiles</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'LinkedIn', placeholder: 'linkedin.com/in/...', icon: '🔗' },
                    { label: 'GitHub', placeholder: 'github.com/...', icon: '💻' },
                    { label: 'Twitter / X', placeholder: 'x.com/...', icon: '🐦' },
                    { label: 'Portfolio / Website', placeholder: 'yoursite.com', icon: '🌐' },
                  ].map((s) => (
                    <div key={s.label} className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">{s.icon}</span>
                      <input className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder={s.placeholder} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: First Project */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">Project Name</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder="e.g., E-Commerce Dashboard" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">Description</label>
                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 h-20 resize-none focus:border-indigo-500/50 focus:outline-none transition-colors" placeholder="Brief overview of what the project does..."></textarea>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1.5">Tech Stack</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors text-sm" placeholder="React, Node.js, Python..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1.5">Live Demo URL</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none transition-colors text-sm" placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">Cover Image</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-indigo-500/30 transition-colors cursor-pointer">
                  <div className="text-2xl mb-2">📷</div>
                  <p className="text-sm text-gray-500">Click to upload a project screenshot</p>
                  <p className="text-xs text-gray-700 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={() => step > 1 ? setStep(step - 1) : null} className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${step > 1 ? 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10' : 'invisible'}`}>
            ← Back
          </button>
          <div className="flex gap-3">
            <button onClick={() => step < totalSteps ? setStep(step + 1) : onComplete()} className="text-sm text-gray-600 hover:text-gray-400 transition-colors px-4 py-3">
              Skip this step
            </button>
            <button onClick={() => step < totalSteps ? setStep(step + 1) : onComplete()} className="btn-primary !rounded-xl !py-3 !px-8 text-sm font-bold">
              {step < totalSteps ? 'Continue →' : '🎉 Launch Dashboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ MAIN APP BUILDER ═══════════════ */
export default function BuilderApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView setActiveTab={setActiveTab} />;
      case 'portfolio': return <PortfolioView />;
      case 'projects': return <ProjectsView />;
      case 'skills': return <SkillsView />;
      case 'animations': return <AnimationsView />;
      case 'themes': return <ThemesView />;
      case 'domain': return <DomainView />;
      case 'billing': return <BillingView />;
      case 'inbox': return <InboxView />;
      case 'experience': return <ExperienceView />;
      case 'certifications': return <CertificationsView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
    {/* Onboarding Wizard */}
    {showOnboarding && <OnboardingWizard onComplete={() => setShowOnboarding(false)} />}

    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Mobile Overlay */}
      {mobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>}

      {/* ═════ Sidebar ═════ */}
      <aside className={`
        ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 border-r border-white/5 flex flex-col bg-[#080808] flex-shrink-0 h-screen sticky top-0
        max-lg:fixed max-lg:z-50 max-lg:w-72 max-lg:shadow-2xl max-lg:shadow-black/50
        ${mobileMenuOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-500/20">N</div>
            {sidebarOpen && <span className="text-lg font-bold tracking-tight">NexId</span>}
          </div>
          <button onClick={() => { setSidebarOpen(!sidebarOpen); setMobileMenuOpen(false); }} className="text-gray-600 hover:text-white transition-colors text-lg max-lg:hidden">
            {sidebarOpen ? '‹' : '›'}
          </button>
          <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white text-xl lg:hidden">✕</button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-indigo-500/15 text-indigo-400 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]'
                  : 'text-gray-500 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <span className={`${!sidebarOpen ? 'lg:hidden' : ''}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom: View Portfolio Link */}
        <div className="p-4 border-t border-white/5">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-indigo-400 hover:bg-indigo-500/10 transition-colors">
            <span>🔗</span>
            <span className={`${!sidebarOpen ? 'lg:hidden' : ''}`}>View Portfolio</span>
          </a>
        </div>
      </aside>

      {/* ═════ Main Content ═════ */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-gray-400 hover:text-white text-xl p-1">☰</button>
            <span className="text-sm text-gray-600 font-medium hidden sm:inline">app.nexid.in</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="btn-primary !py-2 !px-4 sm:!px-5 text-xs sm:text-sm !rounded-xl">Publish</button>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm cursor-pointer">V</div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
          {renderContent()}
        </div>
      </main>
    </div>
    </>
  );
}

