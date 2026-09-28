"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  Bot, Zap, Users, FileText, Calendar, MessageSquare,
  ArrowRight, Check, Star, ChevronDown, Menu, X,
  Shield, TrendingUp, Clock, Mail, Globe, BarChart2,
  Play, Quote, ChevronRight, Sparkles, Rocket, CheckCircle2,
  ShieldCheck, Activity, Target, Lock, Layers, ArrowUpRight
} from "lucide-react";

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#060B14]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/40" : "bg-transparent"}`}>
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
              OpsAgent
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400">Enterprise</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium block">Autonomous Business Operations</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Platform Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How It Works</Link>
          <Link href="#widget" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Live Simulation</Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</Link>
        </div>

        {/* CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} className="shadow-lg shadow-blue-500/20">
              Deploy Free Agent
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0A0F1D]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 flex flex-col gap-4 animate-fade-in">
          <Link href="#features" className="text-sm font-medium text-slate-200 py-1" onClick={() => setMenuOpen(false)}>Platform Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-slate-200 py-1" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link href="#widget" className="text-sm font-medium text-slate-200 py-1" onClick={() => setMenuOpen(false)}>Live Simulation</Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-200 py-1" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Link href="/login" className="flex-1">
              <Button variant="ghost" size="sm" className="w-full">Sign In</Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button variant="primary" size="sm" className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[360px] h-[360px] bg-purple-600/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-[960px] mx-auto">
          {/* Executive status pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>Autonomous Operations Platform 3.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 font-medium lowercase">enterprise ready</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-[76px] font-black text-white tracking-tight leading-[1.05] mb-8">
            Your Autonomous AI Operator,{" "}
            <span className="gradient-text">Executing 24/7.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-10 font-normal">
            Qualify incoming high-value leads in under 90 seconds, dispatch accurate grounded quotes, settle overdue invoices, and schedule calendar appointments without human bottleneck.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/signup">
              <Button variant="primary" size="xl" rightIcon={<ArrowRight className="w-4 h-4" />} className="shadow-2xl shadow-blue-500/35">
                Launch Workspace Free
              </Button>
            </Link>
            <Link href="#widget">
              <Button variant="ghost" size="xl" leftIcon={<Play className="w-4 h-4 text-blue-400" />} className="border border-white/10 hover:border-white/20">
                Test Interactive Simulation
              </Button>
            </Link>
          </div>

          {/* Social Proof Strip - Completely Professional Vector Badges */}
          <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-slate-300 font-semibold">4.9/5 Rating</span>
              <span className="text-slate-500">(240+ Enterprise Reviews)</span>
            </div>

            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-700" />

            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-slate-200 font-semibold">2,400+ Active Workspaces</span>
            </div>

            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-700" />

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-200 font-semibold">1m 24s Avg. AI Response SLA</span>
            </div>
          </div>
        </div>

        {/* Realistic Executive Dashboard Mockup */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-transparent to-transparent z-10 bottom-0 h-1/4 pointer-events-none" />
          <div className="glass-card !rounded-2xl overflow-hidden shadow-[0_20px_70px_-10px_rgba(30,58,138,0.25)] border border-white/15">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Executive Dashboard Preview Window ───────────────────────────────────────
function DashboardPreview() {
  return (
    <div className="bg-[#090E1A] text-left border border-white/5">
      {/* Window Titlebar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]/80 border border-[#E0443E]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/80 border border-[#DEA123]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]/80 border border-[#1AAB29]" />
          <div className="ml-4 flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/8 text-[11px] text-slate-400 font-mono">
            <Lock className="w-3 h-3 text-slate-500" />
            opsagent.ai/workspace/apex-consulting
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Agent Online · Latency 142ms
          </div>
          <span className="text-xs text-slate-500 font-medium">Production v3.2</span>
        </div>
      </div>

      {/* Main Preview Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Bar */}
        <div className="hidden lg:block lg:col-span-2 space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Workspace</p>
          {[
            { label: "Dashboard", icon: BarChart2, active: true },
            { label: "Leads Pipeline", icon: Users, badge: "14" },
            { label: "Invoices", icon: FileText, badge: "3" },
            { label: "Appointments", icon: Calendar },
            { label: "Knowledge Base", icon: Layers },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  item.active
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/4"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300 font-semibold">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Central Analytics & Pipeline Panel */}
        <div className="lg:col-span-6 space-y-5">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Active Pipeline", val: "$148,250", change: "+18.4%", color: "text-emerald-400" },
              { label: "Hot Leads Qualified", val: "14", change: "+4 today", color: "text-blue-400" },
              { label: "Avg Resolution SLA", val: "1m 24s", change: "-42s vs benchmark", color: "text-indigo-400" },
            ].map((m) => (
              <div key={m.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-3.5">
                <p className="text-[11px] text-slate-400 font-medium">{m.label}</p>
                <p className="text-xl font-bold text-white mt-1 tracking-tight">{m.val}</p>
                <p className={`text-[10px] font-semibold mt-1 ${m.color}`}>{m.change}</p>
              </div>
            ))}
          </div>

          {/* Mini Visual Chart Container */}
          <div className="bg-white/[0.02] border border-white/8 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-white">Revenue Pipeline Velocity</p>
                <p className="text-[10px] text-slate-500">Autonomous deal qualification over last 30 days</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                +32.6% Growth
              </span>
            </div>

            {/* Simulated Chart Bars */}
            <div className="h-28 flex items-end gap-2 pt-4 px-1">
              {[38, 48, 42, 60, 52, 70, 64, 85, 78, 92, 88, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div
                    className="w-full rounded-t-sm transition-all duration-300 group-hover:brightness-125"
                    style={{
                      height: `${h}%`,
                      background: i >= 9
                        ? "linear-gradient(to top, rgba(99,102,241,0.8), rgba(59,130,246,0.9))"
                        : "linear-gradient(to top, rgba(59,130,246,0.3), rgba(59,130,246,0.5))",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-2 pt-2 border-t border-white/5">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4 (Current)</span>
            </div>
          </div>
        </div>

        {/* Right Live Autonomous Operations Feed */}
        <div className="lg:col-span-4 bg-white/[0.02] border border-white/8 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-semibold text-white">Live Operations Feed</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Real-Time</span>
            </div>

            <div className="space-y-3">
              {[
                {
                  type: "LEAD",
                  title: "Sarah Mitchell (TechCorp)",
                  sub: "Qualified as HOT LEAD · $15,000 budget",
                  time: "2m ago",
                  badge: "HOT",
                  badgeColor: "bg-red-500/10 text-red-400 border-red-500/20",
                },
                {
                  type: "INVOICE",
                  title: "Invoice #INV-2026-004",
                  sub: "Auto-dispatched with settlement link ($8,500)",
                  time: "14m ago",
                  badge: "SENT",
                  badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                },
                {
                  type: "APPT",
                  title: "Marcus Chen",
                  sub: "Strategy Discovery Session scheduled",
                  time: "38m ago",
                  badge: "BOOKED",
                  badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                },
              ].map((ev, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-200 truncate">{ev.title}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold border ${ev.badgeColor}`}>
                      {ev.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{ev.sub}</p>
                  <p className="text-[10px] text-slate-600 mt-1 font-mono">{ev.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between text-[11px] text-blue-400">
            <span>Automated RAG Grounding</span>
            <span className="flex items-center gap-1 font-semibold hover:text-blue-300 cursor-pointer">
              Inspect logs <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Trusted By Strip ─────────────────────────────────────────────────────────
function TrustedBy() {
  const companies = [
    { name: "Apex Dynamics", mark: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
    { name: "Vertex AI", mark: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
    { name: "NovaCloud Systems", mark: "M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" },
    { name: "Horizon Ventures", mark: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" },
    { name: "Quantum Scale", mark: "M4 6h16M4 12h16m-7 6h7" },
    { name: "PulseData Corp", mark: "M22 12h-4l-3 9L9 3l-3 9H2" },
  ];

  return (
    <section className="py-14 border-y border-white/5 bg-[#060A14]">
      <div className="max-w-[1280px] mx-auto px-6">
        <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-8">
          Trusted by operations teams and high-growth businesses
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center">
          {companies.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-center gap-2.5 p-3 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/[0.02] text-slate-400 hover:text-slate-200 transition-all duration-300"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d={c.mark} />
              </svg>
              <span className="text-sm font-semibold tracking-tight">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features Grid ────────────────────────────────────────────────────────────
const features = [
  {
    icon: <Users className="w-5 h-5" />,
    title: "Real-Time Lead Qualification",
    desc: "AI extracts budgets, project scope, and timelines from inbound chats in under 90 seconds. Classifies leads as Hot, Warm, or Cold with high precision.",
    color: "from-blue-500 to-indigo-600",
    tag: "Autonomous",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Grounded Knowledge Follow-Ups",
    desc: "Every message is grounded in your company's actual FAQs, pricing models, and service agreements through vectorized RAG context.",
    color: "from-purple-500 to-indigo-600",
    tag: "RAG Powered",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Automated Invoice Recovery",
    desc: "Dispatches professional branded invoices instantly. Handles polite multi-stage overdue follow-ups, reducing days sales outstanding (DSO).",
    color: "from-amber-500 to-orange-600",
    tag: "Financial SLA",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Appointment Management",
    desc: "Seamless calendar synchronization. Sends automated confirmation SMS/email reminders and re-engages no-shows with instant reschedule slots.",
    color: "from-emerald-500 to-teal-600",
    tag: "Zero No-Show",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Embeddable Smart Widget",
    desc: "Add a single asynchronous script tag to any Webflow, WordPress, React, or custom site. Starts engaging and capturing prospects immediately.",
    color: "from-cyan-500 to-blue-600",
    tag: "Zero Setup",
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    title: "Executive Analytics Dashboard",
    desc: "Consolidated operational telemetry—revenue pipeline velocity, lead scoring breakdown, and full audit logs of every automated decision.",
    color: "from-rose-500 to-pink-600",
    tag: "Audit Ready",
  },
];

function Features() {
  return (
    <section id="features" className="py-28 max-w-[1280px] mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-4">
          <Zap className="w-3.5 h-3.5" />
          End-to-End Enterprise Automation
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-5">
          Everything your operations team needs to scale.
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          Replace fragmented tools and manual spreadsheets with an integrated, always-online AI workforce.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="glass-card p-7 group hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-lg shadow-blue-500/20`}>
                  {f.icon}
                </div>
                <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  {f.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-blue-300 transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center text-xs font-semibold text-blue-400 group-hover:text-blue-300">
              <span>View technical architecture</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Sync Knowledge Base",
      desc: "Upload service offerings, pricing tiers, FAQs, and SLA guidelines. OpsAgent builds a private vectorized knowledge index.",
      icon: <Layers className="w-5 h-5 text-blue-400" />,
    },
    {
      step: "02",
      title: "Deploy Omnichannel Widget",
      desc: "Embed our single-line code snippet onto your website, app, or portal. The agent initializes instantly with your branding.",
      icon: <Globe className="w-5 h-5 text-indigo-400" />,
    },
    {
      step: "03",
      title: "Autonomous Action Execution",
      desc: "The agent interacts with inbound prospects, scores budget intent, books discovery sessions, and creates invoices on autopilot.",
      icon: <Zap className="w-5 h-5 text-purple-400" />,
    },
    {
      step: "04",
      title: "Review & Settle Deals",
      desc: "Your team jumps in only when high-value opportunities are warm and ready to close. Full audit trails available in real time.",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-28 bg-gradient-to-b from-[#060B14] via-[#0A0F1E] to-[#060B14] border-y border-white/5">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Rapid Deployment
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Configured in <span className="gradient-text">10 minutes</span>.
          </h2>
          <p className="text-slate-400 text-lg">
            No complex engineering sprints. No heavy API integrations required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s) => (
            <div key={s.step} className="glass-card p-6 relative flex flex-col justify-between hover:border-white/20 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-2xl font-black text-white/20 font-mono">{s.step}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Deployment SLA</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface DemoMeta {
  intent?: string;
  leadScore?: number;
  leadStatus?: string;
  agentAction?: string;
}

interface DemoMessage {
  from: "ai" | "user";
  text: string;
  meta: DemoMeta | null;
}

// ─── Interactive Live Simulation ──────────────────────────────────────────────
function WidgetDemo() {
  const [messages, setMessages] = useState<DemoMessage[]>([
    {
      from: "ai",
      text: "Hello! I'm Alex, your automated operations assistant at Apex Consulting. How can I assist you with your business goals today?",
      meta: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const samplePrompts = [
    { label: "Consulting Packages & Pricing", query: "What are your consulting packages and fee structures?" },
    { label: "Schedule Discovery Session", query: "Can I schedule a 30-minute discovery call for next week?" },
    { label: "Request Strategy Proposal", query: "We have an $8,500 budget for a GTM overhaul needed in 30 days." },
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || typing) return;

    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: textToSend, meta: null }]);
    setTyping(true);

    try {
      const res = await fetch("/api/v1/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          businessId: "biz-001",
          conversationId: "demo-live",
        }),
      });
      const data = await res.json();

      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text: data.response || "Our engagements start at $3,000. Would you like to schedule a free 30-minute discovery call?",
          meta: data,
        },
      ]);
    } catch {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text: "Thank you for inquiring. Our specialized consulting engagements start at $3,000 for advisory sprints and scale for complete operational overhauls. Would you like to schedule an introductory session?",
          meta: { intent: "pricing_inquiry", leadScore: 88, leadStatus: "WARM" },
        },
      ]);
    }
  };

  return (
    <section id="widget" className="py-28 max-w-[1280px] mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase">
            <Bot className="w-3.5 h-3.5" />
            Interactive Agent Sandbox
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
            Experience the AI Qualification Engine.
          </h2>

          <p className="text-slate-400 text-base leading-relaxed">
            Test the live agent right now. See how it classifies client intent, matches against your knowledge base, and computes a lead score in real time.
          </p>

          <div className="space-y-2.5 pt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Try quick simulation prompts:</p>
            <div className="flex flex-col gap-2">
              {samplePrompts.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleSend(p.query)}
                  className="text-left px-3.5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/30 text-xs text-slate-300 hover:text-white transition-all duration-200 flex items-center justify-between group"
                >
                  <span>{p.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/8 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Vectorized RAG retrieval against Apex Consulting knowledge base</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Real-time intent extraction and lead temperature scoring</span>
            </div>
          </div>
        </div>

        {/* Right Sandbox Container */}
        <div className="lg:col-span-7">
          <div className="glass-card !rounded-2xl border border-white/15 overflow-hidden shadow-2xl shadow-blue-500/10">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Alex · Apex Operations Assistant</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-emerald-400 font-medium">Live Agent Active</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/5 text-slate-400 border border-white/10">
                GPT-4o Grounded
              </span>
            </div>

            {/* Chat Body */}
            <div className="h-80 overflow-y-auto p-5 space-y-4 bg-[#080D1A]/90">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      m.from === "user"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-white/[0.06] text-slate-200 border border-white/10 shadow-sm"
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* AI Metadata Chip */}
                  {m.meta && (
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                      <Target className="w-3 h-3 text-blue-400" />
                      <span>Score: <strong className="text-white">{m.meta.leadScore || 85}/100</strong></span>
                      <span>·</span>
                      <span className="text-emerald-400 font-bold uppercase">{m.meta.leadStatus || "HOT"}</span>
                      {m.meta.agentAction && (
                        <>
                          <span>·</span>
                          <span className="text-slate-400 truncate max-w-[180px]">{m.meta.agentAction}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div className="flex items-center gap-1.5 p-3 rounded-xl bg-white/[0.04] border border-white/10 w-fit">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="text-[11px] text-slate-400 ml-2 font-mono">Agent analyzing knowledge base...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#0B1120] border-t border-white/10 flex gap-2">
              <input
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500/50 transition-colors"
                placeholder="Ask about consulting services, pricing, or request a strategy session..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSend()}
                disabled={typing || !input.trim()}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Marcus Vance",
    role: "Managing Director",
    company: "Vance Capital Group",
    quote: "OpsAgent paid for its annual license inside 72 hours. An inbound prospect engaged the widget at 11:30 PM, was qualified for $24,000, and our partner was alerted with the complete dossier before morning.",
    stars: 5,
    metric: "+$140k Closed in 60 Days",
  },
  {
    name: "Elena Rostova",
    role: "Head of Operations",
    company: "Apex Strategy Partners",
    quote: "Our billing team used to spend 12 hours a week reconciling overdue invoices. OpsAgent's automated recovery sequences cleared 92% of our outstanding receivables without awkward client friction.",
    stars: 5,
    metric: "12 Hours Saved / Week",
  },
  {
    name: "David Kim",
    role: "Founder & CEO",
    company: "Synapse Digital",
    quote: "The lead qualification is astonishingly precise. It doesn't just regurgitate generic chatbot answers; it pulls exact numbers from our knowledge base and books directly into calendar slots.",
    stars: 5,
    metric: "0 No-Shows Recorded",
  },
];

function Testimonials() {
  return (
    <section className="py-28 max-w-[1280px] mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide uppercase mb-4">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          Verified Customer Outcomes
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Built for teams that value velocity.
        </h2>
        <p className="text-slate-400 text-lg">
          Read how high-growth businesses replace operational drag with automated execution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="glass-card p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {t.metric}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-3 pt-5 border-t border-white/8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-blue-500/20">
                {t.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t.name}</p>
                <p className="text-xs text-slate-400">{t.role} · <span className="text-slate-300">{t.company}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="glass-card !rounded-3xl p-12 md:p-16 relative overflow-hidden text-center border border-white/15 shadow-2xl shadow-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-violet-600/15 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/40">
              <Bot className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Deploy your AI operations agent today.
            </h2>

            <p className="text-slate-300 text-lg mb-10 leading-relaxed">
              Join over 2,400 forward-thinking businesses automating lead qualification, invoicing, and appointments. Free tier available—no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button variant="primary" size="xl" rightIcon={<ArrowRight className="w-4 h-4" />} className="shadow-2xl shadow-blue-500/40">
                  Start Free 14-Day Pro Trial
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" size="xl" className="border border-white/10 hover:border-white/20">
                  Compare Tier Capabilities
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 10-Minute Setup</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Cancel Anytime</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> SOC 2 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#040810] py-16 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">OpsAgent Enterprise</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
              Autonomous operations platform for high-velocity teams. Qualify inbound opportunities, dispatch quotes, settle invoices, and synchronize calendar bookings 24/7.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SOC 2 Type II Certified · GDPR Compliant · ISO 27001</span>
            </div>
          </div>

          {[
            {
              title: "Product",
              links: [
                { label: "Lead Qualification", href: "#features" },
                { label: "Invoice Settlement", href: "#features" },
                { label: "Appointment Engine", href: "#features" },
                { label: "Interactive Sandbox", href: "#widget" },
                { label: "Pricing & Plans", href: "/pricing" },
              ],
            },
            {
              title: "Platform",
              links: [
                { label: "API Reference", href: "#" },
                { label: "Vector RAG Pipeline", href: "#" },
                { label: "Web Widget SDK", href: "#" },
                { label: "Security & Encryption", href: "#" },
                { label: "Release Changelog", href: "#" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About CRESCONIX", href: "#" },
                { label: "Enterprise Security", href: "#" },
                { label: "Customer Stories", href: "#" },
                { label: "Contact Advisory", href: "#" },
                { label: "Terms of Service", href: "#" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">{col.title}</p>
              <div className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CRESCONIX Technologies, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">System Status: All Green</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="bg-[#050914] min-h-screen text-slate-100 selection:bg-blue-500 selection:text-white">
      <div className="mesh-bg" />
      <div className="grid-overlay" />
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <WidgetDemo />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}
