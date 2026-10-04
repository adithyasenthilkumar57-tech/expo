"use client";
import { useState } from "react";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { EmptyState } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { toast } from "@/lib/toast";
import type { KnowledgeBaseEntry } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import {
  BookOpen, Plus, Search, Bot, Trash2, Edit3, CheckCircle,
  Zap, RefreshCw, ChevronDown, ChevronUp, BarChart2, Eye, X
} from "lucide-react";

const CATEGORIES = ["All", "Services", "Pricing", "Process", "Team", "Policy"];

export default function KnowledgePage() {
  const { knowledgeBase, addKnowledge, deleteKnowledge, business } = useAppStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [newCat, setNewCat] = useState("Services");
  const [previewQ, setPreviewQ] = useState("");
  const [previewA, setPreviewA] = useState("");
  const [matchedSource, setMatchedSource] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = knowledgeBase.filter((kb) => {
    const matchesCat = category === "All" || kb.category === category;
    const matchesSearch =
      !search ||
      kb.question.toLowerCase().includes(search.toLowerCase()) ||
      kb.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch && kb.isActive;
  });

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ.trim() || !newA.trim()) {
      toast.error("Please provide both a question and answer");
      return;
    }
    const newEntry: KnowledgeBaseEntry = {
      id: `kb-${Date.now()}`,
      businessId: business?.id || "biz-001",
      question: newQ.trim(),
      answer: newA.trim(),
      category: newCat,
      isActive: true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addKnowledge(newEntry);
    setNewQ("");
    setNewA("");
    setShowAdd(false);
    toast.success("Knowledge base entry created and indexed for AI");
  };

  const handleDelete = (id: string, qText: string) => {
    deleteKnowledge(id);
    toast.info(`Deleted entry: "${qText.substring(0, 30)}…"`);
  };

  const handlePreview = async () => {
    if (!previewQ.trim()) return;
    setIsPreviewing(true);
    setMatchedSource(null);
    await new Promise((r) => setTimeout(r, 700));

    const qLower = previewQ.toLowerCase();
    const words = qLower.split(" ").filter((w) => w.length > 3);

    const relevant = knowledgeBase.find((kb) => {
      const q = kb.question.toLowerCase();
      const a = kb.answer.toLowerCase();
      return (
        q.includes(qLower) ||
        words.some((w) => q.includes(w) || a.includes(w))
      );
    });

    if (relevant) {
      setPreviewA(relevant.answer);
      setMatchedSource(`Source: "${relevant.question}" (${relevant.category})`);
    } else {
      setPreviewA(
        knowledgeBase.length === 0
          ? "No knowledge base entries exist yet. Add FAQ entries about your services and pricing above to train the AI agent."
          : "Based on the knowledge base, I do not have a specific policy or answer for that yet. Would you like me to connect you with our operations team directly?"
      );
      setMatchedSource(null);
    }
    setIsPreviewing(false);
  };

  return (
    <div className="page-content flex flex-col gap-8">
      {/* Header */}
      <div className="page-header pb-6 border-b border-white/8">
        <div>
          <h1 className="page-title text-2xl lg:text-3xl font-bold tracking-tight">
            <BookOpen className="w-6 h-6 text-blue-400" aria-hidden="true" />
            Knowledge Base & RAG
          </h1>
          <p className="page-subtitle text-slate-400 text-sm mt-1.5">
            Manage FAQs, services, and operational context that power the AI agent&apos;s real-time client responses
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAdd(true)}
          id="add-kb-btn"
        >
          Add Knowledge Entry
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Indexed FAQ Entries", value: knowledgeBase.length, icon: <BookOpen className="w-5 h-5" />, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
          { label: "Total AI Grounded Queries", value: knowledgeBase.reduce((s, k) => s + k.usageCount, 0), icon: <BarChart2 className="w-5 h-5" />, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
          { label: "Active Context Sources", value: knowledgeBase.filter((k) => k.isActive).length, icon: <CheckCircle className="w-5 h-5" />, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
        ].map((item) => (
          <div key={item.label} className="glass-card p-6 rounded-2xl flex items-center gap-4 border border-white/8">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${item.color} ${item.bg}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-white tracking-tight">{item.value}</p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Knowledge entries */}
        <div className="lg:col-span-8 space-y-6">
          {/* Search & filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search knowledge questions or answers…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftElement={<Search className="w-4 h-4 text-slate-400" />}
                rightElement={
                  search ? (
                    <button onClick={() => setSearch("")} className="text-slate-500 hover:text-slate-300 p-1" aria-label="Clear search">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : null
                }
                id="search-kb-input"
              />
            </div>
            <div className="flex gap-1.5 bg-white/[0.03] rounded-xl p-1.5 border border-white/8 overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    category === cat
                      ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Add form */}
          {showAdd && (
            <div className="glass-card p-8 rounded-2xl !border-blue-500/30 shadow-2xl animate-scaleIn">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/8">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-blue-400" />
                    New Knowledge Entry
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Teach your AI agent how to reply to specific questions</p>
                </div>
                <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/8 transition-colors" aria-label="Close add form">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAddEntry} className="space-y-5">
                <Input
                  label="Question or Topic Title"
                  placeholder="e.g., What are your consulting package rates?"
                  value={newQ}
                  onChange={(e) => setNewQ(e.target.value)}
                  required
                  id="kb-new-q"
                />
                <Textarea
                  label="Answer / Instructions for AI Agent"
                  placeholder="e.g., Starter audits begin at $3,000. Pro engagements range from $5,000–$15,000 depending on scope…"
                  value={newA}
                  onChange={(e) => setNewA(e.target.value)}
                  className="min-h-[120px]"
                  required
                  id="kb-new-a"
                />
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-white/8">
                  <div className="w-full sm:w-56">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">Category</label>
                    <select
                      className="input-field text-sm w-full h-11"
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value)}
                      id="kb-new-cat"
                    >
                      {CATEGORIES.slice(1).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto justify-end">
                    <Button variant="ghost" size="md" type="button" onClick={() => setShowAdd(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="md" type="submit" leftIcon={<CheckCircle className="w-4 h-4" />}>
                      Save Entry
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Entry list */}
          {filtered.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="w-7 h-7" />}
              title="No knowledge base entries yet"
              description="Add FAQ entries, pricing policies, and service descriptions so the AI agent can answer customer inquiries accurately."
              action={
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowAdd(true)}
                >
                  Add First Entry
                </Button>
              }
            />
          ) : (
            <div className="space-y-3.5">
              {filtered.map((entry) => (
                <KBEntryCard
                  key={entry.id}
                  entry={entry}
                  expanded={expanded === entry.id}
                  onToggle={() => setExpanded(expanded === entry.id ? null : entry.id)}
                  onDelete={() => handleDelete(entry.id, entry.question)}
                />
              ))}
            </div>
          )}
        </div>

        {/* AI Preview panel */}
        <div className="lg:col-span-4">
          <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/8 sticky top-6 space-y-5">
            <div className="flex items-center gap-3.5 pb-4 border-b border-white/8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-white">AI Live RAG Tester</p>
                <p className="text-xs text-slate-400">Test how the AI retrieves knowledge in real time</p>
              </div>
            </div>

            <Textarea
              placeholder="Ask a customer question (e.g. How much do services cost?)"
              value={previewQ}
              onChange={(e) => setPreviewQ(e.target.value)}
              className="min-h-[90px]"
              id="rag-test-input"
            />
            <Button
              variant="primary"
              size="md"
              onClick={handlePreview}
              isLoading={isPreviewing}
              leftIcon={<Zap className="w-4 h-4" />}
              className="w-full"
            >
              {isPreviewing ? "Querying Knowledge Base…" : "Test AI Query"}
            </Button>

            {previewA && (
              <div className="chat-bubble-ai p-5 rounded-2xl space-y-3 border border-blue-500/20 bg-blue-500/5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-blue-400 font-semibold">AI Agent Response</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-mono font-medium">
                    Grounded RAG
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{previewA}</p>
                {matchedSource && (
                  <p className="text-[11px] text-slate-400 italic pt-2 border-t border-white/6 font-mono">
                    {matchedSource}
                  </p>
                )}
              </div>
            )}

            {!previewA && (
              <div className="rounded-xl bg-white/[0.02] border border-white/6 p-6 text-center">
                <Bot className="w-8 h-8 text-slate-600 mx-auto mb-2.5 opacity-60" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter a question above to preview how the AI agent retrieves and cites your indexed knowledge base.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KBEntryCard({
  entry,
  expanded,
  onToggle,
  onDelete,
}: {
  entry: KnowledgeBaseEntry;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={`glass-card rounded-2xl transition-all border border-white/8 shadow-sm ${expanded ? "!border-blue-500/35 bg-white/[0.035]" : "hover:border-white/16"}`}>
      <div className="p-5 sm:p-6 flex items-center justify-between cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
          <p className="text-sm sm:text-base font-semibold text-slate-100 truncate">{entry.question}</p>
        </div>
        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-white/8 border border-white/10 text-slate-300 font-medium">
            {entry.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Eye className="w-3.5 h-3.5" />
            {entry.usageCount}
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-6 border-t border-white/6 pt-4 space-y-4 animate-fadeIn">
          <p className="text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">{entry.answer}</p>
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-slate-400">Updated {formatRelativeTime(entry.updatedAt)}</p>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Delete Entry
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
