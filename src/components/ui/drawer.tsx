"use client";

import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMounted, useFocusTrap } from "@/hooks";

type DrawerSide = "right" | "left" | "bottom";

const SIDE: Record<DrawerSide, string> = {
  right: "inset-y-0 right-0 h-full w-full max-w-md border-l",
  left: "inset-y-0 left-0 h-full w-full max-w-md border-r",
  bottom: "inset-x-0 bottom-0 max-h-[85vh] w-full rounded-t-2xl border-t",
};

const ENTER: Record<DrawerSide, string> = {
  right: "animate-[drawer-in-right_0.2s_ease]",
  left: "animate-[drawer-in-left_0.2s_ease]",
  bottom: "animate-[drawer-in-bottom_0.2s_ease]",
};

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title?: ReactNode;
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
  children?: ReactNode;
}

/**
 * Drawer (Sheet) — a slide-in panel anchored to an edge, for filters,
 * detail views or forms. Focus-trapped, Esc + backdrop close, portalled.
 */
export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  footer,
  closeOnBackdrop = true,
  children,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  useFocusTrap(panelRef, open, onClose);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] bg-overlay"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "drawer-title" : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute flex flex-col bg-surface shadow-overlay outline-none border-border",
          SIDE[side],
          ENTER[side]
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          {title ? (
            <h2 id="drawer-title" className="text-base font-semibold text-text">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 shrink-0 rounded-md p-1 text-text-tertiary hover:bg-bg-hover hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-sm text-text">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
