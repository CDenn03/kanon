"use client";

import { cn } from "@/lib/utils";

type ExceptionTone = "pine" | "amber" | "neutral";

interface ExceptionStripItem {
  label: string;
  value: string;
  tone?: ExceptionTone;
}

interface ExceptionStripProps {
  items: ExceptionStripItem[];
  loading?: boolean;
  errored?: boolean;
  asOf?: string;
}

const TONE_TEXT: Record<ExceptionTone, string> = {
  pine: "text-accent",
  amber: "text-warning",
  neutral: "text-text",
};

/**
 * ExceptionStrip — single-line compact stat bar.
 * 44px instead of 118px. The only form that should render below sm,
 * where stacked cards would push the table off-screen.
 */
export function ExceptionStrip({ items, loading, errored, asOf }: ExceptionStripProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1 rounded-lg border border-border bg-surface px-2 py-1.5">
      {items.map((it, i) => (
        <span key={it.label} className="flex items-center">
          {i > 0 && <span className="mx-1 h-4 w-px bg-border" />}
          <button
            disabled={loading || errored}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-default"
          >
            <span className="text-text-secondary">{it.label}</span>
            {loading ? (
              <span className="block h-3.5 w-8 animate-pulse rounded bg-bg-secondary" />
            ) : (
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  errored ? "text-text-tertiary" : TONE_TEXT[it.tone || "neutral"]
                )}
              >
                {errored ? "\u2014" : it.value}
              </span>
            )}
          </button>
        </span>
      ))}
      {asOf && (
        <span className="ml-auto pr-1 font-mono text-[10px] text-text-tertiary">as of {asOf}</span>
      )}
    </div>
  );
}
