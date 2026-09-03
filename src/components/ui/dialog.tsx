"use client";

import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMounted, useFocusTrap } from "@/hooks";

type DialogSize = "sm" | "md" | "lg";

const SIZE: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;

  footer?: ReactNode;
  size?: DialogSize;

  closeOnBackdrop?: boolean;
  children?: ReactNode;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  size = "md",
  closeOnBackdrop = true,
  children,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  useFocusTrap(panelRef, open, onClose);

  if (!open || !mounted) return null;

  const labelledBy = title ? "dialog-title" : undefined;
  const describedBy = description ? "dialog-desc" : undefined;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-overlay p-4"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-xl bg-surface shadow-overlay outline-none",
          SIZE[size]
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-5">
            <div className="min-w-0">
              {title && (
                <h2 id="dialog-title" className="text-base font-semibold text-text">
                  {title}
                </h2>
              )}
              {description && (
                <p id="dialog-desc" className="mt-1 text-sm leading-relaxed text-text-secondary">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="-mr-1 -mt-1 shrink-0 rounded-md p-1 text-text-tertiary hover:bg-bg-hover hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X size={18} aria-hidden />
            </button>
          </div>
        )}

        {children && <div className="px-5 py-2 text-sm text-text">{children}</div>}

        {footer && (
          <div className="mt-2 flex items-center justify-end gap-2 border-t border-border bg-bg px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
