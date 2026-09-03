"use client";

import { useState, type ReactNode } from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertTone = "info" | "success" | "warning" | "error";

const TONE: Record<AlertTone, { icon: LucideIcon; wrap: string; icon_: string }> = {
  info: { icon: Info, wrap: "border-border bg-bg-secondary", icon_: "text-text-secondary" },
  success: { icon: CheckCircle2, wrap: "border-accent-muted bg-accent-light", icon_: "text-accent" },
  warning: { icon: AlertTriangle, wrap: "border-warning/30 bg-warning-light", icon_: "text-warning" },
  error: { icon: XCircle, wrap: "border-error/30 bg-error-light", icon_: "text-error" },
};

interface AlertProps {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;

  dismissible?: boolean;
  onDismiss?: () => void;

  action?: ReactNode;
}

export function Alert({ tone = "info", title, children, dismissible, onDismiss, action }: AlertProps) {
  const [open, setOpen] = useState(true);
  const cfg = TONE[tone];
  const Icon = cfg.icon;

  if (!open) return null;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex items-start gap-3 rounded-lg border p-3.5", cfg.wrap)}
    >
      <Icon size={18} className={cn("mt-0.5 shrink-0", cfg.icon_)} aria-hidden />
      <div className="min-w-0 flex-1">
        {title && <p className="text-sm font-semibold text-text">{title}</p>}
        {children && <div className={cn("text-sm text-text-secondary", title && "mt-0.5")}>{children}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={() => { setOpen(false); onDismiss?.(); }}
          aria-label="Dismiss"
          className="-mr-1 -mt-1 shrink-0 rounded p-1 text-text-tertiary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X size={15} aria-hidden />
        </button>
      )}
    </div>
  );
}
