"use client";

import { type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type BannerTone = "amber" | "rose" | "neutral";

interface BannerProps {
  tone: BannerTone;
  icon: LucideIcon;
  children: ReactNode;
  action?: string;
  onAction?: () => void;
}

const TONE_CLASS: Record<BannerTone, string> = {
  amber: "bg-warning-light text-warning",
  rose: "bg-error-light text-error",
  neutral: "bg-bg-secondary text-text-secondary",
};

export function Banner({ tone, icon: Icon, children, action, onAction }: BannerProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-wrap items-center gap-2 border-b border-border px-4 py-2.5 text-sm",
        TONE_CLASS[tone]
      )}
    >
      <Icon size={15} className="shrink-0" aria-hidden />
      <span className="flex-1">{children}</span>
      {action && (
        <button
          onClick={onAction}
          className="rounded px-2 py-0.5 text-sm font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          {action}
        </button>
      )}
    </div>
  );
}
