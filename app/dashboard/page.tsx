"use client";
import { MetricCard, Card, CardHeader, Badge, Avatar, EmptyState } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  mockDashboardMetrics, mockPriorityItems, mockNotifications,
  mockLeads, weeklyLeadsData, revenueData, leadSourceData
} from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime, getLeadStatusConfig } from "@/lib/utils";
import {
  Users, FileText, Calendar, TrendingUp, Zap, AlertCircle,
  Clock, DollarSign, ArrowRight, Bot, Activity, Target
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
      <div className="glass-card !rounded-lg p-3 text-xs shadow-xl">
        <p className="font-semibold text-slate-200 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user, business } = useAuthStore();
  const m = mockDashboardMetrics;

  const getHour = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {getHour()}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-slate-500">
            Here&apos;s what&apos;s happening with <span className="text-slate-300">{business?.name}</span> today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Agent Active
          </div>
          <Button variant="primary" size="sm" leftIcon={<Bot className="w-3.5 h-3.5" />}>
            Ask AI
          </Button>
        </div>
      </div>

      {/* Priority Alerts */}
      {mockPriorityItems.filter(p => p.urgency === "NOW").length > 0 && (
        <div className="mb-6">
          <div className="glass-card !border-amber-500/20 !bg-amber-500/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <p className="text-sm font-semibold text-amber-400">Needs Your Attention</p>
            </div>
            <div className="flex flex-col gap-2">
              {mockPriorityItems.filter(p => p.urgency === "NOW").map((item) => (
                <div key={item.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.type === "LEAD" ? "bg-red-400" : item.type === "INVOICE" ? "bg-amber-400" : "bg-blue-400"}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-200">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                  </div>
                  <Link
                    href={item.type === "LEAD" ? `/dashboard/leads/${item.relatedId}` : item.type === "INVOICE" ? `/dashboard/invoices/${item.relatedId}` : `/dashboard/appointments`}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 flex-shrink-0 ml-4"
                  >
                    {item.actionLabel} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Hot Leads"
          value={m.hotLeads}
          subtitle="Need immediate follow-up"
          change="+2 from last week"
          changeType="positive"
          icon={<Target className="w-5 h-5" />}
          iconColor="red"
        />
        <MetricCard
          title="Leads This Week"
          value={m.leadsThisWeek}
          subtitle={`vs ${m.leadsLastWeek} last week`}
          change={`+${m.leadsThisWeek - m.leadsLastWeek} (${Math.round((m.leadsThisWeek - m.leadsLastWeek) / m.leadsLastWeek * 100)}%)`}
          changeType="positive"
          icon={<Users className="w-5 h-5" />}
          iconColor="blue"
        />
        <MetricCard
          title="Revenue Pending"
          value={formatCurrency(m.revenuePending)}
          subtitle={`${m.overdueInvoices} overdue invoice`}
          change="1 overdue — take action"
          changeType="negative"
          icon={<DollarSign className="w-5 h-5" />}
          iconColor="amber"
        />
        <MetricCard
          title="AI Response Time"
          value={m.avgResponseTime}
          subtitle="avg. first reply"
          change="vs 4m industry avg"
          changeType="positive"
          icon={<Zap className="w-5 h-5" />}
          iconColor="green"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <CardHeader
            title="Revenue Overview"
            subtitle="Collected vs pending (last 6 months)"
            icon={<TrendingUp className="w-4 h-4" />}
            action={<span className="badge badge-info text-[10px]">Live</span>}
          />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="collected" name="Collected" stroke="#3B82F6" fill="url(#colorCollected)" strokeWidth={2} />
              <Area type="monotone" dataKey="pending" name="Pending" stroke="#8B5CF6" fill="url(#colorPending)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead source donut */}
        <div className="glass-card p-5">
          <CardHeader title="Lead Sources" subtitle="This month" icon={<Activity className="w-4 h-4" />} />
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                {leadSourceData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => [`${val}%`, ""]} contentStyle={{ background: "rgba(15,22,41,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {leadSourceData.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <span className="text-slate-300 font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent leads */}
        <div className="glass-card p-5">
          <CardHeader
            title="Recent Leads"
            subtitle="AI-qualified status"
            icon={<Users className="w-4 h-4" />}
            action={<Link href="/dashboard/leads" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>}
          />
          <div className="flex flex-col gap-2">
            {mockLeads.slice(0, 4).map((lead) => {
              const statusConfig = getLeadStatusConfig(lead.status);
              return (
                <Link
                  key={lead.id}
                  href={`/dashboard/leads`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/4 transition-colors group"
                >
                  <Avatar name={lead.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 group-hover:text-white truncate">{lead.name}</p>
                    <p className="text-xs text-slate-500 truncate">{lead.need || lead.source}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`badge ${statusConfig.className} text-[10px]`}>{statusConfig.label}</span>
                    <span className="text-[10px] text-slate-600">{formatRelativeTime(lead.lastContact)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Activity feed */}
        <div className="glass-card p-5">
          <CardHeader
            title="AI Activity Feed"
            subtitle="Recent agent actions"
            icon={<Bot className="w-4 h-4" />}
            action={<Link href="/dashboard/notifications" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>}
          />
          <div className="flex flex-col gap-2">
            {mockNotifications.map((notif) => {
              const icons: Record<string, React.ReactNode> = {
                LEAD: <Users className="w-3 h-3" />,
                INVOICE: <FileText className="w-3 h-3" />,
                APPOINTMENT: <Calendar className="w-3 h-3" />,
                AI_ACTION: <Bot className="w-3 h-3" />,
                SYSTEM: <Activity className="w-3 h-3" />,
              };
              const colors: Record<string, string> = {
                LEAD: "text-blue-400 bg-blue-500/10",
                INVOICE: "text-amber-400 bg-amber-500/10",
                APPOINTMENT: "text-purple-400 bg-purple-500/10",
                AI_ACTION: "text-emerald-400 bg-emerald-500/10",
                SYSTEM: "text-slate-400 bg-slate-500/10",
              };
              return (
                <div key={notif.id} className={`flex items-start gap-3 p-2 rounded-xl ${!notif.isRead ? "bg-white/3" : ""}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[notif.type]}`}>
                    {icons[notif.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200">{notif.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{notif.body}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {!notif.isRead && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                    <span className="text-[10px] text-slate-600">{formatRelativeTime(notif.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
