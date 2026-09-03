"use client";

import { useState, type ReactNode, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Field, controlBase, controlClasses } from "./field";

interface ChipProps {
  children: ReactNode;
  onRemove?: () => void;
  className?: string;
}

export function Chip({ children, onRemove, className }: ChipProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md bg-accent-light px-2 py-0.5 text-xs font-medium text-accent", className)}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className="rounded-full hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X size={11} aria-hidden />
        </button>
      )}
    </span>
  );
}

interface TagInputProps {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TagInput({ id, label, hint, error, value, onChange, placeholder = "Add tag…", disabled }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const t = raw.trim().replace(/,$/, "").trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && draft.trim()) {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <Field label={label} hint={hint} error={error} htmlFor={id}>
      <div
        className={cn(
          controlBase,
          controlClasses(error, disabled),
          "flex min-h-10 flex-wrap items-center gap-1 px-2 py-1",
          !disabled && "cursor-text"
        )}
      >
        {value.map((t) => (
          <Chip key={t} onRemove={disabled ? undefined : () => onChange(value.filter((x) => x !== t))}>
            {t}
          </Chip>
        ))}
        <input
          id={id}
          value={draft}
          disabled={disabled}
          placeholder={value.length === 0 ? placeholder : ""}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft.trim() && add(draft)}
          className="min-w-24 flex-1 bg-transparent px-1 py-0.5 text-sm text-text outline-none"
        />
      </div>
    </Field>
  );
}
