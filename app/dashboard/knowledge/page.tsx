"use client";
import { useState } from "react";
import { mockKnowledgeBase } from "@/lib/mock-data";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { EmptyState } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import type { KnowledgeBaseEntry } from "@/lib/types";
import {
  BookOpen, Plus, Search, Bot, Trash2, Edit3, CheckCircle,
  Zap, RefreshCw, ChevronDown, ChevronUp, BarChart2, Eye
} from "lucide-react";

const CATEGORIES = ["All", "Services", "Pricing", "Process", "Team", "Policy"];

export default function KnowledgePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [previewQ, setPreviewQ] = useState("");
  const [previewA, setPreviewA] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = mockKnowledgeBase.filter(kb => {
    const matchesCat = category === "All" || kb.category === category;
    const matchesSearch = !search || kb.question.toLowerCase().includes(search.toLowerCase()) || kb.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch && kb.isActive;
  });

  const handlePreview = async () => {
    if (!previewQ.trim()) return;
    setIsPreviewing(true);
    await new Promise(r => setTimeout(r, 1500));
    // Simulate AI response based on KB
    const relevant = mockKnowledgeBase.find(kb =>
      kb.question.toLowerCase().includes(previewQ.toLowerCase().split(" ")[0])
    );
    setPreviewA(relevant?.answer || "Based on my knowledge base, I don't have a specific answer to that question yet. Please add more entries to improve my responses.");
    setIsPreviewing(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            Knowledge Base
          </h1>
          <p className="text-sm text-slate-500">FAQs and business context that power the AI agent&apos;s responses</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowAdd(true)}>
          Add Entry
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Entries", value: mockKnowledgeBase.length, icon: <BookOpen className="w-4 h-4" />, color: "text-blue-400" },
          { label: "Total AI Uses", value: mockKnowledgeBase.reduce((s, k) => s + k.usageCount, 0), icon: <BarChart2 className="w-4 h-4" />, color: "text-purple-400" },
          { label: "Active Entries", value: mockKnowledgeBase.filter(k => k.isActive).length, icon: <CheckCircle className="w-4 h-4" />, color: "text-emerald-400" },
        ].map(item => (
          <div key={item.label} className="glass-card p-4 flex items-center gap-3">
            <div className={`${item.color} flex-shrink-0`}>{item.icon}</div>
            <div>
              <p className="text-xl font-bold text-white">{item.value}</p>
              <p className="text-xs text-slate-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Knowledge entries */}
        <div className="lg:col-span-2">
          {/* Search & filter */}
          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Search knowledge base…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftElement={<Search className="w-4 h-4" />}
              className="flex-1"
            />
            <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/8">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${category === cat ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Add form */}
          {showAdd && (
            <div className="glass-card p-5 mb-4 !border-blue-500/25">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                New Knowledge Entry
              </h3>
              <div className="flex flex-col gap-3">
                <Input label="Question" placeholder="What services do you offer?" />
                <Textarea label="Answer" placeholder="We offer four core service areas…" className="min-h-[120px]" />
                <div className="flex gap-3">
                  <select className="input-field flex-1 text-sm">
                    {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
                  </select>
                  <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button variant="primary" leftIcon={<CheckCircle className="w-3.5 h-3.5" />}>Save Entry</Button>
                </div>
              </div>
            </div>
          )}

          {/* Entry list */}
          {filtered.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="w-6 h-6" />}
              title="No entries found"
              description="Add FAQ entries so the AI can answer customer questions accurately."
              action={<Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowAdd(true)}>Add First Entry</Button>}
            />
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map(entry => (
                <KBEntryCard
                  key={entry.id}
                  entry={entry}
                  expanded={expanded === entry.id}
                  onToggle={() => setExpanded(expanded === entry.id ? null : entry.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* AI Preview panel */}
        <div>
          <div className="glass-card p-5 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">AI Preview</p>
                <p className="text-[11px] text-slate-500">Test how AI responds</p>
              </div>
            </div>

            <Textarea
              placeholder="Ask a sample question…"
              value={previewQ}
              onChange={e => setPreviewQ(e.target.value)}
              className="min-h-[80px] mb-3"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handlePreview}
              isLoading={isPreviewing}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
              className="w-full mb-4"
            >
              {isPreviewing ? "AI Thinking…" : "Preview Response"}
            </Button>

            {previewA && (
              <div className="chat-bubble-ai p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[11px] text-blue-400 font-medium">AI Agent Response</span>
                </div>
                <p className="text-sm text-slate-200 whitespace-pre-wrap">{previewA}</p>
              </div>
            )}

            {!previewA && (
              <div className="rounded-xl bg-white/3 border border-white/8 p-4 text-center">
                <Bot className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-600">Ask a question to see how the AI would respond based on your knowledge base</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KBEntryCard({ entry, expanded, onToggle }: { entry: KnowledgeBaseEntry; expanded: boolean; onToggle: () => void }) {
  return (
    <div className={`glass-card cursor-pointer ${expanded ? "!border-blue-500/25" : ""}`}>
      <div className="p-4 flex items-center justify-between" onClick={onToggle}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          <p className="text-sm font-medium text-slate-200 truncate">{entry.question}</p>
        </div>
        <div className="flex items-center gap-3 ml-3 flex-shrink-0">
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/8 border border-white/10 text-slate-500">{entry.category}</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-600">
            <Eye className="w-3 h-3" />
            {entry.usageCount}
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/8 pt-3">
          <p className="text-sm text-slate-400 mb-4">{entry.answer}</p>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-slate-600">Updated {formatRelativeTime(entry.updatedAt)}</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" leftIcon={<Edit3 className="w-3 h-3" />}>Edit</Button>
              <Button variant="danger" size="sm" leftIcon={<Trash2 className="w-3 h-3" />}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
