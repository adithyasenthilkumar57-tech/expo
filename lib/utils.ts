import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { LeadStatus, InvoiceStatus, AppointmentStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", options || {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function getLeadStatusConfig(status: LeadStatus) {
  const configs: Record<LeadStatus, { label: string; className: string; badgeVariant: string; dotClass: string; color: string }> = {
    HOT:  { label: "Hot",  className: "badge-hot",  badgeVariant: "hot",  dotClass: "hot",  color: "#EF4444" },
    WARM: { label: "Warm", className: "badge-warm", badgeVariant: "warm", dotClass: "warm", color: "#F59E0B" },
    COLD: { label: "Cold", className: "badge-cold", badgeVariant: "cold", dotClass: "cold", color: "#3B82F6" },
  };
  return configs[status];
}

export function getInvoiceStatusConfig(status: InvoiceStatus) {
  const configs = {
    DRAFT: { label: "Draft", className: "badge-neutral", color: "#94A3B8" },
    SENT: { label: "Sent", className: "badge-info", color: "#3B82F6" },
    VIEWED: { label: "Viewed", className: "badge-purple", color: "#8B5CF6" },
    OVERDUE: { label: "Overdue", className: "badge-error", color: "#EF4444" },
    PAID: { label: "Paid", className: "badge-success", color: "#10B981" },
  };
  return configs[status];
}

export function getAppointmentStatusConfig(status: AppointmentStatus) {
  const configs = {
    CONFIRMED: { label: "Confirmed", className: "badge-success", color: "#10B981" },
    PENDING: { label: "Pending", className: "badge-warning", color: "#F59E0B" },
    CANCELLED: { label: "Cancelled", className: "badge-error", color: "#EF4444" },
    NO_SHOW: { label: "No Show", className: "badge-error", color: "#EF4444" },
  };
  return configs[status];
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}

export function daysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}

export function generateId(prefix = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatPercentChange(current: number, previous: number): string {
  if (previous === 0) return "+100%";
  const change = ((current - previous) / previous) * 100;
  return `${change > 0 ? "+" : ""}${change.toFixed(0)}%`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
