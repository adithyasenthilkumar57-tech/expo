"use client";
import { useState } from "react";
import { mockNotifications } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Users, FileText, Calendar, Bot, Activity, Bell, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, isRead: true })));
  const unreadCount = notifications.filter(n => !n.isRead).length;

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
    HIGH: "text-red-400",
    MEDIUM: "text-amber-400",
    LOW: "text-slate-500",
  };

  return (
    <div className="p-6 lg:p-8 max-w-[800px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-400" />
            Notifications
            {unreadCount > 0 && (
              <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">{unreadCount}</span>
            )}
          </h1>
          <p className="text-sm text-slate-500">All alerts and AI agent activity</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" leftIcon={<CheckCheck className="w-3.5 h-3.5" />} onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {notifications.map(notif => (
          <div
            key={notif.id}
            onClick={() => setNotifications(n => n.map(x => x.id === notif.id ? { ...x, isRead: true } : x))}
            className={`glass-card p-4 flex items-start gap-4 cursor-pointer transition-all ${!notif.isRead ? "!bg-white/5 !border-white/12" : "opacity-80"}`}
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${colors[notif.type]}`}>
              {icons[notif.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold text-slate-200">{notif.title}</p>
                <span className={`text-[10px] font-semibold ${priorityColors[notif.priority]}`}>{notif.priority}</span>
              </div>
              <p className="text-sm text-slate-400">{notif.body}</p>
              <p className="text-[11px] text-slate-600 mt-1">{formatRelativeTime(notif.createdAt)}</p>
            </div>
            {!notif.isRead && (
              <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
