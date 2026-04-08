"use client";

import React, { useState, useEffect } from 'react';
import { GithubIcon, GoogleIcon, InstagramIcon, FacebookIcon, XIcon } from '@/components/icons';
import { syncGetDoc, syncSetDoc } from '@/lib/db-sync';

/* ═══════════════════════════════════════════════
   NEXID PORTFOLIO — The Rendered Public Portfolio
   This is what visitors see at username.nexid.in
   or nexid.in/username
   ═══════════════════════════════════════════════ */

// Mock structure kept as type definition reference for the live DB payload
type PortfolioData = {
  name: string;
  tagline: string;
  bio: string;
  location: string;
  avatar: string;
  theme: string;
  tier: string;
  stats: { views: number; projects: number; experience: number };
  skills: Array<{ name: string; level: number }>;
  projects: Array<any>;
  experience: Array<any>;
  certifications: Array<any>;
  socials: Record<string, string>;
  is_active: boolean;
};

/* ─────── Animated Skill Bar ─────── */
function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(level), delay);
    return () => clearTimeout(t);
  }, [level, delay]);

  return (
    <div className="group">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{name}</span>
        <span className="text-xs text-gray-500 font-mono">{level}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out" style={{ width: `${width}%` }}></div>
      </div>
    </div>
  );
}

/* ─────── Project Card ─────── */
function ProjectCard({ project, index }: { project: any; index: number }) {
  const gradients = [
    'from-indigo-500/20 to-purple-500/20',
    'from-rose-500/20 to-orange-500/20',
    'from-emerald-500/20 to-teal-500/20',
    'from-amber-500/20 to-yellow-500/20',
    'from-cyan-500/20 to-blue-500/20',
    'from-pink-500/20 to-fuchsia-500/20',
  ];
  const icons = ['🚀', '🌐', '🤖', '🎮', '⚡', '🔥'];

  return (
    <div className={`group relative rounded-2xl border border-white/5 bg-gradient-to-br ${gradients[index % gradients.length]} backdrop-blur-sm overflow-hidden hover:border-white/15 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1`}>
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between mb-4">
          <span className="text-3xl">{icons[index % icons.length]}</span>
          {project.featured && <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-500/20">Featured</span>}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-5">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map((t: string) => (
            <span key={t} className="px-2.5 py-1 bg-white/5 text-gray-400 text-[11px] font-medium rounded-lg border border-white/5">{t}</span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <a href={project.link} className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group/link">
            View Project <span className="group-hover/link:translate-x-1 transition-transform">→</span>
          </a>
          <button 
            onClick={() => alert("Visitor Login Required: You must create a Visitor Account to like projects.")}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-rose-400 transition-colors"
          >
            <span>♡</span> Like
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage({ params }: { params: { subdomain: string } }) {
  const [user, setUser] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        setLoading(true);
        // Step 1: Query the subdomain lookup from DB
        const subdomainMapping = await syncGetDoc('subdomains', params.subdomain) as any;
        
        if (subdomainMapping && subdomainMapping.userId) {
          // Step 2: Query the actual portfolio data using securely linked user ID
          const portfolio = await syncGetDoc('portfolios', subdomainMapping.userId) as any;
          
          if (portfolio) {
            setUser(portfolio as PortfolioData);
            
            // Log deep analytics view non-blockingly
            syncSetDoc('analytics', Date.now().toString(), {
              subdomain: params.subdomain,
              userId: subdomainMapping.userId,
              timestamp: Date.now(),
              userAgent: navigator.userAgent,
              type: 'view'
            }).catch(e => console.error("Analytics ping failed silently"));

            setLoading(false);
            return;
          }
        }
        setUser(null);
      } catch (e) {
        console.error("Portfolio fetch failed", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, [params.subdomain]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050505] text-white">
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <div className="text-gray-500 font-medium tracking-widest text-xs uppercase animate-pulse">Establishing Secure Connection...</div>
        <div className="text-[10px] text-gray-700 mt-2 font-mono">Routing to V1 Database</div>
      </div>
    );
  }

  if (!user || !user.is_active) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white px-6 text-center">
        <div className="w-24 h-24 mb-6 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-4xl text-rose-100 font-bold mb-4">Portfolio Disconnected</h1>
        <p className="text-gray-400 max-w-md mx-auto">This NexId identity is either not currently active or the subdomain does not exist in the routing table.</p>
        <a href="https://nexid.in" className="mt-8 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-sm font-bold transition-all">Create Your Own Portfolio</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* ═══ NAVIGATION ═══ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 80 ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <a href="#" className="text-lg font-black text-white tracking-tight">
            {user.name.split(' ')[0]}<span className="text-indigo-400">.</span>
          </a>
          <div className="hidden sm:flex items-center gap-8">
            {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-gray-400 hover:text-white transition-colors font-medium">{item}</a>
            ))}
          </div>
          <a href={`mailto:contact@${user.name.split(' ')[0].toLowerCase()}.nexid.in`} className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-sm font-bold text-white transition-colors hidden sm:block">
            Hire Me
          </a>
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/8 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/8 rounded-full blur-[128px]"></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        </div>

        <div className="relative text-center max-w-4xl mx-auto">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-8 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-indigo-500/20 border-4 border-[#050505]">
            {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" /> : user.name.charAt(0)}
          </div>

          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sm text-gray-400 font-medium">📍 {user.location} • Available for work</span>
          </div>

          {/* Name */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 text-transparent bg-clip-text">{user.name}</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-gray-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            {user.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => alert("Visitor Login Required: You must create a Visitor Account to follow creators.")}
              className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-white font-bold transition-all flex items-center gap-2 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5"
            >
              <span>+ Follow {user.name.split(' ')[0]}</span>
            </button>
            <a href={`http://chat.${user.name.split(' ')[0].toLowerCase()}.nexid.in`} target="_blank" className="px-8 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-2xl text-emerald-400 font-bold transition-all flex items-center gap-2">
              💬 Chat
            </a>
            <a href="#projects" className="px-8 py-4 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white font-bold transition-all">
              View Work ↓
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10 sm:gap-16 mt-16">
            {[
              { val: `${(user.stats.views / 1000).toFixed(1)}K`, label: 'Profile Views' },
              { val: user.stats.projects, label: 'Projects' },
              { val: `${user.stats.experience}+`, label: 'Years Exp.' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-white">{s.val}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-bounce">
          <span className="text-xs tracking-wider uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-white/10 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-white/30"></div>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT SECTION ═══ */}
      <section id="about" className="px-6 sm:px-8 py-20 sm:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-[0.2em] mb-4 block">About Me</span>
              <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
                Crafting digital<br /><span className="text-indigo-400">experiences</span> that matter.
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg">{user.bio}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '💻', label: 'Clean Code', desc: 'Maintainable & scalable' },
                { icon: '🎨', label: 'UI/UX Design', desc: 'Pixel-perfect interfaces' },
                { icon: '⚡', label: 'Performance', desc: 'Optimized & fast' },
                { icon: '🔒', label: 'Security', desc: 'Production-grade' },
              ].map((item) => (
                <div key={item.label} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group">
                  <span className="text-2xl mb-3 block">{item.icon}</span>
                  <h3 className="font-bold text-white text-sm mb-1">{item.label}</h3>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SKILLS SECTION ═══ */}
      <section id="skills" className="px-6 sm:px-8 py-20 sm:py-32 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-[0.2em] mb-4 block">Technical Skills</span>
            <h2 className="text-4xl sm:text-5xl font-black">What I <span className="text-indigo-400">Work</span> With</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 max-w-4xl mx-auto">
            {user.skills.map((skill, i) => (
              <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={200 + i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROJECTS SECTION ═══ */}
      <section id="projects" className="px-6 sm:px-8 py-20 sm:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-[0.2em] mb-4 block">Portfolio</span>
            <h2 className="text-4xl sm:text-5xl font-black">Selected <span className="text-indigo-400">Projects</span></h2>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto">A curated selection of projects I&apos;ve built, from production SaaS to creative experiments.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EXPERIENCE SECTION ═══ */}
      <section id="experience" className="px-6 sm:px-8 py-20 sm:py-32 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-[0.2em] mb-4 block">Experience</span>
            <h2 className="text-4xl sm:text-5xl font-black">Where I&apos;ve <span className="text-indigo-400">Worked</span></h2>
          </div>
          <div className="space-y-0">
            {user.experience.map((exp, i) => (
              <div key={i} className="relative pl-8 pb-12 last:pb-0 group">
                {/* Timeline Line */}
                <div className="absolute left-0 top-2 bottom-0 w-px bg-white/10 group-last:hidden"></div>
                {/* Timeline Dot */}
                <div className="absolute left-[-4px] top-2 w-[9px] h-[9px] rounded-full bg-indigo-500 border-2 border-[#050505] group-hover:shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-shadow"></div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{exp.title}</h3>
                  <span className="text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full">{exp.period}</span>
                </div>
                <p className="text-sm text-indigo-400/70 font-medium mb-2">{exp.company}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATIONS ═══ */}
      {user.certifications.length > 0 && (
        <section className="px-6 sm:px-8 py-20 sm:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-[0.2em] mb-4 block">Certifications</span>
              <h2 className="text-4xl sm:text-5xl font-black">Credentials & <span className="text-indigo-400">Awards</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {user.certifications.map((cert) => (
                <div key={cert.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-indigo-500/15 transition-all group text-center">
                  <span className="text-3xl mb-3 block">🏆</span>
                  <h3 className="font-bold text-white text-sm mb-1 group-hover:text-indigo-400 transition-colors">{cert.title}</h3>
                  <p className="text-xs text-gray-500">{cert.issuer} • {cert.year}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CONTACT SECTION ═══ */}
      <section id="contact" className="px-6 sm:px-8 py-20 sm:py-32 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-[0.2em] mb-4 block">Get In Touch</span>
          <h2 className="text-4xl sm:text-5xl font-black mb-6">Let&apos;s Build Something <span className="text-indigo-400">Amazing</span></h2>
          <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
            I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
          <a href={`mailto:contact@${user.name.split(' ')[0].toLowerCase()}.nexid.in`} className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-white font-bold text-lg transition-all hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1">
            ✉️ Say Hello
          </a>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 mt-12">
            {Object.entries(user.socials).map(([key, link]) => {
              const IconComponent = () => {
                switch(key) {
                  case 'github': return <GithubIcon className="w-5 h-5 text-gray-300 group-hover:text-white" />;
                  case 'twitter': return <XIcon className="w-4 h-4 text-gray-300 group-hover:text-white" />;
                  case 'instagram': return <InstagramIcon className="w-5 h-5 text-gray-300 group-hover:text-white" />;
                  case 'facebook': return <FacebookIcon className="w-5 h-5 text-gray-300 group-hover:text-white" />;
                  case 'linkedin': return <span className="font-bold text-lg text-gray-300 group-hover:text-white">in</span>;
                  case 'website': return <span className="text-xl">🌐</span>;
                  default: return <span className="text-xl">🔗</span>;
                }
              };
              
              return (
                <a key={key} href={link} target="_blank" rel="noopener noreferrer" className="group w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/15 transition-all hover:-translate-y-1">
                  <IconComponent />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-6 sm:px-8 py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} {user.name}. All rights reserved.</p>
          {user.tier === 'free' && (
            <a href="https://nexid.in" className="text-xs text-gray-600 hover:text-indigo-400 transition-colors flex items-center gap-1">
              Made with <span className="font-bold text-indigo-400">NexId</span>
            </a>
          )}
          {user.tier === 'pro' && (
            <a href="https://nexid.in" className="text-[10px] text-gray-700 hover:text-gray-500 transition-colors">
              Powered by NexId
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
