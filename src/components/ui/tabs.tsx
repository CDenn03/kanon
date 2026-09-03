"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
  count?: number;
  urgent?: boolean;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  variant?: "underline" | "segmented";
}

export function Tabs({ items, value, onChange, variant = "underline" }: TabsProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (e: React.KeyboardEvent) => {
    const enabled = items.filter((i) => !i.disabled);
    const i = enabled.findIndex((t) => t.id === value);
    let next: string | undefined;
    if (e.key === "ArrowRight") next = enabled[(i + 1) % enabled.length]?.id;
    else if (e.key === "ArrowLeft") next = enabled[(i - 1 + enabled.length) % enabled.length]?.id;
    else if (e.key === "Home") next = enabled[0]?.id;
    else if (e.key === "End") next = enabled[enabled.length - 1]?.id;
    if (!next) return;
    e.preventDefault();
    onChange(next);
    refs.current[next]?.focus();
  };

  if (variant === "segmented") {
    return (
      <div
        role="tablist"
        onKeyDown={onKeyDown}
        className="inline-flex rounded-md border border-border bg-bg-secondary p-0.5"
      >
        {items.map((it) => {
          const on = it.id === value;
          return (
            <button
              key={it.id}
              ref={(el) => { refs.current[it.id] = el; }}
              role="tab"
              aria-selected={on}
              onClick={() => !it.disabled && onChange(it.id)}
              disabled={it.disabled}
              className={cn(
                "rounded px-3 py-1 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                "disabled:cursor-not-allowed disabled:opacity-40",
                on ? "bg-surface text-text shadow-sm" : "text-text-secondary"
              )}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      onKeyDown={onKeyDown}
      className="flex items-end gap-1 overflow-x-auto overflow-y-hidden border-b border-border"
    >
      {items.map((it) => {
        const on = it.id === value;
        return (
          <button
            key={it.id}
            ref={(el) => { refs.current[it.id] = el; }}
            role="tab"
            aria-selected={on}
            disabled={it.disabled}
            onClick={() => !it.disabled && onChange(it.id)}
            className={cn(
              "relative flex h-10 shrink-0 items-center gap-2 px-3 text-sm font-medium",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              "disabled:cursor-not-allowed disabled:opacity-40",
              on ? "text-text" : "text-text-secondary"
            )}
          >
            {it.label}
            {it.count !== undefined && (
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-xs tabular-nums",
                  it.urgent ? "font-semibold" : "font-medium",
                  on
                    ? "bg-accent-light text-accent"
                    : it.urgent
                      ? "bg-bg-secondary text-warning"
                      : "bg-bg-secondary text-text-secondary"
                )}
              >
                {it.count.toLocaleString()}
              </span>
            )}
            {on && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent" />}
          </button>
        );
      })}
    </div>
  );
}
