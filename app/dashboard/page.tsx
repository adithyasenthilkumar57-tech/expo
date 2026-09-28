"use client";
import { MetricCard, Card, CardHeader, Badge, Avatar } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  mockDashboardMetrics, mockPriorityItems, mockNotifications,
  mockLeads, weeklyLeadsData, revenueData, leadSourceData
} from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime, getLeadStatusConfig } from "@/lib/utils";
import {
  Users, FileText, Calendar, TrendingUp, Zap, AlertCircle,
  Clock, DollarSign, ArrowRight, Bot, Activity, Target,
  Plus, CheckCircle2, ShieldCheck, ArrowUpRight, Flame
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card !rounded-xl p-3 text-xs shadow-2xl border border-white/15 bg-[#0C1322]/95 backdrop-blur-md">
        <p className="font-semibold text-slate-200 mb-1.5 border-b border-white/10 pb-1">{label} Period</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center justify-between gap-4 py-0.5">
            <span className="text-slate-400 font-medium capitalize">{p.name}:</span>
            <span className="font-bold font-mono" style={{ color: p.color }}>
              ${Number(p.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user, business } = useAuthStore();
  const m = mockDashboardMetrics;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const todayDateFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {getGreeting()}, {user?.name?.split(" ")[0] || "Operator"}
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400">
              Workspace Live
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Operations summary for <span className="text-slate-200 font-semibold">{business?.name || "Apex Consulting Group"}</span> · {todayDateFormatted}
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            AI Operations Online
          </div>

          <Link href="/dashboard/invoices">
            <Button variant="ghost" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} className="border border-white/10">
              New Invoice
            </Button>
          </Link>

          <Link href="/dashboard/leads">
            <Button variant="primary" size="sm" leftIcon={<Users className="w-3.5 h-3.5" />} className="shadow-lg shadow-blue-500/20">
              Review Pipeline
            </Button>
          </Link>
        </div>
      </div>

      {/* Critical Priority Items */}
      {mockPriorityItems.filter((p) => p.urgency === "NOW").length > 0 && (
        <div className="glass-card !border-amber-500/25 !bg-amber-500/[0.04] p-5 !rounded-2xl">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-300">Action Required: Immediate Operational Items</p>
                <p className="text-xs text-slate-400">Items flagged by AI as requiring business owner sign-off</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              High Priority
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {mockPriorityItems.filter((p) => p.urgency === "NOW").map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/8 hover:border-amber-500/30 transition-all duration-200"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      item.type === "LEAD" ? "bg-red-400" : item.type === "INVOICE" ? "bg-amber-400" : "bg-blue-400"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-100 truncate">{item.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                  </div>
                </div>

                <Link
                  href={
                    item.type === "LEAD"
                      ? `/dashboard/leads`
                      : item.type === "INVOICE"
                      ? `/dashboard/invoices`
                      : `/dashboard/appointments`
                  }
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 flex-shrink-0 ml-3"
                >
                  {item.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Metrics Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Active Hot Leads"
          value={m.hotLeads}
          subtitle="92% qualification readiness"
          change="+2 from last week"
          changeType="positive"
          icon={<Flame className="w-5 h-5 text-red-400" />}
          iconColor="red"
        />
        <MetricCard
          title="Inbound Volume (7D)"
          value={m.leadsThisWeek}
          subtitle={`vs ${m.leadsLastWeek} previous period`}
          change={`+${m.leadsThisWeek - m.leadsLastWeek} (${Math.round(((m.leadsThisWeek - m.leadsLastWeek) / m.leadsLastWeek) * 100)}% velocity)`}
          changeType="positive"
          icon={<Users className="w-5 h-5 text-blue-400" />}
          iconColor="blue"
        />
        <MetricCard
          title="Pending Receivables"
          value={formatCurrency(m.revenuePending)}
          subtitle={`${m.overdueInvoices} invoice in recovery sequence`}
          change="Auto-reminders active"
          changeType="negative"
          icon={<DollarSign className="w-5 h-5 text-amber-400" />}
          iconColor="amber"
        />
        <MetricCard
          title="AI Resolution SLA"
          value={m.avgResponseTime}
          subtitle="mean time to first grounded reply"
          change="vs 4m 00s industry avg"
          changeType="positive"
          icon={<Zap className="w-5 h-5 text-emerald-400" />}
          iconColor="green"
        />
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Area Chart */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <h3 className="text-base font-bold text-white">Revenue Settlement & Invoiced Pipeline</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Historical trajectory over 6-month operational cycle</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-400">Collected Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-slate-400">Invoiced Pipeline</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="collected" name="collected" stroke="#3B82F6" fill="url(#colorCollected)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="pending" name="pending" stroke="#A855F7" fill="url(#colorPending)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Channel Acquisition Breakdown */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Inbound Lead Channels</h3>
            </div>
            <p className="text-xs text-slate-400">Share of high-value qualification by channel</p>

            <div className="h-44 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {leadSourceData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="rgba(0,0,0,0.4)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val}%`, "Conversion Share"]}
                    contentStyle={{
                      background: "rgba(12, 19, 34, 0.95)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 10,
                      fontSize: 12,
                      color: "#F1F5F9",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            {leadSourceData.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="text-slate-100 font-bold font-mono">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Workflows: Recent Leads & Agent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent High-Priority Leads */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/8">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-blue-400" />
              <div>
                <h3 className="text-base font-bold text-white">Recent Inbound Opportunities</h3>
                <p className="text-xs text-slate-400">Classified by autonomous qualification pipeline</p>
              </div>
            </div>
            <Link
              href="/dashboard/leads"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
            >
              All Leads <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {mockLeads.slice(0, 4).map((lead) => {
              const statusConfig = getLeadStatusConfig(lead.status);
              return (
                <Link
                  key={lead.id}
                  href="/dashboard/leads"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/6 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={lead.name} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                        {lead.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {lead.need || lead.source} · Budget: <strong className="text-slate-200">${lead.budget?.toLocaleString() || "N/A"}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <span className={`badge ${statusConfig.className} text-[10px] font-bold uppercase`}>
                      {statusConfig.label}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {formatRelativeTime(lead.lastContact)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* AI Agent Execution Log */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/8">
            <div className="flex items-center gap-2.5">
              <Bot className="w-4 h-4 text-purple-400" />
              <div>
                <h3 className="text-base font-bold text-white">Autonomous Agent Activity</h3>
                <p className="text-xs text-slate-400">Verifiable trace of recent background decisions</p>
              </div>
            </div>
            <Link
              href="/dashboard/notifications"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
            >
              Audit Log <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {mockNotifications.slice(0, 4).map((notif) => {
              const icons: Record<string, React.ReactNode> = {
                LEAD: <Users className="w-3.5 h-3.5" />,
                INVOICE: <FileText className="w-3.5 h-3.5" />,
                APPOINTMENT: <Calendar className="w-3.5 h-3.5" />,
                AI_ACTION: <Bot className="w-3.5 h-3.5" />,
                SYSTEM: <Activity className="w-3.5 h-3.5" />,
              };
              const colors: Record<string, string> = {
                LEAD: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                INVOICE: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                APPOINTMENT: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                AI_ACTION: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                SYSTEM: "text-slate-400 bg-slate-500/10 border-slate-500/20",
              };
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border border-white/5 transition-colors ${
                    !notif.isRead ? "bg-blue-500/[0.03] border-blue-500/15" : "bg-white/[0.02]"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${colors[notif.type]}`}>
                    {icons[notif.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-200 truncate">{notif.title}</p>
                      <span className="text-[10px] font-mono text-slate-500">{formatRelativeTime(notif.createdAt)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{notif.body}</p>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 mt-1.5 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
