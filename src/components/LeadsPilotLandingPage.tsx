import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  Star, 
  Flame, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  Database, 
  Send, 
  BarChart3, 
  Users, 
  ChevronRight, 
  Play, 
  Filter, 
  Lock, 
  ChevronDown,
  Layers,
  Award,
  TrendingUp,
  Cpu,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

interface LeadsPilotLandingPageProps {
  onEnterApp: () => void;
}

export const LeadsPilotLandingPage: React.FC<LeadsPilotLandingPageProps> = ({ onEnterApp }) => {
  const [emailInput, setEmailInput] = useState('');
  const [activeTab, setActiveTab] = useState<'prospect' | 'ai' | 'sequences' | 'enrich'>('prospect');
  const [filterSeniority, setFilterSeniority] = useState('All');
  const [filterIndustry, setFilterIndustry] = useState('All');
  const [generatedSampleEmail, setGeneratedSampleEmail] = useState<string | null>(null);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);

  const handleQuickSignup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onEnterApp();
  };

  const handleGenerateSample = () => {
    setIsGeneratingSample(true);
    setTimeout(() => {
      setGeneratedSampleEmail(
        `Hi Sarah,\n\nNoticed Acme Corp is rapidly expanding its RevOps team and recently implemented AWS & Snowflake. Given your focus on enterprise pipeline acceleration, our AI prospecting engine could help your team book 3x more qualified demos from verified Tier-1 accounts.\n\nOpen to a brief 5-min intro this Thursday?\n\nBest,\nAlex | LeadsPilot`
      );
      setIsGeneratingSample(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* 2. NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div 
              onClick={onEnterApp}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400 shadow-sm group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-950 flex items-center">
                  Leads<span className="text-amber-500 font-black">Pilot</span>
                </span>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
              <button 
                onClick={onEnterApp} 
                className="hover:text-slate-950 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Platform <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              <button 
                onClick={onEnterApp} 
                className="hover:text-slate-950 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Solutions <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              <a href="#features" className="hover:text-slate-950 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-slate-950 transition-colors">Pricing</a>
              <a href="#reviews" className="hover:text-slate-950 transition-colors">Customers</a>
              <a href="#stats" className="hover:text-slate-950 transition-colors">Data & Accuracy</a>
            </nav>
          </div>

          {/* Right Header CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onEnterApp}
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Log In
            </button>

            <button
              onClick={onEnterApp}
              id="header-signup-btn"
              className="px-4.5 py-2.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Sign up for Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-100">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Eyebrow badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold shadow-2xs mb-6">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="w-px h-3 bg-amber-200" />
              <span>Rated #1 on G2 for B2B Sales Intelligence & Prospecting</span>
            </div>
          </div>

          {/* Main Hero Headline */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12]">
              Find, contact, and close your{' '}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 text-slate-950">ideal buyers.</span>
                <span className="absolute bottom-2 left-0 right-0 h-3.5 bg-amber-300/70 -rotate-1 -z-0 rounded-sm" />
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              LeadsPilot is the all-in-one sales engine powered by <strong className="text-slate-900 font-semibold">275M+ verified contacts</strong>, AI outreach personalization, and automated multi-channel sequences.
            </p>

            {/* Email Signup Form Box */}
            <div className="pt-2 max-w-lg mx-auto">
              <form onSubmit={handleQuickSignup} className="flex flex-col sm:flex-row items-stretch gap-2.5 bg-white p-2 rounded-2xl border border-slate-300 shadow-lg shadow-slate-900/5">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your work email..."
                    className="w-full pl-10 pr-3 py-3 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-900 placeholder-slate-400 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  id="hero-signup-btn"
                  className="px-6 py-3 rounded-xl font-bold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <span>Sign up for Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Guarantees / trust micro-copy */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-3.5 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free forever plan
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 1-Click LeadsPilot & CRM sync
                </span>
              </div>
            </div>
          </div>

          {/* 4. LIVE HERO PRODUCT MOCKUP (INTERACTIVE LEADSPILOT CONSOLE) */}
          <div className="mt-12 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden ring-1 ring-slate-900/5">
              {/* Mockup top browser bar */}
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-slate-300 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/90" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/90" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
                  </div>
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1 ml-2">
                    <Lock className="w-3 h-3 text-emerald-400" /> app.leadspilot.io/prospects/search
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold font-mono text-[10px]">
                    275M+ Live Contacts
                  </span>
                  <button 
                    onClick={onEnterApp}
                    className="px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-bold text-[11px] hover:bg-amber-300 transition-colors"
                  >
                    Open Live App →
                  </button>
                </div>
              </div>

              {/* Mockup Filter Bar */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5 mr-1">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" /> Filters:
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold flex items-center gap-1">
                    Job Title: <strong>VP of Sales, CTO, CMO</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                    Industry: <strong>SaaS, FinTech, AI</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Emails Only
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-semibold flex items-center gap-1">
                    <Flame className="w-3 h-3" /> High Intent Signals
                  </span>
                </div>

                <div className="text-slate-500 font-mono font-medium">
                  Showing <strong className="text-slate-900 font-bold">1,482,920</strong> matching decision-makers
                </div>
              </div>

              {/* Mockup Table Results */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Title & Company</th>
                      <th className="py-3 px-4">Deliverable Email</th>
                      <th className="py-3 px-4">Direct Phone</th>
                      <th className="py-3 px-4">Buying Intent</th>
                      <th className="py-3 px-4 text-right">Instant Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {[
                      {
                        name: 'Sarah Chen',
                        title: 'Chief Technology Officer',
                        company: 'CloudScale Inc',
                        email: 'sarah.c@cloudscale.io',
                        phone: '+1 (415) 892-4412',
                        intent: '98 High Intent',
                        avatar: 'SC',
                        badge: '99% Verified',
                        tech: 'AWS, Snowflake, React',
                      },
                      {
                        name: 'Marcus Vance',
                        title: 'VP of Global Sales',
                        company: 'Nexus AI Systems',
                        email: 'm.vance@nexusai.com',
                        phone: '+1 (212) 555-0199',
                        intent: '95 High Intent',
                        avatar: 'MV',
                        badge: '99% Verified',
                        tech: 'Salesforce, HubSpot',
                      },
                      {
                        name: 'Elena Rostova',
                        title: 'Head of Growth Marketing',
                        company: 'FinPulse Pay',
                        email: 'elena@finpulse.co',
                        phone: '+1 (650) 404-8831',
                        intent: '91 Active Buyer',
                        avatar: 'ER',
                        badge: '99% Verified',
                        tech: 'Segment, Mixpanel',
                      },
                      {
                        name: 'David Kim',
                        title: 'Director of RevOps',
                        company: 'DataStream Core',
                        email: 'david.k@datastream.io',
                        phone: '+1 (312) 782-9011',
                        intent: '88 Warm Lead',
                        avatar: 'DK',
                        badge: '99% Verified',
                        tech: 'LeadsPilot, Outreach',
                      },
                    ].map((row, idx) => (
                      <tr 
                        key={idx} 
                        onClick={onEnterApp}
                        className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px] shadow-2xs">
                              {row.avatar}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors block">
                                {row.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">ID: 804{idx}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-semibold text-slate-800 block">{row.title}</span>
                            <span className="text-slate-500 font-medium">{row.company}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              {row.email}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✓ {row.badge}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {row.phone}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">
                            <Flame className="w-3 h-3 text-rose-500" /> {row.intent}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEnterApp();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-semibold transition-all border border-indigo-200 shadow-2xs"
                          >
                            + Sequence & CRM
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom interactive banner */}
              <div className="p-4 bg-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Ready to search & scrape live contacts?</span>
                    <span className="text-slate-400 text-[11px]">Launch web scraper, AI sequences, and LeadsPilot CRM integration</span>
                  </div>
                </div>

                <button
                  onClick={onEnterApp}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Launch Interactive Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LOGO CLOUD / SOCIAL PROOF */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Trusted by over 3,000,000 revenue professionals at 500,000+ top companies
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
            {['Snowflake', 'Stripe', 'Autodesk', 'Carta', 'Loom', 'Customer.io', 'Brex', 'Docker'].map((brand) => (
              <span key={brand} className="text-base sm:text-lg font-bold text-slate-700 tracking-tight flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" /> {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 6. THE 4 LEADSPILOT PILLARS (CORE CAPABILITIES) */}
      <section id="features" className="py-20 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              Complete Go-to-Market Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Everything you need to build pipeline and win deals
            </h2>
            <p className="text-base text-slate-600">
              Replace 6 disconnected sales tools with LeadsPilot's unified intelligence, engagement, and CRM automation engine.
            </p>
          </div>

          {/* 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Prospect */}
            <div 
              onClick={onEnterApp}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4 cursor-pointer group hover:border-amber-400"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-lg text-slate-950 group-hover:text-amber-600 transition-colors">
                1. Prospect & Discover
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Access 275M+ verified decision-maker emails, direct dials, and 65+ precision filters including tech stack, funding, and headcount.
              </p>
              <div className="pt-2 text-xs font-bold text-amber-600 flex items-center gap-1">
                Explore Database <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pillar 2: Enrich */}
            <div 
              onClick={onEnterApp}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4 cursor-pointer group hover:border-indigo-400"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-lg text-slate-950 group-hover:text-indigo-600 transition-colors">
                2. Enrich & Verify
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically verify DNS MX records, eliminate spam traps with 99.4% deliverability score, and enrich stale CRM records.
              </p>
              <div className="pt-2 text-xs font-bold text-indigo-600 flex items-center gap-1">
                Email Verifier <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pillar 3: AI Sequences */}
            <div 
              onClick={onEnterApp}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4 cursor-pointer group hover:border-purple-400"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg text-slate-950 group-hover:text-purple-600 transition-colors">
                3. AI Cold Outreach
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate hyper-personalized icebreakers, customized cold email sequences, and 30-second cold call scripts tailored to each prospect.
              </p>
              <div className="pt-2 text-xs font-bold text-purple-600 flex items-center gap-1">
                AI Sequence Engine <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pillar 4: CRM Pipeline */}
            <div 
              onClick={onEnterApp}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4 cursor-pointer group hover:border-emerald-400"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg text-slate-950 group-hover:text-emerald-600 transition-colors">
                4. LeadsPilot CRM Pipeline
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sync leads directly to LeadsPilot CRM & LeadsPilot opportunities. Track pipeline stages, stage conversion velocity, and closed deals.
              </p>
              <div className="pt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                View CRM Pipeline <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE PLATFORM DEMO TABS */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">
              Test LeadsPilot's Core Workflows Live
            </h2>
            <p className="text-sm text-slate-600">
              Select a module below to see how LeadsPilot accelerates each phase of your sales cycle.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4">
            {[
              { id: 'prospect', label: '1. Contact Search & Filters', icon: Search },
              { id: 'ai', label: '2. Generative AI Cold Email', icon: Sparkles },
              { id: 'sequences', label: '3. Multi-Step Sequences', icon: Send },
              { id: 'enrich', label: '4. MX Email Deliverability', icon: ShieldCheck },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-950 hover:bg-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Prospecting Demo */}
          {activeTab === 'prospect' && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Live Search Simulator</h3>
                  <p className="text-xs text-slate-500">Filter by seniority level and target industry</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={filterSeniority}
                    onChange={(e) => setFilterSeniority(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
                  >
                    <option value="All">All Seniorities (C-Level, VP, Dir)</option>
                    <option value="C-Level">C-Level (CTO, CEO, CMO)</option>
                    <option value="VP">VP & Head of Dept</option>
                  </select>
                  <select
                    value={filterIndustry}
                    onChange={(e) => setFilterIndustry(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
                  >
                    <option value="All">All Industries</option>
                    <option value="SaaS">SaaS / Enterprise Software</option>
                    <option value="FinTech">FinTech & Payments</option>
                    <option value="AI">AI & Machine Learning</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">Alex Rivera</span>
                      <span className="text-xs text-slate-500 block">VP Sales @ DataWave</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      ✓ 99.8% Valid
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-indigo-600">alex.r@datawave.io</div>
                  <button 
                    onClick={onEnterApp}
                    className="w-full mt-2 py-1.5 text-xs font-semibold bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 rounded-lg transition-colors"
                  >
                    Scrape & Export to LeadsPilot
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">Maya Patel</span>
                      <span className="text-xs text-slate-500 block">CTO @ CyberGuard AI</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      ✓ 99.5% Valid
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-indigo-600">m.patel@cyberguard.ai</div>
                  <button 
                    onClick={onEnterApp}
                    className="w-full mt-2 py-1.5 text-xs font-semibold bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 rounded-lg transition-colors"
                  >
                    Scrape & Export to LeadsPilot
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">Liam Gallagher</span>
                      <span className="text-xs text-slate-500 block">Head of RevOps @ Stripe</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      ✓ 100% Valid
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-indigo-600">liam@stripe.com</div>
                  <button 
                    onClick={onEnterApp}
                    className="w-full mt-2 py-1.5 text-xs font-semibold bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 rounded-lg transition-colors"
                  >
                    Scrape & Export to LeadsPilot
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: AI Email Generator */}
          {activeTab === 'ai' && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" /> Generative AI Cold Email Studio
                  </h3>
                  <p className="text-xs text-slate-500">AI crafts hyper-relevant value props based on prospect's tech stack</p>
                </div>

                <button
                  onClick={handleGenerateSample}
                  disabled={isGeneratingSample}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isGeneratingSample ? 'Crafting personalized pitch...' : 'Generate New Sample Pitch'}
                </button>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                {generatedSampleEmail || (
                  `Subject: Quick question re: Acme's RevOps expansion\n\nHi Sarah,\n\nNoticed Acme Corp is rapidly expanding its RevOps team and recently implemented AWS & Snowflake. Given your focus on enterprise pipeline acceleration, our AI prospecting engine could help your team book 3x more qualified demos from verified Tier-1 accounts.\n\nOpen to a brief 5-min intro this Thursday?\n\nBest,\nAlex | LeadsPilot`
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Sequences */}
          {activeTab === 'sequences' && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold text-slate-900">Multi-Touch Automated Drip Sequences</h3>
              <p className="text-xs text-slate-500">Automate outreach across Email, Phone, and LinkedIn</p>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                  <div className="text-[10px] font-bold text-indigo-600 uppercase">Step 1 • Day 1</div>
                  <div className="font-bold text-slate-900 text-xs">Personalized Cold Email</div>
                  <div className="text-[11px] text-slate-500">AI icebreaker + value prop</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                  <div className="text-[10px] font-bold text-indigo-600 uppercase">Step 2 • Day 3</div>
                  <div className="font-bold text-slate-900 text-xs">Direct Dial Call Task</div>
                  <div className="text-[11px] text-slate-500">30-sec pitch script ready</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                  <div className="text-[10px] font-bold text-indigo-600 uppercase">Step 3 • Day 6</div>
                  <div className="font-bold text-slate-900 text-xs">Follow-up Case Study</div>
                  <div className="text-[11px] text-slate-500">Relevant customer ROI story</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                  <div className="text-[10px] font-bold text-indigo-600 uppercase">Step 4 • Day 10</div>
                  <div className="font-bold text-slate-900 text-xs">Breakup / Quick Check-in</div>
                  <div className="text-[11px] text-slate-500">Final gentle touchpoint</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Email Deliverability */}
          {activeTab === 'enrich' && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> 99.4% Email Deliverability & MX Verification
              </h3>
              <p className="text-xs text-slate-500">Every corporate email is tested against real-time DNS MX servers before sequence dispatch.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block text-[11px]">DNS MX Check</span>
                  <span className="font-bold text-emerald-600">✓ Valid Routing</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block text-[11px]">Spam Trap Detection</span>
                  <span className="font-bold text-emerald-600">✓ 0% Trap Risk</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block text-[11px]">Disposable Mail</span>
                  <span className="font-bold text-emerald-600">✓ Corporate Domain</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block text-[11px]">Deliverability Score</span>
                  <span className="font-bold text-emerald-600 font-mono">99.4% Safe</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 8. STATS & ACCURACY BAR */}
      <section id="stats" className="py-16 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400">275M+</div>
              <div className="text-xs font-semibold text-slate-300">Verified B2B Decision Makers</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400">73M+</div>
              <div className="text-xs font-semibold text-slate-300">Company Accounts Tracked</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">99.4%</div>
              <div className="text-xs font-semibold text-slate-300">Email Deliverability Rate</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400">312%</div>
              <div className="text-xs font-semibold text-slate-300">Average Qualified Meeting Lift</div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS & REVIEWS */}
      <section id="reviews" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-slate-950">Loved by revenue leaders worldwide</h2>
            <p className="text-sm text-slate-600">See how high-growth sales teams use LeadsPilot to beat revenue targets.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "LeadsPilot replaced ZoomInfo, Outreach, and Hunter for our entire 40-person SDR team. We doubled our meeting bookings within our first month."
              </p>
              <div>
                <span className="font-bold text-slate-950 text-xs block">Jordan Miller</span>
                <span className="text-[11px] text-slate-500">VP of Global Sales @ CloudTech</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "The email accuracy is unmatched. Having verified MX checks and direct dials inside one single workspace saved our reps 15 hours a week."
              </p>
              <div>
                <span className="font-bold text-slate-950 text-xs block">Rachel Zhao</span>
                <span className="text-[11px] text-slate-500">Director of Demand Gen @ SaaSify</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "The AI sequence generator drafts icebreakers that actually convert. Our reply rates jumped from 2.8% to 9.4% on cold tier-1 accounts."
              </p>
              <div>
                <span className="font-bold text-slate-950 text-xs block">Marcus Vance</span>
                <span className="text-[11px] text-slate-500">Head of Growth @ NextGen AI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. TRANSPARENT PRICING PLANS */}
      <section id="pricing" className="py-20 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              Simple, Transparent Pricing
            </span>
            <h2 className="text-3xl font-black text-slate-950">Start for free, scale as you grow</h2>
            <p className="text-sm text-slate-600">No credit card required. Upgrade anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Free */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Free</h3>
                  <p className="text-xs text-slate-500 mt-1">For individuals starting out</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-950">$0</span>
                  <span className="text-xs text-slate-500 font-medium">/ month</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> 10,000 email credits / mo
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Basic search filters
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> AI email writer
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterApp}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Sign up for Free
              </button>
            </div>

            {/* Basic */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Basic</h3>
                  <p className="text-xs text-slate-500 mt-1">For prospecting professionals</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-950">$49</span>
                  <span className="text-xs text-slate-500 font-medium">/ user / mo</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Unlimited email credits
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> 1,200 mobile dials / yr
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> 2 sequence integrations
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterApp}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-colors cursor-pointer"
              >
                Get Started
              </button>
            </div>

            {/* Professional - Highlighted */}
            <div className="p-6 rounded-2xl bg-slate-950 text-white border-2 border-amber-400 space-y-5 shadow-xl flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                Most Popular
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-white text-base">Professional</h3>
                  <p className="text-xs text-slate-400 mt-1">For high-growth sales teams</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-400">$79</span>
                  <span className="text-xs text-slate-400 font-medium">/ user / mo</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> Unlimited email credits
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> 2,400 mobile dials / yr
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> Unlimited AI sequences
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> LeadsPilot CRM bi-directional sync
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterApp}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Start Free Trial
              </button>
            </div>

            {/* Organization */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Organization</h3>
                  <p className="text-xs text-slate-500 mt-1">For scale & enterprise teams</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-950">$119</span>
                  <span className="text-xs text-slate-500 font-medium">/ user / mo</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> All Pro features included
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Advanced buying intent
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Custom webhook workflows
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterApp}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-colors cursor-pointer"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. PRE-FOOTER FINAL CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" /> Start Closing More Deals Today
          </span>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to build your dream sales pipeline?
          </h2>

          <p className="text-base text-slate-300 max-w-xl mx-auto">
            Join over 3,000,000 revenue professionals using LeadsPilot to prospect, automate cold outreach, and close deals.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onEnterApp}
              id="cta-bottom-signup-btn"
              className="px-8 py-3.5 rounded-xl font-extrabold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-xl shadow-amber-400/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Sign up for Free — No Card Needed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
                <Zap className="w-4 h-4 fill-slate-950" />
              </div>
              <span className="font-bold text-base text-white">LeadsPilot</span>
            </div>
            <p className="text-slate-500 max-w-sm text-[11px] leading-relaxed">
              LeadsPilot is the leading all-in-one sales intelligence and go-to-market platform helping sales teams find and close buyers.
            </p>
            <p className="text-slate-600 text-[10px]">© 2026 LeadsPilot, Inc. All rights reserved.</p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Product</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={onEnterApp} className="hover:text-white">Lead Search</button></li>
              <li><button onClick={onEnterApp} className="hover:text-white">Chrome Extension</button></li>
              <li><button onClick={onEnterApp} className="hover:text-white">AI Sequences</button></li>
              <li><button onClick={onEnterApp} className="hover:text-white">Data Enrichment</button></li>
              <li><button onClick={onEnterApp} className="hover:text-white">LeadsPilot CRM Sync</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Solutions</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={onEnterApp} className="hover:text-white">For Sales Leaders</button></li>
              <li><button onClick={onEnterApp} className="hover:text-white">For SDRs & BDRs</button></li>
              <li><button onClick={onEnterApp} className="hover:text-white">For Marketing</button></li>
              <li><button onClick={onEnterApp} className="hover:text-white">For Founders</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={onEnterApp} className="hover:text-white">About Us</button></li>
              <li><button onClick={onEnterApp} className="hover:text-white">Careers</button></li>
              <li><button onClick={onEnterApp} className="hover:text-white">Privacy Policy</button></li>
              <li><button onClick={onEnterApp} className="hover:text-white">Terms of Service</button></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
