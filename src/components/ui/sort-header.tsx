"use client";

import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SortState = "asc" | "desc" | "none";

interface SortHeaderProps {
  label: string;
  state: SortState;
  onClick: () => void;
}

export function SortHeader({ label, state, onClick }: SortHeaderProps) {
  const active = state === "asc" || state === "desc";

  return (
    <th
      scope="col"
      aria-sort={state === "asc" ? "ascending" : state === "desc" ? "descending" : "none"}
      className={cn(
        "px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider",
        active ? "text-text" : "text-text-secondary"
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="group inline-flex items-center gap-1.5 rounded uppercase tracking-wider text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {label}
        {state === "asc" ? (
          <ChevronUp size={13} strokeWidth={2.5} aria-hidden />
        ) : state === "desc" ? (
          <ChevronDown size={13} strokeWidth={2.5} aria-hidden />
        ) : (
          <ChevronsUpDown
            size={13}
            aria-hidden
            className="text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100"
          />
        )}
      </button>
    </th>
  );
}
