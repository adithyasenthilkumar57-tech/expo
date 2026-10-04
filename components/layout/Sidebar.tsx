"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import { Avatar } from "@/components/ui/Card";
import {
  LayoutDashboard, Users, FileText, Calendar, BookOpen,
  Settings, LogOut, Bot, Bell, ChevronRight, Zap, Menu, X,
  ChevronLeft
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Dashboard",     href: "/dashboard",               icon: LayoutDashboard },
  { label: "Leads & Inbox", href: "/dashboard/leads",         icon: Users },
  { label: "Invoices",      href: "/dashboard/invoices",      icon: FileText },
  { label: "Appointments",  href: "/dashboard/appointments",  icon: Calendar },
  { label: "Knowledge",     href: "/dashboard/knowledge",     icon: BookOpen },
  { label: "Settings",      href: "/dashboard/settings",      icon: Settings },
];

/* ─── Desktop Sidebar ─────────────────────────────────────────────── */
export function Sidebar() {
  const pathname = usePathname();
  const { user, business, notifications, logout } = useAuthStore();
  const unreadCount = (notifications || []).filter((n) => !n.isRead).length;
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <aside
      className={cn(
        "sidebar relative z-10 transition-all duration-300 flex-shrink-0 flex flex-col justify-between",
        collapsed ? "w-[72px]" : "w-[264px]"
      )}
      aria-label="Main navigation"
    >
      <div>
        {/* Logo */}
        <div className={cn("flex items-center gap-3.5 px-5 py-6 border-b border-white/6", collapsed && "justify-center px-3")}>
          <Link
            href="/"
            className={cn("flex items-center gap-3.5 group min-w-0", collapsed && "gap-0")}
            aria-label="OpsAgent home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-white leading-none tracking-tight">OpsAgent</p>
                <p className="text-[10.5px] text-slate-400 mt-1 font-medium tracking-wide">by CRESCONIX</p>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all flex-shrink-0",
              collapsed && "ml-0"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* AI Status */}
        {!collapsed && (
          <div className="mx-4 mt-4 mb-2 px-3.5 py-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/18">
            <div className="flex items-center gap-2.5">
              <div className="dot dot-live flex-shrink-0" aria-hidden="true" />
              <p className="text-xs text-emerald-300 font-semibold tracking-wide">AI Agent Active</p>
              <Zap className="w-3.5 h-3.5 text-emerald-400 ml-auto flex-shrink-0" aria-hidden="true" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="px-3.5 py-4 flex flex-col gap-1.5" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-item py-2.5 px-3.5 text-sm",
                  active && "active",
                  collapsed && "px-0 justify-center w-11 h-11 mx-auto"
                )}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="border-t border-white/6 p-3.5 flex flex-col gap-3 mt-auto">
        {/* Notifications */}
        <Link
          href="/dashboard/notifications"
          className={cn(
            "nav-item relative py-2.5 px-3.5 text-sm",
            pathname.startsWith("/dashboard/notifications") && "active",
            collapsed && "px-0 justify-center w-11 h-11 mx-auto"
          )}
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        >
          <Bell className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          {!collapsed && <span className="font-medium">Notifications</span>}
          {unreadCount > 0 && (
            <span
              className={cn(
                "bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-full flex items-center justify-center shadow-sm shadow-red-500/30",
                collapsed
                  ? "absolute -top-1 -right-1 w-4 h-4 text-[9px]"
                  : "ml-auto text-[10px] px-2 h-5 min-w-[20px]"
              )}
              aria-hidden="true"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        {/* Business info */}
        {!collapsed && business && (
          <div className="px-3 py-2.5 rounded-xl bg-white/[0.025] border border-white/6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm">
              {business.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-100 truncate">{business.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" aria-hidden="true" />
                <p className="text-[10px] text-slate-400 capitalize font-medium truncate">{business.plan.toLowerCase()} plan</p>
              </div>
            </div>
          </div>
        )}

        {/* User profile */}
        <div className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.025] border border-white/6", collapsed && "justify-center px-1")}>
          {user && <Avatar name={user.name} size="sm" />}
          {!collapsed && user && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
                <p className="text-[10.5px] text-slate-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-auto flex-shrink-0"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ─── Mobile: Slide-out Drawer + Bottom Navigation ─────────────────── */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, notifications, logout } = useAuthStore();
  const unreadCount = (notifications || []).filter((n) => !n.isRead).length;

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const bottomNavItems = [
    { label: "Home",     href: "/dashboard",              icon: LayoutDashboard },
    { label: "Leads",    href: "/dashboard/leads",        icon: Users },
    { label: "Invoices", href: "/dashboard/invoices",     icon: FileText },
    { label: "Calendar", href: "/dashboard/appointments", icon: Calendar },
    { label: "More",     href: "#",                       icon: Menu, isMore: true },
  ];

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav lg:hidden" aria-label="Mobile navigation">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          if (item.isMore) {
            return (
              <button
                key="more"
                onClick={() => setOpen(true)}
                className={cn("bottom-nav-item", open && "active")}
                aria-label="More navigation"
                aria-expanded={open}
              >
                <Icon aria-hidden="true" />
                <span>More</span>
              </button>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("bottom-nav-item", active && "active")}
              aria-current={active ? "page" : undefined}
            >
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" aria-modal="true" role="dialog" aria-label="Navigation menu">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <aside className="absolute right-0 top-0 bottom-0 w-[280px] sidebar flex flex-col anim-slide-right">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">OpsAgent</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">by CRESCONIX</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("nav-item", active && "active")}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <Link
                href="/dashboard/notifications"
                className={cn("nav-item relative", pathname.startsWith("/dashboard/notifications") && "active")}
              >
                <Bell className="w-4 h-4" aria-hidden="true" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 h-5 min-w-[20px] rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            </nav>

            {/* User */}
            <div className="border-t border-white/5 p-4">
              {user && (
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
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

/* Keep MobileSidebar as alias for backward compat */
export { MobileNav as MobileSidebar };
