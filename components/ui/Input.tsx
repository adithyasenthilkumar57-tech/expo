"use client";
import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftElement, rightElement, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex-shrink-0" style={{ color: "var(--text-muted)" }}>
              {leftElement}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`input ${error ? "error" : ""} ${leftElement ? "!pl-10" : ""} ${rightElement ? "!pr-10" : ""} ${className}`}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex-shrink-0">
              {rightElement}
            </span>
          )}
        </div>
        {hint && !error && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{hint}</p>}
        {error && <p className="text-xs" style={{ color: "var(--danger)" }}>{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`input ${error ? "error" : ""} ${className}`}
          {...props}
        />
        {hint && !error && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{hint}</p>}
        {error && <p className="text-xs" style={{ color: "var(--danger)" }}>{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
