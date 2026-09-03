"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";

interface HoldToConfirmProps {
  label?: string;
  duration?: number;
  onConfirm: () => void;
  onKeyboardFallback: () => void;
  disabled?: boolean;
}

export function HoldToConfirm({
  label = "Hold to delete",
  duration = 1200,
  onConfirm,
  onKeyboardFallback,
  disabled,
}: HoldToConfirmProps) {
  const [pct, setPct] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const start = useRef(0);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setPct(0);
  };

  const begin = () => {
    if (disabled || timer.current) return;
    start.current = Date.now();
    timer.current = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start.current) / duration) * 100);
      setPct(p);
      if (p >= 100) { stop(); onConfirm(); }
    }, 16);
  };

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  return (
    <button
      disabled={disabled}
      onPointerDown={begin}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onKeyboardFallback(); } }}
      aria-label={`${label}. Press Enter for a confirmation dialog instead.`}
      className="relative inline-flex h-10 select-none items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-error px-4 text-sm font-medium text-on-error shadow-sm transition-[color,background-color,box-shadow] hover:bg-error-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
      style={{ touchAction: "none" }}
    >
      <span
        className="absolute inset-y-0 left-0 bg-black/30 transition-none"
        style={{ width: `${pct}%` }}
        aria-hidden
      />
      <span className="relative inline-flex items-center gap-1.5">
        <Trash2 size={15} aria-hidden />
        {pct > 0 ? "Keep holding\u2026" : label}
      </span>
    </button>
  );
}
