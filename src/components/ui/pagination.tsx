"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationMeta {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  from: number;
  to: number;
}

export interface PaginationProps {
  meta?: PaginationMeta;
  page?: number;
  pages?: number;
  perPage?: number;
  total?: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  perPageOptions?: number[];
  disabled?: boolean;
  className?: string;
}

function buildPages(page: number, totalPages: number): (number | "…")[] {
  const out: (number | "…")[] = [1];
  if (page > 4) out.push("…");
  for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) out.push(p);
  if (page < totalPages - 3) out.push("…");
  if (totalPages > 1) out.push(totalPages);
  return out;
}

export function Pagination({
  meta,
  page: pageProp,
  pages: pagesProp,
  perPage: perPageProp,
  total: totalProp,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 25, 50, 100],
  disabled,
  className,
}: PaginationProps) {
  const page       = meta ? meta.page       : (pageProp    ?? 1);
  const totalPages = meta ? meta.totalPages  : (pagesProp   ?? 1);
  const perPage    = meta ? meta.perPage     : (perPageProp ?? 25);
  const total      = meta ? meta.totalItems  : (totalProp   ?? 0);
  const from       = meta ? meta.from : (page - 1) * perPage + 1;
  const to         = meta ? meta.to   : Math.min(page * perPage, total);

  const navBtn = cn(
    "flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
    "hover:bg-bg-hover disabled:cursor-not-allowed disabled:opacity-40"
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border px-4 py-3 lg:flex-row lg:items-center lg:justify-between",
        disabled && "opacity-50",
        className
      )}
    >
      {}
      <div className="flex items-center gap-3 text-sm text-text-secondary">
        <span className="tabular-nums">
          <span className="font-medium text-text">
            {from.toLocaleString()}–{to.toLocaleString()}
          </span>
          {" of "}
          <span className="font-medium text-text">{total.toLocaleString()}</span>
        </span>
        <span className="h-4 w-px shrink-0 bg-border" />
        <label className="flex items-center gap-1.5">
          <span className="hidden sm:inline">Rows</span>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            aria-label="Rows per page"
            className="h-8 rounded-md border border-border bg-surface px-2 text-sm tabular-nums text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {perPageOptions.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>

      {}
      <nav aria-label="Pagination" className="flex items-center justify-between gap-1 lg:justify-end">
        {}
        <button
          type="button"
          onClick={() => page > 1 && onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className={navBtn}
        >
          <ChevronLeft size={15} aria-hidden />
        </button>

        {}
        <span className="hidden items-center gap-1 md:flex">
          {buildPages(page, totalPages).map((p, i) =>
            p === "…" ? (
              <span
                key={`e${i}`}
                className="flex h-8 w-8 select-none items-center justify-center text-sm text-text-tertiary"
                aria-hidden
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p as number)}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  "h-8 min-w-8 rounded-md border px-1.5 text-sm tabular-nums",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  p === page
                    ? "border-accent bg-accent font-medium text-on-accent"
                    : "border-border text-text-secondary hover:bg-bg-hover"
                )}
              >
                {p}
              </button>
            )
          )}
        </span>

        {}
        <span className="px-2 text-sm tabular-nums text-text-secondary md:hidden">
          <span className="font-medium text-text">{page}</span>
          {" / "}{totalPages}
        </span>

        {}
        <button
          type="button"
          onClick={() => page < totalPages && onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className={navBtn}
        >
          <ChevronRight size={15} aria-hidden />
        </button>

        {}
        <span className="ml-3 hidden items-center gap-1.5 border-l border-border pl-3 text-sm md:flex">
          <label htmlFor="pagination-jump" className="whitespace-nowrap text-xs text-text-tertiary">
            Go to
          </label>
          <input
            id="pagination-jump"
            type="number"
            min={1}
            max={totalPages}
            aria-label={`Go to page (1–${totalPages})`}
            placeholder={String(page)}
            className="h-8 w-14 rounded-md border border-border px-1.5 text-center text-sm tabular-nums text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const v = Number(e.currentTarget.value);
                if (v >= 1 && v <= totalPages) { onPageChange(v); e.currentTarget.value = ""; }
              }
              if (e.key === "Escape") { e.currentTarget.value = ""; e.currentTarget.blur(); }
            }}
            onBlur={(e) => {
              const v = Number(e.currentTarget.value);
              if (v >= 1 && v <= totalPages) { onPageChange(v); e.currentTarget.value = ""; }
            }}
          />
        </span>
      </nav>
    </div>
  );
}
