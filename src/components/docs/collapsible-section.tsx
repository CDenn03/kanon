"use client";

import { useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * CollapsibleSection — an accessible <details>/<summary> disclosure styled to
 * match the docs, collapsed by default unless `defaultOpen` is set.
 *
 * Animation: the panel is a CSS grid whose row animates 0fr → 1fr, so it
 * expands to its natural height without a hard-coded value. Native <details>
 * hides content instantly on close, which would skip the collapse animation;
 * so on close we keep the element `open`, play the transition, then remove
 * `open` when it ends. Timing sits in the disclosure "sweet spot"
 * (--duration-normal 200ms, --ease-out) and is disabled under
 * prefers-reduced-motion (handled in globals.css).
 */
export function CollapsibleSection({
  title,
  subtitle,
  defaultOpen = false,
  action,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  defaultOpen?: boolean;
  /** Optional control rendered on the right of the header (e.g. a copy button).
   *  It stays reachable while the section is collapsed. */
  action?: ReactNode;
  children: ReactNode;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(defaultOpen);
  const closingRef = useRef(false);

  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // We drive the open state ourselves so close can animate.
    const el = detailsRef.current;
    if (!el) return;

    if (!open) {
      // Opening: set open immediately, CSS transitions 0fr → 1fr.
      el.open = true;
      setOpen(true);
      closingRef.current = false;
    } else {
      // Closing: keep it open, flip the visual state to animate 1fr → 0fr,
      // then actually close when the grid transition finishes.
      closingRef.current = true;
      setOpen(false);
    }
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (
      e.propertyName === "grid-template-rows" &&
      closingRef.current &&
      detailsRef.current
    ) {
      detailsRef.current.open = false;
      closingRef.current = false;
    }
  };

  return (
    <details ref={detailsRef} open={open} className="collapsible group" data-open={open}>
      <summary
        onClick={handleToggleClick}
        className="flex cursor-pointer list-none items-center gap-2 rounded-md py-1 text-sm font-semibold text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-details-marker]:hidden"
      >
        <ChevronDown
          size={16}
          className="shrink-0 text-text-tertiary transition-transform duration-200 ease-[cubic-bezier(0.33,1,0.68,1)] group-data-[open=true]:rotate-180"
          aria-hidden
        />
        <span>{title}</span>
        {action && <span className="ml-auto">{action}</span>}
      </summary>

      <div ref={panelRef} className="collapsible-panel grid" onTransitionEnd={handleTransitionEnd}>
        <div className="min-h-0 overflow-hidden">
          {subtitle && <div className="mb-3 mt-2 text-sm text-text-secondary">{subtitle}</div>}
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </details>
  );
}
