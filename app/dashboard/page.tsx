"use client";
import { useMemo } from "react";
import { MetricCard, Avatar, EmptyState } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatRelativeTime, getLeadStatusConfig } from "@/lib/utils";
import {
  Users, FileText, Calendar, TrendingUp, Zap, AlertCircle,
  Clock, DollarSign, ArrowRight, Bot, Activity, Plus,
  CheckCircle2, Flame, Sparkles
} from "lucide-react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import Link from "next/link";
import { useAppStore } from "@/lib/store";

/* ─── Custom Chart Tooltip ──────────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card !rounded-xl p-3 text-xs shadow-2xl border border-white/12 bg-[#0C1322]/98">
      <p className="font-semibold text-slate-300 mb-2 pb-1.5 border-b border-white/8">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} aria-hidden="true" />
            <span className="text-slate-400 capitalize">{p.name}</span>
          </div>
          <span className="font-bold font-mono" style={{ color: p.color }}>
            ${Number(p.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─── Dashboard Page ────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, business, leads, invoices, appointments, notifications } = useAppStore();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());

  // Real KPI calculations from store
  const hotLeads = leads.filter((l) => l.status === "HOT");
  const overdueInvoices = invoices.filter((i) => i.status === "OVERDUE");
  const pendingRevenue = invoices
    .filter((i) => ["SENT", "VIEWED", "OVERDUE"].includes(i.status))
    .reduce((s, i) => s + i.total, 0);
  const collectedRevenue = invoices
    .filter((i) => i.status === "PAID")
    .reduce((s, i) => s + i.total, 0);

  // Critical urgent action items generated dynamically from real items
  const criticalItems = useMemo(() => {
    const items: {
      id: string;
      type: "LEAD" | "INVOICE" | "APPOINTMENT";
      title: string;
      description: string;
      actionLabel: string;
      href: string;
    }[] = [];

    overdueInvoices.forEach((inv) => {
      items.push({
        id: inv.id,
        type: "INVOICE",
        title: `Invoice ${inv.number} is overdue`,
        description: `${inv.clientName} owes ${formatCurrency(inv.total)}`,
        actionLabel: "View Invoice",
        href: "/dashboard/invoices",
      });
    });

    hotLeads.forEach((lead) => {
      items.push({
        id: lead.id,
        type: "LEAD",
        title: `Hot Lead: ${lead.name}`,
        description: `${lead.need || "High score lead"} · ${lead.budget ? formatCurrency(lead.budget) : "Budget pending"}`,
        actionLabel: "View Lead",
        href: "/dashboard/leads",
      });
    });

    appointments
      .filter((a) => a.status === "NO_SHOW")
      .forEach((apt) => {
        items.push({
          id: apt.id,
          type: "APPOINTMENT",
          title: `No-Show: ${apt.clientName}`,
          description: "Missed booking — reschedule recommended",
          actionLabel: "Reschedule",
          href: "/dashboard/appointments",
        });
      });

    return items;
  }, [overdueInvoices, hotLeads, appointments]);

  const notifTypeIcons: Record<string, React.ReactNode> = {
    LEAD: <Users className="w-3.5 h-3.5" />,
    INVOICE: <FileText className="w-3.5 h-3.5" />,
    APPOINTMENT: <Calendar className="w-3.5 h-3.5" />,
    AI_ACTION: <Bot className="w-3.5 h-3.5" />,
    SYSTEM: <Activity className="w-3.5 h-3.5" />,
  };
  const notifTypeColors: Record<string, string> = {
    LEAD: "text-blue-400 bg-blue-500/10 border-blue-500/18",
    INVOICE: "text-amber-400 bg-amber-500/10 border-amber-500/18",
    APPOINTMENT: "text-purple-400 bg-purple-500/10 border-purple-500/18",
    AI_ACTION: "text-emerald-400 bg-emerald-500/10 border-emerald-500/18",
    SYSTEM: "text-slate-400 bg-slate-500/10 border-slate-500/18",
  };

  // Lead source breakdown dynamically computed
  const leadSources = useMemo(() => {
    if (leads.length === 0) return [];
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      const src = l.source || "Direct";
      counts[src] = (counts[src] || 0) + 1;
    });
    const colors = ["#3B82F6", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"];
    return Object.entries(counts).map(([name, value], idx) => ({
      name,
      value,
      color: colors[idx % colors.length],
    }));
  }, [leads]);

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="page-content flex flex-col gap-10">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/8">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {greeting()}, {user?.name?.split(" ")[0] || "Operator"}
            </h1>
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/12 border border-blue-500/25 text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-400 anim-pulse" aria-hidden="true" />
              Workspace Live
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-400 mt-2 font-normal leading-relaxed">
            Operations summary for{" "}
            <span className="text-slate-200 font-semibold">{business?.name || "Your Business"}</span>
            {" "}·{" "}{dateFormatted}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <div className="dot dot-live flex-shrink-0" aria-hidden="true" />
            AI Operations Online
          </div>
          <Link href="/dashboard/invoices">
            <Button variant="ghost" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              New Invoice
            </Button>
          </Link>
          <Link href="/dashboard/leads">
            <Button variant="primary" size="md" leftIcon={<Users className="w-4 h-4" />}>
              Pipeline
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Action Required Banner (Only shows when real critical items exist) ── */}
      {criticalItems.length > 0 && (
        <div
          className="glass-card p-6 lg:p-7 !rounded-2xl border-amber-500/25 bg-amber-500/[0.035] shadow-xl shadow-amber-950/10"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-amber-500/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-sm" aria-hidden="true">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base font-bold text-amber-300 tracking-tight">Action Required</p>
                <p className="text-xs text-slate-400 mt-0.5">Critical items requiring your immediate review</p>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex-shrink-0">
              {criticalItems.length} urgent
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/8 hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${
                      item.type === "LEAD" ? "bg-red-400 shadow-sm shadow-red-400/50" :
                      item.type === "INVOICE" ? "bg-amber-400 shadow-sm shadow-amber-400/50" : "bg-blue-400 shadow-sm shadow-blue-400/50"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-100 truncate">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-1 clamp-1">{item.description}</p>
                  </div>
                </div>
                <Link
                  href={item.href}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 flex-shrink-0 ml-4 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 transition-all"
                >
                  {item.actionLabel}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── KPI Metrics (Calculated from real data) ──────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <MetricCard
          title="Hot Leads"
          value={hotLeads.length}
          subtitle="High qualification readiness"
          change={hotLeads.length > 0 ? `${hotLeads.length} ready to close` : "No hot leads yet"}
          changeType={hotLeads.length > 0 ? "positive" : "neutral"}
          icon={<Flame className="w-5 h-5" />}
          iconColor="red"
        />
        <MetricCard
          title="Total Pipeline Leads"
          value={leads.length}
          subtitle="Inbound & qualified leads"
          change={leads.length > 0 ? `${leads.length} active in CRM` : "Awaiting first lead"}
          changeType={leads.length > 0 ? "positive" : "neutral"}
          icon={<Users className="w-5 h-5" />}
          iconColor="blue"
        />
        <MetricCard
          title="Pending Invoices"
          value={formatCurrency(pendingRevenue)}
          subtitle={`${overdueInvoices.length} overdue invoices`}
          change={pendingRevenue > 0 ? "Follow-ups enabled" : "All invoices settled"}
          changeType={overdueInvoices.length > 0 ? "negative" : "positive"}
          icon={<DollarSign className="w-5 h-5" />}
          iconColor="amber"
        />
        <MetricCard
          title="Collected Revenue"
          value={formatCurrency(collectedRevenue)}
          subtitle="Total paid invoices"
          change={collectedRevenue > 0 ? "Revenue verified" : "No payments yet"}
          changeType="positive"
          icon={<Zap className="w-5 h-5" />}
          iconColor="green"
        />
      </div>

      {/* ── Analytics & Pipeline Row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real Pipeline Leads Table */}
        <div className="lg:col-span-2 glass-card p-6 lg:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">Active Lead Pipeline</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Most recent inbound prospects & status</p>
                </div>
              </div>
              <Link href="/dashboard/leads" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 transition-all">
                View All ({leads.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-center mb-4 text-slate-500">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-base font-bold text-slate-200 mb-1.5">No leads captured yet</p>
                <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                  Add leads manually or integrate the OpsAgent chat widget to capture inbound prospects automatically.
                </p>
                <Link href="/dashboard/leads">
                  <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
                    Create First Lead
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/6">
                {recentLeads.map((lead) => {
                  const s = getLeadStatusConfig(lead.status);
                  return (
                    <Link
                      key={lead.id}
                      href="/dashboard/leads"
                      className="py-4 px-3 flex items-center justify-between hover:bg-white/[0.03] rounded-xl transition-all group gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <Avatar name={lead.name} size="md" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-200 group-hover:text-white truncate">
                            {lead.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{lead.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3.5 flex-shrink-0">
                        {lead.budget && (
                          <span className="text-xs font-bold text-slate-200 font-mono hidden sm:block px-2.5 py-1 rounded-lg bg-white/5 border border-white/8">
                            {formatCurrency(lead.budget)}
                          </span>
                        )}
                        <span className={`badge ${s.className}`}>{s.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Lead Sources breakdown */}
        <div className="glass-card p-6 lg:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/6">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Inbound Channels</h2>
                <p className="text-xs text-slate-400 mt-0.5">Source attribution breakdown</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-slate-300 font-mono">
                {leads.length} total
              </span>
            </div>

            {leadSources.length === 0 ? (
              <div className="py-14 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3 text-blue-400">
                  <Sparkles className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-sm font-bold text-slate-200 mb-1">No source data yet</p>
                <p className="text-xs text-slate-400 max-w-[220px] leading-relaxed">
                  Channels will be automatically graphed here as leads are acquired.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {leadSources.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs p-3 rounded-xl bg-white/[0.025] border border-white/6">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                      <span className="text-sm font-medium text-slate-200">{s.name}</span>
                    </div>
                    <span className="font-bold text-white font-mono text-sm">{s.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Real Activity Feed ────────────────────────────────────────── */}
      <div className="glass-card p-6 lg:p-7">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Activity className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Operations Activity Feed</h2>
              <p className="text-xs text-slate-400 mt-0.5">Live audit log of AI actions, leads, and billing</p>
            </div>
          </div>
          <Link href="/dashboard/notifications" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 transition-all">
            View All ({notifications.length})
          </Link>
        </div>

        {notifications.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400">
            No recent activity logged yet. Autonomous actions and invoice alerts will be recorded here in real-time.
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 4).map((notif) => (
              <div
                key={notif.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.025] border border-white/6 hover:border-white/12 transition-all"
              >
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                    notifTypeColors[notif.type] || notifTypeColors.SYSTEM
                  }`}
                >
                  {notifTypeIcons[notif.type] || notifTypeIcons.SYSTEM}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-200 truncate">{notif.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{notif.body}</p>
                </div>
                <span className="text-xs text-slate-500 font-mono flex-shrink-0 ml-3">
                  {formatRelativeTime(notif.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
