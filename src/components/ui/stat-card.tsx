"use client";

import { cn } from "@/lib/utils";

type StatTone = "pine" | "amber" | "rose" | "neutral";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  tone?: StatTone;
  ring?: number;
  loading?: boolean;
  errored?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

const TONE_TEXT: Record<StatTone, string> = {
  pine: "text-accent",
  amber: "text-warning",
  rose: "text-error",
  neutral: "text-text",
};

const TONE_STROKE: Record<StatTone, string> = {
  pine: "var(--color-accent)",
  amber: "var(--color-warning)",
  rose: "var(--color-error)",
  neutral: "var(--color-text)",
};

export function StatCard({
  label,
  value,
  sub,
  tone = "neutral",
  ring: ringValue,
  loading,
  errored,
  onClick,
  compact,
}: StatCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || errored}
      className={cn(
        "relative flex items-center rounded-lg border border-border bg-surface text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        "disabled:cursor-default",
        compact ? "gap-3 p-3" : "gap-4 p-4"
      )}
    >
      {ringValue !== undefined && (
        <span className={cn("relative flex shrink-0 items-center justify-center", compact ? "h-8 w-8" : "h-11 w-11")}>
          <svg viewBox="0 0 40 40" className={cn("-rotate-90", compact ? "h-8 w-8" : "h-11 w-11")}>
            <circle cx="20" cy="20" r="16" fill="none" stroke="var(--color-bg-secondary)" strokeWidth="4" />
            {!loading && !errored && (
              <circle
                cx="20" cy="20" r="16" fill="none" stroke={TONE_STROKE[tone]} strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${(ringValue / 100) * 100.5} 100.5`}
              />
            )}
          </svg>
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium uppercase tracking-wider text-text-secondary">{label}</span>
        {loading ? (
          <span className={cn("block animate-pulse rounded bg-bg-secondary", compact ? "mt-1 h-5 w-16" : "mt-1.5 h-6 w-20")} />
        ) : (
          <span
            className={cn(
              "mt-0.5 block font-semibold tabular-nums",
              compact ? "text-xl" : "text-2xl",
              errored ? "text-text-tertiary" : TONE_TEXT[tone]
            )}
          >
            {errored ? "\u2014" : value}
          </span>
        )}
        {!compact && (
          <span className={cn("mt-0.5 block truncate text-xs", errored ? "text-error" : "text-text-secondary")}>
            {loading ? "\u00A0" : errored ? "Couldn't load \u00B7 Retry" : sub}
          </span>
        )}
      </span>
    </button>
  );
}
