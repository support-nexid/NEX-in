"use client";

import React, { useState, useEffect, useRef } from 'react';

/* ─────────────── Subdomain Search Component ─────────────── */
function SubdomainSearch() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<{available?: boolean; message?: string; loading?: boolean}>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const checkAvailability = async (subdomain: string) => {
    if (!subdomain || subdomain.length < 3) {
      setStatus(subdomain.length > 0 && subdomain.length < 3 ? { available: false, message: 'Minimum 3 characters required' } : {});
      return;
    }
    setStatus({ loading: true });
    try {
      const res = await fetch('/api/system/public/check-subdomain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomain }),
      });
      const data = await res.json();
      setStatus({ available: data.available, message: data.message, loading: false });
    } catch {
      setStatus({ available: false, message: 'Connection error. Try again.', loading: false });
    }
  };

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => checkAvailability(query), 500);
    return () => clearTimeout(timerRef.current!);
  }, [query]);

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up-delay-2">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 rounded-2xl opacity-20 group-hover:opacity-40 blur-lg transition-all duration-500"></div>
        <div className="relative flex items-center bg-[#111] border border-white/10 rounded-2xl p-2 focus-within:border-indigo-500/50 transition-all shadow-2xl">
          <span className="pl-6 text-gray-500 font-semibold select-none whitespace-nowrap text-lg">nexid.in /</span>
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white pl-2 pr-4 py-4 w-full font-bold text-xl tracking-tight"
            placeholder="yourname"
            value={query}
            onChange={(e) => setQuery(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase())}
            maxLength={30}
          />
          <button
            disabled={!status.available}
            className={`px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
              status.available 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:-translate-y-0.5'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
          >
            Claim It
          </button>
        </div>
      </div>
      <div className={`text-center mt-5 h-6 text-sm font-semibold tracking-wide transition-all duration-300 ${status.message ? 'opacity-100' : 'opacity-0'}`}>
        {status.loading ? (
          <span className="text-gray-400 animate-pulse">Scanning registry...</span>
        ) : status.available === true ? (
          <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">✓ {status.message}</span>
        ) : status.available === false ? (
          <span className="text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]">✗ {status.message}</span>
        ) : null}
      </div>
    </div>
  );
}

/* ─────────────── Stats Counter Component ─────────────── */
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center px-8">
      <div className="text-3xl md:text-4xl font-black gradient-text">{value}</div>
      <div className="text-gray-500 text-sm mt-1 font-medium">{label}</div>
    </div>
  );
}

/* ─────────────── Feature Card Component ─────────────── */
function FeatureCard({ icon, title, description, delay }: { icon: string; title: string; description: string; delay: number }) {
  return (
    <div className={`glass-card rounded-3xl p-8 group cursor-default`} style={{ animationDelay: `${delay}ms` }}>
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

/* ─────────────── Pricing Card Component ─────────────── */
function PricingCard({ plan, price, period, features, popular, cta }: { plan: string; price: string; period: string; features: string[]; popular?: boolean; cta: string }) {
  return (
    <div className={`relative rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${
      popular
        ? 'bg-gradient-to-b from-indigo-500/10 to-purple-500/5 border-2 border-indigo-500/30 shadow-[0_0_60px_rgba(99,102,241,0.1)]'
        : 'glass-card'
    }`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg">Most Popular</span>
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-300 mb-2">{plan}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-black text-white">{price}</span>
          <span className="text-gray-500 text-sm">/{period}</span>
        </div>
      </div>
      <ul className="space-y-4 mb-10">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs flex-shrink-0">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
        popular
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]'
          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
      }`}>
        {cta}
      </button>
    </div>
  );
}

/* ─────────────── FAQ Item Component ─────────────── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-6 text-left group">
        <span className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors pr-4">{question}</span>
        <span className={`text-2xl text-gray-500 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-60 pb-6' : 'max-h-0'}`}>
        <p className="text-gray-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

/* ─────────────── Testimonial Card Component ─────────────── */
function TestimonialCard({ name, role, quote, avatar }: { name: string; role: string; quote: string; avatar: string }) {
  return (
    <div className="glass-card rounded-3xl p-8 min-w-[340px] flex-shrink-0">
      <p className="text-gray-300 leading-relaxed mb-6 italic">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
          {avatar}
        </div>
        <div>
          <div className="font-bold text-white">{name}</div>
          <div className="text-gray-500 text-sm">{role}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ MAIN LANDING PAGE ═══════════════ */
export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white relative">
      {/* ═════ Ambient Glow Orbs ═════ */}
      <div className="glow-orb w-[600px] h-[600px] bg-indigo-600/30 top-[-200px] left-[-200px]" />
      <div className="glow-orb w-[500px] h-[500px] bg-purple-600/20 top-[200px] right-[-150px]" style={{ animationDelay: '2s' }} />
      <div className="glow-orb w-[400px] h-[400px] bg-rose-600/15 bottom-[20%] left-[30%]" style={{ animationDelay: '4s' }} />

      {/* ═════ Navigation ═════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-500/20">N</div>
            <span className="text-xl font-bold tracking-tight">NexId</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
            <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/auth" className="text-sm text-gray-400 hover:text-white font-medium transition-colors px-4 py-2">Sign In</a>
            <a href="/app" className="btn-primary text-sm !py-2.5 !px-6">Get Started Free</a>
          </div>
        </div>
      </nav>

      {/* ═════ HERO SECTION ═════ */}
      <section className="relative pt-36 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Trust Badge */}
        <div className="animate-fade-in-up flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-sm text-gray-400 font-medium">Trusted by <span className="text-white font-bold">2,400+</span> creators worldwide</span>
        </div>

        <h1 className="animate-fade-in-up text-5xl md:text-7xl lg:text-8xl font-black tracking-tight max-w-5xl leading-[0.95] mb-8">
          Your Next Generation{' '}
          <span className="gradient-text animate-gradient">Identity.</span>
        </h1>

        <p className="animate-fade-in-up-delay-1 text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-12">
          Build stunning, animated portfolio websites in minutes — not hours.
          Claim your unique <span className="text-white font-semibold">yourname.nexid.in</span> subdomain
          and showcase your work with premium cinematic animations.
        </p>

        {/* Subdomain Search */}
        <SubdomainSearch />

        {/* Social Proof Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-20 animate-fade-in-up-delay-3">
          <StatItem value="2.4K+" label="Active Portfolios" />
          <StatItem value="99.9%" label="Uptime SLA" />
          <StatItem value="<1s" label="Load Time" />
          <StatItem value="4.9★" label="User Rating" />
        </div>
      </section>

      {/* ═════ FEATURES SECTION ═════ */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-indigo-400 font-semibold text-sm uppercase tracking-[0.2em] mb-4 block">Features</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Everything You Need to Stand Out</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">From animated portfolios to custom domains — we handle the infrastructure so you can focus on your craft.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon="⚡" title="Lightning Fast Deploy" description="Go live in under 60 seconds. Edit your bio, add projects, pick an animation preset, and publish instantly." delay={0} />
            <FeatureCard icon="🎨" title="Cinematic Animations" description="Choose from Fade, Slide, Bounce, and more. Scroll-triggered effects and smooth transitions make your portfolio come alive." delay={100} />
            <FeatureCard icon="🌐" title="Custom Subdomain" description="Claim yourname.nexid.in for free — or connect your own .com, .io, or .dev domain with one-click DNS setup." delay={200} />
            <FeatureCard icon="🛡️" title="Enterprise Security" description="Edge-level protection, encrypted API tunnels, and role-based access control ensure your data and identity stay safe." delay={300} />
            <FeatureCard icon="📊" title="Built-in Analytics" description="Track visitors, page views, and engagement metrics for every portfolio page right from your dashboard." delay={400} />
            <FeatureCard icon="🎧" title="Priority Support" description="Dedicated ticket system with unique IDs. Pro users get front-of-queue priority with staff-only escalation." delay={500} />
          </div>
        </div>
      </section>

      {/* ═════ HOW IT WORKS ═════ */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-purple-400 font-semibold text-sm uppercase tracking-[0.2em] mb-4 block">The Process</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Do it Yourself, or Let Us Build It</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Claim Your Identity', desc: 'Search and reserve your unique nexid.in subdomain. It takes 10 seconds.' },
              { step: '02', title: 'Build Your Portfolio', desc: 'Use our visual builder to add your bio, projects, social links, and select animation presets.' },
              { step: '03', title: 'Go Live Instantly', desc: 'Hit publish and your animated portfolio is live worldwide with SSL and CDN protection.' },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                <div className="text-7xl font-black text-white/[0.03] mb-4 group-hover:text-indigo-500/10 transition-colors duration-500">{item.step}</div>
                <h3 className="text-xl font-bold mb-3 -mt-8 relative z-10">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════ PRICING SECTION ═════ */}
      <section id="pricing" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-rose-400 font-semibold text-sm uppercase tracking-[0.2em] mb-4 block">Pricing & Services</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Choose Your Growth Path</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Build it yourself for free, unlock pro tools, or let our expert team build a stunning custom website for you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              plan="Basic Profile"
              price="Free"
              period="forever"
              features={[
                'Basic nexid.in subdomain',
                'Only 1 Project Slot',
                'NexId Watermark on Profile',
                'No Custom Domains',
                'No Analytics'
              ]}
              cta="Create Free Profile"
            />
            <PricingCard
              plan="NexId Pro"
              price="₹799"
              period="year"
              popular
              features={[
                'Unlimited Projects & Experience',
                'Connect Custom .com Domain',
                'Premium Animations & Themes',
                'Remove NexId Watermarks',
                'Audience Analytics + Contact Inbox',
                'Priority Verification',
              ]}
              cta="Upgrade to Pro"
            />
            <PricingCard
              plan="Done-For-You"
              price="₹4,999"
              period="project"
              features={[
                'We Build Your Website for You',
                'Custom Design & Architecture',
                '1 Year Pro Hosting Included',
                'Free .com Domain Name',
                'E-commerce & Agency Integration',
                '1-on-1 Account Manager',
                'Monthly Maintenance'
              ]}
              cta="Hire Our Developers"
            />
          </div>
        </div>
      </section>

      {/* ═════ TESTIMONIALS ═════ */}
      <section id="testimonials" className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-[0.2em] mb-4 block">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Loved by Creators</h2>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
            <TestimonialCard name="Arjun Mehta" role="Full Stack Developer" quote="NexId made my portfolio look like a million bucks. The animations are buttery smooth and I had it live in under 5 minutes." avatar="A" />
            <TestimonialCard name="Priya Sharma" role="UI/UX Designer" quote="The subdomain claiming feature is genius. priya.nexid.in looks so clean and professional. My clients love it." avatar="P" />
            <TestimonialCard name="Rahul Gupta" role="CS Student" quote="As a student, the free tier is perfect. I got a professional portfolio without spending a rupee. The animation presets are top-notch." avatar="R" />
            <TestimonialCard name="Sneha Iyer" role="Freelance Developer" quote="Custom domain mapping was seamless. NexId is the best portfolio platform — simple, fast, and beautiful." avatar="S" />
          </div>
        </div>
      </section>

      {/* ═════ FAQ SECTION ═════ */}
      <section id="faq" className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-indigo-400 font-semibold text-sm uppercase tracking-[0.2em] mb-4 block">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div>
            <FAQItem question="Is NexId really free to start?" answer="Yes! Our Starter plan is completely free forever. You get a unique subdomain, up to 3 projects, and 2 animation presets. No credit card required." />
            <FAQItem question="How do I connect my own custom domain?" answer="On the Pro plan, head to your Builder dashboard, navigate to Domain Settings, and add a CNAME record pointing to nexid.in. We handle SSL automatically." />
            <FAQItem question="What animation presets are available?" answer="Free users get Fade and Slide. Pro users unlock Bounce, Scale, Stagger, Parallax scroll, and custom cinema-quality animations. We're always adding new ones." />
            <FAQItem question="How does the payment system work?" answer="We use a manual UTR payment verification system optimized for Indian users. Upload your payment screenshot and UTR number, and our admin team verifies it within a few hours." />
            <FAQItem question="Can I export my portfolio?" answer="Yes! Pro and Enterprise users can export their portfolio as a static HTML bundle that can be hosted anywhere." />
            <FAQItem question="What happens if my plan expires?" answer="We give you a 24-hour grace period. After that, your portfolio will show a friendly 'Plan Expired' page. Your data is never deleted — simply renew to restore everything instantly." />
          </div>
        </div>
      </section>

      {/* ═════ CTA SECTION ═════ */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-rose-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative glass-card rounded-3xl p-16 hover:transform-none">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Ready to Build Your Identity?</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">Join thousands of creators who've already claimed their space on the internet.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/app" className="btn-primary text-base !py-4 !px-10">
                Start Building — It's Free
              </a>
              <a href="#features" className="btn-secondary text-base !py-4 !px-10">
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═════ FOOTER ═════ */}
      <footer className="border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-black text-xs">N</div>
                <span className="text-lg font-bold">NexId</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">Your Next Generation Identity. Build stunning animated portfolios in minutes.</p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="text-gray-500 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-500 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/app" className="text-gray-500 hover:text-white transition-colors">Builder</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/support" className="text-gray-500 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#faq" className="text-gray-500 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/support" className="text-gray-500 hover:text-white transition-colors">Submit Ticket</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} NexId. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-white transition-colors text-sm">Twitter</a>
              <a href="#" className="text-gray-600 hover:text-white transition-colors text-sm">GitHub</a>
              <a href="#" className="text-gray-600 hover:text-white transition-colors text-sm">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
