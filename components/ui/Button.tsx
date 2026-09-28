"use client";
import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger" | "success" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const sizeClasses = {
  sm: "btn btn-sm btn-ghost",
  md: "btn btn-ghost",
  lg: "btn btn-lg btn-ghost",
  xl: "btn btn-lg btn-ghost",
};

const variantClasses = {
  primary: "btn btn-primary",
  ghost: "btn btn-ghost",
  danger: "btn btn-danger",
  success: "btn btn-success",
  outline: "btn btn-ghost",
};

const combinedClasses: Record<string, Record<string, string>> = {
  primary: {
    sm: "btn btn-sm btn-primary",
    md: "btn btn-primary",
    lg: "btn btn-lg btn-primary",
    xl: "btn btn-primary" + " !text-base !px-8 !py-4",
  },
  ghost: {
    sm: "btn btn-sm btn-ghost",
    md: "btn btn-ghost",
    lg: "btn btn-lg btn-ghost",
    xl: "btn btn-ghost !text-base !px-8 !py-4",
  },
  danger: {
    sm: "btn btn-sm btn-danger",
    md: "btn btn-danger",
    lg: "btn btn-lg btn-danger",
    xl: "btn btn-danger !text-base",
  },
  success: {
    sm: "btn btn-sm btn-success",
    md: "btn btn-success",
    lg: "btn btn-lg btn-success",
    xl: "btn btn-success !text-base",
  },
  outline: {
    sm: "btn btn-sm btn-ghost",
    md: "btn btn-ghost",
    lg: "btn btn-lg btn-ghost",
    xl: "btn btn-ghost",
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "ghost", size = "md", isLoading, leftIcon, rightIcon, children, className = "", disabled, ...props }, ref) => {
    const base = combinedClasses[variant]?.[size] ?? "btn btn-ghost";
    return (
      <button
        ref={ref}
        className={`${base} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";
