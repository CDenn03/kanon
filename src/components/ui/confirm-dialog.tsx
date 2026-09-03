"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { controlBase, controlClasses } from "./field";
import { Button } from "./button";
import { HoldToConfirm } from "./hold-to-confirm";

interface ConfirmDialogProps {
  open: boolean;
  tone?: "default" | "destructive";
  title: string;
  body?: string;
  consequences?: string[];
  confirmLabel: string;
  mode?: "simple" | "type" | "hold";
  typeToMatch?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  tone = "default",
  title,
  body,
  consequences = [],
  confirmLabel,
  mode = "simple",
  typeToMatch,
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState("");
  useEffect(() => { if (!open) setTyped(""); }, [open]);
  if (!open) return null;

  const destructive = tone === "destructive";
  const blocked = mode === "type" && typed.trim() !== typeToMatch;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
      onClick={onCancel}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-xl bg-surface shadow-overlay">
        <div className="px-5 pb-4 pt-5">
          <h3 className="text-base font-semibold text-text">{title}</h3>
          {body && <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{body}</p>}
          {consequences.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {consequences.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm text-text-secondary">
                  <span className={cn("mt-1.5 h-1 w-1 shrink-0 rounded-full", destructive ? "bg-error" : "bg-text-tertiary")} />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          )}
          {mode === "type" && (
            <label className="mt-4 block text-sm text-text-secondary">
              Type <span className="font-semibold text-text">{typeToMatch}</span> to confirm.
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoFocus
                className={cn(controlBase, controlClasses(), "mt-1.5 h-10 px-2.5")}
              />
            </label>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border bg-bg px-5 py-3">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          {mode === "hold" ? (
            <HoldToConfirm label={confirmLabel} onConfirm={onConfirm} onKeyboardFallback={onConfirm} />
          ) : (
            <Button variant={destructive ? "destructive" : "primary"} disabled={blocked} loading={loading} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
