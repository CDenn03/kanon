"use client";

import { useRef, useState, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePopoverPosition, useMounted } from "@/hooks";
import { Field, controlBase, controlClasses } from "./field";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Select — a single-select dropdown built on Field. Keyboard: Enter/Space
 * or ↓ to open, ↑/↓ to move, Enter to choose, Esc to close. For search-first
 * selection use SearchCombobox instead.
 */
export function Select({
  id,
  label,
  hint,
  error,
  disabled,
  options,
  value,
  onChange,
  placeholder = "Select…",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const position = usePopoverPosition(triggerRef, open, { matchWidth: true, preferredHeight: 260 });
  const mounted = useMounted();
  const reactId = useId();
  const selectId = id ?? reactId;
  const messageId = `${selectId}-message`;

  const selected = options.find((o) => o.value === value) ?? null;

  useEffect(() => {
    if (!open) return;
    const idx = options.findIndex((o) => o.value === value);
    setActive(idx >= 0 ? idx : 0);
  }, [open, options, value]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !listRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const choose = (opt: SelectOption) => {
    if (opt.disabled) return;
    onChange(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, options.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); choose(options[active]); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
  };

  return (
    <Field label={label} hint={hint} error={error} required={false} htmlFor={selectId} messageId={messageId}>
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error || hint ? messageId : undefined}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={cn(controlBase, controlClasses(error, disabled), "flex h-10 items-center justify-between gap-2 px-3 text-left")}
      >
        <span className={cn("truncate", selected ? "text-text" : "text-text-tertiary")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} className={cn("shrink-0 text-text-tertiary transition-transform", open && "rotate-180")} aria-hidden />
      </button>

      {open && position && mounted && createPortal(
        <div
          ref={listRef}
          role="listbox"
          className="z-50 overflow-auto rounded-lg border border-border bg-surface py-1 shadow-lg"
          style={position.style}
        >
          {options.map((opt, i) => {
            const on = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={on}
                aria-disabled={opt.disabled || undefined}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(opt)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-sm text-text transition-colors",
                  opt.disabled ? "cursor-not-allowed opacity-40" : "hover:bg-bg-hover",
                  i === active && !opt.disabled && "bg-bg-secondary"
                )}
              >
                <span className="truncate">{opt.label}</span>
                {on && <Check size={14} className="shrink-0 text-accent" aria-hidden />}
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </Field>
  );
}
