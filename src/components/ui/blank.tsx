"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type BlankTone = "rose" | "amber" | "neutral";

interface BlankProps {
  icon?: LucideIcon;
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
  mono?: string;
  tone?: BlankTone;
}

const TONE_TEXT: Record<BlankTone, string> = {
  rose: "text-error",
  amber: "text-warning",
  neutral: "text-text-tertiary",
};

export function Blank({
  icon: Icon,
  title,
  body,
  action,
  onAction,
  mono,
  tone = "neutral",
}: BlankProps) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      {Icon && <Icon size={22} className={TONE_TEXT[tone]} aria-hidden />}
      <p className="mt-3 text-base font-medium text-text">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-text-secondary">{body}</p>
      {action && (
        <div className="mt-4">
          <Button onClick={onAction}>{action}</Button>
        </div>
      )}
      {mono && <p className="mt-5 font-mono text-[11px] text-text-tertiary">{mono}</p>}
    </div>
  );
}
