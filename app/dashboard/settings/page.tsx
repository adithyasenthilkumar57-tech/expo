"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Card";
import { toast } from "@/lib/toast";
import type { PlanType } from "@/lib/types";
import {
  Settings, Building2, Bot, Bell, Users, CreditCard,
  Save, Globe, Phone, Mail, Edit3, Crown,
  Zap, Star, Trash2, X
} from "lucide-react";

type SettingsTab = "business" | "ai" | "notifications" | "team" | "billing" | "data";

const PLANS = [
  {
    name: "FREE" as PlanType,
    label: "Free",
    price: 0,
    period: "forever",
    features: ["Up to 50 leads/mo", "5 KB entries", "Basic AI responses", "Email reminders"],
    color: "from-slate-700 to-slate-600",
  },
  {
    name: "PRO" as PlanType,
    label: "Pro",
    price: 49,
    period: "per month",
    features: ["Unlimited leads", "Unlimited KB entries", "Advanced AI agent", "Auto follow-ups", "Invoice automation", "Priority support"],
    color: "from-blue-600 to-indigo-600",
    badge: "Most Popular",
  },
  {
    name: "BUSINESS" as PlanType,
    label: "Business",
    price: 149,
    period: "per month",
    features: ["Everything in Pro", "Multi-user access", "Custom AI persona", "White-label widget", "API access", "Dedicated success manager"],
    color: "from-purple-600 to-pink-600",
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("business");
  const { user, business, clearAllData } = useAppStore();

  const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { key: "business", label: "Business Profile", icon: <Building2 className="w-4 h-4" /> },
    { key: "ai", label: "AI Configuration", icon: <Bot className="w-4 h-4" /> },
    { key: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { key: "team", label: "Team Members", icon: <Users className="w-4 h-4" /> },
    { key: "billing", label: "Billing & Plan", icon: <CreditCard className="w-4 h-4" /> },
    { key: "data", label: "Data Management", icon: <Trash2 className="w-4 h-4" /> },
  ];

  return (
    <div className="page-content max-w-5xl flex flex-col gap-8">
      <div className="page-header pb-6 border-b border-white/8">
        <div>
          <h1 className="page-title text-2xl lg:text-3xl font-bold tracking-tight">
            <Settings className="w-6 h-6 text-blue-400" aria-hidden="true" />
            Workspace Settings
          </h1>
          <p className="page-subtitle text-slate-400 text-sm mt-1.5">
            Configure business identity, AI behavior, notification triggers, team roles, and subscription tier
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Tabs sidebar */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 bg-white/[0.02] p-2 rounded-2xl border border-white/6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left whitespace-nowrap ${
                  activeTab === t.key
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-8 lg:col-span-9 min-w-0">
          {activeTab === "business" && <BusinessSettings business={business} user={user} />}
          {activeTab === "ai" && <AISettings business={business} />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "team" && <TeamSettings user={user} />}
          {activeTab === "billing" && <BillingSettings currentPlan={business?.plan} />}
          {activeTab === "data" && <DataSettings onClearData={clearAllData} />}
        </div>
      </div>
    </div>
  );
}

function BusinessSettings({ business, user }: { business: any; user: any }) {
  const { updateBusiness } = useAppStore();
  const [name, setName] = useState(business?.name || "My Operations");
  const [industry, setIndustry] = useState(business?.industry || "Services");
  const [email, setEmail] = useState(business?.email || user?.email || "contact@mybusiness.com");
  const [phone, setPhone] = useState(business?.phone || "");
  const [website, setWebsite] = useState(business?.website || "");
  const [timezone, setTimezone] = useState(business?.timezone || "America/New_York");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    updateBusiness({ name, industry, email, phone, website, timezone });
    setIsSaving(false);
    toast.success("Business profile saved successfully");
  };

  return (
    <form onSubmit={handleSave} className="glass-card p-8 sm:p-10 rounded-2xl border border-white/8 shadow-md space-y-8">
      <div className="pb-5 border-b border-white/8">
        <h2 className="text-xl font-bold text-white tracking-tight">Business Profile</h2>
        <p className="text-xs text-slate-400 mt-1">Primary details used across client invoices, emails, and notifications</p>
      </div>

      {/* Business logo/avatar */}
      <div className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.025] border border-white/6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
          {name.charAt(0) || "B"}
        </div>
        <div>
          <p className="text-base font-bold text-slate-100">{name || "Unnamed Business"}</p>
          <p className="text-xs text-slate-400 mb-2.5">{industry || "Professional Services"}</p>
          <Button variant="ghost" size="sm" type="button" leftIcon={<Edit3 className="w-3.5 h-3.5" />} onClick={() => toast.info("Custom logo upload is enabled for this workspace")}>
            Change Workspace Icon
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input label="Business Name" value={name} onChange={(e) => setName(e.target.value)} required id="settings-biz-name" />
        <Input label="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} required id="settings-biz-ind" />
        <Input label="Business Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} leftElement={<Mail className="w-4 h-4 text-slate-400" />} required id="settings-biz-email" />
        <Input label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} leftElement={<Phone className="w-4 h-4 text-slate-400" />} placeholder="+1 (555) 000-0000" id="settings-biz-phone" />
        <Input label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} leftElement={<Globe className="w-4 h-4 text-slate-400" />} placeholder="https://mybusiness.com" id="settings-biz-site" />
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 block">Timezone</label>
          <select className="input-field text-sm h-11" value={timezone} onChange={(e) => setTimezone(e.target.value)} id="settings-biz-tz">
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Europe/Paris">Central European Time (CET)</option>
            <option value="Asia/Tokyo">Tokyo (JST)</option>
          </select>
        </div>
      </div>

      <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Avatar name={user?.name || "User"} size="md" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Account Owner</p>
            <p className="text-sm font-bold text-slate-200">{user?.name} · <span className="font-normal text-slate-400">{user?.email}</span></p>
          </div>
        </div>

        <Button variant="primary" size="md" type="submit" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}

function AISettings({ business }: { business: any }) {
  const { updateBusiness } = useAppStore();
  const [personaName, setPersonaName] = useState(business?.aiPersonaName || "Alex (AI)");
  const [greeting, setGreeting] = useState(
    business?.aiPersonaGreeting ||
      "Hi! Welcome. How can I help you today?"
  );
  const [style, setStyle] = useState("Professional");
  const [model, setModel] = useState("OpenAI (GPT-4o)");
  const [autoQualify, setAutoQualify] = useState(true);
  const [autoInvoiceFollowup, setAutoInvoiceFollowup] = useState(true);
  const [reengageNoShows, setReengageNoShows] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    updateBusiness({ aiPersonaName: personaName, aiPersonaGreeting: greeting });
    setIsSaving(false);
    toast.success("AI agent configuration saved");
  };

  return (
    <form onSubmit={handleSave} className="glass-card p-8 sm:p-10 rounded-2xl border border-white/8 shadow-md space-y-8">
      <div className="pb-5 border-b border-white/8">
        <h2 className="text-xl font-bold text-white tracking-tight">AI Agent Configuration</h2>
        <p className="text-xs text-slate-400 mt-1">Fine-tune the tone, engine, and autonomous automation triggers for your AI employee</p>
      </div>

      <div className="space-y-6">
        <Input
          label="AI Persona Name"
          value={personaName}
          onChange={(e) => setPersonaName(e.target.value)}
          placeholder="Alex (AI)"
          hint="The name shown to customers across chat widgets and booking portals"
          id="ai-persona-name"
        />
        <Textarea
          label="Greeting Message"
          value={greeting}
          onChange={(e) => setGreeting(e.target.value)}
          className="min-h-[100px]"
          hint="First message dispatched when a prospective customer visits your website"
          id="ai-greeting-msg"
        />

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5 block">Response Tone</label>
          <div className="grid grid-cols-3 gap-3">
            {["Professional", "Friendly", "Concise"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setStyle(t)}
                className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-all ${
                  style === t
                    ? "bg-blue-500/15 border-blue-500/35 text-blue-400 shadow-sm"
                    : "bg-white/[0.02] border-white/8 text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 block">LLM Engine</label>
          <select className="input-field text-sm h-11" value={model} onChange={(e) => setModel(e.target.value)} id="ai-model-select">
            <option value="OpenAI (GPT-4o)">OpenAI (GPT-4o) — Recommended</option>
            <option value="Anthropic (Claude 3.5 Sonnet)">Anthropic (Claude 3.5 Sonnet)</option>
            <option value="Google (Gemini 2.0 Flash)">Google (Gemini 2.0 Flash)</option>
            <option value="OpenRouter">OpenRouter (Custom BYOK)</option>
          </select>
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/6 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Autonomous AI Triggers</p>
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <p className="text-sm font-semibold text-slate-200">Auto-qualify inbound leads</p>
              <p className="text-xs text-slate-400 mt-0.5">AI automatically computes 0–100 score and assigns HOT/WARM/COLD tiers</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoQualify(!autoQualify)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${autoQualify ? "bg-blue-500" : "bg-slate-700"}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${autoQualify ? "left-7" : "left-1"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <p className="text-sm font-semibold text-slate-200">Automated invoice follow-ups</p>
              <p className="text-xs text-slate-400 mt-0.5">Dispatches polite follow-up reminders when invoices reach due date</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoInvoiceFollowup(!autoInvoiceFollowup)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${autoInvoiceFollowup ? "bg-blue-500" : "bg-slate-700"}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${autoInvoiceFollowup ? "left-7" : "left-1"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-200">No-show appointment re-engagement</p>
              <p className="text-xs text-slate-400 mt-0.5">AI schedules tailored outreach with rescheduling links for missed bookings</p>
            </div>
            <button
              type="button"
              onClick={() => setReengageNoShows(!reengageNoShows)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${reengageNoShows ? "bg-blue-500" : "bg-slate-700"}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${reengageNoShows ? "left-7" : "left-1"}`} />
            </button>
          </div>
        </div>

        <Input
          label="API Key (Optional / BYOK)"
          type="password"
          placeholder="sk-…"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          hint="Stored encrypted in local state. Leave blank to use built-in OpsAgent infrastructure."
          id="ai-api-key"
        />
      </div>

      <div className="pt-6 border-t border-white/8 flex justify-end">
        <Button variant="primary" size="md" type="submit" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
          Save AI Configuration
        </Button>
      </div>
    </form>
  );
}

function NotificationSettings() {
  const [preferences, setPreferences] = useState([
    { key: "new_lead", label: "New lead captured", desc: "Triggered immediately when a visitor completes the chat widget form", enabled: true },
    { key: "hot_lead", label: "Hot lead priority alert", desc: "When AI scores an inbound lead >80 based on budget and urgency", enabled: true },
    { key: "inv_overdue", label: "Invoice overdue alert", desc: "Notification dispatched when an unpaid invoice passes its due date", enabled: true },
    { key: "inv_paid", label: "Invoice payment received", desc: "Real-time payment confirmation when a client completes settlement", enabled: true },
    { key: "appt_noshow", label: "Appointment no-show notice", desc: "Alerted when a client fails to attend a confirmed consultation", enabled: true },
    { key: "appt_remind", label: "Appointment reminder confirmation", desc: "Confirmation when automated 24h reminders are delivered", enabled: false },
    { key: "weekly_digest", label: "Weekly operational digest", desc: "Executive KPI and financial summary delivered every Monday", enabled: true },
  ]);

  const toggle = (index: number) => {
    setPreferences((prev) => {
      const next = [...prev];
      next[index].enabled = !next[index].enabled;
      toast.info(`${next[index].label} ${next[index].enabled ? "enabled" : "disabled"}`);
      return next;
    });
  };

  return (
    <div className="glass-card p-8 sm:p-10 rounded-2xl border border-white/8 shadow-md space-y-8">
      <div className="pb-5 border-b border-white/8">
        <h2 className="text-xl font-bold text-white tracking-tight">Notification Preferences</h2>
        <p className="text-xs text-slate-400 mt-1">Configure email and in-app triggers for leads, billing, and scheduling</p>
      </div>

      <div className="space-y-4">
        {preferences.map((n, i) => (
          <div key={n.key} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.015] border border-white/5 hover:border-white/10 transition-colors">
            <div>
              <p className="text-sm font-semibold text-slate-200">{n.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => toggle(i)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ml-4 ${n.enabled ? "bg-blue-500" : "bg-slate-700"}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${n.enabled ? "left-7" : "left-1"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamSettings({ user }: { user: any }) {
  const [members, setMembers] = useState([
    { name: user?.name || "Operations Admin", email: user?.email || "admin@mybusiness.com", role: "OWNER", joined: "Active" },
  ]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      toast.error("Please enter a name and email");
      return;
    }
    setMembers((prev) => [
      ...prev,
      {
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: "ADMIN",
        joined: "Just now",
      },
    ]);
    setShowInvite(false);
    setInviteName("");
    setInviteEmail("");
    toast.success(`Invite sent to ${inviteEmail}`);
  };

  return (
    <div className="glass-card p-8 sm:p-10 rounded-2xl border border-white/8 shadow-md space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/8">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Team Members</h2>
          <p className="text-xs text-slate-400 mt-1">Manage team access and role-based permissions in this workspace</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Users className="w-4 h-4" />} onClick={() => setShowInvite(true)}>
          Invite Member
        </Button>
      </div>

      <div className="space-y-3.5">
        {members.map((m) => (
          <div key={m.email} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/6">
            <Avatar name={m.name} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-200 truncate">{m.name}</p>
              <p className="text-xs text-slate-400 truncate mt-0.5">{m.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`badge ${m.role === "OWNER" ? "badge-purple" : "badge-info"} px-3 py-1 text-xs font-semibold`}>
                {m.role === "OWNER" && <Crown className="w-3 h-3 mr-1" />}
                {m.role}
              </span>
              <p className="text-xs text-slate-500 font-mono hidden sm:block">{m.joined}</p>
            </div>
          </div>
        ))}
      </div>

      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md">
          <div className="glass-card w-full max-w-lg p-8 sm:p-10 rounded-2xl animate-scaleIn border border-white/12 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/8">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Invite Team Member</h3>
                <p className="text-xs text-slate-400 mt-0.5">Send an invitation to join this workspace</p>
              </div>
              <button onClick={() => setShowInvite(false)} className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/8 transition-colors" aria-label="Close dialog">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleInvite} className="space-y-5">
              <Input label="Name" placeholder="e.g. Jamie Smith" value={inviteName} onChange={(e) => setInviteName(e.target.value)} required id="invite-name" />
              <Input label="Email Address" type="email" placeholder="jamie@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required id="invite-email" />
              <div className="flex justify-end gap-3 pt-4 border-t border-white/8">
                <Button variant="ghost" size="md" type="button" onClick={() => setShowInvite(false)}>Cancel</Button>
                <Button variant="primary" size="md" type="submit">Send Invite</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BillingSettings({ currentPlan }: { currentPlan?: PlanType }) {
  const { updateBusiness } = useAppStore();

  const handleSelectPlan = (plan: PlanType) => {
    updateBusiness({ plan });
    toast.success(`Plan updated to ${plan}!`);
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 sm:p-10 rounded-2xl border border-white/8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/8">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Current Subscription</h2>
            <p className="text-xs text-slate-400 mt-1">Active Tier: <span className="text-white font-bold">{currentPlan || "PRO"}</span> · Renews next billing cycle</p>
          </div>
          <span className="badge badge-info flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold self-start sm:self-auto">
            <Star className="w-3.5 h-3.5" />
            Active Plan: {currentPlan || "PRO"}
          </span>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="ghost" size="md" onClick={() => toast.info("Stripe billing portal connected")}>Manage Billing</Button>
          <Button variant="ghost" size="md" onClick={() => toast.success("Invoices downloaded")}>Download Invoices</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = (currentPlan || "PRO") === plan.name;
          return (
            <div key={plan.name} className={`glass-card p-7 rounded-2xl relative overflow-hidden flex flex-col border ${isCurrent ? "!border-blue-500/45 shadow-xl shadow-blue-500/10 bg-white/[0.04]" : "border-white/8"}`}>
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-wide uppercase">
                  {plan.badge}
                </div>
              )}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} mb-4 flex items-center justify-center shadow-md`}>
                {plan.name === "FREE" ? <Zap className="w-5 h-5 text-white" /> : plan.name === "PRO" ? <Star className="w-5 h-5 text-white" /> : <Crown className="w-5 h-5 text-white" />}
              </div>
              <p className="text-lg font-bold text-white mb-1">{plan.label}</p>
              <p className="text-xs text-slate-400 mb-5">
                {plan.price === 0 ? "Free forever" : <><span className="text-2xl font-extrabold text-white">${plan.price}</span> <span className="text-slate-400">/{plan.period}</span></>}
              </p>
              <div className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              {isCurrent ? (
                <div className="w-full py-2.5 text-center text-xs font-bold text-blue-400 border border-blue-500/35 rounded-xl bg-blue-500/10">
                  Current Plan
                </div>
              ) : (
                <Button
                  variant={plan.name === "PRO" ? "primary" : "ghost"}
                  size="md"
                  className="w-full"
                  onClick={() => handleSelectPlan(plan.name)}
                >
                  {plan.price > 49 ? "Upgrade to Business" : "Switch Plan"}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DataSettings({ onClearData }: { onClearData: () => void }) {
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    onClearData();
    setConfirming(false);
    toast.success("Workspace reset to a clean slate");
  };

  return (
    <div className="glass-card p-8 sm:p-10 rounded-2xl border border-white/8 shadow-md space-y-8">
      <div className="pb-5 border-b border-white/8">
        <h2 className="text-xl font-bold text-white tracking-tight">Data & Storage Management</h2>
        <p className="text-xs text-slate-400 mt-1">Manage local workspace storage or reset all records to a clean slate</p>
      </div>

      <div className="p-6 rounded-2xl border border-red-500/25 bg-red-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-red-300 mb-1">Reset Workspace Data</p>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            Clears all locally stored active leads, invoices, bookings, and indexed knowledge base entries.
          </p>
        </div>
        {!confirming ? (
          <Button
            variant="ghost"
            size="md"
            className="!text-red-400 !border-red-500/30 hover:!bg-red-500/10 flex-shrink-0"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => setConfirming(true)}
          >
            Reset Data
          </Button>
        ) : (
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              className="!bg-red-600 hover:!bg-red-700 !border-red-600"
              onClick={handleReset}
            >
              Confirm Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
