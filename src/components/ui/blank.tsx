"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type BlankTone = "rose" | "amber" | "neutral";

interface BlankProps {
  icon?: LucideIcon;
  title: string;
  body: string;
  primary?: string;
  secondary?: string;
  mono?: string;
  tone?: BlankTone;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

const TONE_TEXT: Record<BlankTone, string> = {
  rose: "text-error",
  amber: "text-warning",
  neutral: "text-text-tertiary",
};

/**
 * Blank — empty/error state for tables.
 * Use when the table has no rows to show (empty, filtered-empty, error, forbidden).
 */
export function Blank({
  icon: Icon,
  title,
  body,
  primary,
  secondary,
  mono,
  tone = "neutral",
  onPrimary,
  onSecondary,
}: BlankProps) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      {Icon && <Icon size={22} className={TONE_TEXT[tone]} aria-hidden />}
      <p className="mt-3 text-base font-medium text-text">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-text-secondary">{body}</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {primary && (
          <Button onClick={onPrimary}>{primary}</Button>
        )}
        {secondary && (
          <Button variant="secondary" onClick={onSecondary}>{secondary}</Button>
        )}
      </div>
      {mono && <p className="mt-5 font-mono text-[11px] text-text-tertiary">{mono}</p>}
    </div>
  );
}
