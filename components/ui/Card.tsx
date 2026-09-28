"use client";
import { HTMLAttributes, forwardRef } from "react";

// ─── Card ────────────────────────────────────────────────────────────────────
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  accent?: boolean;
  glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ interactive, accent, glow, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          card
          ${interactive ? "card-interactive" : ""}
          ${accent ? "card-accent" : ""}
          ${glow ? "shadow-blue" : ""}
          ${className}
        `}
        style={glow ? { boxShadow: "var(--shadow-md), var(--shadow-blue)" } : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

// ─── MetricCard ──────────────────────────────────────────────────────────────
interface MetricCardProps {
  title?: string;
  label?: string;
  value: string | number;
  subtitle?: string;
  subtext?: string;
  subtextColor?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: string; up?: boolean };
  accentBar?: string;
  className?: string;
}

export function MetricCard({
  title,
  label,
  value,
  subtitle,
  subtext,
  subtextColor,
  change,
  changeType = "positive",
  icon,
  iconColor = "blue",
  iconBg,
  trend,
  accentBar,
  className = "",
}: MetricCardProps) {
  const displayTitle = title || label || "";
  const displaySubtext = subtitle || subtext || "";

  // Color mappings
  const colorStyles: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    red: {
      bg: "rgba(239, 68, 68, 0.12)",
      text: "#F87171",
      border: "rgba(239, 68, 68, 0.25)",
      glow: "rgba(239, 68, 68, 0.15)",
    },
    blue: {
      bg: "rgba(59, 130, 246, 0.12)",
      text: "#60A5FA",
      border: "rgba(59, 130, 246, 0.25)",
      glow: "rgba(59, 130, 246, 0.15)",
    },
    amber: {
      bg: "rgba(245, 158, 11, 0.12)",
      text: "#FBBF24",
      border: "rgba(245, 158, 11, 0.25)",
      glow: "rgba(245, 158, 11, 0.15)",
    },
    green: {
      bg: "rgba(16, 185, 129, 0.12)",
      text: "#34D399",
      border: "rgba(16, 185, 129, 0.25)",
      glow: "rgba(16, 185, 129, 0.15)",
    },
  };

  const currentTheme = colorStyles[iconColor] || {
    bg: iconBg || "rgba(59, 130, 246, 0.12)",
    text: iconColor.startsWith("#") ? iconColor : "#60A5FA",
    border: "rgba(255, 255, 255, 0.1)",
    glow: "rgba(59, 130, 246, 0.15)",
  };

  return (
    <div
      className={`glass-card p-5 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300 ${className}`}
      style={{
        boxShadow: `0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
      }}
    >
      {/* Subtle top edge glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: accentBar || `linear-gradient(90deg, transparent, ${currentTheme.text}, transparent)`,
        }}
      />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1 truncate">
            {displayTitle}
          </p>
          <div className="flex items-baseline gap-2">
            <span
              className="text-3xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {value}
            </span>
          </div>
        </div>

        {icon && (
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{
              background: currentTheme.bg,
              color: currentTheme.text,
              border: `1px solid ${currentTheme.border}`,
              boxShadow: `0 0 15px ${currentTheme.glow}`,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-white/5 text-xs">
        {displaySubtext && (
          <p className="text-slate-400 truncate font-medium" style={{ color: subtextColor }}>
            {displaySubtext}
          </p>
        )}

        {change && (
          <span
            className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[11px] flex-shrink-0 ${
              changeType === "positive"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : changeType === "negative"
                ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                : "bg-slate-700/40 text-slate-300 border border-slate-600/40"
            }`}
          >
            {changeType === "positive" ? "↑" : changeType === "negative" ? "↓" : "•"} {change}
          </span>
        )}

        {trend && (
          <span
            className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[11px] flex-shrink-0 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          >
            {trend.up !== false ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
];

interface AvatarProps {
  name: string;
  src?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizePx: Record<string, string> = {
  xs: "24px", sm: "30px", md: "36px", lg: "44px", xl: "56px",
};
const sizeFontPx: Record<string, string> = {
  xs: "9px", sm: "11px", md: "13px", lg: "16px", xl: "20px",
};

export function Avatar({ name, src, size = "md", className = "" }: AvatarProps) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const colorIdx = name.charCodeAt(0) % AVATAR_COLORS.length;
  const wh = sizePx[size];
  return (
    <div
      className={`rounded-full flex items-center justify-center flex-shrink-0 font-bold bg-gradient-to-br ${AVATAR_COLORS[colorIdx]} ${className}`}
      style={{ width: wh, height: wh, fontSize: sizeFontPx[size], color: "#fff" }}
    >
      {src ? <img src={src} alt={name} style={{ width: wh, height: wh, borderRadius: "50%", objectFit: "cover" }} /> : initials}
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────
interface BadgeProps {
  variant?: "hot" | "warm" | "cold" | "success" | "warning" | "error" | "info" | "purple" | "neutral";
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const badgeVariants: Record<string, string> = {
  hot: "badge-hot", warm: "badge-warm", cold: "badge-cold",
  success: "badge-success", warning: "badge-warning", error: "badge-error",
  info: "badge-info", purple: "badge-purple", neutral: "badge-neutral",
};

const dotColors: Record<string, string> = {
  hot: "bg-red-400", warm: "bg-amber-400", cold: "bg-blue-400",
  success: "bg-emerald-400", warning: "bg-amber-400", error: "bg-red-400",
  info: "bg-blue-400", purple: "bg-purple-400", neutral: "bg-slate-400",
};

export function Badge({ variant = "neutral", children, dot, className = "" }: BadgeProps) {
  return (
    <span className={`badge ${badgeVariants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", color: "var(--text-muted)" }}>
          {icon}
        </div>
      )}
      <p className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{title}</p>
      {description && <p className="text-sm mb-6 max-w-xs" style={{ color: "var(--text-muted)" }}>{description}</p>}
      {action}
    </div>
  );
}

// ─── CardHeader ─────────────────────────────────────────────────────────────
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, icon, action, className = "" }: CardHeaderProps) {
  return (
    <div className={`flex items-start justify-between mb-4 gap-3 ${className}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/20 flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight text-white truncate">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ─── ProgressBar ────────────────────────────────────────────────────────────
export function ProgressBar({
  value,
  max = 100,
  className = "",
  color,
}: {
  value: number;
  max?: number;
  className?: string;
  color?: string;
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const defaultGradient = percentage >= 70
    ? "from-emerald-500 to-teal-400"
    : percentage >= 40
    ? "from-blue-500 to-cyan-400"
    : "from-amber-500 to-rose-400";

  return (
    <div className={`w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden border border-white/5 relative ${className}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color || defaultGradient} transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// ─── LoadingSpinner ──────────────────────────────────────────────────────────
export function LoadingSpinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };
  return (
    <div
      className={`inline-block animate-spin rounded-full border-blue-500 border-t-transparent ${sizeMap[size]} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton ${className}`} style={style} />;
}
