"use client";
import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ─── Card ────────────────────────────────────────────────────────────────── */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  accent?: boolean;
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ interactive, accent, hover, className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "card",
        interactive && "card-interactive",
        accent && "card-accent",
        hover && "card-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

/* ─── CardHeader ──────────────────────────────────────────────────────────── */
export function CardHeader({
  title,
  subtitle,
  icon,
  action,
  className = "",
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between pb-4 mb-6 border-b border-white/6", className)}>
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <span className="flex-shrink-0 text-blue-400" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-100 tracking-tight truncate">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1 leading-relaxed truncate">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  );
}

/* ─── MetricCard ──────────────────────────────────────────────────────────── */
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  iconColor?: "blue" | "red" | "amber" | "green" | "purple" | "cyan";
  className?: string;
}

const iconColorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue:   { bg: "rgba(59,130,246,0.12)",  text: "#60A5FA", border: "rgba(59,130,246,0.22)" },
  red:    { bg: "rgba(239,68,68,0.12)",   text: "#F87171", border: "rgba(239,68,68,0.22)" },
  amber:  { bg: "rgba(245,158,11,0.12)",  text: "#FCD34D", border: "rgba(245,158,11,0.22)" },
  green:  { bg: "rgba(16,185,129,0.12)",  text: "#34D399", border: "rgba(16,185,129,0.22)" },
  purple: { bg: "rgba(139,92,246,0.12)",  text: "#A78BFA", border: "rgba(139,92,246,0.22)" },
  cyan:   { bg: "rgba(6,182,212,0.12)",   text: "#67E8F9", border: "rgba(6,182,212,0.22)" },
};

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  changeType = "positive",
  icon,
  iconColor = "blue",
  className = "",
}: MetricCardProps) {
  const colors = iconColorMap[iconColor] ?? iconColorMap.blue;
  const changeStyles = {
    positive: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    negative: "text-red-400 bg-red-500/10 border-red-500/25",
    neutral:  "text-slate-400 bg-white/5 border-white/10",
  };

  return (
    <div className={cn("glass-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between gap-4 border border-white/8 shadow-md min-h-[160px]", className)}>
      <div>
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
          {icon && (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
        </div>

        <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">{value}</p>

        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{subtitle}</p>
        )}
      </div>

      {change && (
        <div className="pt-2.5 border-t border-white/6 flex items-center">
          <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border font-mono", changeStyles[changeType])}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Avatar ──────────────────────────────────────────────────────────────── */
const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-600",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

interface AvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  src?: string;
  className?: string;
}

const avatarSizes = {
  xs: { wrap: "w-6 h-6", text: "text-[9px]" },
  sm: { wrap: "w-8 h-8", text: "text-[11px]" },
  md: { wrap: "w-10 h-10", text: "text-sm" },
  lg: { wrap: "w-12 h-12", text: "text-base" },
  xl: { wrap: "w-16 h-16", text: "text-xl" },
};

export function Avatar({ name, size = "md", src, className = "" }: AvatarProps) {
  const { wrap, text } = avatarSizes[size];
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
  const colorClass = getAvatarColor(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover flex-shrink-0", wrap, className)}
      />
    );
  }

  return (
    <div
      className={cn(
        `bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 shadow-sm`,
        wrap,
        text,
        className
      )}
      aria-label={name}
      role="img"
    >
      {initials}
    </div>
  );
}

/* ─── Badge ───────────────────────────────────────────────────────────────── */
interface BadgeProps {
  children: React.ReactNode;
  variant?: "hot" | "warm" | "cold" | "success" | "warning" | "error" | "info" | "purple" | "neutral";
  className?: string;
}

export function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  return (
    <span className={cn(`badge badge-${variant}`, className)}>
      {children}
    </span>
  );
}

/* ─── EmptyState ──────────────────────────────────────────────────────────── */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 px-8 text-center", className)}>
      {icon && (
        <div
          className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-6 text-slate-400 shadow-lg shadow-black/20"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-slate-100 mb-2 tracking-tight">{title}</h3>
      {description && (
        <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

/* ─── LoadingSpinner ──────────────────────────────────────────────────────── */
export function LoadingSpinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div className={cn("flex items-center justify-center", className)} role="status" aria-label="Loading">
      <div className={cn("rounded-full border-2 border-blue-500/20 border-t-blue-500 anim-spin", sizes[size])} />
    </div>
  );
}

/* ─── ProgressBar ─────────────────────────────────────────────────────────── */
export function ProgressBar({
  value,
  max = 100,
  className = "",
  color,
  variant,
}: {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  variant?: "default" | "success" | "warning" | "danger" | string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const variantColor =
    variant === "success"
      ? "#10B981"
      : variant === "warning"
      ? "#F59E0B"
      : variant === "danger"
      ? "#EF4444"
      : undefined;
  const barColor =
    color ??
    variantColor ??
    (value >= 80 ? "#10B981" : value >= 60 ? "#F59E0B" : "#3B82F6");

  return (
    <div className={cn("progress-track", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div
        className="progress-fill"
        style={{ width: `${pct}%`, background: `${barColor}` }}
      />
    </div>
  );
}

/* ─── Skeleton ────────────────────────────────────────────────────────────── */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden="true" />;
}

/* ─── Toast Provider ──────────────────────────────────────────────────────── */
export function ToastContainer({ children }: { children?: React.ReactNode }) {
  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {children}
    </div>
  );
}
