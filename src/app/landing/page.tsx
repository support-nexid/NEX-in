import React from 'react';
import { getLandingConfig } from '@/lib/cms';
import { SubdomainSearch, FAQItem, NavMenu } from './ClientComponents';

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
    <div className={`glass-card rounded-3xl p-8 group cursor-default animate-fade-in-up`} style={{ animationDelay: `${delay}ms` }}>
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
export default async function LandingPage() {
  const config = await getLandingConfig();

  return (
    <div className="min-h-screen bg-[#050505] text-white relative">
      {/* ═════ Ambient Glow Orbs ═════ */}
      <div className="glow-orb w-[600px] h-[600px] bg-indigo-600/30 top-[-200px] left-[-200px]" />
      <div className="glow-orb w-[500px] h-[500px] bg-purple-600/20 top-[200px] right-[-150px]" style={{ animationDelay: '2s' }} />
      <div className="glow-orb w-[400px] h-[400px] bg-rose-600/15 bottom-[20%] left-[30%]" style={{ animationDelay: '4s' }} />

      {/* ═════ Navigation ═════ */}
      <NavMenu />

      {/* ═════ HERO SECTION ═════ */}
      <section className="relative pt-36 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Trust Badge */}
        <div className="animate-fade-in-up flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-sm text-gray-400 font-medium">{config.hero.badge} <span className="text-white font-bold">{config.hero.badgeValue}</span> creators worldwide</span>
        </div>

        <h1 className="animate-fade-in-up text-5xl md:text-7xl lg:text-8xl font-black tracking-tight max-w-5xl leading-[0.95] mb-8">
          {config.hero.title}
          <span className="gradient-text animate-gradient">{config.hero.titleHighlight}</span>
        </h1>

        <p className="animate-fade-in-up-delay-1 text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-12">
          {config.hero.description}
        </p>

        {/* Subdomain Search */}
        <SubdomainSearch />

        {/* Social Proof Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-20 animate-fade-in-up-delay-3">
          {config.stats.map((s, i) => (
            <StatItem key={i} value={s.value} label={s.label} />
          ))}
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
            {config.features.map((f, i) => (
              <FeatureCard key={i} icon={f.icon} title={f.title} description={f.description} delay={i * 100} />
            ))}
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
            {config.process.map((item, i) => (
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
              plan={config.pricing.plan1.name}
              price={config.pricing.plan1.price}
              period="forever"
              features={config.pricing.plan1.features}
              cta={config.pricing.plan1.cta}
            />
            <PricingCard
              plan={config.pricing.plan2.name}
              price={config.pricing.plan2.price}
              period="year"
              popular
              features={config.pricing.plan2.features}
              cta={config.pricing.plan2.cta}
            />
            <PricingCard
              plan={config.pricing.plan3.name}
              price={config.pricing.plan3.price}
              period="project"
              features={config.pricing.plan3.features}
              cta={config.pricing.plan3.cta}
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
            {config.testimonials.map((t, i) => (
              <TestimonialCard key={i} name={t.name} role={t.role} quote={t.quote} avatar={t.avatar} />
            ))}
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
            {config.faqs.map((f, i) => (
              <FAQItem key={i} question={f.question} answer={f.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ═════ CTA SECTION ═════ */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-rose-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative glass-card rounded-3xl p-16 hover:transform-none">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">{config.cta.title}</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">{config.cta.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/auth" className="btn-primary text-base !py-4 !px-10">
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
