"use client";
import { useState } from "react";
import { mockInvoices } from "@/lib/mock-data";
import { formatCurrency, formatDate, getInvoiceStatusConfig, formatRelativeTime } from "@/lib/utils";
import { Avatar, EmptyState, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import type { Invoice, InvoiceStatus } from "@/lib/types";
import {
  FileText, Plus, Search, Send, Eye, CheckCircle, AlertCircle,
  Clock, DollarSign, ArrowLeft, Trash2, Download, Bot, Mail, ChevronDown, X
} from "lucide-react";

type Tab = "all" | InvoiceStatus;

export default function InvoicesPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = mockInvoices.filter((inv) => {
    const matchesTab = tab === "all" || inv.status === tab;
    const matchesSearch = !search || inv.clientName.toLowerCase().includes(search.toLowerCase()) || inv.number.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "DRAFT", label: "Draft" },
    { key: "SENT", label: "Sent" },
    { key: "VIEWED", label: "Viewed" },
    { key: "OVERDUE", label: "Overdue" },
    { key: "PAID", label: "Paid" },
  ];

  const totals = {
    pending: mockInvoices.filter(i => ["SENT", "VIEWED"].includes(i.status)).reduce((s, i) => s + i.total, 0),
    overdue: mockInvoices.filter(i => i.status === "OVERDUE").reduce((s, i) => s + i.total, 0),
    paid: mockInvoices.filter(i => i.status === "PAID").reduce((s, i) => s + i.total, 0),
  };

  if (showCreate) return <CreateInvoiceForm onClose={() => setShowCreate(false)} />;
  if (selected) return <InvoiceDetail invoice={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Invoices
          </h1>
          <p className="text-sm text-slate-500">Create, send, and track client invoices</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowCreate(true)}>
          New Invoice
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Pending Payment", value: totals.pending, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
          { label: "Overdue", value: totals.overdue, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
          { label: "Collected (Month)", value: totals.paid, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
        ].map((item) => (
          <div key={item.label} className={`glass-card p-4 border ${item.bg}`}>
            <p className="text-xs text-slate-500 mb-1">{item.label}</p>
            <p className={`text-xl font-bold ${item.color}`}>{formatCurrency(item.value)}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 flex-wrap">
        {tabs.map((t) => {
          const count = t.key === "all" ? mockInvoices.length : mockInvoices.filter(i => i.status === t.key).length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}
            >
              {t.label} {count > 0 && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-md ml-1">{count}</span>}
            </button>
          );
        })}
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search by client name or invoice number…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftElement={<Search className="w-4 h-4" />}
          className="max-w-sm"
        />
      </div>

      {/* Invoice table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Follow-ups</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500 text-sm">No invoices found</td>
              </tr>
            ) : filtered.map((inv) => {
              const statusCfg = getInvoiceStatusConfig(inv.status);
              return (
                <tr key={inv.id} className="hover:bg-white/3 transition-colors cursor-pointer" onClick={() => setSelected(inv)}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-200">{inv.number}</p>
                    <p className="text-xs text-slate-500">{formatDate(inv.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={inv.clientName} size="sm" />
                      <div>
                        <p className="text-sm text-slate-200">{inv.clientName}</p>
                        <p className="text-xs text-slate-500">{inv.clientEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-100">{formatCurrency(inv.total)}</p>
                    <p className="text-xs text-slate-500">{inv.items.length} item{inv.items.length !== 1 ? "s" : ""}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className={`text-sm ${inv.status === "OVERDUE" ? "text-red-400 font-medium" : "text-slate-300"}`}>
                      {formatDate(inv.dueDate)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${statusCfg.className}`}>{statusCfg.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs text-slate-400">{inv.followUpCount} sent</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-slate-600 hover:text-blue-400 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InvoiceDetail({ invoice, onBack }: { invoice: Invoice; onBack: () => void }) {
  const statusCfg = getInvoiceStatusConfig(invoice.status);

  return (
    <div className="p-6 lg:p-8 max-w-[900px] mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Invoices
      </button>

      <div className="glass-card p-6">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-white">{invoice.number}</h2>
              <span className={`badge ${statusCfg.className}`}>{statusCfg.label}</span>
            </div>
            <p className="text-sm text-slate-500">Created {formatDate(invoice.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            {invoice.status === "DRAFT" && (
              <Button variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>Send Invoice</Button>
            )}
            {invoice.status === "OVERDUE" && (
              <Button variant="ghost" size="sm" leftIcon={<Bot className="w-3.5 h-3.5" />}>AI Follow-Up</Button>
            )}
            {["SENT", "VIEWED"].includes(invoice.status) && (
              <Button variant="success" size="sm" leftIcon={<CheckCircle className="w-3.5 h-3.5" />}>Mark Paid</Button>
            )}
            <Button variant="ghost" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>PDF</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Bill To</p>
            <p className="text-sm font-semibold text-slate-100">{invoice.clientName}</p>
            <p className="text-sm text-slate-400">{invoice.clientEmail}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Due Date</p>
            <p className={`text-sm font-semibold ${invoice.status === "OVERDUE" ? "text-red-400" : "text-slate-100"}`}>
              {formatDate(invoice.dueDate)}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-0 mb-8">
          {[
            { label: "Created", date: invoice.createdAt, done: true },
            { label: "Sent", date: invoice.sentAt, done: !!invoice.sentAt },
            { label: "Viewed", date: invoice.viewedAt, done: !!invoice.viewedAt },
            { label: "Paid", date: invoice.paidAt, done: !!invoice.paidAt },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step.done ? "bg-blue-500 text-white" : "bg-white/10 text-slate-600"}`}>
                  {step.done ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <p className={`text-[10px] font-medium ${step.done ? "text-slate-300" : "text-slate-600"}`}>{step.label}</p>
                {step.date && <p className="text-[9px] text-slate-600">{formatDate(step.date, { month: "short", day: "numeric" })}</p>}
              </div>
              {i < 3 && <div className={`h-[1px] flex-1 ${step.done ? "bg-blue-500/40" : "bg-white/8"}`} />}
            </div>
          ))}
        </div>

        {/* Items */}
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left py-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">Description</th>
              <th className="text-center py-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">Qty</th>
              <th className="text-right py-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">Unit Price</th>
              <th className="text-right py-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="py-3 text-sm text-slate-300">{item.description}</td>
                <td className="py-3 text-sm text-slate-400 text-center">{item.quantity}</td>
                <td className="py-3 text-sm text-slate-400 text-right">{formatCurrency(item.unitPrice)}</td>
                <td className="py-3 text-sm font-medium text-slate-200 text-right">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span>Tax (8%)</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
              <span>Total</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {invoice.followUpCount > 0 && (
          <div className="mt-6 p-3 rounded-xl bg-blue-500/8 border border-blue-500/15">
            <div className="flex items-center gap-2 text-xs text-blue-400">
              <Bot className="w-3.5 h-3.5" />
              AI sent {invoice.followUpCount} automated follow-up{invoice.followUpCount !== 1 ? "s" : ""}. Next follow-up in 3 days if unpaid.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CreateInvoiceForm({ onClose }: { onClose: () => void }) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [items, setItems] = useState([{ desc: "", qty: 1, price: 0 }]);

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="p-6 lg:p-8 max-w-[800px] mx-auto">
      <button onClick={onClose} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Invoices
      </button>
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-6">Create New Invoice</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Input label="Client Name" placeholder="Sarah Mitchell" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          <Input label="Client Email" placeholder="sarah@company.com" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
          <Input label="Due Date" type="date" />
          <Input label="Invoice Number" placeholder="INV-2026-005" />
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-slate-300 mb-3">Line Items</p>
          {items.map((item, i) => (
            <div key={i} className="flex gap-3 mb-2">
              <Input placeholder="Description" value={item.desc} onChange={(e) => { const n = [...items]; n[i].desc = e.target.value; setItems(n); }} className="flex-1" />
              <Input placeholder="Qty" type="number" value={item.qty} onChange={(e) => { const n = [...items]; n[i].qty = +e.target.value; setItems(n); }} className="w-20" />
              <Input placeholder="Unit $" type="number" value={item.price} onChange={(e) => { const n = [...items]; n[i].price = +e.target.value; setItems(n); }} className="w-28" />
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setItems([...items, { desc: "", qty: 1, price: 0 }])} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add Item
          </Button>
        </div>

        <div className="flex justify-end mb-6">
          <div className="w-56 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-slate-400"><span>Tax 8%</span><span>{formatCurrency(tax)}</span></div>
            <div className="flex justify-between font-bold text-white border-t border-white/10 pt-1.5"><span>Total</span><span>{formatCurrency(total)}</span></div>
          </div>
        </div>

        <Textarea label="Notes (optional)" placeholder="Payment due within 15 days…" />

        <div className="flex gap-3 mt-6">
          <Button variant="ghost" onClick={onClose} className="flex-1">Save as Draft</Button>
          <Button variant="primary" leftIcon={<Send className="w-3.5 h-3.5" />} className="flex-1">Send Invoice</Button>
        </div>
      </div>
    </div>
  );
}
