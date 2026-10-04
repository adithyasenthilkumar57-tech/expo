"use client";
import { useState, useCallback } from "react";
import { getLeadStatusConfig, formatRelativeTime, formatCurrency } from "@/lib/utils";
import { Avatar, EmptyState, ProgressBar } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { toast } from "@/lib/toast";
import type { Lead, LeadStatus, Conversation, Message } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import {
  Users, Search, Bot, Clock, DollarSign,
  Phone, Mail, Tag, ChevronRight, Send, Flame, Thermometer,
  Snowflake, ArrowLeft, Zap, FileText, Calendar, X, Plus
} from "lucide-react";

type Tab = "all" | LeadStatus;

const STATUS_ICONS: Record<LeadStatus, React.ReactNode> = {
  HOT:  <Flame className="w-3 h-3" />,
  WARM: <Thermometer className="w-3 h-3" />,
  COLD: <Snowflake className="w-3 h-3" />,
};

const TABS: { key: Tab; label: string }[] = [
  { key: "all",  label: "All Leads" },
  { key: "HOT",  label: "Hot" },
  { key: "WARM", label: "Warm" },
  { key: "COLD", label: "Cold" },
];

export default function LeadsPage() {
  const { leads, conversations, addLead, updateLead, deleteLead, sendMessage, business } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isQualifyingAll, setIsQualifyingAll] = useState(false);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null;

  const counts: Record<Tab, number> = {
    all:  leads.length,
    HOT:  leads.filter((l) => l.status === "HOT").length,
    WARM: leads.filter((l) => l.status === "WARM").length,
    COLD: leads.filter((l) => l.status === "COLD").length,
  };

  const filtered = leads.filter((l) => {
    const matchTab = activeTab === "all" || l.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const selectedConv = selectedLead
    ? conversations.find((c) => c.leadId === selectedLead.id) ?? null
    : null;

  const handleAddLead = (newLeadData: { name: string; email: string; phone?: string; budget?: number; need?: string }) => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      businessId: business?.id || "biz-001",
      name: newLeadData.name,
      email: newLeadData.email,
      phone: newLeadData.phone,
      status: "WARM",
      source: "Manual",
      budget: newLeadData.budget,
      need: newLeadData.need,
      score: 65,
      tags: ["Direct"],
      lastContact: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    addLead(newLead);
    setShowAddModal(false);
    toast.success(`Lead ${newLead.name} added successfully`);
  };

  const handleQualifyAll = async () => {
    if (leads.length === 0) {
      toast.info("No leads to qualify. Add leads first.");
      return;
    }
    setIsQualifyingAll(true);
    await new Promise((r) => setTimeout(r, 1000));
    leads.forEach((l) => {
      if (l.budget && l.budget > 10000) {
        updateLead(l.id, { status: "HOT", score: Math.max(l.score, 90) });
      } else if (l.budget && l.budget >= 5000) {
        updateLead(l.id, { status: "WARM", score: Math.max(l.score, 70) });
      }
    });
    setIsQualifyingAll(false);
    toast.success("AI qualification complete. Lead scores and statuses updated.");
  };

  const handleUpdateStatus = (leadId: string, status: LeadStatus) => {
    updateLead(leadId, { status });
    toast.info(`Lead status updated to ${status}`);
  };

  const handleSend = useCallback(async () => {
    if (!newMessage.trim() || !selectedLead) return;
    const userText = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    sendMessage(selectedLead.id, userText, "USER");
    setIsSending(false);

    // Trigger AI response after 900ms
    setTimeout(() => {
      sendMessage(
        selectedLead.id,
        `Thanks for the update! I have noted "${userText}" and synced the details into your lead profile. Let me know if you need to generate an invoice or schedule a call.`,
        "AI"
      );
    }, 900);
  }, [newMessage, selectedLead, sendMessage]);

  if (selectedLead) {
    return (
      <LeadDetailView
        lead={selectedLead}
        conversation={selectedConv}
        onBack={() => setSelectedLeadId(null)}
        onUpdateStatus={(st) => handleUpdateStatus(selectedLead.id, st)}
        onDelete={() => {
          deleteLead(selectedLead.id);
          setSelectedLeadId(null);
          toast.info("Lead deleted");
        }}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        isSending={isSending}
        onSend={handleSend}
      />
    );
  }

  return (
    <div className="page-content flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-white/8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Users className="w-5 h-5" aria-hidden="true" />
            </div>
            Leads & Pipeline
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 font-normal leading-relaxed">
            AI-qualified leads and automated conversational sales threads
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {leads.length > 0 && (
            <Button
              variant="ghost"
              size="md"
              leftIcon={<Zap className="w-4 h-4" />}
              onClick={handleQualifyAll}
              isLoading={isQualifyingAll}
              id="ai-qualify-btn"
            >
              AI Qualify All
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
            id="add-lead-btn"
          >
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div
          className="flex items-center gap-1.5 bg-white/[0.03] rounded-2xl p-1.5 w-fit border border-white/8 overflow-x-auto max-w-full"
          role="tablist"
          aria-label="Lead filter tabs"
        >
          {TABS.map(({ key, label }) => {
            const count = counts[key];
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive ? "bg-white/12 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-white/4"
                }`}
              >
                {key !== "all" && STATUS_ICONS[key]}
                <span>{label}</span>
                <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-md font-mono font-bold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        {leads.length > 0 && (
          <div className="w-full md:w-80">
            <Input
              placeholder="Search leads by name, email, or need…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftElement={<Search className="w-4 h-4" />}
              rightElement={
                search ? (
                  <button
                    onClick={() => setSearch("")}
                    className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null
              }
              id="search-leads"
            />
          </div>
        )}
      </div>

      {/* Leads List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="No leads in pipeline yet"
          description={
            search
              ? "No leads matched your search query."
              : "Leads captured via your AI website widget or created manually will be organized here with automatic scoring."
          }
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAddModal(true)}
            >
              Add First Lead
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((lead) => {
            const s = getLeadStatusConfig(lead.status);
            return (
              <button
                key={lead.id}
                className="glass-card p-6 w-full text-left hover:border-blue-500/30 hover:bg-white/[0.035] hover:-translate-y-0.5 transition-all group cursor-pointer !rounded-2xl"
                onClick={() => setSelectedLeadId(lead.id)}
                aria-label={`View lead details for ${lead.name}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <Avatar name={lead.name} size="lg" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <p className="text-base font-bold text-slate-100 group-hover:text-white truncate">
                          {lead.name}
                        </p>
                        <span className={`badge ${s.className}`}>{s.label}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-1 font-normal">{lead.email}</p>
                    </div>
                  </div>

                  {/* AI Score */}
                  <div className="flex items-center gap-5 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-[10.5px] text-slate-500 font-bold uppercase tracking-wider">AI Score</p>
                      <p className={`text-lg font-extrabold font-mono ${lead.score >= 80 ? "text-emerald-400" : lead.score >= 50 ? "text-amber-400" : "text-slate-400"}`}>
                        {lead.score}/100
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-blue-500/20 transition-all">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                {/* Need & Meta */}
                {lead.need && (
                  <p className="text-xs text-slate-300 bg-white/[0.025] rounded-xl px-4 py-2.5 mb-4 border border-white/6 line-clamp-2 leading-relaxed">
                    &ldquo;{lead.need}&rdquo;
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-1 border-t border-white/5">
                  {lead.budget && (
                    <span className="flex items-center gap-1.5 font-bold text-slate-200 font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                      {formatCurrency(lead.budget)} budget
                    </span>
                  )}
                  {lead.timeline && (
                    <span className="flex items-center gap-1.5 text-slate-300 px-2.5 py-1 rounded-lg bg-white/5 border border-white/8">
                      <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      {lead.timeline}
                    </span>
                  )}
                  <span className="text-slate-500 ml-auto font-mono text-[11px]">
                    Last updated {formatRelativeTime(lead.lastContact)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddLead}
        />
      )}
    </div>
  );
}

/* ─── Add Lead Modal ─────────────────────────────────────────────────── */
function AddLeadModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (data: { name: string; email: string; phone?: string; budget?: number; need?: string }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [need, setNeed] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter a name and email address");
      return;
    }
    onAdd({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      budget: budget ? parseFloat(budget) : undefined,
      need: need.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-lead-title">
      <div className="glass-card w-full max-w-md p-6 animate-scaleIn">
        <div className="flex items-center justify-between mb-5">
          <h2 id="add-lead-title" className="text-base font-bold text-white">Add New Lead</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1" aria-label="Close dialog">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" placeholder="e.g., Jennifer Wu" value={name} onChange={(e) => setName(e.target.value)} required id="lead-name-input" />
          <Input label="Email Address" type="email" placeholder="jennifer@enterprise.com" value={email} onChange={(e) => setEmail(e.target.value)} required id="lead-email-input" />
          <Input label="Phone (Optional)" type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} id="lead-phone-input" />
          <Input label="Estimated Budget ($)" type="number" placeholder="10000" value={budget} onChange={(e) => setBudget(e.target.value)} id="lead-budget-input" />
          <Textarea label="Needs / Project Scope" placeholder="What are they looking for?" value={need} onChange={(e) => setNeed(e.target.value)} id="lead-need-input" className="min-h-[80px]" />
          <div className="flex justify-end gap-3 pt-3 border-t border-white/6">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit">Create Lead</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Lead Detail View ───────────────────────────────────────────────── */
function LeadDetailView({
  lead,
  conversation,
  onBack,
  onUpdateStatus,
  onDelete,
  newMessage,
  setNewMessage,
  isSending,
  onSend,
}: {
  lead: Lead;
  conversation: Conversation | null;
  onBack: () => void;
  onUpdateStatus: (s: LeadStatus) => void;
  onDelete: () => void;
  newMessage: string;
  setNewMessage: (v: string) => void;
  isSending: boolean;
  onSend: () => void;
}) {
  const statusCfg = getLeadStatusConfig(lead.status);

  return (
    <div className="page-content space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors group px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 w-fit"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
        Back to Leads
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Lead profile & info */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="glass-card p-7 !rounded-2xl">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/6">
              <Avatar name={lead.name} size="xl" />
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white truncate">{lead.name}</h2>
                <p className="text-xs text-slate-400 truncate mt-0.5 font-normal">{lead.email}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`badge ${statusCfg.className}`}>{statusCfg.label}</span>
                </div>
              </div>
            </div>

            {/* Status Selector */}
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Change Status</p>
              <div className="grid grid-cols-3 gap-2">
                {(["HOT", "WARM", "COLD"] as LeadStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(st)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      lead.status === st
                        ? "bg-white/15 border-white/30 text-white shadow-sm"
                        : "bg-white/[0.02] border-white/6 text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Score */}
            <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  AI Lead Score
                </span>
                <span className="text-base font-extrabold font-mono text-white">{lead.score}/100</span>
              </div>
              <ProgressBar value={lead.score} variant={lead.score >= 80 ? "success" : lead.score >= 50 ? "warning" : "default"} />
            </div>

            {/* Metadata list */}
            <div className="space-y-3.5 text-xs mb-6">
              {lead.phone && (
                <div className="flex items-center gap-3 text-slate-300 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="font-mono">{lead.phone}</span>
                </div>
              )}
              {lead.budget && (
                <div className="flex items-center gap-3 text-slate-300 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <DollarSign className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-bold text-slate-100 font-mono">{formatCurrency(lead.budget)} estimated budget</span>
                </div>
              )}
              {lead.timeline && (
                <div className="flex items-center gap-3 text-slate-300 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>Timeline: {lead.timeline}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-slate-300 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                <Tag className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Source: {lead.source}</span>
              </div>
            </div>

            <Button variant="danger" size="md" className="w-full" onClick={onDelete}>
              Delete Lead
            </Button>
          </div>
        </div>

        {/* Right Column: Live Conversation Thread */}
        <div className="lg:col-span-2">
          <div className="glass-card flex flex-col h-[650px] !rounded-2xl">
            {/* Thread Header */}
            <div className="p-5 border-b border-white/6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white">AI Conversation History</span>
                  <p className="text-[11px] text-slate-400">Live thread between lead & OpsAgent AI</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/8">
                {conversation?.messages.length || 0} messages
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!conversation || conversation.messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Bot className="w-8 h-8 text-slate-500 mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-slate-300 mb-1">No message history yet</p>
                  <p className="text-xs text-slate-500">Send an initial response below or let the AI engage on website visit.</p>
                </div>
              ) : (
                conversation.messages.map((m) => {
                  const isAI = m.sender === "AI";
                  const isUser = m.sender === "USER";
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 mb-1.5 px-1">
                        <span className="text-xs font-bold text-slate-300">
                          {m.senderName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {formatRelativeTime(m.createdAt)}
                        </span>
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                          isUser
                            ? "bg-blue-600 text-white rounded-br-sm shadow-lg shadow-blue-600/20"
                            : isAI
                            ? "bg-white/[0.06] text-slate-200 border border-white/10 rounded-bl-sm"
                            : "bg-white/[0.03] text-slate-300 border border-white/6 rounded-bl-sm"
                        }`}
                      >
                        {m.content}
                      </div>
                      {m.agentAction && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-blue-400 font-mono px-1">
                          <Zap className="w-3 h-3" />
                          {m.agentAction}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Send Input */}
            <div className="p-4 border-t border-white/6 bg-white/[0.015]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSend();
                }}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Type a message or instruction for the AI agent…"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                  id="lead-reply-input"
                />
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  isLoading={isSending}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
