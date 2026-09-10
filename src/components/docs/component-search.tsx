"use client";

import { useState, useRef, useEffect, useMemo, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks";

export interface SearchItem {
  slug: string;
  name: string;
  category: string;
  href: string;
}

/**
 * ComponentSearch — a launcher-style search for the docs.
 * Filters the registry by name/category and navigates on select. Results
 * are plain links (no selection checkbox); keyboard: ↑/↓ to move, Enter to
 * open, Esc to close.
 */
export function ComponentSearch({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const mounted = useMounted();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) => it.name.toLowerCase().includes(q) || it.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const go = (it?: SearchItem) => {
    if (!it) return;
    setOpen(false);
    setQuery("");
    router.push(it.href);
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); go(results[active]); }
    else if (e.key === "Escape") { setOpen(false); }
  };

  return (
    <div ref={boxRef} className="relative w-56 sm:w-72">
      <div className="relative flex items-center">
        <Search size={15} className="pointer-events-none absolute left-3 text-text-tertiary" aria-hidden />
        <input
          role="combobox"
          aria-expanded={open}
          aria-controls="component-search-list"
          value={query}
          placeholder="Search components…"
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onKeyDown={onKeyDown}
          className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-text placeholder:text-text-tertiary focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
        />
      </div>

      {open && mounted && (
        <ul
          id="component-search-list"
          role="listbox"
          className="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-lg border border-border bg-surface py-1 shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-3 py-4 text-center text-sm text-text-secondary">
              No component matches &ldquo;{query}&rdquo;
            </li>
          ) : (
            results.map((it, i) => (
              <li key={it.slug} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(it)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors",
                    i === active ? "bg-bg-secondary text-text" : "text-text-secondary hover:bg-bg-hover"
                  )}
                >
                  <span className="truncate font-medium text-text">{it.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-text-tertiary">{it.category}</span>
                    {i === active && <CornerDownLeft size={12} className="text-text-tertiary" aria-hidden />}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
