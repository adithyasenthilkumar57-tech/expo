"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Bot, Check, Star, Crown, Zap, ArrowRight, X } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    desc: "Perfect for solo operators just getting started",
    icon: <Zap className="w-5 h-5 text-white" />,
    color: "from-slate-600 to-slate-700",
    features: [
      { text: "50 leads per month", included: true },
      { text: "5 knowledge base entries", included: true },
      { text: "Basic AI responses", included: true },
      { text: "Email appointment reminders", included: true },
      { text: "2 invoices per month", included: true },
      { text: "Website chat widget", included: true },
      { text: "Auto invoice follow-ups", included: false },
      { text: "Lead qualification AI", included: false },
      { text: "Custom AI persona", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Get Started Free",
    href: "/signup",
  },
  {
    name: "Pro",
    price: { monthly: 49, annual: 39 },
    desc: "For growing businesses that want full automation",
    icon: <Star className="w-5 h-5 text-white" />,
    color: "from-blue-600 to-indigo-600",
    badge: "Most Popular",
    features: [
      { text: "Unlimited leads", included: true },
      { text: "Unlimited knowledge base entries", included: true },
      { text: "Advanced AI agent (GPT-4o)", included: true },
      { text: "Email appointment reminders", included: true },
      { text: "Unlimited invoices", included: true },
      { text: "Website chat widget", included: true },
      { text: "Auto invoice follow-ups", included: true },
      { text: "Lead qualification AI", included: true },
      { text: "Custom AI persona name", included: true },
      { text: "Priority email support", included: true },
    ],
    cta: "Start Pro Trial",
    href: "/signup",
  },
  {
    name: "Business",
    price: { monthly: 149, annual: 119 },
    desc: "For teams and agencies running multiple businesses",
    icon: <Crown className="w-5 h-5 text-white" />,
    color: "from-purple-600 to-pink-600",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Up to 5 team members", included: true },
      { text: "Multi-business management", included: true },
      { text: "White-label widget (your branding)", included: true },
      { text: "API access", included: true },
      { text: "Custom LLM integration", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Dedicated success manager", included: true },
      { text: "Custom onboarding session", included: true },
      { text: "SLA uptime guarantee", included: true },
    ],
    cta: "Contact Sales",
    href: "/signup",
  },
];

const faqs = [
  { q: "Is there a free trial for the Pro plan?", a: "Yes! Every new signup gets a 14-day free trial of the Pro plan with no credit card required. You can downgrade to Free at any time." },
  { q: "Can I cancel anytime?", a: "Absolutely. There are no long-term contracts. Cancel at any time from your billing settings — no questions asked." },
  { q: "What AI model powers OpsAgent?", a: "By default, OpsAgent uses OpenAI GPT-4o. You can swap to Anthropic Claude or any OpenRouter model in your settings using your own API key." },
  { q: "How does the knowledge base work?", a: "You add your FAQs, pricing, and policies to the knowledge base. The AI uses a RAG pipeline to retrieve relevant context before every response, ensuring accurate, grounded answers." },
  { q: "Does the widget work with any website?", a: "Yes. The widget is a single script tag that works with any website — WordPress, Webflow, Squarespace, custom HTML, or any framework." },
  { q: "What happens to my data?", a: "Your data is stored encrypted and never used to train shared AI models. We're SOC 2 Type II certified and GDPR compliant." },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <div className="mesh-bg" />
      <div className="grid-overlay" />

      {/* Navbar */}
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">OpsAgent</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link href="/signup"><Button variant="primary" size="sm">Start Free</Button></Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 py-20 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-400 mb-8">Start for free. Scale as you grow. No surprise charges.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${!annual ? "bg-white/10 text-white" : "text-slate-500"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${annual ? "bg-white/10 text-white" : "text-slate-500"}`}
            >
              Annual
              <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {plans.map(plan => (
            <div key={plan.name} className={`glass-card p-6 relative overflow-hidden flex flex-col ${plan.badge ? "!border-blue-500/40 shadow-lg shadow-blue-500/10" : ""}`}>
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl">
                  {plan.badge}
                </div>
              )}

              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                {plan.icon}
              </div>
              <h2 className="text-lg font-bold text-white mb-1">{plan.name}</h2>
              <p className="text-sm text-slate-500 mb-4">{plan.desc}</p>

              <div className="mb-6">
                {plan.price.monthly === 0 ? (
                  <p className="text-3xl font-black text-white">Free</p>
                ) : (
                  <div>
                    <p className="text-3xl font-black text-white">
                      ${annual ? plan.price.annual : plan.price.monthly}
                      <span className="text-base font-normal text-slate-500">/mo</span>
                    </p>
                    {annual && <p className="text-xs text-emerald-400 mt-0.5">Billed ${plan.price.annual! * 12}/year · Save ${(plan.price.monthly - plan.price.annual!) * 12}/year</p>}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 mb-6 flex-1">
                {plan.features.map(f => (
                  <div key={f.text} className={`flex items-center gap-2 text-sm ${f.included ? "text-slate-300" : "text-slate-600"}`}>
                    {f.included
                      ? <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      : <X className="w-4 h-4 text-slate-700 flex-shrink-0" />
                    }
                    {f.text}
                  </div>
                ))}
              </div>

              <Link href={plan.href}>
                <Button
                  variant={plan.badge ? "primary" : "ghost"}
                  className="w-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison note */}
        <div className="text-center mb-20">
          <p className="text-sm text-slate-600">All plans include: SSL encryption · 99.9% uptime SLA · GDPR compliance · Automatic updates</p>
        </div>

        {/* FAQ */}
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-10">Frequently asked questions</h2>
          <div className="flex flex-col gap-2">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-semibold text-slate-200">{faq.q}</span>
                  <ArrowRight className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3">
                    <p className="text-sm text-slate-400">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <p className="text-slate-400 mb-4">Still have questions?</p>
          <div className="flex gap-3 justify-center">
            <Button variant="ghost">Talk to sales</Button>
            <Link href="/signup"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Start for free</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
