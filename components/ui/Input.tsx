"use client";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ─── Input ────────────────────────────────────────────────────────── */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      leftElement,
      rightElement,
      containerClassName,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-300 leading-none"
          >
            {label}
            {props.required && (
              <span className="text-red-400 ml-1" aria-label="required">*</span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftElement && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none flex items-center"
              aria-hidden="true"
            >
              {leftElement}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "input",
              leftElement && "pl-9",
              rightElement && "pr-9",
              error && "error",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {rightElement && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {rightElement}
            </span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-400 flex items-center gap-1.5 mt-0.5" role="alert">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-slate-600 mt-0.5">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

/* ─── Textarea ─────────────────────────────────────────────────────── */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, containerClassName, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300 leading-none">
            {label}
            {props.required && (
              <span className="text-red-400 ml-1" aria-label="required">*</span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          className={cn("input", error && "error", className)}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-400 flex items-center gap-1.5" role="alert">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-slate-600">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
