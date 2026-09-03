"use client";

import { useState, useEffect, useCallback, useRef, useMemo, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks";

export interface CommandItem {
  /** Stable id. */
  id: string;
  /** Primary label. */
  title: string;
  /** Optional secondary line. */
  subtitle?: string;
  /** Optional trailing tag (e.g. category / type). */
  tag?: string;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Free-text keywords to match against, in addition to title/subtitle. */
  keywords?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  /** Called with the chosen item's id. */
  onSelect: (id: string) => void;
  placeholder?: string;
  /** Heading shown above results when the query is empty. */
  emptyHeading?: string;
}

/**
 * CommandPalette — a generic ⌘K overlay. Filters `items` by title/subtitle/
 * keywords and calls `onSelect(id)`. Keyboard: ↑/↓ to move, Enter to choose,
 * Esc to close. Pair with {@link useCommandPalette} for the ⌘K shortcut.
 */
export function CommandPalette({
  open,
  onClose,
  items,
  onSelect,
  placeholder = "Search, or type a command…",
  emptyHeading = "Suggestions",
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const mounted = useMounted();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      [it.title, it.subtitle, it.tag, it.keywords]
        .filter(Boolean)
        .some((s) => (s as string).toLowerCase().includes(q))
    );
  }, [items, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => setSelected(0), [query]);

  const choose = useCallback(
    (item?: CommandItem) => {
      if (!item) return;
      onSelect(item.id);
      onClose();
    },
    [onSelect, onClose]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelected((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); choose(results[selected]); }
    else if (e.key === "Escape") { e.preventDefault(); onClose(); }
  };

  if (!open || !mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[1000] bg-overlay" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="fixed left-1/2 top-[15%] z-[1001] flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-overlay"
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-border p-4">
          <Search size={20} className="shrink-0 text-text-tertiary" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-base text-text outline-none placeholder:text-text-tertiary"
          />
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex size-7 items-center justify-center rounded-md bg-bg-secondary text-text-tertiary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X size={16} aria-hidden />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] min-h-0 flex-1 overflow-y-auto p-2">
          {!query.trim() && (
            <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">
              {emptyHeading}
            </p>
          )}
          {results.length === 0 ? (
            <div className="px-8 py-10 text-center text-text-tertiary">
              <Search size={32} className="mx-auto mb-2 opacity-50" aria-hidden />
              <p className="text-sm">No results for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            results.map((it, i) => (
              <button
                key={it.id}
                onMouseEnter={() => setSelected(i)}
                onClick={() => choose(it)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  i === selected ? "bg-bg-secondary" : "hover:bg-bg-hover"
                )}
              >
                {it.icon && (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
                    {it.icon}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-text">{it.title}</span>
                  {it.subtitle && (
                    <span className="block truncate text-xs text-text-tertiary">{it.subtitle}</span>
                  )}
                </span>
                {it.tag && <span className="shrink-0 text-xs capitalize text-text-tertiary">{it.tag}</span>}
              </button>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center justify-center gap-4 border-t border-border p-3 text-xs text-text-tertiary">
          <span><kbd className="rounded bg-bg-secondary px-1.5 py-0.5">↑↓</kbd> Navigate</span>
          <span><kbd className="rounded bg-bg-secondary px-1.5 py-0.5">↵</kbd> Open</span>
          <span><kbd className="rounded bg-bg-secondary px-1.5 py-0.5">esc</kbd> Close</span>
        </div>
      </div>
    </>,
    document.body
  );
}

/**
 * useCommandPalette — open/close state + the global ⌘K / Ctrl+K shortcut.
 */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  const openPalette = useCallback(() => setOpen(true), []);
  const closePalette = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [toggle]);

  return { open, openPalette, closePalette, toggle, isOpen: open };
}
