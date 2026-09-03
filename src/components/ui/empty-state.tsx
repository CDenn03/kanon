"use client";

import { type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  body?: string;
  /** Action slot — usually one or two Buttons. */
  actions?: ReactNode;
  /** Compact reduces vertical padding for inline use. */
  compact?: boolean;
  className?: string;
}

/**
 * EmptyState — a general page-level empty/zero state: icon, title, body and
 * actions, centered. Use Blank for table-scoped empties.
 */
export function EmptyState({ icon: Icon, title, body, actions, compact, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-border bg-surface text-center",
        compact ? "px-6 py-8" : "px-6 py-16",
        className
      )}
    >
      {Icon && (
        <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent-light text-accent">
          <Icon size={22} aria-hidden />
        </span>
      )}
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {body && <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-text-secondary">{body}</p>}
      {actions && <div className="mt-5 flex flex-wrap items-center justify-center gap-2">{actions}</div>}
    </div>
  );
}
