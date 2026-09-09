"use client";

import { cn } from "@/lib/utils";

interface FieldCounter {
  text: string;
  warn?: boolean;
}

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  counter?: FieldCounter;

  messageId?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  counter,
  messageId,
  children,
}: FieldProps) {
  const message = error || hint;
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-1 text-[13px] font-medium text-text"
        >
          {label}
          {required && (
            <span className="text-error" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      {children}
      <div className="flex items-start justify-between gap-3">
        <p
          id={messageId}
          className={cn("text-xs leading-snug", error ? "text-error" : "text-text-secondary")}
        >
          {message || "\u00A0"}
        </p>
        {counter && (
          <span
            className={cn(
              "shrink-0 text-xs tabular-nums",
              counter.warn ? "text-error" : "text-text-tertiary"
            )}
          >
            {counter.text}
          </span>
        )}
      </div>
    </div>
  );
}

export const controlBase = cn(
  "w-full rounded-lg border text-sm bg-surface text-text transition-colors",
  "placeholder:text-text-tertiary",
  "focus:outline-none focus-visible:border-accent",
  "disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-60",
  "read-only:bg-bg-secondary"
);

export function controlClasses(error?: string, disabled?: boolean, readOnly?: boolean) {
  return cn(
    error ? "border-error focus-visible:border-error" : "border-border",
    readOnly && "read-only:bg-bg-secondary",
    disabled && "text-text-tertiary"
  );
}
