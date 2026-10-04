"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  Bot, Zap, Users, FileText, Calendar, MessageSquare,
  ArrowRight, Check, Star, Menu, X,
  Shield, Clock, Globe, BarChart2,
  Play, CheckCircle2, ShieldCheck, Activity, Target, Lock, Layers, ArrowUpRight
} from "lucide-react";

// === Navbar ===
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Platform", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Demo", href: "#widget" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "navbar-scrolled" : "bg-transparent"}`}>
      <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
            <Bot className="w-[18px] h-[18px] text-white" />
          </div>
          <div>
            <span className="text-[15px] font-bold text-white tracking-tight flex items-center gap-2">
              OpsAgent
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400">Enterprise</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium block leading-none mt-0.5">by CRESCONIX</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(l => (
            <Link key={l.label} href={l.href} className="text-[13.5px] font-medium text-slate-400 hover:text-slate-100 transition-colors">{l.label}</Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white text-[13px]">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} className="shadow-lg shadow-blue-500/20 text-[13px]">
              Start Free
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#040810]/98 backdrop-blur-2xl border-b border-white/8 px-6 py-5 flex flex-col gap-3 anim-fade-in">
          {navLinks.map(l => (
            <Link key={l.label} href={l.href} className="text-sm font-medium text-slate-200 py-1.5" onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
          <div className="flex gap-3 pt-3 border-t border-white/8 mt-1">
            <Link href="/login" className="flex-1"><Button variant="ghost" size="sm" className="w-full">Sign In</Button></Link>
            <Link href="/signup" className="flex-1"><Button variant="primary" size="sm" className="w-full">Start Free</Button></Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// === Hero ===
function Hero() {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[960px] h-[600px] bg-gradient-to-tr from-blue-600/12 via-indigo-600/8 to-violet-600/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[360px] h-[360px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-[940px] mx-auto">
          <div className="hero-badge mb-8 anim-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase text-[10px] tracking-widest font-bold">Autonomous Operations Platform 3.0</span>
            <span className="text-emerald-400 text-[10px] font-bold">Enterprise Ready</span>
          </div>

          <h1 className="anim-fade-up delay-1 mb-7" style={{fontFamily:"'Space Grotesk', sans-serif", fontSize:"clamp(44px,7vw,80px)", fontWeight:900, color:"#fff", letterSpacing:"-0.04em", lineHeight:1.04}}>
            Your Autonomous AI Operator,{" "}
            <span className="gradient-text">Executing 24/7.</span>
          </h1>

          <p className="text-[17px] md:text-[18px] text-slate-400 leading-[1.75] max-w-[760px] mx-auto mb-10 anim-fade-up delay-2 font-normal">
            Qualify high-value leads in under 90 seconds, dispatch accurate quotes, settle overdue invoices, and schedule appointments — without human bottleneck.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center mb-14 anim-fade-up delay-3">
            <Link href="/signup">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />} className="shadow-2xl shadow-blue-500/30 px-7 py-3.5 text-[14px] font-semibold">
                Launch Workspace Free
              </Button>
            </Link>
            <Link href="#widget">
              <Button variant="ghost" size="lg" leftIcon={<Play className="w-4 h-4 text-blue-400" />} className="border border-white/10 hover:border-white/18 px-7 py-3.5 text-[14px]">
                Test Live Agent Demo
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-7 text-[12.5px] font-medium text-slate-500 anim-fade-up delay-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-slate-300 font-semibold">4.9/5</span>
              <span>(240+ Reviews)</span>
            </div>
            <span className="hidden sm:block w-px h-3.5 bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-semibold">2,400+ Active Workspaces</span>
            </div>
            <span className="hidden sm:block w-px h-3.5 bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-300 font-semibold">1m 24s Avg. Response SLA</span>
            </div>
          </div>
        </div>

        <div className="mt-16 relative">
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#040810] to-transparent z-10 pointer-events-none" />
          <div className="glass-card overflow-hidden shadow-[0_24px_80px_-16px_rgba(30,58,138,0.30)] border border-white/12">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

// === Dashboard Preview ===
function DashboardPreview() {
  return (
    <div className="bg-[#080D1A] text-left">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/7 bg-white/[0.018]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]/80 border border-[#E0443E]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/80 border border-[#DEA123]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]/80 border border-[#1AAB29]" />
          <div className="ml-3 flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/7 text-[10.5px] text-slate-400 font-mono">
            <Lock className="w-3 h-3 text-slate-500" />
            opsagent.ai/workspace/apex-consulting
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10.5px] text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Agent Online · 142ms
          </div>
          <span className="text-[11px] text-slate-500 font-medium">v3.2 Production</span>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="hidden lg:block lg:col-span-2 space-y-0.5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2.5 mb-2.5">Workspace</p>
          {[
            { label: "Dashboard", icon: BarChart2, active: true },
            { label: "Leads Pipeline", icon: Users, badge: "14" },
            { label: "Invoices", icon: FileText, badge: "3" },
            { label: "Appointments", icon: Calendar },
            { label: "Knowledge Base", icon: Layers },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-[11.5px] font-medium transition-colors ${item.active ? "bg-blue-600/18 text-blue-400 border border-blue-500/28" : "text-slate-500 hover:text-slate-300"}`}>
                <div className="flex items-center gap-2"><Icon className="w-3.5 h-3.5" /><span>{item.label}</span></div>
                {item.badge && <span className="text-[9.5px] px-1.5 rounded-full bg-white/10 text-slate-300 font-semibold">{item.badge}</span>}
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Active Pipeline", val: "$148,250", change: "+18.4%", c: "text-emerald-400" },
              { label: "Leads Qualified", val: "14", change: "+4 today", c: "text-blue-400" },
              { label: "Avg Response SLA", val: "1m 24s", change: "-42s vs avg", c: "text-indigo-400" },
            ].map(m => (
              <div key={m.label} className="bg-white/[0.028] border border-white/7 rounded-xl p-3">
                <p className="text-[10.5px] text-slate-500 font-medium">{m.label}</p>
                <p className="text-lg font-bold text-white mt-1 tracking-tight leading-none">{m.val}</p>
                <p className={`text-[10px] font-semibold mt-1 ${m.c}`}>{m.change}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/[0.018] border border-white/7 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[12px] font-semibold text-white">Revenue Pipeline Velocity</p>
                <p className="text-[10px] text-slate-500">Autonomous deal qualification — last 30 days</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">+32.6% Growth</span>
            </div>
            <div className="h-24 flex items-end gap-1.5 px-0.5">
              {[38,48,42,60,52,70,64,85,78,92,88,100].map((h,i) => (
                <div key={i} className="flex-1 rounded-t-sm" style={{ height:`${h}%`, background: i>=9 ? "linear-gradient(to top, rgba(99,102,241,0.85), rgba(59,130,246,0.95))" : "linear-gradient(to top, rgba(59,130,246,0.28), rgba(59,130,246,0.45))" }} />
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-slate-600 font-mono mt-2 pt-2 border-t border-white/5">
              <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white/[0.018] border border-white/7 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-white/7 mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[12px] font-semibold text-white">Live Operations Feed</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Real-Time</span>
          </div>

          <div className="space-y-2.5">
            {[
              { title: "Sarah Mitchell (TechCorp)", sub: "Qualified HOT LEAD · $15,000 budget", time: "2m ago", badge: "HOT", bc: "bg-red-500/10 text-red-400 border-red-500/20" },
              { title: "Invoice #INV-2026-004", sub: "Auto-dispatched · settlement link ($8,500)", time: "14m ago", badge: "SENT", bc: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
              { title: "Marcus Chen", sub: "Strategy Discovery Session scheduled", time: "38m ago", badge: "BOOKED", bc: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
            ].map((ev, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-white/[0.018] border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-200 truncate">{ev.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${ev.bc}`}>{ev.badge}</span>
                </div>
                <p className="text-[10.5px] text-slate-400">{ev.sub}</p>
                <p className="text-[9.5px] text-slate-600 mt-0.5 font-mono">{ev.time}</p>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-3 border-t border-white/7 flex items-center justify-between text-[10.5px]">
            <span className="text-slate-500">Automated RAG Grounding Active</span>
            <span className="flex items-center gap-1 font-semibold text-blue-400 cursor-pointer hover:text-blue-300">Inspect <ArrowRight className="w-3 h-3" /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// === Trusted By ===
function TrustedBy() {
  const companies = ["Apex Dynamics", "Vertex AI", "NovaCloud", "Horizon Ventures", "Quantum Scale", "PulseData Corp"];
  return (
    <section className="py-12 border-y border-white/5">
      <div className="max-w-[1280px] mx-auto px-6">
        <p className="text-center text-[10.5px] font-bold text-slate-600 uppercase tracking-[0.14em] mb-7">
          Trusted by operations teams at high-growth businesses
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 items-center">
          {companies.map(c => (
            <div key={c} className="flex items-center justify-center px-4 py-2.5 rounded-xl border border-transparent hover:border-white/8 hover:bg-white/[0.018] text-slate-500 hover:text-slate-300 transition-all duration-300">
              <span className="text-[12.5px] font-semibold tracking-tight text-center leading-tight">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// === Stats Bar ===
function StatsBar() {
  const stats = [
    { number: "2,400+", label: "Active Workspaces" },
    { number: "92%", label: "Invoice Recovery Rate" },
    { number: "$1.2M+", label: "Revenue Qualified Monthly" },
    { number: "1m 24s", label: "Average Response SLA" },
  ];
  return (
    <section className="py-16 relative">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="glass-card border border-white/8 p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/7">
          {stats.map((s, i) => (
            <div key={i} className="text-center pt-6 md:pt-0 first:pt-0">
              <p className="stat-number mb-1">{s.number}</p>
              <p className="text-[13px] text-slate-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// === Features ===
const features = [
  { icon: <Users className="w-5 h-5" />, title: "Real-Time Lead Qualification", desc: "AI extracts budgets, project scope, and timelines from inbound chats in under 90 seconds. Classifies leads as Hot, Warm, or Cold with high precision and escalates instantly.", color: "from-blue-500 to-indigo-600", tag: "Autonomous", shadow: "shadow-blue-500/20" },
  { icon: <MessageSquare className="w-5 h-5" />, title: "Grounded Knowledge Follow-Ups", desc: "Every message is grounded in your company's actual FAQs, pricing models, and service agreements through a private vectorized RAG context window.", color: "from-violet-500 to-indigo-600", tag: "RAG Powered", shadow: "shadow-violet-500/20" },
  { icon: <FileText className="w-5 h-5" />, title: "Automated Invoice Recovery", desc: "Dispatches professional branded invoices instantly. Handles polite multi-stage overdue follow-ups, reducing days sales outstanding (DSO) by over 40%.", color: "from-amber-500 to-orange-600", tag: "Financial SLA", shadow: "shadow-amber-500/20" },
  { icon: <Calendar className="w-5 h-5" />, title: "Appointment Management", desc: "Seamless calendar synchronization with automated confirmation reminders and instant reschedule slots. Eliminate no-shows without manual intervention.", color: "from-emerald-500 to-teal-600", tag: "Zero No-Show", shadow: "shadow-emerald-500/20" },
  { icon: <Globe className="w-5 h-5" />, title: "Embeddable Smart Widget", desc: "Add a single script tag to any Webflow, WordPress, or React site. Starts engaging and capturing qualified prospects within 60 seconds of deployment.", color: "from-cyan-500 to-blue-600", tag: "Zero Setup", shadow: "shadow-cyan-500/20" },
  { icon: <BarChart2 className="w-5 h-5" />, title: "Executive Analytics Dashboard", desc: "Consolidated operational telemetry — revenue pipeline velocity, lead scoring breakdown, and full audit trails of every autonomous decision made.", color: "from-rose-500 to-pink-600", tag: "Audit Ready", shadow: "shadow-rose-500/20" },
];

function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-[680px] mx-auto mb-16">
          <div className="section-label section-label-blue mx-auto">
            <Zap className="w-3.5 h-3.5" />
            End-to-End Enterprise Automation
          </div>
          <h2 className="section-title mb-4">Everything your operations team needs to scale.</h2>
          <p className="section-subtitle mx-auto">Replace fragmented tools and manual spreadsheets with an integrated, always-online AI workforce.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="glass-card p-7 group flex flex-col">
              <div className="flex items-start justify-between mb-5">
                <div className={`w-11 h-11 rounded-[13px] bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-lg ${f.shadow} flex-shrink-0`}>
                  {f.icon}
                </div>
                <span className="text-[10px] font-bold tracking-[0.07em] uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-slate-400">{f.tag}</span>
              </div>
              <h3 className="text-[15.5px] font-bold text-white mb-2.5 group-hover:text-blue-300 transition-colors leading-snug">{f.title}</h3>
              <p className="text-[13.5px] text-slate-400 leading-[1.7] flex-1">{f.desc}</p>
              <div className="pt-5 mt-5 border-t border-white/5 flex items-center text-[12px] font-semibold text-blue-400/70 group-hover:text-blue-400 transition-colors">
                <span>View technical architecture</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// === How It Works ===
function HowItWorks() {
  const steps = [
    { step: "01", title: "Sync Knowledge Base", desc: "Upload service offerings, pricing tiers, FAQs, and SLA guidelines. OpsAgent builds a private vectorized knowledge index in minutes.", icon: <Layers className="w-5 h-5 text-blue-400" /> },
    { step: "02", title: "Deploy Omnichannel Widget", desc: "Embed a single-line script onto your website, app, or portal. The agent initializes instantly with your brand identity and persona.", icon: <Globe className="w-5 h-5 text-indigo-400" /> },
    { step: "03", title: "Autonomous Action Execution", desc: "The agent qualifies inbound prospects, scores budget intent, books discovery sessions, and creates invoices — all on autopilot.", icon: <Zap className="w-5 h-5 text-purple-400" /> },
    { step: "04", title: "Review and Close Deals", desc: "Your team jumps in only when high-value opportunities are warm and ready to close. Complete audit trails available in real time.", icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" /> },
  ];
  return (
    <section id="how-it-works" className="py-24 md:py-32 border-y border-white/5" style={{background:"linear-gradient(180deg, #060B14 0%, #080F1E 50%, #060B14 100%)"}}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-[640px] mx-auto mb-16">
          <div className="section-label section-label-green mx-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Rapid Deployment
          </div>
          <h2 className="section-title mb-4">Configured in <span className="gradient-text">10 minutes</span>.</h2>
          <p className="section-subtitle mx-auto">No complex engineering sprints. No heavy API integrations required.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => (
            <div key={s.step} className="glass-card p-6 flex flex-col group hover:border-white/16 transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">{s.icon}</div>
                <span className="text-[26px] font-black text-white/15 font-mono leading-none">{s.step}</span>
              </div>
              <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
              <p className="text-[13px] text-slate-400 leading-[1.7] flex-1">{s.desc}</p>
              <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
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

// === Chat Demo ===
interface DemoMsg { from: "ai"|"user"; text: string; meta: { leadScore?: number; leadStatus?: string } | null; }

function WidgetDemo() {
  const [messages, setMessages] = useState<DemoMsg[]>([{
    from: "ai",
    text: "Hello, I'm Alex — your automated operations assistant at Apex Consulting. How can I assist you with your business goals today?",
    meta: null,
  }]);
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
    setMessages(prev => [...prev, { from: "user", text: textToSend, meta: null }]);
    setTyping(true);
    try {
      const res = await fetch("/api/v1/agent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: textToSend, businessId: "biz-001", conversationId: "demo-live" }) });
      const data = await res.json();
      setTyping(false);
      setMessages(prev => [...prev, { from: "ai", text: data.response || "Our engagements start at $3,000. Would you like to schedule a free discovery call?", meta: data }]);
    } catch {
      setTyping(false);
      setMessages(prev => [...prev, { from: "ai", text: "Our specialized consulting engagements start at $3,000 for advisory sprints. Would you like to schedule an introductory session?", meta: { leadScore: 88, leadStatus: "WARM" } }]);
    }
  };

  return (
    <section id="widget" className="py-24 md:py-32">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="section-label section-label-blue">
              <Bot className="w-3.5 h-3.5" />
              Interactive Agent Sandbox
            </div>
            <h2 className="section-title leading-tight">Experience the AI Qualification Engine.</h2>
            <p className="text-[15px] text-slate-400 leading-[1.75]">
              Test the live agent right now. See how it classifies client intent, matches against your knowledge base, and computes a real-time lead score.
            </p>
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Quick simulation prompts</p>
              <div className="flex flex-col gap-2">
                {samplePrompts.map(p => (
                  <button key={p.label} onClick={() => handleSend(p.query)} className="text-left px-4 py-2.5 rounded-xl bg-white/[0.025] hover:bg-white/[0.065] border border-white/8 hover:border-blue-500/28 text-[12.5px] text-slate-300 hover:text-white transition-all duration-200 flex items-center justify-between group">
                    <span>{p.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-white/7 space-y-2">
              {["Vectorized RAG retrieval against private knowledge base", "Real-time intent extraction and lead temperature scoring"].map(t => (
                <div key={t} className="flex items-center gap-2 text-[12.5px] text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-card border border-white/12 overflow-hidden shadow-2xl shadow-blue-500/8">
              <div className="bg-gradient-to-r from-[#0D1528] to-[#131E35] px-5 py-4 border-b border-white/8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                    <Bot className="w-[18px] h-[18px]" />
                  </div>
                  <div>
                    <p className="text-[13.5px] font-bold text-white">Alex · Apex Operations Assistant</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10.5px] text-emerald-400 font-medium">Live Agent Active</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/5 text-slate-400 border border-white/8">GPT-4o Grounded</span>
              </div>

              <div className="h-80 overflow-y-auto p-5 space-y-4 bg-[#070C18]/90">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[12.5px] leading-relaxed ${m.from === "user" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/18" : "bg-white/[0.055] text-slate-200 border border-white/8"}`}>
                      {m.text}
                    </div>
                    {m.meta && (
                      <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/8 px-2.5 py-1 rounded-lg">
                        <Target className="w-3 h-3 text-blue-400" />
                        <span>Score: <strong className="text-white">{m.meta.leadScore || 85}/100</strong></span>
                        <span className="text-slate-600">·</span>
                        <span className="text-emerald-400 font-bold uppercase">{m.meta.leadStatus || "HOT"}</span>
                      </div>
                    )}
                  </div>
                ))}
                {typing && (
                  <div className="flex items-center gap-1.5 p-3 rounded-xl bg-white/[0.035] border border-white/8 w-fit">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-[10.5px] text-slate-400 ml-2 font-mono">Analyzing knowledge base...</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-[#09101F] border-t border-white/8 flex gap-2">
                <input
                  className="flex-1 bg-white/[0.035] border border-white/8 rounded-xl px-4 py-2.5 text-[12.5px] text-white placeholder:text-slate-500 outline-none focus:border-blue-500/45 transition-colors"
                  placeholder="Ask about services, pricing, or request a strategy session..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                />
                <Button variant="primary" size="sm" onClick={() => handleSend()} disabled={typing || !input.trim()} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// === Testimonials ===
const testimonials = [
  { name: "Marcus Vance", role: "Managing Director", company: "Vance Capital Group", quote: "OpsAgent paid for its annual license inside 72 hours. An inbound prospect engaged the widget at 11:30 PM, was fully qualified for $24,000, and our partner was alerted with the complete dossier before morning.", stars: 5, metric: "+$140k in 60 Days" },
  { name: "Elena Rostova", role: "Head of Operations", company: "Apex Strategy Partners", quote: "Our billing team used to spend 12 hours a week reconciling overdue invoices. OpsAgent's automated recovery sequences cleared 92% of our outstanding receivables without any awkward client friction.", stars: 5, metric: "12 Hours Saved / Week" },
  { name: "David Kim", role: "Founder & CEO", company: "Synapse Digital", quote: "The lead qualification is astonishingly precise. It doesn't just give generic answers — it pulls exact numbers from our knowledge base and books directly into calendar slots without any human input.", stars: 5, metric: "0 No-Shows Recorded" },
];

function Testimonials() {
  return (
    <section className="py-24 md:py-32 border-t border-white/5" style={{background:"linear-gradient(180deg, #060B14 0%, #040810 100%)"}}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-[600px] mx-auto mb-16">
          <div className="section-label section-label-amber mx-auto">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            Verified Customer Outcomes
          </div>
          <h2 className="section-title mb-4">Built for teams that value velocity.</h2>
          <p className="section-subtitle mx-auto">Read how high-growth businesses replace operational drag with automated execution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map(t => (
            <div key={t.name} className="glass-card p-8 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="flex">{Array.from({length: t.stars}).map((_,i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">{t.metric}</span>
              </div>
              <blockquote className="text-[13.5px] text-slate-300 leading-[1.75] mb-6 flex-1 font-light">&ldquo;{t.quote}&rdquo;</blockquote>
              <div className="flex items-center gap-3 pt-5 border-t border-white/7">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shadow-md shadow-blue-500/18 flex-shrink-0">
                  {t.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-white">{t.name}</p>
                  <p className="text-[11.5px] text-slate-400">{t.role} · <span className="text-slate-300">{t.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// === CTA ===
function CTASection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="glass-card p-12 md:p-16 relative overflow-hidden text-center border border-white/12 glow-blue">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/7 to-violet-600/10 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-blue-400/40 to-transparent" />
          <div className="relative z-10 max-w-[580px] mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/35">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <h2 className="mb-4" style={{fontFamily:"'Space Grotesk', sans-serif", fontSize:"clamp(30px,4.5vw,44px)", fontWeight:900, color:"#fff", letterSpacing:"-0.03em", lineHeight:1.1}}>
              Deploy your AI operations agent today.
            </h2>
            <p className="text-[15px] text-slate-400 mb-10 leading-[1.75]">
              Join over 2,400 businesses automating lead qualification, invoicing, and appointments. Free tier available — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
              <Link href="/signup">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />} className="shadow-2xl shadow-blue-500/35 px-7">
                  Start Free 14-Day Pro Trial
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" size="lg" className="border border-white/10 hover:border-white/18 px-7">Compare Plans</Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-[12px] text-slate-500">
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 10-Minute Setup</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Cancel Anytime</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> SOC 2 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// === Footer ===
function Footer() {
  const cols = [
    { title: "Product", links: [{ label: "Lead Qualification", href: "#features" }, { label: "Invoice Settlement", href: "#features" }, { label: "Appointment Engine", href: "#features" }, { label: "Interactive Sandbox", href: "#widget" }, { label: "Pricing & Plans", href: "/pricing" }] },
    { title: "Platform", links: [{ label: "API Reference", href: "#" }, { label: "Vector RAG Pipeline", href: "#" }, { label: "Web Widget SDK", href: "#" }, { label: "Security & Encryption", href: "#" }, { label: "Release Changelog", href: "#" }] },
    { title: "Company", links: [{ label: "About CRESCONIX", href: "#" }, { label: "Enterprise Security", href: "#" }, { label: "Customer Stories", href: "#" }, { label: "Contact Advisory", href: "#" }, { label: "Terms of Service", href: "#" }] },
  ];
  return (
    <footer className="border-t border-white/6 py-14 px-6" style={{background:"#030710"}}>
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-[14.5px] font-bold text-white tracking-tight">OpsAgent Enterprise</span>
            </div>
            <p className="text-[12.5px] text-slate-500 max-w-[280px] leading-[1.75] mb-5">
              Autonomous operations platform for high-velocity teams. Qualify inbound opportunities, dispatch quotes, settle invoices, and synchronize calendar bookings 24/7.
            </p>
            <div className="flex items-center gap-2 text-[11.5px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SOC 2 Type II · GDPR Compliant · ISO 27001</span>
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.12em] mb-4">{col.title}</p>
              <div className="flex flex-col gap-2.5">
                {col.links.map(l => <Link key={l.label} href={l.href} className="text-[12.5px] text-slate-500 hover:text-slate-200 transition-colors">{l.label}</Link>)}
              </div>
            </div>
          ))}
        </div>
        <div className="line-accent mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11.5px] text-slate-600">
          <p>&copy; 2026 CRESCONIX Technologies, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />System Status: All Green</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// === Main Page ===
export default function LandingPage() {
  return (
    <div className="bg-[#040810] min-h-screen text-slate-100 selection:bg-blue-500/30 selection:text-white">
      <div className="mesh-bg" />
      <div className="grid-overlay" />
      <Navbar />
      <Hero />
      <TrustedBy />
      <StatsBar />
      <Features />
      <HowItWorks />
      <WidgetDemo />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}
