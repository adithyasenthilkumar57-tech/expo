"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Card";
import { toast } from "@/lib/toast";
import type { Notification } from "@/lib/types";
import {
  Users, FileText, Calendar, Bot, Activity, Bell, CheckCheck,
  Check, Filter, Trash2
} from "lucide-react";

type NotifFilter = "ALL" | "LEAD" | "INVOICE" | "APPOINTMENT" | "AI_ACTION";

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearReadNotifications,
  } = useAppStore();
  const [filter, setFilter] = useState<NotifFilter>("ALL");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    toast.success("All notifications marked as read");
  };

  const handleClearRead = () => {
    clearReadNotifications();
    toast.info("Cleared read notifications");
  };

  const filtered = notifications.filter(
    (n) => filter === "ALL" || n.type === filter
  );

  const icons: Record<string, React.ReactNode> = {
    LEAD: <Users className="w-4 h-4" />,
    INVOICE: <FileText className="w-4 h-4" />,
    APPOINTMENT: <Calendar className="w-4 h-4" />,
    AI_ACTION: <Bot className="w-4 h-4" />,
    SYSTEM: <Activity className="w-4 h-4" />,
  };

  const colors: Record<string, string> = {
    LEAD: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    INVOICE: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    APPOINTMENT: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    AI_ACTION: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    SYSTEM: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  };

  const priorityColors: Record<string, string> = {
    HIGH: "text-red-400 bg-red-500/10 border-red-500/20",
    MEDIUM: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    LOW: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  };

  const filters: { key: NotifFilter; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "LEAD", label: "Leads" },
    { key: "INVOICE", label: "Invoices" },
    { key: "APPOINTMENT", label: "Bookings" },
    { key: "AI_ACTION", label: "AI Actions" },
  ];

  return (
    <div className="page-content max-w-4xl flex flex-col gap-8">
      {/* Header */}
      <div className="page-header pb-6 border-b border-white/8">
        <div>
          <h1 className="page-title text-2xl lg:text-3xl font-bold tracking-tight">
            <Bell className="w-6 h-6 text-blue-400" aria-hidden="true" />
            Activity & Notifications
            {unreadCount > 0 && (
              <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-red-500/30">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="page-subtitle text-slate-400 text-sm mt-1.5">
            Real-time operational alerts, lead triggers, automated invoices, and AI agent execution logs
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="md"
              leftIcon={<CheckCheck className="w-4 h-4" />}
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
          {notifications.some((n) => n.isRead) && (
            <Button
              variant="ghost"
              size="md"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={handleClearRead}
            >
              Clear read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white/[0.03] rounded-xl p-1.5 border border-white/8 w-fit overflow-x-auto max-w-full">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              filter === f.key
                ? "bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-7 h-7" />}
          title="No notifications"
          description="You're all caught up! New lead alerts, scheduled bookings, and AI actions will appear here."
        />
      ) : (
        <div className="space-y-3.5">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`glass-card p-5 sm:p-6 rounded-2xl flex items-start gap-5 cursor-pointer transition-all border ${
                !notif.isRead
                  ? "bg-white/[0.04] border-blue-500/30 shadow-md shadow-blue-500/5 hover:border-blue-500/40"
                  : "border-white/6 opacity-75 hover:opacity-100 hover:border-white/12"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 shadow-sm ${
                  colors[notif.type] || colors.SYSTEM
                }`}
              >
                {icons[notif.type] || icons.SYSTEM}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                  <p className="text-sm sm:text-base font-bold text-slate-100">{notif.title}</p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono uppercase tracking-wider ${
                      priorityColors[notif.priority] || priorityColors.LOW
                    }`}
                  >
                    {notif.priority}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{notif.body}</p>
                <p className="text-[11px] text-slate-500 mt-2 font-mono">
                  {formatRelativeTime(notif.createdAt)}
                </p>
              </div>
              {!notif.isRead && (
                <div
                  className="w-2.5 h-2.5 rounded-full bg-blue-400 flex-shrink-0 mt-2 shadow-[0_0_8px_rgba(96,165,250,0.8)]"
                  aria-label="Unread notification"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
