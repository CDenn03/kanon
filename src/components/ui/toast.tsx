"use client";

import { useState, useEffect, useCallback } from "react";
import { CircleCheck, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "warning" | "info";

export interface ToastData {
  id: number;
  tone: ToastTone;
  title: string;
  body?: string;
  duration: number;
  sticky?: boolean;
  action?: { label: string; run?: () => void };
}

const TOAST_TONE: Record<
  ToastTone,
  { icon: typeof CircleCheck; text: string; bar: string }
> = {
  success: { icon: CircleCheck, text: "text-accent", bar: "var(--color-accent)" },
  error: { icon: AlertTriangle, text: "text-error", bar: "var(--color-error)" },
  warning: { icon: AlertTriangle, text: "text-warning", bar: "var(--color-warning)" },
  info: { icon: Info, text: "text-text-secondary", bar: "var(--color-text-secondary)" },
};

interface ToastProps {
  t: ToastData;
  onClose: () => void;
}

export function Toast({ t, onClose }: ToastProps) {
  const [paused, setPaused] = useState(false);
  const [left, setLeft] = useState(100);
  const sticky = t.tone === "error" || t.sticky;

  useEffect(() => {
    if (sticky || paused) return;
    const id = setInterval(() => {
      setLeft((v) => {
        const next = v - 100 / (t.duration / 50);
        if (next <= 0) { clearInterval(id); return 0; }
        return next;
      });
    }, 50);
    return () => clearInterval(id);
  }, [paused, sticky, t.duration]);

  useEffect(() => {
    if (left <= 0 && !sticky) onClose();
  }, [left, sticky, onClose]);

  const cfg = TOAST_TONE[t.tone];
  const Icon = cfg.icon;

  return (
    <div
      role={t.tone === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="pointer-events-auto relative w-full overflow-hidden rounded-lg border border-border bg-surface shadow-lg sm:w-80"
    >
      <div className="flex gap-2.5 p-3">
        <Icon size={16} className={cn("mt-0.5 shrink-0", cfg.text)} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text">{t.title}</p>
          {t.body && <p className="mt-0.5 text-xs leading-snug text-text-secondary">{t.body}</p>}
          {t.action && (
            <button
              onClick={() => { t.action!.run?.(); onClose(); }}
              className={cn(
                "mt-1.5 text-xs font-medium underline underline-offset-2",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",
                cfg.text
              )}
            >
              {t.action.label}
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Dismiss"
          className="shrink-0 rounded p-0.5 text-text-tertiary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X size={14} aria-hidden />
        </button>
      </div>
      {!sticky && (
        <span
          className="absolute bottom-0 left-0 h-0.5 transition-all"
          style={{ width: `${left}%`, background: cfg.bar, opacity: 0.5 }}
        />
      )}
    </div>
  );
}

export function useToasts() {
  const [list, setList] = useState<ToastData[]>([]);
  const push = useCallback((t: Partial<ToastData> & { title: string }) => {
    setList((l) => [...l, { id: Date.now() + Math.random(), duration: 5000, tone: "info", ...t } as ToastData].slice(-4));
  }, []);
  const close = useCallback((id: number) => setList((l) => l.filter((x) => x.id !== id)), []);
  return { list, push, close };
}
