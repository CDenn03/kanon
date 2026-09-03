"use client";

import { cn } from "@/lib/utils";

export interface ButtonGroupOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

interface ButtonGroupProps {
  options: ButtonGroupOption[];
  value: string;
  onChange: (value: string) => void;
  "aria-label"?: string;
  className?: string;
}

/**
 * ButtonGroup — a segmented set of connected buttons for a single choice
 * (like a compact toggle group). For tab-like navigation use Tabs.
 */
export function ButtonGroup({ options, value, onChange, className, ...rest }: ButtonGroupProps) {
  return (
    <div
      role="group"
      aria-label={rest["aria-label"]}
      className={cn("inline-flex overflow-hidden rounded-lg border border-border", className)}
    >
      {options.map((opt, i) => {
        const on = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={on}
            disabled={opt.disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
              i > 0 && "border-l border-border",
              on ? "bg-accent text-on-accent" : "bg-surface text-text-secondary hover:bg-bg-hover hover:text-text",
              opt.disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Toolbar — a horizontal container that groups actions/controls with
 * consistent spacing and keyboard semantics.
 */
export function Toolbar({ children, className, "aria-label": ariaLabel }: { children: React.ReactNode; className?: string; "aria-label"?: string }) {
  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-2", className)}
    >
      {children}
    </div>
  );
}
