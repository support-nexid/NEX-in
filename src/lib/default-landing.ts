export interface LandingConfig {
  hero: {
    badge: string;
    badgeValue: string;
    title: string;
    titleHighlight: string;
    description: string;
  };
  stats: Array<{ value: string; label: string }>;
  features: Array<{ icon: string; title: string; description: string }>;
  process: Array<{ step: string; title: string; desc: string }>;
  pricing: {
    plan1: { name: string; price: string; features: string[]; cta: string };
    plan2: { name: string; price: string; features: string[]; cta: string };
    plan3: { name: string; price: string; features: string[]; cta: string };
  };
  testimonials: Array<{ name: string; role: string; quote: string; avatar: string }>;
  faqs: Array<{ question: string; answer: string }>;
  cta: {
    title: string;
    description: string;
  };
}

export const defaultLandingConfig: LandingConfig = {
  hero: {
    badge: "Trusted by",
    badgeValue: "2,400+",
    title: "Your Next Generation ",
    titleHighlight: "Identity.",
    description: "Build stunning, animated portfolio websites in minutes — not hours. Claim your unique yourname.nexid.in subdomain and showcase your work with premium animations."
  },
  stats: [
    { value: "2.4K+", label: "Active Portfolios" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "<1s", label: "Load Time" },
    { value: "4.9★", label: "User Rating" }
  ],
  features: [
    { icon: "⚡", title: "Lightning Fast Deploy", description: "Go live in under 60 seconds. Edit your bio, add projects, pick an animation preset, and publish instantly." },
    { icon: "🎨", title: "Cinematic Animations", description: "Choose from Fade, Slide, Bounce, and more. Scroll-triggered effects and smooth transitions make your portfolio come alive." },
    { icon: "🌐", title: "Custom Subdomain", description: "Claim yourname.nexid.in for free — or connect your own domain with one-click DNS setup." },
    { icon: "🛡️", title: "Enterprise Security", description: "Edge-level protection, encrypted API tunnels, and role-based access control ensure your data stays safe." },
    { icon: "📊", title: "Built-in Analytics", description: "Track visitors, page views, and engagement metrics for every portfolio right from your dashboard." },
    { icon: "🎧", title: "Priority Support", description: "Dedicated ticket system. Pro users get front-of-queue priority with staff-only escalation." }
  ],
  process: [
    { step: '01', title: 'Claim Your Identity', desc: 'Search and reserve your unique nexid.in subdomain. It takes 10 seconds.' },
    { step: '02', title: 'Build Your Portfolio', desc: 'Use our visual builder to add your bio, projects, social links, and select animation presets.' },
    { step: '03', title: 'Go Live Instantly', desc: 'Hit publish and your animated portfolio is live worldwide with SSL and CDN protection.' },
  ],
  pricing: {
    plan1: { name: "Basic Profile", price: "Free", features: ["Basic subdomain", "1 Project Slot", "Watermark", "No Stats"], cta: "Create Free" },
    plan2: { name: "NexId Pro", price: "₹799", features: ["Unlimited", "Custom Domain", "Animations", "Analytics"], cta: "Upgrade to Pro" },
    plan3: { name: "Done-For-You", price: "₹4,999", features: ["We build it", "Custom Design", "Hosting Included"], cta: "Hire Us" }
  },
  testimonials: [
    { name: "Arjun Mehta", role: "Full Stack Developer", quote: "NexId made my portfolio look like a million bucks.", avatar: "A" }
  ],
  faqs: [
    { question: "Is NexId really free to start?", answer: "Yes!" }
  ],
  cta: {
    title: "Ready to Build Your Identity?",
    description: "Join thousands of creators who've already claimed their space on the internet."
  }
};
