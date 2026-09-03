"use client";

import * as React from "react";
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Takes `meta` shaped exactly like PaginationMeta from the table
 * contract (page/perPage/totalItems/totalPages/from/to) — this is
 * meant to be handed `useTableData(...).meta.pagination` directly with
 * no translation layer in between, not a generic pagination widget
 * that happens to also work with that shape.
 */
export interface PaginationMeta {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  from: number;
  to: number;
}

export interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  perPageOptions?: number[];
  /** Dims the whole bar during a refetch, without disabling it —
   *  matches the table's "refetching" row state. */
  loading?: boolean;
  className?: string;
}

function pageList(page: number, totalPages: number): (number | "…")[] {
  const out: (number | "…")[] = [1];
  if (page > 4) out.push("…");
  for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) out.push(p);
  if (page < totalPages - 3) out.push("…");
  if (totalPages > 1) out.push(totalPages);
  return out;
}

export function Pagination({
  meta, onPageChange, onPerPageChange, perPageOptions = [10, 25, 50, 100], loading, className,
}: PaginationProps) {
  const { page, perPage, totalItems, totalPages, from, to } = meta;
  const [jumpAt, setJumpAt] = React.useState<number | null>(null);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-(--border) px-4 py-3 lg:flex-row lg:items-center lg:justify-between",
        className
      )}
      style={{ opacity: loading ? 0.5 : 1 }}
    >
      {/* zone 1 — where am I in the data */}
      <div className="flex items-center gap-3 text-[length:var(--fs-md)] text-(--muted)">
        <span className="tnum">
          <span className="font-medium text-(--text)">{from.toLocaleString()}–{to.toLocaleString()}</span>
          {" of "}
          <span className="font-medium text-(--text)">{totalItems.toLocaleString()}</span>
        </span>
        <span className="h-4 w-px shrink-0 bg-(--border)" />
        <label className="flex items-center gap-1.5">
          <span className="hidden sm:inline">Rows</span>
          <select
            value={perPage} onChange={(e) => onPerPageChange(Number(e.target.value))}
            aria-label="Rows per page"
            className="tnum h-8 rounded-(--r-input) border border-(--border) bg-(--surface) px-2 text-[length:var(--fs-md)] text-(--text) outline-none focus-visible:ring-2 focus-visible:ring-(--ring)"
          >
            {perPageOptions.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>

      {/* zone 2 — navigation */}
      <nav aria-label="Pagination" className="flex items-center justify-between gap-1 lg:justify-end">
        <span className="flex items-center gap-1">
          <NavButton icon={ChevronsLeft} label="First page" onClick={() => onPageChange(1)} disabled={page === 1} hideBelowSm />
          <NavButton icon={ChevronLeft} label="Previous page" onClick={() => onPageChange(page - 1)} disabled={page === 1} />
        </span>

        <span className="hidden items-center gap-1 md:flex">
          {pageList(page, totalPages).map((p, i) =>
            p === "…" ? (
              jumpAt === i ? (
                <input
                  key={`j${i}`} autoFocus type="number" min={1} max={totalPages} defaultValue={page}
                  aria-label="Go to page" onBlur={() => setJumpAt(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const v = Number(e.currentTarget.value);
                      if (v >= 1 && v <= totalPages) onPageChange(v);
                      setJumpAt(null);
                    }
                    if (e.key === "Escape") setJumpAt(null);
                  }}
                  className="tnum h-8 w-14 rounded-(--r-input) border border-(--primary) px-1.5 text-center text-[length:var(--fs-md)] text-(--text) outline-none focus-visible:ring-2 focus-visible:ring-(--ring)"
                />
              ) : (
                <button
                  key={`e${i}`} type="button" onClick={() => setJumpAt(i)} aria-label="Jump to a page" title="Jump to page"
                  className="h-8 w-8 rounded-(--r-input) text-[length:var(--fs-md)] text-(--subtle) outline-none hover:bg-(--muted-bg) focus-visible:ring-2 focus-visible:ring-(--ring)"
                >
                  …
                </button>
              )
            ) : (
              <button
                key={p} type="button" onClick={() => onPageChange(p)} aria-current={p === page ? "page" : undefined}
                className={cn(
                  "tnum h-8 min-w-8 rounded-(--r-input) border px-1.5 text-[length:var(--fs-md)] outline-none focus-visible:ring-2 focus-visible:ring-(--ring)",
                  p === page
                    ? "border-(--primary) bg-(--primary) font-medium text-white"
                    : "border-(--border) text-(--muted) hover:bg-(--muted-bg)"
                )}
              >
                {p}
              </button>
            )
          )}
        </span>

        <span className="tnum text-[length:var(--fs-md)] text-(--muted) md:hidden">
          Page <span className="font-medium text-(--text)">{page}</span> of {totalPages}
        </span>

        <span className="flex items-center gap-1">
          <NavButton icon={ChevronRight} label="Next page" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} />
          <NavButton icon={ChevronsRight} label="Last page" onClick={() => onPageChange(totalPages)} disabled={page === totalPages} hideBelowSm />
        </span>
      </nav>
    </div>
  );
}

function NavButton({
  icon: Icon, label, onClick, disabled, hideBelowSm,
}: { icon: typeof ChevronLeft; label: string; onClick: () => void; disabled?: boolean; hideBelowSm?: boolean }) {
  return (
    <button
      type="button" onClick={onClick} disabled={disabled} aria-label={label}
      className={cn(
        // Display comes from exactly one place, driven by a boolean —
        // never a base "flex" fighting a passed-in "hidden" override,
        // which is fragile in a way that depends on Tailwind's
        // generated CSS order rather than anything visible in the JSX.
        hideBelowSm ? "hidden sm:flex" : "flex",
        "h-8 w-8 items-center justify-center rounded-(--r-input) border border-(--border) text-(--muted)",
        "outline-none focus-visible:ring-2 focus-visible:ring-(--ring) disabled:cursor-not-allowed disabled:opacity-50"
      )}
    >
      <Icon size={15} />
    </button>
  );
}
