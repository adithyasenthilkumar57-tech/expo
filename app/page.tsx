"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  Bot, Zap, Users, FileText, Calendar, MessageSquare,
  ArrowRight, Check, Star, ChevronDown, Menu, X,
  Shield, TrendingUp, Clock, Mail, Globe, BarChart2,
  Play, Quote, ChevronRight, Sparkles
} from "lucide-react";

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-white/10" : ""}`}>
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-white leading-none">OpsAgent</span>
            <span className="text-[10px] text-slate-500 block leading-none">by CRESCONIX</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How it works</Link>
          <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</Link>
          <Link href="#widget" className="text-sm text-slate-400 hover:text-white transition-colors">Widget Demo</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>Get Started Free</Button>
          </Link>
        </div>

        <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden glass border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          <Link href="#features" className="text-sm text-slate-300" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="#how-it-works" className="text-sm text-slate-300" onClick={() => setMenuOpen(false)}>How it works</Link>
          <Link href="/pricing" className="text-sm text-slate-300" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <div className="flex gap-2 pt-2">
            <Link href="/login" className="flex-1"><Button variant="ghost" size="sm" className="w-full">Log in</Button></Link>
            <Link href="/signup" className="flex-1"><Button variant="primary" size="sm" className="w-full">Get Started</Button></Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] bg-cyan-600/8 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative max-w-[1000px] mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-sm font-medium mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          Powered by GPT-4o · Built for small businesses
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Your AI employee,{" "}
          <span className="gradient-text">working 24/7</span>
          <br />so you don&apos;t have to.
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          OpsAgent qualifies your leads, sends invoices, books appointments, and re-engages cold customers — automatically. Set it up in 10 minutes.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <Link href="/signup">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />} className="shadow-2xl shadow-blue-500/30">
              Start for Free — No credit card
            </Button>
          </Link>
          <Button variant="ghost" size="lg" leftIcon={<Play className="w-4 h-4" />}>
            Watch 2-min demo
          </Button>
        </div>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            <span className="ml-1">4.9/5 from 200+ businesses</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />
          <span>🚀 2,400+ businesses onboarded</span>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />
          <span>⚡ Avg. 1m 24s AI response time</span>
        </div>

        {/* Dashboard preview */}
        <div className="mt-16 relative animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-transparent to-transparent z-10 bottom-0 h-1/3 top-auto" />
          <div className="glass-card !rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 border !border-white/15">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="bg-[#0F1629] p-4 text-left">
      {/* Mini topbar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-amber-500/60" />
        <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
        <div className="flex-1 mx-4 h-5 rounded-md bg-white/5 border border-white/8" />
      </div>

      <div className="flex gap-3">
        {/* Sidebar preview */}
        <div className="w-36 flex flex-col gap-1.5">
          {["Dashboard", "Leads", "Invoices", "Appointments"].map((item, i) => (
            <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] ${i === 0 ? "bg-blue-500/15 text-blue-400" : "text-slate-600"}`}>
              <div className="w-3 h-3 rounded bg-current opacity-50" />
              {item}
            </div>
          ))}
        </div>
        {/* Content preview */}
        <div className="flex-1">
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { label: "Hot Leads", val: "2", color: "text-red-400" },
              { label: "Leads/Week", val: "4", color: "text-blue-400" },
              { label: "Pending Revenue", val: "$17,280", color: "text-amber-400" },
              { label: "AI Response", val: "1m 24s", color: "text-emerald-400" },
            ].map(m => (
              <div key={m.label} className="bg-white/4 rounded-lg p-2 border border-white/8">
                <p className={`text-sm font-bold ${m.color}`}>{m.val}</p>
                <p className="text-[9px] text-slate-600 mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
          <div className="h-24 bg-white/4 rounded-lg border border-white/8 flex items-end px-3 pb-2 gap-1">
            {[40, 65, 55, 80, 70, 95, 75].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-blue-500/60 to-blue-500/20 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Logos ────────────────────────────────────────────────────────────────────
function TrustedBy() {
  const companies = ["Acme Corp", "BuildRight", "NovaSpark", "Greenleaf", "SwiftTrack", "DataPulse"];
  return (
    <section className="py-10 border-y border-white/5">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-center text-xs font-semibold text-slate-600 uppercase tracking-widest mb-8">Trusted by small businesses across industries</p>
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {companies.map(c => (
            <div key={c} className="text-slate-700 font-bold text-sm hover:text-slate-500 transition-colors">{c}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Lead Qualification",
    desc: "AI reads every inquiry and classifies it as Hot, Warm, or Cold based on budget, need, and urgency — in under 2 minutes.",
    color: "from-blue-500 to-indigo-600",
    tag: "Auto",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Smart Follow-Ups",
    desc: "Personalized follow-up messages that reference your specific services, pricing, and policies — never generic templates.",
    color: "from-purple-500 to-pink-600",
    tag: "AI-Written",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Invoice Automation",
    desc: "Create invoices in seconds and let AI handle follow-ups for unpaid invoices automatically, at the right intervals.",
    color: "from-amber-500 to-orange-600",
    tag: "Auto",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Appointment Reminders",
    desc: "AI sends reminders before every appointment and instantly re-engages no-shows with a reschedule offer.",
    color: "from-emerald-500 to-teal-600",
    tag: "Auto",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Website Chat Widget",
    desc: "A lightweight widget your customers can install on any website. Powered by your knowledge base — answers in real time.",
    color: "from-cyan-500 to-blue-600",
    tag: "Embeddable",
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: "Business Dashboard",
    desc: "See everything at a glance — leads, revenue pipeline, appointment schedule, and AI actions — in one place.",
    color: "from-rose-500 to-red-600",
    tag: "Analytics",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 max-w-[1200px] mx-auto px-6">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-medium mb-4">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          Everything you need
        </div>
        <h2 className="text-4xl font-black text-white mb-4">
          One AI. Six superpowers.
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Replace the hours you spend on repetitive business tasks with a single, always-on AI employee.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div key={f.title} className="glass-card p-6 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-lg`}>
                {f.icon}
              </div>
              <span className="badge badge-info text-[10px]">{f.tag}</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { step: "01", title: "Add your knowledge", desc: "Tell the AI about your services, pricing, and policies. Takes 10 minutes.", icon: <BookIcon /> },
    { step: "02", title: "Install the widget", desc: "Copy one line of code onto your website. Widget is live instantly.", icon: <WidgetIcon /> },
    { step: "03", title: "AI handles everything", desc: "Leads come in, AI qualifies, follows up, books, and invoices — all on autopilot.", icon: <AutoIcon /> },
    { step: "04", title: "You close the deals", desc: "Jump in only when a lead is hot and ready. Your dashboard shows you exactly when.", icon: <CheckIcon /> },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-transparent to-[#0A0F1E] to-[#0A0E1A]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4">
            Set up in <span className="gradient-text">10 minutes</span>
          </h2>
          <p className="text-slate-400 text-lg">No engineering required. No complex integrations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

          {steps.map((step, i) => (
            <div key={step.step} className="glass-card p-5 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-4">
                {step.icon}
              </div>
              <span className="text-[11px] font-bold text-blue-500 tracking-widest uppercase mb-1 block">{step.step}</span>
              <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>; }
function WidgetIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>; }
function AutoIcon() { return <Bot className="w-5 h-5" />; }
function CheckIcon() { return <Check className="w-5 h-5" />; }

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Maria Santos",
    role: "Owner, Santos Landscaping",
    quote: "I used to lose leads constantly because I couldn't respond fast enough. OpsAgent literally paid for itself in the first week — it closed a $4,200 job while I was on a job site.",
    stars: 5,
  },
  {
    name: "Kevin Park",
    role: "Founder, Park Legal Services",
    quote: "The invoice follow-up feature alone saved me 3 hours a week. It's like having an admin I never have to train or pay overtime.",
    stars: 5,
  },
  {
    name: "Danielle Ross",
    role: "Therapist & Practice Owner",
    quote: "Appointment reminders cut my no-show rate by 70%. The AI also re-engaged 3 no-shows and they booked again. I'm genuinely shocked.",
    stars: 5,
  },
];

function Testimonials() {
  return (
    <section className="py-24 max-w-[1200px] mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-white mb-3">What owners are saying</h2>
        <p className="text-slate-400">Real results from real small businesses</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div key={t.name} className="glass-card p-6">
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: t.stars }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <Quote className="w-6 h-6 text-blue-500/40 mb-3" />
            <p className="text-sm text-slate-300 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-2 pt-3 border-t border-white/8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">{t.name}</p>
                <p className="text-[11px] text-slate-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Widget Demo ──────────────────────────────────────────────────────────────
function WidgetDemo() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! I'm Alex from Apex Consulting 👋 How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages(m => [...m, { from: "user", text: userMsg }]);
    setTyping(true);
    await new Promise(r => setTimeout(r, 1500));
    setTyping(false);
    setMessages(m => [...m, { from: "ai", text: "Thanks for reaching out! We specialize in operational efficiency audits, GTM strategy, and financial optimization. Our engagements start at $3,000. Would you like to schedule a free 30-minute discovery call?" }]);
  };

  return (
    <section id="widget" className="py-24 max-w-[1200px] mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
            <Globe className="w-3.5 h-3.5" />
            Embeddable Widget
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Install on any website<br />in 30 seconds
          </h2>
          <p className="text-slate-400 mb-6">
            One script tag. That&apos;s it. The AI widget instantly appears on your site and starts qualifying visitors 24/7.
          </p>
          <div className="bg-[#0F1629] rounded-xl border border-white/10 p-4 mb-6 font-mono text-sm">
            <p className="text-slate-500 text-xs mb-2">// Add to your website before &lt;/body&gt;</p>
            <p className="text-blue-300">&lt;<span className="text-emerald-400">script</span></p>
            <p className="pl-4 text-slate-300">src=<span className="text-amber-300">&quot;https://cdn.opsagent.ai/widget.js&quot;</span></p>
            <p className="pl-4 text-slate-300">data-business-id=<span className="text-amber-300">&quot;biz-001&quot;</span></p>
            <p className="text-blue-300">&gt;&lt;/<span className="text-emerald-400">script</span>&gt;</p>
          </div>
          <div className="flex flex-col gap-2">
            {["Answers FAQs from your knowledge base", "Qualifies leads in real-time", "Books appointments via your calendar", "Escalates to you when needed"].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-400">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Live widget demo */}
        <div className="relative">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10 min-h-[400px] flex items-end justify-end relative overflow-hidden">
            <p className="absolute top-4 left-4 text-xs text-slate-600 font-medium">Sample Business Website</p>
            <div className="absolute inset-0 opacity-10">
              <div className="h-8 bg-white/10 m-4 rounded" />
              <div className="flex gap-4 mx-4 mt-2"><div className="flex-1 h-4 bg-white/5 rounded" /><div className="flex-1 h-4 bg-white/5 rounded" /><div className="flex-1 h-4 bg-white/5 rounded" /></div>
              <div className="h-40 bg-white/5 mx-4 mt-6 rounded" />
            </div>

            {/* Chat widget */}
            <div className="relative z-10">
              {open && (
                <div className="absolute bottom-16 right-0 w-72 glass rounded-2xl shadow-2xl shadow-blue-500/20 border border-blue-500/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-white" />
                    <span className="text-sm font-semibold text-white">Alex · Apex Consulting</span>
                    <button onClick={() => setOpen(false)} className="ml-auto text-white/70 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="max-h-48 overflow-y-auto p-3 flex flex-col gap-2 bg-[#0F1629]">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${m.from === "ai" ? "chat-bubble-ai text-slate-200" : "bg-blue-600 text-white"}`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {typing && (
                      <div className="flex gap-1 px-3 py-2 chat-bubble-ai rounded-xl w-fit">
                        <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t border-white/8 flex gap-2 bg-[#0F1629]">
                    <input
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-blue-500/40"
                      placeholder="Type a message…"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendMessage()}
                    />
                    <button onClick={sendMessage} className="bg-blue-600 text-white rounded-lg px-2.5 text-xs font-medium hover:bg-blue-500 transition-colors">
                      Send
                    </button>
                  </div>
                </div>
              )}
              <button
                onClick={() => setOpen(!open)}
                className="widget-button !static !w-12 !h-12 rounded-full"
              >
                {open ? <X className="w-5 h-5 text-white" /> : <MessageSquare className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-[700px] mx-auto px-6 text-center">
        <div className="glass-card p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/40 animate-float">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4">
              Ready to hire your<br />AI employee?
            </h2>
            <p className="text-slate-400 mb-8">
              Join 2,400+ small businesses running on autopilot. Free plan available — no credit card required.
            </p>
            <Link href="/signup">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />} className="shadow-2xl shadow-blue-500/40">
                Get Started for Free
              </Button>
            </Link>
            <p className="text-xs text-slate-600 mt-4">Set up in 10 minutes · Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">OpsAgent</span>
            </div>
            <p className="text-xs text-slate-600 max-w-[160px]">AI employee for small businesses. 24/7 operations on autopilot.</p>
          </div>
          {[
            { title: "Product", links: ["Features", "Pricing", "Widget Demo", "Changelog", "Roadmap"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Press", "Contact"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"] },
          ].map(col => (
            <div key={col.title}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">{col.title}</p>
              <div className="flex flex-col gap-2">
                {col.links.map(l => (
                  <a key={l} href="#" className="text-sm text-slate-600 hover:text-slate-400 transition-colors">{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-700">© 2026 CRESCONIX, Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-xs text-slate-700">
            <Shield className="w-3 h-3" />
            SOC 2 Type II · GDPR Compliant · SSL Encrypted
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="bg-[#0A0E1A] min-h-screen">
      <div className="mesh-bg" />
      <div className="grid-overlay" />
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <Testimonials />
      <WidgetDemo />
      <CTASection />
      <Footer />
    </div>
  );
}
