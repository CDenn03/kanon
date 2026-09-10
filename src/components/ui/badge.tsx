import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "pine" | "amber" | "rose" | "neutral";

interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}

const TONE_CLASS: Record<BadgeTone, string> = {
  pine: "bg-accent-light text-accent",
  amber: "bg-warning-light text-warning",
  rose: "bg-error-light text-error",
  neutral: "bg-bg-secondary text-text-secondary",
};

export function Badge({ tone = "neutral", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        TONE_CLASS[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
