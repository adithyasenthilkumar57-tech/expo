"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import { Avatar } from "@/components/ui/Card";
import { mockNotifications } from "@/lib/mock-data";
import {
  LayoutDashboard, Users, FileText, Calendar, BookOpen,
  Settings, LogOut, Bot, Bell, ChevronRight, Zap, Menu, X
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads & Inbox", href: "/dashboard/leads", icon: Users },
  { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { label: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { label: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, business, logout } = useAuthStore();
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "sidebar flex flex-col h-full transition-all duration-300 relative z-10",
      collapsed ? "w-[72px]" : "w-[260px]"
    )}>
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-5 py-5 border-b border-white/5", collapsed && "px-3 justify-center")}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
          <Bot className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-white leading-none tracking-tight">OpsAgent</p>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">by CRESCONIX</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn("ml-auto text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors", collapsed && "ml-0")}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* AI Status indicator */}
      {!collapsed && (
        <div className="mx-3.5 mt-3.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <p className="text-[11px] text-emerald-300 font-semibold tracking-wide">AI Agent Online</p>
            <Zap className="w-3.5 h-3.5 text-emerald-400 ml-auto" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("nav-item", isActive && "active", collapsed && "px-0 justify-center w-11 h-11 mx-auto")}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/8 p-3 flex flex-col gap-2.5 mt-auto">
        {/* Notifications */}
        <Link
          href="/dashboard/notifications"
          className={cn("nav-item relative", collapsed && "px-0 justify-center w-11 h-11 mx-auto")}
        >
          <Bell className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Notifications</span>}
          {unreadCount > 0 && (
            <span className={cn(
              "bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30",
              collapsed ? "absolute -top-1 -right-1 w-4 h-4" : "ml-auto px-1.5 h-5 min-w-[20px]"
            )}>
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Business info */}
        {!collapsed && business && (
          <div className="glass-card !rounded-xl p-2.5 flex items-center gap-2.5 border border-white/10 bg-white/[0.02]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-md shadow-blue-500/20">
              {business.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-100 truncate">{business.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <p className="text-[10px] text-slate-400 capitalize font-medium">{business.plan.toLowerCase()} plan</p>
              </div>
            </div>
          </div>
        )}

        {/* User profile */}
        <div className={cn("flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-white/[0.02] border border-white/5", collapsed && "justify-center px-1")}>
          {user && <Avatar name={user.name} size="sm" />}
          {!collapsed && user && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-auto"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, business, logout } = useAuthStore();
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-[240px] sidebar flex flex-col">
            <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">OpsAgent</p>
                <p className="text-[10px] text-slate-500 mt-0.5">by CRESCONIX</p>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-3 flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn("nav-item", isActive && "active")}>
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-white/5 p-3">
              {user && (
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <Avatar name={user.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-300 truncate">{user.name}</p>
                  </div>
                  <button onClick={logout} className="text-slate-600 hover:text-red-400 transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
