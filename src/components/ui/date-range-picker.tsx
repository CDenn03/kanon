"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from "lucide-react";
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

  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <button ref={anchorRef} id={id} onClick={() => setOpen((o) => !o)} className={cn(controlBase, controlClasses(), "flex h-10 items-center gap-2 px-3 text-left")}>
        <CalIcon size={15} className="text-text-tertiary" aria-hidden />
        <span className={cn("tabular-nums", value ? "text-text" : "text-text-tertiary")}>
          {value ? `${fmt(value[0])} \u2013 ${fmt(value[1])}` : "Select a range"}
        </span>
      </button>
      {open && position && mounted && createPortal(
        <div ref={panelRef} className="z-40 flex overflow-auto rounded-lg border border-border bg-surface shadow-lg" style={position.style}>
          <div className="w-36 shrink-0 border-r border-border py-2">
            {PRESETS.map(([lbl, fn]) => (
              <button key={lbl} onClick={() => { const [a, b] = fn(); setStart(a); setEnd(b); setCur(new Date(a.getFullYear(), a.getMonth(), 1)); }}
                className="block w-full px-3 py-1.5 text-left text-sm text-text hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent">{lbl}</button>
            ))}
          </div>
          <div className="p-3">
            <div className="mb-3 flex items-center justify-between">
              <button onClick={() => shift(-1)} className="rounded p-1 text-text-secondary hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Previous month"><ChevronLeft size={16} aria-hidden /></button>
              <div className="flex gap-14 text-sm font-medium tabular-nums">
                <span>{MONTHS[cur.getMonth()]} {cur.getFullYear()}</span>
                <span>{MONTHS[(cur.getMonth() + 1) % 12]} {cur.getMonth() === 11 ? cur.getFullYear() + 1 : cur.getFullYear()}</span>
              </div>
              <button onClick={() => shift(1)} className="rounded p-1 text-text-secondary hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Next month"><ChevronRight size={16} aria-hidden /></button>
            </div>
            <div className="flex gap-5" onMouseLeave={() => setHover(null)}>
              <MonthGrid y={cur.getFullYear()} m={cur.getMonth()} rangeStart={start} rangeEnd={end} hover={hover} onPick={pick} onHover={setHover} />
              <MonthGrid y={cur.getMonth() === 11 ? cur.getFullYear() + 1 : cur.getFullYear()} m={(cur.getMonth() + 1) % 12} rangeStart={start} rangeEnd={end} hover={hover} onPick={pick} onHover={setHover} />
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
