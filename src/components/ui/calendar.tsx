"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ChevronDown, Calendar as CalIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePopoverPosition, useMounted } from "@/hooks";
import { Field, controlBase, controlClasses } from "./field";

const DOW = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const sameDay = (a: Date | null, b: Date | null) => a && b && a.toDateString() === b.toDateString();
const fmt = (d: Date | null) => d ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";

function monthCells(y: number, m: number): (Date | null)[] {
  const start = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const cells: (Date | null)[] = Array(start).fill(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7) cells.push(null);
  return cells;
}

function yearRange(viewYear: number, min?: Date, max?: Date): number[] {
  const start = min ? min.getFullYear() : viewYear - 100;
  const end = max ? max.getFullYear() : viewYear + 10;
  const lo = Math.min(start, viewYear);
  const hi = Math.max(end, viewYear);
  const years: number[] = [];
  for (let y = lo; y <= hi; y++) years.push(y);
  return years;
}

interface MiniSelectOption {
  value: number;
  label: string;
}

function MiniSelect({
  value,
  options,
  ariaLabel,
  onChange,
  container,
}: {
  value: number;
  options: readonly MiniSelectOption[];
  ariaLabel: string;
  onChange: (value: number) => void;
  container: HTMLElement | null;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: globalThis.MouseEvent) => {
      const target = e.target as Node;
      if (!triggerRef.current?.contains(target) && !listRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  useEffect(() => {
    if (coords) {
      const active = listRef.current?.querySelector<HTMLElement>('[data-selected="true"]');
      active?.scrollIntoView({ block: "center" });
    }
  }, [coords]);

  const toggle = () => {
    if (open) {
      setOpen(false);
      setCoords(null);
      return;
    }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setCoords({ top: rect.bottom + 4, left: rect.left, width: Math.max(rect.width, 96) });
    }
    setOpen(true);
  };

  const selected = options.find((o) => o.value === value);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        className="flex items-center gap-1 rounded px-1.5 py-0.5 text-sm font-medium tabular-nums text-text hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {selected?.label ?? value}
        <ChevronDown size={13} className="text-text-tertiary" aria-hidden />
      </button>
      {open && coords && createPortal(
        <ul
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          data-calendar-mini-select=""
          className="pointer-events-auto fixed z-50 max-h-56 overflow-auto rounded-md border border-border bg-surface p-1 shadow-lg"
          style={{ top: coords.top, left: coords.left, width: coords.width }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  data-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setCoords(null);
                  }}
                  className={cn(
                    "w-full rounded px-2 py-1 text-left text-sm tabular-nums text-text hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isSelected && "bg-accent-light font-semibold"
                  )}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>,
        container ?? document.body
      )}
    </>
  );
}

interface MonthGridProps {
  y: number;
  m: number;
  selected?: Date | null;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  hover?: Date | null;
  onPick: (d: Date) => void;
  onHover?: (d: Date) => void;
  min?: Date;
  max?: Date;
}

export function MonthGrid({ y, m, selected, rangeStart, rangeEnd, hover, onPick, onHover, min, max }: MonthGridProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inRange = (d: Date | null) => {
    const end = rangeEnd || hover;
    if (!rangeStart || !end || !d) return false;
    const [a, b] = rangeStart <= end ? [rangeStart, end] : [end, rangeStart];
    return d > a && d < b;
  };

  return (
    <div className="w-60">
      <div className="mb-2 grid grid-cols-7">
        {DOW.map((d, i) => <span key={i} className="text-center text-xs font-medium text-text-tertiary">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {monthCells(y, m).map((d, i) => {
          if (!d) return <span key={i} />;
          const off = (min ? d < min : false) || (max ? d > max : false);
          const isStart = sameDay(d, rangeStart ?? null);
          const isEnd = sameDay(d, rangeEnd ?? null);
          const on = sameDay(d, selected ?? null) || isStart || isEnd;
          const mid = inRange(d);
          const isToday = sameDay(d, today);
          return (
            <button
              key={i} disabled={off}
              onClick={() => onPick(d)}
              onMouseEnter={() => onHover?.(d)}
              className={cn(
                "relative mx-auto flex h-7 w-7 items-center justify-center text-sm tabular-nums transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed",
                on ? "bg-accent text-on-accent font-semibold" : mid ? "bg-accent-light text-text" : "text-text",
                isToday && !on && "ring-1 ring-inset ring-accent",
                off && "opacity-40 text-text-tertiary"
              )}
              style={{ borderRadius: mid ? 0 : 6 }}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface DatePickerProps {
  id?: string;
  label?: string;
  hint?: string;
  value: Date | null;
  onChange: (d: Date | null) => void;
  min?: Date;
  max?: Date;
}

export function DatePicker({ id, label, hint, value, onChange, min, max }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const anchorRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const position = usePopoverPosition(anchorRef, open, { minWidth: 260, preferredHeight: 340 });
  const mounted = useMounted();

  // When rendered inside a modal/dialog, portaling to document.body puts the
  // popover outside the dialog's focus scope and scroll lock, which blocks
  // pointer/scroll interaction. Portal into the dialog content when present so
  // it stays interactive; otherwise fall back to document.body.
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      setPortalTarget(
        next ? (anchorRef.current?.closest<HTMLElement>('[role="dialog"]') ?? document.body) : null
      );
      return next;
    });
  };

  useEffect(() => {
    const h = (e: globalThis.MouseEvent) => {
      const target = e.target as Element;
      if (
        !anchorRef.current?.contains(target) &&
        !panelRef.current?.contains(target) &&
        !target.closest?.("[data-calendar-mini-select]")
      ) {
        setOpen(false);
        setPortalTarget(null);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const shift = (n: number) => setCur(new Date(cur.getFullYear(), cur.getMonth() + n, 1));
  const setMonth = (mm: number) => setCur(new Date(cur.getFullYear(), mm, 1));
  const setYear = (yr: number) => setCur(new Date(yr, cur.getMonth(), 1));
  const years = yearRange(cur.getFullYear(), min, max);

  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <div className="relative flex items-center">
        <button ref={anchorRef} id={id} onClick={toggleOpen} className={cn(controlBase, controlClasses(), "flex h-10 items-center gap-2 px-3 text-left", value ? "pr-8" : "")}>
          <CalIcon size={15} className="text-text-tertiary" aria-hidden />
          <span className={cn("tabular-nums", value ? "text-text" : "text-text-tertiary")}>{value ? fmt(value) : "Select a date"}</span>
        </button>
        {value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            aria-label="Clear date"
            className="absolute right-2 rounded p-0.5 text-text-tertiary hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X size={14} aria-hidden />
          </button>
        )}
      </div>
      {open && position && mounted && portalTarget && createPortal(
        <div ref={panelRef} className="pointer-events-auto z-40 overflow-auto rounded-lg border border-border bg-surface p-3 shadow-lg" style={position.style}>
          <div className="mb-3 flex items-center justify-between">
            <button type="button" onClick={() => shift(-1)} className="rounded p-1 text-text-secondary hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Previous month"><ChevronLeft size={16} aria-hidden /></button>
            <span className="flex items-center gap-1">
              <MiniSelect
                ariaLabel="Month"
                value={cur.getMonth()}
                onChange={setMonth}
                options={MONTHS.map((name, i) => ({ value: i, label: name }))}
                container={portalTarget}
              />
              <MiniSelect
                ariaLabel="Year"
                value={cur.getFullYear()}
                onChange={setYear}
                options={years.map((yr) => ({ value: yr, label: String(yr) }))}
                container={portalTarget}
              />
            </span>
            <button type="button" onClick={() => shift(1)} className="rounded p-1 text-text-secondary hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Next month"><ChevronRight size={16} aria-hidden /></button>
          </div>
          <MonthGrid y={cur.getFullYear()} m={cur.getMonth()} selected={value} min={min} max={max} onPick={(d) => { onChange(d); setOpen(false); setPortalTarget(null); }} />
        </div>,
        portalTarget
      )}
    </Field>
  );
}
