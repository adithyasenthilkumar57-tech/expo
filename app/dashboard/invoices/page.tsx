"use client";
import { useState, useCallback } from "react";
import { formatCurrency, formatDate, getInvoiceStatusConfig } from "@/lib/utils";
import { Avatar, EmptyState } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { toast } from "@/lib/toast";
import type { Invoice, InvoiceStatus, InvoiceItem } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import {
  FileText, Plus, Search, Send, Eye, CheckCircle,
  Clock, DollarSign, ArrowLeft, Download, Bot, X, Trash2
} from "lucide-react";

type Tab = "all" | InvoiceStatus;

const TABS: { key: Tab; label: string }[] = [
  { key: "all",     label: "All" },
  { key: "DRAFT",   label: "Draft" },
  { key: "SENT",    label: "Sent" },
  { key: "VIEWED",  label: "Viewed" },
  { key: "OVERDUE", label: "Overdue" },
  { key: "PAID",    label: "Paid" },
];

export default function InvoicesPage() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, business } = useAppStore();
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const selected = invoices.find((i) => i.id === selectedId) || null;

  const filtered = invoices.filter((inv) => {
    const matchTab = tab === "all" || inv.status === tab;
    const q = search.toLowerCase();
    const matchSearch = !q || inv.clientName.toLowerCase().includes(q) || inv.number.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const totals = {
    pending: invoices
      .filter((i) => ["SENT", "VIEWED", "OVERDUE"].includes(i.status))
      .reduce((s, i) => s + i.total, 0),
    overdue: invoices
      .filter((i) => i.status === "OVERDUE")
      .reduce((s, i) => s + i.total, 0),
    paid: invoices
      .filter((i) => i.status === "PAID")
      .reduce((s, i) => s + i.total, 0),
  };

  const getCount = (key: Tab) =>
    key === "all" ? invoices.length : invoices.filter((i) => i.status === key).length;

  const handleAddInvoice = (newInv: Invoice) => {
    addInvoice(newInv);
    setShowCreate(false);
    toast.success(`Invoice ${newInv.number} created successfully`);
  };

  const handleUpdateStatus = (id: string, newStatus: InvoiceStatus, extra?: Partial<Invoice>) => {
    updateInvoice(id, { status: newStatus, ...extra });
  };

  if (showCreate) {
    return (
      <CreateInvoiceForm
        onClose={() => setShowCreate(false)}
        onAddInvoice={handleAddInvoice}
        nextNumber={`INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`}
        businessId={business?.id || "biz-001"}
      />
    );
  }

  if (selected) {
    return (
      <InvoiceDetail
        invoice={selected}
        onBack={() => setSelectedId(null)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={() => {
          deleteInvoice(selected.id);
          setSelectedId(null);
          toast.info("Invoice deleted");
        }}
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
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            Invoices & Billing
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 font-normal leading-relaxed">
            Create, send, and automate client invoice follow-ups and payment reminders
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreate(true)}
          id="new-invoice-btn"
        >
          New Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
        {[
          { label: "Pending Payment", value: totals.pending, color: "text-amber-400", bg: "border-amber-500/20 bg-amber-500/[0.04]" },
          { label: "Overdue Amount",  value: totals.overdue, color: "text-red-400",   bg: "border-red-500/20 bg-red-500/[0.04]" },
          { label: "Collected (MTD)", value: totals.paid,    color: "text-emerald-400", bg: "border-emerald-500/20 bg-emerald-500/[0.04]" },
        ].map((item) => (
          <div key={item.label} className={`glass-card p-6 lg:p-7 border !rounded-2xl ${item.bg}`}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{item.label}</p>
            <p className={`text-3xl lg:text-4xl font-extrabold font-display ${item.color}`}>{formatCurrency(item.value)}</p>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div
          className="flex items-center gap-1.5 bg-white/[0.03] rounded-2xl p-1.5 w-fit border border-white/8 overflow-x-auto max-w-full"
          role="tablist"
          aria-label="Invoice status filter"
        >
          {TABS.map(({ key, label }) => {
            const count = getCount(key);
            const isActive = tab === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                  isActive ? "bg-white/12 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                {label}
                <span className="ml-2 text-[11px] bg-white/10 px-2 py-0.5 rounded-md font-mono font-bold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        {invoices.length > 0 && (
          <div className="w-full md:w-80">
            <Input
              placeholder="Search by client or invoice #…"
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
              id="search-invoices"
            />
          </div>
        )}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title="No invoices yet"
          description={
            search
              ? "No invoices match your search query."
              : "Generate your first professional invoice to bill clients and collect revenue."
          }
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowCreate(true)}
            >
              Create First Invoice
            </Button>
          }
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="glass-card overflow-hidden hidden md:block !rounded-2xl border border-white/8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" aria-label="Invoices list">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.025]">
                    <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice</th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Client</th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Due Date</th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Follow-ups</th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filtered.map((inv) => {
                    const s = getInvoiceStatusConfig(inv.status);
                    return (
                      <tr
                        key={inv.id}
                        className="hover:bg-white/[0.035] transition-all cursor-pointer group"
                        onClick={() => setSelectedId(inv.id)}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedId(inv.id); }}
                        aria-label={`View invoice ${inv.number} for ${inv.clientName}`}
                      >
                        <td className="px-6 py-4.5">
                          <p className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                            {inv.number}
                          </p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{formatDate(inv.createdAt)}</p>
                        </td>
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={inv.clientName} size="md" />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-200 truncate">{inv.clientName}</p>
                              <p className="text-xs text-slate-400 truncate mt-0.5">{inv.clientEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4.5">
                          <p className="text-sm font-extrabold text-white font-mono">{formatCurrency(inv.total)}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{inv.items.length} item{inv.items.length !== 1 ? "s" : ""}</p>
                        </td>
                        <td className="px-6 py-4.5">
                          <p className={`text-sm font-mono ${inv.status === "OVERDUE" ? "text-red-400 font-bold" : "text-slate-300"}`}>
                            {formatDate(inv.dueDate)}
                          </p>
                        </td>
                        <td className="px-6 py-4.5">
                          <span className={`badge ${s.className}`}>{s.label}</span>
                        </td>
                        <td className="px-6 py-4.5">
                          {inv.followUpCount > 0 ? (
                            <div className="flex items-center gap-2">
                              <Bot className="w-4 h-4 text-blue-400 flex-shrink-0" aria-hidden="true" />
                              <span className="text-xs text-slate-300 font-mono">{inv.followUpCount} sent</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-600 font-mono">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-blue-500/20 ml-auto transition-all">
                            <Eye className="w-4 h-4" aria-hidden="true" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((inv) => {
              const s = getInvoiceStatusConfig(inv.status);
              return (
                <button
                  key={inv.id}
                  className="glass-card p-4 w-full text-left hover:border-white/14 transition-colors cursor-pointer"
                  onClick={() => setSelectedId(inv.id)}
                  aria-label={`View invoice ${inv.number} for ${inv.clientName}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-slate-100">{inv.number}</p>
                      <p className="text-xs text-slate-500">{formatDate(inv.createdAt)}</p>
                    </div>
                    <span className={`badge ${s.className}`}>{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <Avatar name={inv.clientName} size="sm" />
                    <div>
                      <p className="text-sm text-slate-200">{inv.clientName}</p>
                      <p className="text-xs text-slate-500">{inv.clientEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-400">
                      <DollarSign className="w-3 h-3" aria-hidden="true" />
                      <span className="font-semibold text-slate-200">{formatCurrency(inv.total)}</span>
                    </span>
                    <span className={`flex items-center gap-1 ${inv.status === "OVERDUE" ? "text-red-400" : "text-slate-500"}`}>
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      Due {formatDate(inv.dueDate)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Invoice Detail ─────────────────────────────────────────────────── */
function InvoiceDetail({
  invoice,
  onBack,
  onUpdateStatus,
  onDelete,
}: {
  invoice: Invoice;
  onBack: () => void;
  onUpdateStatus: (id: string, newStatus: InvoiceStatus, extra?: Partial<Invoice>) => void;
  onDelete: () => void;
}) {
  const statusCfg = getInvoiceStatusConfig(invoice.status);

  const steps = [
    { label: "Created", date: invoice.createdAt, done: true },
    { label: "Sent", date: invoice.sentAt, done: !!invoice.sentAt },
    { label: "Viewed", date: invoice.viewedAt, done: !!invoice.viewedAt },
    { label: "Paid", date: invoice.paidAt, done: !!invoice.paidAt },
  ];

  const handleSend = () => {
    onUpdateStatus(invoice.id, "SENT", { sentAt: new Date().toISOString() });
    toast.success(`Invoice ${invoice.number} sent to ${invoice.clientEmail}`);
  };

  const handleFollowUp = () => {
    onUpdateStatus(invoice.id, invoice.status, { followUpCount: invoice.followUpCount + 1 });
    toast.info(`Automated follow-up reminder sent to ${invoice.clientName}`);
  };

  const handleMarkPaid = () => {
    onUpdateStatus(invoice.id, "PAID", { paidAt: new Date().toISOString() });
    toast.success(`Invoice ${invoice.number} marked as PAID`);
  };

  const handleDownloadPDF = () => {
    toast.success(`Downloading PDF for ${invoice.number}…`);
  };

  return (
    <div className="page-content max-w-4xl space-y-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors group px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 w-fit"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
        Back to Invoices
      </button>

      <div className="glass-card p-8 sm:p-10 !rounded-2xl border border-white/8 space-y-8">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-white/8">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h2 className="text-2xl font-bold text-white tracking-tight font-display">{invoice.number}</h2>
              <span className={`badge ${statusCfg.className}`}>{statusCfg.label}</span>
            </div>
            <p className="text-sm text-slate-400 font-mono">Created {formatDate(invoice.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {invoice.status === "DRAFT" && (
              <Button variant="primary" size="md" leftIcon={<Send className="w-4 h-4" />} onClick={handleSend}>
                Send Invoice
              </Button>
            )}
            {invoice.status === "OVERDUE" && (
              <Button variant="ghost" size="md" leftIcon={<Bot className="w-4 h-4" />} onClick={handleFollowUp}>
                AI Follow-Up
              </Button>
            )}
            {["SENT", "VIEWED", "OVERDUE"].includes(invoice.status) && (
              <Button variant="success" size="md" leftIcon={<CheckCircle className="w-4 h-4" />} onClick={handleMarkPaid}>
                Mark Paid
              </Button>
            )}
            <Button variant="ghost" size="md" leftIcon={<Download className="w-4 h-4" />} onClick={handleDownloadPDF}>
              PDF
            </Button>
            <Button variant="danger" size="md" leftIcon={<Trash2 className="w-4 h-4" />} onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>

        {/* Bill To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6 rounded-2xl bg-white/[0.025] border border-white/6">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</p>
            <p className="text-base font-bold text-slate-100">{invoice.clientName}</p>
            <p className="text-sm text-slate-400 mt-0.5">{invoice.clientEmail}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Due Date</p>
            <p className={`text-base font-bold font-mono ${invoice.status === "OVERDUE" ? "text-red-400" : "text-slate-100"}`}>
              {formatDate(invoice.dueDate)}
            </p>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="flex items-center gap-0 overflow-x-auto pb-4 pt-2">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.done ? "bg-blue-500 text-white shadow-md shadow-blue-500/30" : "bg-white/8 text-slate-500 border border-white/10"
                  }`}
                  aria-label={`${step.label}: ${step.done ? "complete" : "pending"}`}
                >
                  {step.done ? <CheckCircle className="w-4 h-4" aria-hidden="true" /> : i + 1}
                </div>
                <p className={`text-xs font-semibold whitespace-nowrap ${step.done ? "text-slate-200" : "text-slate-500"}`}>
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                    {formatDate(step.date, { month: "short", day: "numeric" })}
                  </p>
                )}
              </div>
              {i < 3 && (
                <div
                  className={`h-0.5 flex-1 mx-3 ${step.done && steps[i + 1]?.done ? "bg-blue-500/50" : "bg-white/8"}`}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>

        {/* Line Items */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Line Items</p>
          <div className="overflow-x-auto border border-white/6 rounded-2xl">
            <table className="w-full text-left border-collapse" aria-label="Invoice line items">
              <thead>
                <tr className="border-b border-white/8 bg-white/[0.025]">
                  <th scope="col" className="px-5 py-3.5 text-xs text-slate-400 font-bold uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-5 py-3.5 text-xs text-slate-400 font-bold uppercase tracking-wider text-center">Qty</th>
                  <th scope="col" className="px-5 py-3.5 text-xs text-slate-400 font-bold uppercase tracking-wider text-right">Unit Price</th>
                  <th scope="col" className="px-5 py-3.5 text-xs text-slate-400 font-bold uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4 text-sm font-medium text-slate-200">{item.description}</td>
                    <td className="px-5 py-4 text-sm font-mono text-slate-400 text-center">{item.quantity}</td>
                    <td className="px-5 py-4 text-sm font-mono text-slate-400 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-5 py-4 text-sm font-mono font-bold text-white text-right">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end pt-2">
          <div className="w-64 space-y-3 p-5 rounded-2xl bg-white/[0.025] border border-white/6">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Subtotal</span><span className="font-mono">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span>Tax (8%)</span><span className="font-mono">{formatCurrency(invoice.tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-white pt-3 border-t border-white/10 font-display">
              <span>Total</span><span className="text-blue-400 font-mono">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* AI Follow-up note */}
        {invoice.followUpCount > 0 && (
          <div className="p-4 rounded-xl bg-blue-500/8 border border-blue-500/20">
            <div className="flex items-center gap-3 text-xs text-blue-300">
              <Bot className="w-4 h-4 text-blue-400 flex-shrink-0" aria-hidden="true" />
              AI sent {invoice.followUpCount} automated follow-up{invoice.followUpCount !== 1 ? "s" : ""}.
              Next follow-up scheduled in 3 days if unpaid.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Create Invoice Form ────────────────────────────────────────────── */
function CreateInvoiceForm({
  onClose,
  onAddInvoice,
  nextNumber,
  businessId,
}: {
  onClose: () => void;
  onAddInvoice: (inv: Invoice) => void;
  nextNumber: string;
  businessId: string;
}) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [invoiceNum, setInvoiceNum] = useState(nextNumber);
  const [items, setItems] = useState<{ desc: string; qty: number; price: number }[]>([
    { desc: "", qty: 1, price: 0 },
  ]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleSubmit = useCallback(async (asDraft: boolean) => {
    if (!clientName.trim() || !clientEmail.trim()) {
      toast.error("Please provide client name and email");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));

    const lineItems: InvoiceItem[] = items.map((it, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      description: it.desc || "Consulting Service",
      quantity: it.qty || 1,
      unitPrice: it.price || 0,
      total: (it.qty || 1) * (it.price || 0),
    }));

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      businessId,
      clientName,
      clientEmail,
      number: invoiceNum || `INV-${Date.now()}`,
      status: asDraft ? "DRAFT" : "SENT",
      items: lineItems,
      subtotal,
      tax,
      total,
      dueDate: dueDate ? new Date(dueDate).toISOString() : new Date(Date.now() + 14 * 86400000).toISOString(),
      sentAt: asDraft ? undefined : new Date().toISOString(),
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
      followUpCount: 0,
    };

    setIsSubmitting(false);
    onAddInvoice(newInvoice);
  }, [clientName, clientEmail, dueDate, invoiceNum, items, subtotal, tax, total, notes, businessId, onAddInvoice]);

  const updateItem = (index: number, field: "desc" | "qty" | "price", value: string | number) => {
    setItems((prev) => {
      const next = [...prev];
      (next[index] as any)[field] = value;
      return next;
    });
  };

  return (
    <div className="page-content max-w-4xl space-y-8">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors group px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 w-fit"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
        Back to Invoices
      </button>

      <div className="glass-card p-8 sm:p-10 !rounded-2xl border border-white/8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-display">Create New Invoice</h2>
          <p className="text-sm text-slate-400 mt-1">Fill out the details below to generate a new client invoice</p>
        </div>

        {/* Client + meta fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Client Name"
            placeholder="Sarah Mitchell"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            id="invoice-client-name"
          />
          <Input
            label="Client Email"
            placeholder="sarah@company.com"
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            required
            id="invoice-client-email"
          />
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            id="invoice-due-date"
          />
          <Input
            label="Invoice Number"
            placeholder={invoiceNum}
            value={invoiceNum}
            onChange={(e) => setInvoiceNum(e.target.value)}
            id="invoice-number"
          />
        </div>

        {/* Line Items */}
        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Line Items</p>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-start p-3 rounded-xl bg-white/[0.02] border border-white/6">
                <Input
                  placeholder="Service or product description"
                  value={item.desc}
                  onChange={(e) => updateItem(i, "desc", e.target.value)}
                  aria-label={`Item ${i + 1} description`}
                />
                <Input
                  placeholder="Qty"
                  type="number"
                  value={item.qty}
                  onChange={(e) => updateItem(i, "qty", +e.target.value)}
                  className="w-24"
                  aria-label={`Item ${i + 1} quantity`}
                  min={1}
                />
                <Input
                  placeholder="$0.00"
                  type="number"
                  value={item.price || ""}
                  onChange={(e) => updateItem(i, "price", +e.target.value)}
                  className="w-32"
                  aria-label={`Item ${i + 1} unit price`}
                  min={0}
                />
                {items.length > 1 && (
                  <button
                    onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                    className="h-[44px] w-10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
                    aria-label={`Remove item ${i + 1}`}
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="md"
            onClick={() => setItems((prev) => [...prev, { desc: "", qty: 1, price: 0 }])}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Line Item
          </Button>
        </div>

        {/* Totals */}
        <div className="flex justify-end pt-2">
          <div className="w-64 space-y-3 p-5 rounded-2xl bg-white/[0.025] border border-white/6 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span><span className="font-mono">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax (8%)</span><span className="font-mono">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-white pt-3 border-t border-white/10 text-base font-display">
              <span>Total</span><span className="text-blue-400 font-mono">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <Textarea
          label="Notes (optional)"
          placeholder="Payment terms, bank details, wire instructions, or additional info…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px]"
          id="invoice-notes"
        />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/6">
          <Button variant="ghost" size="lg" onClick={() => handleSubmit(true)} isLoading={isSubmitting} className="flex-1">
            Save as Draft
          </Button>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Send className="w-4 h-4" />}
            onClick={() => handleSubmit(false)}
            isLoading={isSubmitting}
            className="flex-1"
            id="send-invoice-btn"
          >
            Send Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}
