"use client";

import { Check as CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: () => void;

  ariaLabel?: string;
}

export function Checkbox({ checked, indeterminate, disabled, onChange, ariaLabel }: CheckboxProps) {
  const on = checked || indeterminate;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : Boolean(checked)}
      aria-label={ariaLabel}
      className={cn(
        "flex h-4 w-4 items-center justify-center rounded-sm border transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        on ? "border-accent bg-accent" : "border-border bg-surface",
        !on && disabled && "bg-bg-secondary"
      )}
    >
      {indeterminate ? (
        <span className="h-0.5 w-2 rounded-full bg-on-accent" />
      ) : checked ? (
        <CheckIcon size={11} strokeWidth={3} className="text-on-accent" />
      ) : null}
    </button>
  );
}
