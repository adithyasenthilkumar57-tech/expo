"use client";
import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Card";
import {
  Settings, Building2, Bot, Bell, Users, CreditCard,
  Shield, Save, Check, Globe, Phone, Mail, Edit3, Crown,
  Zap, Star, ChevronRight, ToggleLeft, ToggleRight
} from "lucide-react";

type SettingsTab = "business" | "ai" | "notifications" | "team" | "billing";

const PLANS = [
  {
    name: "Free", price: 0, period: "forever",
    features: ["Up to 50 leads/mo", "5 KB entries", "Basic AI responses", "Email reminders"],
    color: "from-slate-700 to-slate-600",
  },
  {
    name: "Pro", price: 49, period: "per month",
    features: ["Unlimited leads", "Unlimited KB entries", "Advanced AI agent", "Auto follow-ups", "Invoice automation", "Priority support"],
    color: "from-blue-600 to-indigo-600",
    badge: "Most Popular",
  },
  {
    name: "Business", price: 149, period: "per month",
    features: ["Everything in Pro", "Multi-user access", "Custom AI persona", "White-label widget", "API access", "Dedicated success manager"],
    color: "from-purple-600 to-pink-600",
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("business");
  const { user, business } = useAuthStore();

  const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { key: "business", label: "Business Profile", icon: <Building2 className="w-4 h-4" /> },
    { key: "ai", label: "AI Configuration", icon: <Bot className="w-4 h-4" /> },
    { key: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { key: "team", label: "Team", icon: <Users className="w-4 h-4" /> },
    { key: "billing", label: "Billing & Plan", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1100px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-400" />
          Settings
        </h1>
        <p className="text-sm text-slate-500">Manage your business profile and OpsAgent configuration</p>
      </div>

      <div className="flex gap-6">
        {/* Tabs sidebar */}
        <div className="w-48 flex-shrink-0">
          <div className="flex flex-col gap-1">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${activeTab === t.key ? "bg-blue-500/15 text-blue-400 border border-blue-500/25" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "business" && <BusinessSettings business={business} user={user} />}
          {activeTab === "ai" && <AISettings business={business} />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "team" && <TeamSettings />}
          {activeTab === "billing" && <BillingSettings currentPlan={business?.plan} />}
        </div>
      </div>
    </div>
  );
}

function BusinessSettings({ business, user }: { business: any; user: any }) {
  const [saved, setSaved] = useState(false);
  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 800));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-base font-semibold text-white mb-6">Business Profile</h2>

      {/* Business logo/avatar */}
      <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/3 border border-white/8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white">
          {business?.name?.charAt(0) || "B"}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200">{business?.name}</p>
          <p className="text-xs text-slate-500 mb-2">{business?.industry}</p>
          <Button variant="ghost" size="sm" leftIcon={<Edit3 className="w-3 h-3" />}>Change Logo</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Input label="Business Name" defaultValue={business?.name} />
        <Input label="Industry" defaultValue={business?.industry} />
        <Input label="Business Email" type="email" defaultValue={business?.email} leftElement={<Mail className="w-4 h-4" />} />
        <Input label="Phone Number" type="tel" defaultValue={business?.phone} leftElement={<Phone className="w-4 h-4" />} />
        <Input label="Website" defaultValue={business?.website} leftElement={<Globe className="w-4 h-4" />} />
        <div>
          <label className="text-sm font-medium text-slate-300 mb-1.5 block">Timezone</label>
          <select className="input-field text-sm">
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
          </select>
        </div>
      </div>

      <div className="divider" />

      <h3 className="text-sm font-semibold text-slate-300 mb-4">Account Owner</h3>
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={user?.name || "User"} size="md" />
        <div>
          <p className="text-sm font-medium text-slate-200">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Full Name" defaultValue={user?.name} />
        <Input label="Email" defaultValue={user?.email} />
        <Input label="New Password" type="password" placeholder="Leave blank to keep current" />
        <Input label="Confirm Password" type="password" placeholder="Confirm new password" />
      </div>

      <div className="flex justify-end mt-6">
        <Button
          variant={saved ? "success" : "primary"}
          onClick={handleSave}
          leftIcon={saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        >
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function AISettings({ business }: { business: any }) {
  const [saved, setSaved] = useState(false);
  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-base font-semibold text-white mb-1">AI Agent Configuration</h2>
      <p className="text-sm text-slate-500 mb-6">Customize how the AI agent communicates with your customers</p>

      <div className="flex flex-col gap-4">
        <Input label="AI Persona Name" defaultValue={business?.aiPersonaName} placeholder="Alex" hint="The name customers will see in chat (e.g., Alex, Sam, your business name)" />
        <Textarea label="Greeting Message" defaultValue={business?.aiPersonaGreeting} className="min-h-[100px]" hint="First message the AI sends when someone opens the chat widget" />

        <div>
          <label className="text-sm font-medium text-slate-300 mb-1.5 block">AI Response Style</label>
          <div className="grid grid-cols-3 gap-2">
            {["Professional", "Friendly", "Concise"].map(style => (
              <button key={style} className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${style === "Professional" ? "bg-blue-500/15 border-blue-500/30 text-blue-400" : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"}`}>
                {style}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 mb-1.5 block">LLM Provider</label>
          <select className="input-field text-sm">
            <option>OpenAI (GPT-4o)</option>
            <option>Anthropic (Claude 3.5)</option>
            <option>OpenRouter</option>
          </select>
          <p className="text-xs text-slate-600 mt-1">Provider is configured via OPENAI_API_KEY or ANTHROPIC_API_KEY env variable</p>
        </div>

        <div className="p-4 rounded-xl bg-white/3 border border-white/8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-slate-300">Auto-qualify leads</p>
              <p className="text-xs text-slate-500">AI will automatically assign HOT/WARM/COLD status</p>
            </div>
            <div className="text-blue-400"><ToggleRight className="w-8 h-8" /></div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-slate-300">Auto invoice follow-up</p>
              <p className="text-xs text-slate-500">Send automated reminders for overdue invoices</p>
            </div>
            <div className="text-blue-400"><ToggleRight className="w-8 h-8" /></div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">No-show re-engagement</p>
              <p className="text-xs text-slate-500">AI contacts no-shows to reschedule</p>
            </div>
            <div className="text-blue-400"><ToggleRight className="w-8 h-8" /></div>
          </div>
        </div>

        <Input label="API Key (OpenAI / Anthropic)" type="password" placeholder="sk-…" hint="Stored encrypted. Used for AI agent and RAG pipeline." />
      </div>

      <div className="flex justify-end mt-6">
        <Button
          variant={saved ? "success" : "primary"}
          onClick={handleSave}
          leftIcon={saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        >
          {saved ? "Saved!" : "Save AI Settings"}
        </Button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const notifSettings = [
    { label: "New lead received", desc: "When someone submits via your widget", enabled: true },
    { label: "Hot lead alert", desc: "When AI qualifies a lead as HOT", enabled: true },
    { label: "Invoice overdue", desc: "When a payment is past due date", enabled: true },
    { label: "Invoice paid", desc: "When a client marks invoice as paid", enabled: true },
    { label: "Appointment no-show", desc: "When a client misses their appointment", enabled: true },
    { label: "Appointment reminder sent", desc: "When AI sends a reminder", enabled: false },
    { label: "Weekly summary report", desc: "Weekly digest of leads, revenue, and activity", enabled: true },
  ];

  return (
    <div className="glass-card p-6">
      <h2 className="text-base font-semibold text-white mb-1">Notification Preferences</h2>
      <p className="text-sm text-slate-500 mb-6">Control when and how you get notified</p>

      <div className="flex flex-col gap-3">
        {notifSettings.map((n, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div>
              <p className="text-sm font-medium text-slate-200">{n.label}</p>
              <p className="text-xs text-slate-500">{n.desc}</p>
            </div>
            <div className={`text-2xl cursor-pointer transition-colors ${n.enabled ? "text-blue-400" : "text-slate-600"}`}>
              {n.enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Notification Email</h3>
        <Input placeholder="owner@business.com" type="email" hint="Where to send important alerts and the weekly digest" />
      </div>
    </div>
  );
}

function TeamSettings() {
  const members = [
    { name: "Alex Mercer", email: "owner@apexconsulting.com", role: "OWNER", joined: "Jan 15, 2025" },
    { name: "Jamie Liu", email: "jamie@apexconsulting.com", role: "ADMIN", joined: "Mar 01, 2025" },
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-white mb-1">Team Members</h2>
          <p className="text-sm text-slate-500">Manage who has access to your OpsAgent dashboard</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Users className="w-3.5 h-3.5" />}>Invite Member</Button>
      </div>

      <div className="flex flex-col gap-2">
        {members.map((m, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/8">
            <Avatar name={m.name} size="md" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-200">{m.name}</p>
              <p className="text-xs text-slate-500">{m.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`badge ${m.role === "OWNER" ? "badge-purple" : "badge-info"}`}>
                {m.role === "OWNER" && <Crown className="w-2.5 h-2.5" />}
                {m.role}
              </span>
              <p className="text-[11px] text-slate-600">Since {m.joined}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-blue-500/8 border border-blue-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <p className="text-sm font-medium text-blue-400">Team Access Note</p>
        </div>
        <p className="text-xs text-slate-400">Admins can view and manage all leads, invoices, and appointments. Only the Owner can change billing or delete the account.</p>
      </div>
    </div>
  );
}

function BillingSettings({ currentPlan }: { currentPlan?: string }) {
  return (
    <div>
      <div className="glass-card p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white mb-1">Current Plan</h2>
            <p className="text-sm text-slate-500">Pro plan · Renews October 15, 2026</p>
          </div>
          <span className="badge badge-info flex items-center gap-1"><Star className="w-3 h-3" />PRO</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Next billing date</span>
          <span className="text-slate-200 font-medium">October 15, 2026 · $49.00</span>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="ghost" size="sm">Manage Billing</Button>
          <Button variant="ghost" size="sm">Download Invoices</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const isCurrentPlan = plan.name.toUpperCase() === currentPlan;
          return (
            <div key={plan.name} className={`glass-card p-5 relative overflow-hidden ${isCurrentPlan ? "!border-blue-500/40" : ""}`}>
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                  {plan.badge}
                </div>
              )}
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${plan.color} mb-3 flex items-center justify-center`}>
                {plan.name === "Free" ? <Zap className="w-4 h-4 text-white" /> : plan.name === "Pro" ? <Star className="w-4 h-4 text-white" /> : <Crown className="w-4 h-4 text-white" />}
              </div>
              <p className="text-base font-bold text-white mb-0.5">{plan.name}</p>
              <p className="text-sm text-slate-400 mb-4">
                {plan.price === 0 ? "Free forever" : <><span className="text-xl font-bold text-white">${plan.price}</span>/{plan.period}</>}
              </p>
              <div className="flex flex-col gap-1.5 mb-4">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-slate-400">
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              {isCurrentPlan ? (
                <div className="w-full py-2 text-center text-xs font-semibold text-blue-400 border border-blue-500/30 rounded-xl">Current Plan</div>
              ) : (
                <Button variant={plan.name === "Pro" ? "primary" : "ghost"} size="sm" className="w-full">
                  {plan.price > 49 ? "Contact Sales" : "Upgrade"}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
