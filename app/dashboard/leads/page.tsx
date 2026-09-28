"use client";
import { useState } from "react";
import { mockLeads, mockConversations } from "@/lib/mock-data";
import { getLeadStatusConfig, formatRelativeTime, formatCurrency, formatDate } from "@/lib/utils";
import { Avatar, Card, EmptyState, Badge, ProgressBar } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Lead, LeadStatus, Conversation, Message } from "@/lib/types";
import {
  Users, Search, Filter, Bot, User, Clock, DollarSign,
  Phone, Mail, Tag, ChevronRight, Send, Flame, Thermometer,
  Snowflake, ArrowLeft, Zap, CheckCircle, UserCheck
} from "lucide-react";

type Tab = "all" | "HOT" | "WARM" | "COLD";

const statusIcons: Record<LeadStatus, React.ReactNode> = {
  HOT: <Flame className="w-3 h-3" />,
  WARM: <Thermometer className="w-3 h-3" />,
  COLD: <Snowflake className="w-3 h-3" />,
};

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const filtered = mockLeads.filter((l) => {
    const matchesTab = activeTab === "all" || l.status === activeTab;
    const matchesSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    all: mockLeads.length,
    HOT: mockLeads.filter((l) => l.status === "HOT").length,
    WARM: mockLeads.filter((l) => l.status === "WARM").length,
    COLD: mockLeads.filter((l) => l.status === "COLD").length,
  };

  const selectedConv = selectedLead
    ? mockConversations.find((c) => c.leadId === selectedLead.id)
    : null;

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setNewMessage("");
    setIsSending(false);
  };

  if (selectedLead) {
    return <LeadDetailView lead={selectedLead} conversation={selectedConv || null} onBack={() => setSelectedLead(null)} newMessage={newMessage} setNewMessage={setNewMessage} isSending={isSending} onSend={handleSendMessage} />;
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Leads & Inbox
          </h1>
          <p className="text-sm text-slate-500">AI-qualified leads and conversation threads</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Zap className="w-3.5 h-3.5" />}>
          AI Qualify All
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 bg-white/3 rounded-xl p-1 w-fit border border-white/8">
        {(["all", "HOT", "WARM", "COLD"] as Tab[]).map((tab) => {
          const labels: Record<Tab, string> = { all: "All Leads", HOT: "Hot", WARM: "Warm", COLD: "Cold" };
          const colors: Record<Tab, string> = {
            all: "text-slate-300",
            HOT: "text-red-400",
            WARM: "text-amber-400",
            COLD: "text-blue-400",
          };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === tab ? "bg-white/10 text-white" : `${colors[tab]} hover:bg-white/5`}`}
            >
              {tab !== "all" && statusIcons[tab as LeadStatus]}
              {labels[tab]}
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-md">{counts[tab]}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search leads by name, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftElement={<Search className="w-4 h-4" />}
          className="max-w-sm"
        />
      </div>

      {/* Lead grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No leads found"
          description="Adjust your filters or wait for new leads to come through the widget."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onClick={() => setSelectedLead(lead)} />
          ))}
        </div>
      )}
    </div>
  );
}

function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  const status = getLeadStatusConfig(lead.status);

  return (
    <div
      className="glass-card p-4 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={lead.name} size="md" />
          <div>
            <p className="text-sm font-semibold text-slate-100 group-hover:text-white">{lead.name}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {lead.email}
            </p>
          </div>
        </div>
        <span className={`badge ${status.className} flex items-center gap-1`}>
          {statusIcons[lead.status]}
          {status.label}
        </span>
      </div>

      {/* Score bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-slate-500">Lead Score</span>
          <span className="font-semibold" style={{ color: lead.score >= 80 ? "#EF4444" : lead.score >= 60 ? "#F59E0B" : "#3B82F6" }}>{lead.score}/100</span>
        </div>
        <ProgressBar value={lead.score} />
      </div>

      {lead.need && (
        <p className="text-xs text-slate-400 mb-3 line-clamp-2 bg-white/3 rounded-lg px-2.5 py-2">{lead.need}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          {lead.budget && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {formatCurrency(lead.budget)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(lead.lastContact)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
          View <ChevronRight className="w-3 h-3" />
        </div>
      </div>

      {lead.tags.length > 0 && (
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          {lead.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-slate-500">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function LeadDetailView({
  lead, conversation, onBack, newMessage, setNewMessage, isSending, onSend
}: {
  lead: Lead;
  conversation: Conversation | null;
  onBack: () => void;
  newMessage: string;
  setNewMessage: (v: string) => void;
  isSending: boolean;
  onSend: () => void;
}) {
  const status = getLeadStatusConfig(lead.status);

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Leads
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Lead info sidebar */}
        <div className="flex flex-col gap-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={lead.name} size="lg" />
              <div>
                <h2 className="text-base font-bold text-white">{lead.name}</h2>
                <span className={`badge ${status.className} flex items-center gap-1 w-fit mt-1`}>
                  {statusIcons[lead.status]}{status.label}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-slate-600" />
                {lead.email}
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Phone className="w-4 h-4 text-slate-600" />
                  {lead.phone}
                </div>
              )}
              {lead.budget && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <DollarSign className="w-4 h-4 text-slate-600" />
                  Budget: <span className="text-slate-200 font-medium">{formatCurrency(lead.budget)}</span>
                </div>
              )}
              {lead.timeline && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="w-4 h-4 text-slate-600" />
                  Timeline: <span className="text-slate-200 font-medium">{lead.timeline}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Tag className="w-4 h-4 text-slate-600" />
                Source: <span className="text-slate-200 font-medium">{lead.source}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/8">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500">Lead Score</span>
                <span className="font-bold text-slate-200">{lead.score}/100</span>
              </div>
              <ProgressBar value={lead.score} />
            </div>
          </div>

          {lead.need && (
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Need</p>
              <p className="text-sm text-slate-300">{lead.need}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button variant="primary" size="sm" leftIcon={<Bot className="w-3.5 h-3.5" />} className="w-full">AI Follow-Up</Button>
            <Button variant="ghost" size="sm" leftIcon={<FileIcon className="w-3.5 h-3.5" />} className="w-full">Create Invoice</Button>
            <Button variant="ghost" size="sm" leftIcon={<CalendarIcon className="w-3.5 h-3.5" />} className="w-full">Schedule Appointment</Button>
          </div>
        </div>

        {/* Conversation thread */}
        <div className="lg:col-span-2 glass-card flex flex-col" style={{ height: "calc(100vh - 200px)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <div>
              <h3 className="text-sm font-semibold text-white">Conversation Thread</h3>
              {conversation && (
                <p className="text-xs text-slate-500">
                  {conversation.aiHandled ? "AI-handled" : "Manual"} · {conversation.messages.length} messages
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <Bot className="w-3 h-3" />
              AI Active
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
            {conversation?.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {!conversation && (
              <EmptyState
                icon={<Bot className="w-5 h-5" />}
                title="No messages yet"
                description="The AI will respond automatically when this lead reaches out."
              />
            )}
          </div>

          <div className="p-4 border-t border-white/8">
            <div className="flex items-center gap-2">
              <input
                className="input-field flex-1"
                placeholder="Type a message or let AI handle it…"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
              />
              <Button
                variant="primary"
                size="sm"
                onClick={onSend}
                isLoading={isSending}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Send
              </Button>
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5 text-center">
              AI will auto-reply unless you&apos;ve taken over this conversation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isAI = message.sender === "AI";
  const isUser = message.sender === "USER";
  const isCustomer = message.sender === "CUSTOMER";

  return (
    <div className={`flex gap-3 ${isUser || isAI ? "justify-end" : "justify-start"}`}>
      {isCustomer && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-1">
          {message.senderName.charAt(0)}
        </div>
      )}
      <div className={`max-w-[75%]`}>
        <div className={`${isAI ? "chat-bubble-ai" : isCustomer ? "bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm" : "chat-bubble-user"} px-4 py-2.5`}>
          <p className="text-sm text-slate-100 whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={`flex items-center gap-2 mt-1 ${isUser || isAI ? "justify-end" : "justify-start"}`}>
          {isAI && (
            <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
              <Bot className="w-2.5 h-2.5" /> AI Agent
            </span>
          )}
          <span className="text-[10px] text-slate-600">{formatRelativeTime(message.createdAt)}</span>
          {message.agentAction && (
            <span className="text-[10px] text-blue-500/70 italic">· {message.agentAction}</span>
          )}
        </div>
      </div>
      {(isAI) && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
      )}
    </div>
  );
}

// Mini icon components to avoid import conflicts
function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
