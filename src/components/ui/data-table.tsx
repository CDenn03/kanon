"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SortHeader } from "./sort-header";
import { SkeletonRows } from "./skeleton-rows";
import { Pagination, type PaginationProps } from "./pagination";
import { Blank } from "./blank";

type SortState = "asc" | "desc" | "none";

/** Per-row visual status, mirroring real-world table needs. */
export type RowStatus = "default" | "selected" | "error" | "pending";

export interface DataTableColumn<T> {
  /** Stable key. */
  key: string;
  /** Header label. */
  header: string;
  /** Cell renderer. */
  cell: (row: T) => ReactNode;
  /** Enables a SortHeader for this column. */
  sortable?: boolean;
  /** Text alignment. */
  align?: "left" | "center" | "right";
  /** Render as numeric (right-aligned, tabular figures). */
  numeric?: boolean;
  /** Optional fixed width / utility classes (e.g. "w-40"). */
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Unique key per row. */
  rowKey: (row: T) => string;
  loading?: boolean;
  /** Current sort: column key + direction. */
  sort?: { key: string; dir: SortState };
  onSortChange?: (key: string) => void;
  /** Empty-state content when there are no rows and not loading. */
  empty?: { title: string; body: string };
  /** Optional pagination props; renders a footer pager when provided. */
  pagination?: PaginationProps;
  onRowClick?: (row: T) => void;
  /** Optional per-row status → selected / error / pending styling + left bar. */
  rowStatus?: (row: T) => RowStatus;
  /** Zebra-stripe even rows. */
  zebra?: boolean;
  /** Optional header toolbar: title + count/subtitle. */
  title?: string;
  subtitle?: string;
  /** Accessible table caption (visually hidden). */
  caption?: string;
}

const ALIGN: Record<NonNullable<DataTableColumn<unknown>["align"]>, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/**
 * DataTable — a reusable table that composes SortHeader, SkeletonRows,
 * Pagination and an empty state. Column-driven and controlled (bring your
 * own data + sort state), so it works with client or server sorting.
 *
 * Row states (selected / error / pending) and numeric/aligned columns mirror
 * the patterns proven in production table usage (boda-plus-web).
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  sort,
  onSortChange,
  empty,
  pagination,
  onRowClick,
  rowStatus,
  zebra,
  title,
  subtitle,
  caption,
}: DataTableProps<T>) {
  const showEmpty = !loading && rows.length === 0;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface">
      {/* Top loading bar */}
      {loading && (
        <div className="absolute inset-x-0 top-0 z-10 h-0.5 animate-pulse bg-accent" aria-hidden />
      )}

      {/* Optional toolbar */}
      {(title || subtitle) && (
        <div className="flex min-h-14 flex-wrap items-center gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0 flex-1">
            {title && <h2 className="truncate text-sm font-semibold text-text">{title}</h2>}
            {subtitle && <p className="mt-0.5 truncate text-xs tabular-nums text-text-secondary">{subtitle}</p>}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => {
                const align = col.numeric ? "right" : col.align ?? "left";
                return col.sortable ? (
                  <SortHeader
                    key={col.key}
                    label={col.header}
                    state={sort?.key === col.key ? sort.dir : "none"}
                    onClick={() => onSortChange?.(col.key)}
                  />
                ) : (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      "px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-text-secondary",
                      ALIGN[align],
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows n={6} colCount={Math.max(1, columns.length - 1)} />
            ) : (
              rows.map((row, i) => {
                const status = rowStatus?.(row) ?? "default";
                return (
                  <tr
                    key={rowKey(row)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    aria-selected={status === "selected" || undefined}
                    className={cn(
                      "group relative border-b border-border transition-colors last:border-0",
                      // zebra (only when the row has no special status)
                      zebra && status === "default" && i % 2 === 1 && "bg-bg",
                      status === "default" && onRowClick && "hover:bg-bg-hover",
                      status === "selected" && "bg-accent-light",
                      status === "error" && "bg-error-light",
                      status === "pending" && "opacity-60",
                      onRowClick && "cursor-pointer",
                      // left status bar
                      (status === "selected" || status === "error") &&
                        "before:absolute before:inset-y-0 before:left-0 before:w-0.5",
                      status === "selected" && "before:bg-accent",
                      status === "error" && "before:bg-error"
                    )}
                  >
                    {columns.map((col) => {
                      const align = col.numeric ? "right" : col.align ?? "left";
                      return (
                        <td
                          key={col.key}
                          className={cn(
                            "px-4 py-3 text-text",
                            ALIGN[align],
                            col.numeric && "tabular-nums",
                            col.className
                          )}
                        >
                          {col.cell(row)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showEmpty && (
        <Blank title={empty?.title ?? "No results"} body={empty?.body ?? "There's nothing to show yet."} />
      )}

      {pagination && !showEmpty && <Pagination {...pagination} />}
    </div>
  );
}
