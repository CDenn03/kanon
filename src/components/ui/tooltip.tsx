"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { usePopoverPosition } from "@/hooks/use-popover-position";
import { useMounted } from "@/hooks/use-mounted";

export interface TooltipProps {
  /** Tooltip content — plain string or React node. */
  content: React.ReactNode;
  children: React.ReactElement;
  /** Delay before the tooltip appears, in ms. Default: 400. */
  delayMs?: number;
}

/**
 * Tooltip — wraps any single child and shows a dark label above or below it.
 * Placement auto-flips when near the bottom of the viewport (same logic as
 * the popover hook used by Button, SearchCombobox, etc.).
 *
 * Usage:
 *   <Tooltip content="Remove this item">
 *     <button>×</button>
 *   </Tooltip>
 */
export function Tooltip({ content, children, delayMs = 400 }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const mounted = useMounted();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const position = usePopoverPosition(anchorRef, open, {
    align: "center",
    gap: 6,
    minWidth: 60,
    preferredHeight: 40,
  });

  const show = () => {
    timerRef.current = setTimeout(() => setOpen(true), delayMs);
  };
  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(false);
  };

  return (
    <>
      <span
        ref={anchorRef}
        className="inline-flex"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>

      {open && position && mounted &&
        createPortal(
          <span
            role="tooltip"
            className="pointer-events-none z-50 max-w-56 whitespace-nowrap rounded-md bg-surface-dark px-2.5 py-1.5 text-xs leading-snug text-on-dark shadow-lg"
            style={position.style}
          >
            {content}
            <span
              aria-hidden="true"
              className="absolute left-1/2 size-2 -translate-x-1/2 rotate-45 bg-surface-dark"
              style={position.placement === "top" ? { bottom: -4 } : { top: -4 }}
            />
          </span>,
          document.body
        )}
    </>
  );
}
