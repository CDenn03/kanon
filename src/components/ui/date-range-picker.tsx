"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ChevronDown, Calendar as CalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePopoverPosition, useMounted } from "@/hooks";
import { Field, controlBase, controlClasses } from "./field";
import { MonthGrid } from "./calendar";
import { Button } from "./button";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const fmt = (d: Date | null) => d ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";

const PRESETS: [string, () => [Date, Date]][] = [
  ["Today", () => { const t = new Date(); t.setHours(0,0,0,0); return [t, t]; }],
  ["Last 7 days", () => { const t = new Date(); t.setHours(0,0,0,0); const s = new Date(t); s.setDate(s.getDate() - 6); return [s, t]; }],
  ["This month", () => { const t = new Date(); t.setHours(0,0,0,0); return [new Date(t.getFullYear(), t.getMonth(), 1), t]; }],
  ["Last month", () => { const t = new Date(); return [new Date(t.getFullYear(), t.getMonth() - 1, 1), new Date(t.getFullYear(), t.getMonth(), 0)]; }],
  ["Quarter to date", () => { const t = new Date(); t.setHours(0,0,0,0); const qm = Math.floor(t.getMonth() / 3) * 3; return [new Date(t.getFullYear(), qm, 1), t]; }],
  ["Year to date", () => { const t = new Date(); t.setHours(0,0,0,0); return [new Date(t.getFullYear(), 0, 1), t]; }],
];

function yearRange(viewYear: number): number[] {
  const start = viewYear - 100;
  const end = viewYear + 10;
  const years: number[] = [];
  for (let y = start; y <= end; y++) years.push(y);
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
}: {
  value: number;
  options: readonly MiniSelectOption[];
  ariaLabel: string;
  onChange: (value: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialScrollDone = useRef(false);

  const filteredOptions = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    if (!open) {
      initialScrollDone.current = false;
      return;
    }
    const h = (e: globalThis.MouseEvent) => {
      const target = e.target as Node;
      if (!triggerRef.current?.contains(target) && !listRef.current?.contains(target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  useEffect(() => {
    if (open && !initialScrollDone.current) {
      inputRef.current?.focus();
      const idx = filteredOptions.findIndex((o) => o.value === value);
      setHighlighted(idx >= 0 ? idx : 0);
      
      requestAnimationFrame(() => {
        const selected = listRef.current?.querySelector<HTMLElement>('[data-selected="true"]');
        selected?.scrollIntoView({ block: "center" });
        initialScrollDone.current = true;
      });
    }
  }, [open, value, filteredOptions]);

  useEffect(() => {
    if (highlighted >= 0 && initialScrollDone.current) {
      const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${highlighted}"]`);
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setHighlighted(-1);
  }, []);

  const select = useCallback((opt: MiniSelectOption) => {
    onChange(opt.value);
    close();
  }, [onChange, close]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, filteredOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filteredOptions[highlighted]) {
      e.preventDefault();
      select(filteredOptions[highlighted]);
    } else if (e.key === "Escape") {
      close();
    }
  };

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded px-1.5 py-0.5 text-sm font-medium tabular-nums text-text hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {selected?.label ?? value}
        <ChevronDown size={13} className="text-text-tertiary" aria-hidden />
      </button>
      {open && (
        <div
          ref={listRef}
          data-calendar-mini-select=""
          className="absolute left-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
        >
          <div className="border-b border-border p-1.5">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlighted(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Type to filter…"
              className="w-full rounded bg-bg-secondary px-2 py-1 text-sm text-text outline-none placeholder:text-text-tertiary"
            />
          </div>
          <ul
            role="listbox"
            aria-label={ariaLabel}
            className="max-h-48 overflow-auto p-1"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-2 py-1.5 text-sm text-text-tertiary">No match</li>
            ) : (
              filteredOptions.map((option, idx) => {
                const isSelected = option.value === value;
                const isHighlighted = idx === highlighted;
                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      data-selected={isSelected}
                      data-index={idx}
                      onMouseEnter={() => setHighlighted(idx)}
                      onClick={() => select(option)}
                      className={cn(
                        "w-full rounded px-2 py-1 text-left text-sm tabular-nums text-text focus-visible:outline-none",
                        isHighlighted && "bg-bg-hover",
                        isSelected && "font-semibold text-accent"
                      )}
                    >
                      {option.label}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

interface DateRangePickerProps {
  id?: string;
  label?: string;
  hint?: string;
  value: [Date, Date] | null;
  onChange: (range: [Date, Date]) => void;
}

export function DateRangePicker({ id, label, hint, value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const now = new Date();
  const [cur, setCur] = useState(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  const [start, setStart] = useState<Date | null>(value?.[0] || null);
  const [end, setEnd] = useState<Date | null>(value?.[1] || null);
  const [hover, setHover] = useState<Date | null>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const position = usePopoverPosition(anchorRef, open, { minWidth: 620, preferredHeight: 420 });
  const mounted = useMounted();

  useEffect(() => {
    const h = (e: globalThis.MouseEvent) => {
      if (!anchorRef.current?.contains(e.target as Node) && !panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const pick = (d: Date) => {
    if (!start || (start && end)) { setStart(d); setEnd(null); setHover(null); }
    else if (d < start) { setStart(d); setEnd(start); }
    else setEnd(d);
  };
  const shift = (n: number) => setCur(new Date(cur.getFullYear(), cur.getMonth() + n, 1));
  const nights = start && end ? Math.round((end.getTime() - start.getTime()) / 86400000) + 1 : null;

  const setMonth = (m: number) => setCur(new Date(cur.getFullYear(), m, 1));
  const setYear = (y: number) => setCur(new Date(y, cur.getMonth(), 1));
  const years = yearRange(cur.getFullYear());

  const nextMonth = (cur.getMonth() + 1) % 12;
  const nextYear = cur.getMonth() === 11 ? cur.getFullYear() + 1 : cur.getFullYear();

  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <button ref={anchorRef} id={id} onClick={() => setOpen((o) => !o)} className={cn(controlBase, controlClasses(), "flex h-10 items-center gap-2 px-3 text-left")}>
        <CalIcon size={15} className="text-text-tertiary" aria-hidden />
        <span className={cn("tabular-nums", value ? "text-text" : "text-text-tertiary")}>
          {value ? `${fmt(value[0])} \u2013 ${fmt(value[1])}` : "Select a range"}
        </span>
      </button>
      {open && position && mounted && createPortal(
        <div ref={panelRef} className="z-50 flex overflow-visible rounded-lg border border-border bg-surface shadow-lg" style={position.style}>
          <div className="w-36 shrink-0 border-r border-border py-2">
            {PRESETS.map(([lbl, fn]) => (
              <button key={lbl} onClick={() => { const [a, b] = fn(); setStart(a); setEnd(b); setCur(new Date(a.getFullYear(), a.getMonth(), 1)); }}
                className="block w-full px-3 py-1.5 text-left text-sm text-text hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent">{lbl}</button>
            ))}
          </div>
          <div className="p-3">
            <div className="mb-3 flex items-center justify-between">
              <button onClick={() => shift(-1)} className="rounded p-1 text-text-secondary hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Previous month"><ChevronLeft size={16} aria-hidden /></button>
              <div className="flex gap-8">
                <span className="flex items-center gap-0.5">
                  <MiniSelect
                    ariaLabel="Month (left calendar)"
                    value={cur.getMonth()}
                    onChange={setMonth}
                    options={MONTHS.map((name, i) => ({ value: i, label: name }))}
                  />
                  <MiniSelect
                    ariaLabel="Year (left calendar)"
                    value={cur.getFullYear()}
                    onChange={setYear}
                    options={years.map((yr) => ({ value: yr, label: String(yr) }))}
                  />
                </span>
                <span className="flex items-center gap-0.5">
                  <MiniSelect
                    ariaLabel="Month (right calendar)"
                    value={nextMonth}
                    onChange={(m) => setCur(new Date(m < cur.getMonth() ? cur.getFullYear() + 1 : cur.getFullYear(), m - 1, 1))}
                    options={MONTHS.map((name, i) => ({ value: i, label: name }))}
                  />
                  <MiniSelect
                    ariaLabel="Year (right calendar)"
                    value={nextYear}
                    onChange={(y) => setCur(new Date(y, cur.getMonth(), 1))}
                    options={years.map((yr) => ({ value: yr, label: String(yr) }))}
                  />
                </span>
              </div>
              <button onClick={() => shift(1)} className="rounded p-1 text-text-secondary hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Next month"><ChevronRight size={16} aria-hidden /></button>
            </div>
            <div className="flex gap-5" onMouseLeave={() => setHover(null)}>
              <MonthGrid y={cur.getFullYear()} m={cur.getMonth()} rangeStart={start} rangeEnd={end} hover={hover} onPick={pick} onHover={setHover} />
              <MonthGrid y={nextYear} m={nextMonth} rangeStart={start} rangeEnd={end} hover={hover} onPick={pick} onHover={setHover} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs tabular-nums text-text-secondary">
                {start && end ? `${fmt(start)} \u2013 ${fmt(end)} \u00B7 ${nights} days` : start ? `${fmt(start)} \u2013 select an end date` : "Select a start date"}
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => { setStart(null); setEnd(null); }}>Clear</Button>
                <Button size="sm" disabled={!start} onClick={() => { onChange([start!, end || start!]); setOpen(false); }}>Apply</Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </Field>
  );
}
