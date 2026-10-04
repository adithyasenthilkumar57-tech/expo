"use client";
import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger" | "success" | "outline";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantMap: Record<string, string> = {
  primary: "btn btn-primary",
  ghost:   "btn btn-ghost",
  danger:  "btn btn-danger",
  success: "btn btn-success",
  outline: "btn btn-ghost border border-white/14 hover:border-white/24",
};

const sizeMap: Record<string, string> = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
  xl: "btn-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "ghost",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      variantMap[variant] ?? "btn btn-ghost",
      sizeMap[size],
      className
    );

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : leftIcon ? (
          <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>
        ) : null}

        <span>{children}</span>

        {!isLoading && rightIcon && (
          <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
