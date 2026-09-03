"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { usePopoverPosition, useMounted, useOutsideClick } from "@/hooks";

interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The clickable anchor (button, etc.). */
  trigger: ReactNode;
  /** Panel contents. */
  children: ReactNode;
  align?: "start" | "center" | "end";
  minWidth?: number;
  /** Match the panel width to the trigger. */
  matchWidth?: boolean;
  className?: string;
}

/**
 * Popover — a generic anchored floating panel. Portalled, auto-positioned
 * (flips near the viewport edge) via usePopoverPosition, closes on outside
 * click and Escape. Additive primitive — Menu and Tooltip remain standalone.
 */
export function Popover({
  open,
  onOpenChange,
  trigger,
  children,
  align = "start",
  minWidth = 200,
  matchWidth,
  className,
}: PopoverProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const position = usePopoverPosition(anchorRef, open, { align, minWidth, matchWidth, preferredHeight: 280 });

  useOutsideClick([anchorRef, panelRef], open, () => onOpenChange(false));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <span ref={anchorRef} className="relative inline-flex">
      <span onClick={() => onOpenChange(!open)} className="contents">
        {trigger}
      </span>
      {open && position && mounted &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            className={cn(
              "z-50 rounded-lg border border-border bg-surface p-3 shadow-lg outline-none",
              className
            )}
            style={position.style}
          >
            {children}
          </div>,
          document.body
        )}
    </span>
  );
}
