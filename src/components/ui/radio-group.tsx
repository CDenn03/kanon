"use client";

import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  /** "list" (default) renders stacked radios; "card" renders bordered option cards. */
  variant?: "list" | "card";
  disabled?: boolean;
}

/**
 * RadioGroup — accessible fieldset of radio buttons. Supports a simple
 * stacked list and a card variant with descriptions.
 */
export function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  variant = "list",
  disabled,
}: RadioGroupProps) {
  if (variant === "card") {
    return (
      <fieldset className="min-w-0" disabled={disabled}>
        {label && <legend className="mb-2 text-[13px] font-medium text-text">{label}</legend>}
        <div className="grid gap-2">
          {options.map((opt) => {
            const on = opt.value === value;
            const off = opt.disabled || disabled;
            return (
              <label
                key={opt.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                  "focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2",
                  on ? "border-accent bg-accent-light" : "border-border bg-surface hover:border-border-hover",
                  off && "cursor-not-allowed opacity-50"
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={on}
                  disabled={off}
                  onChange={() => onChange(opt.value)}
                  className="sr-only"
                />
                <span className={cn(
                  "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                  on ? "border-accent" : "border-border"
                )}>
                  {on && <span className="size-2 rounded-full bg-accent" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-text">{opt.label}</span>
                  {opt.description && (
                    <span className="mt-0.5 block text-sm text-text-secondary">{opt.description}</span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  return (
    <fieldset className="min-w-0" disabled={disabled}>
      {label && <legend className="mb-2 text-[13px] font-medium text-text">{label}</legend>}
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const on = opt.value === value;
          const off = opt.disabled || disabled;
          return (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-2.5",
                off && "cursor-not-allowed opacity-50"
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={on}
                disabled={off}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                on ? "border-accent" : "border-border"
              )}>
                {on && <span className="size-2 rounded-full bg-accent" />}
              </span>
              <span className="text-sm text-text">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
