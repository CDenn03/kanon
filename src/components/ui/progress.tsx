"use client";

import { cn } from "@/lib/utils";

type ProgressTone = "accent" | "warning" | "error";

const TONE: Record<ProgressTone, string> = {
  accent: "bg-accent",
  warning: "bg-warning",
  error: "bg-error",
};

interface ProgressProps {
  /** 0–100. Omit (or pass null) for an indeterminate bar. */
  value?: number | null;
  tone?: ProgressTone;
  /** Show the numeric percentage label above the bar. */
  showValue?: boolean;
  label?: string;
  className?: string;
}

/**
 * Progress — a linear progress bar. Determinate when `value` is a number
 * (0–100); indeterminate (looping) when `value` is null/undefined.
 */
export function Progress({ value, tone = "accent", showValue, label, className }: ProgressProps) {
  const indeterminate = value === null || value === undefined;
  const pct = indeterminate ? 0 : Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && <span className="font-medium text-text">{label}</span>}
          {showValue && !indeterminate && <span className="tabular-nums text-text-secondary">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
        className="h-2 w-full overflow-hidden rounded-full bg-bg-active"
      >
        {indeterminate ? (
          <div className={cn("h-full w-1/3 rounded-full", TONE[tone], "animate-[progress-indeterminate_1.2s_ease-in-out_infinite]")} />
        ) : (
          <div
            className={cn("h-full rounded-full transition-[width] duration-300", TONE[tone])}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
}
