"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;

  size?: "sm" | "md";
  disabled?: boolean;

  label?: string;
}

export function Switch({ checked, onChange, size = "md", disabled, label }: SwitchProps) {
  const trackW = size === "sm" ? 28 : 36;
  const trackH = size === "sm" ? 16 : 20;
  const thumbPx = size === "sm" ? 12 : 16;
  const onX = trackW - thumbPx - 2;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
        checked ? "bg-accent" : "bg-border",
        disabled && "cursor-not-allowed opacity-50"
      )}
      style={{ width: trackW, height: trackH }}
    >
      <span
        className="inline-block rounded-full bg-surface shadow transition-transform duration-150"
        style={{
          width: thumbPx,
          height: thumbPx,
          transform: `translateX(${checked ? onX : 2}px)`,
        }}
      />
    </button>
  );
}

export interface SwitchRowProps {
  label: ReactNode;
  hint?: string;
  children: ReactNode;

  labelRight?: boolean;
}

export function SwitchRow({ label, hint, children, labelRight }: SwitchRowProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3",
        labelRight ? "flex-row" : "flex-row-reverse justify-end"
      )}
    >
      {children}
      <span className="min-w-0">
        <span className="block text-sm font-medium text-text">{label}</span>
        {hint && <span className="block text-xs text-text-tertiary">{hint}</span>}
      </span>
    </label>
  );
}
