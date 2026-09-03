"use client";

import { useState, useEffect, useCallback, type RefObject, type CSSProperties } from "react";

interface PopoverPositionOptions {
  align?: "start" | "center" | "end";
  gap?: number;
  viewportPadding?: number;
  preferredHeight?: number;
  matchWidth?: boolean;
  minWidth?: number;
}

interface PopoverPosition {
  placement: "top" | "bottom";
  style: CSSProperties;
}

/**
 * Compute a fixed-position popover style anchored to a ref element.
 * Opens downward by default; flips upward when there isn't room below
 * AND there's more room above. Clamps horizontally so nothing renders
 * past the viewport edge. Re-measures on scroll/resize while open.
 */
export function usePopoverPosition(
  anchorRef: RefObject<HTMLElement | null>,
  open: boolean,
  options: PopoverPositionOptions = {}
): PopoverPosition | null {
  const {
    align = "start",
    gap = 4,
    viewportPadding = 8,
    preferredHeight = 320,
    matchWidth = false,
    minWidth,
  } = options;

  const [position, setPosition] = useState<PopoverPosition | null>(null);

  const measure = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spaceBelow = vh - rect.bottom - viewportPadding;
    const spaceAbove = rect.top - viewportPadding;
    const placement =
      spaceBelow < Math.min(preferredHeight, 160) && spaceAbove > spaceBelow
        ? "top"
        : "bottom";
    const maxHeight = Math.max(
      120,
      Math.min(preferredHeight, placement === "top" ? spaceAbove : spaceBelow)
    );
    const width = matchWidth ? rect.width : minWidth;
    let left = align === "end" && width ? rect.right - width : rect.left;
    if (align === "center" && width)
      left = rect.left + rect.width / 2 - width / 2;
    left = width
      ? Math.min(Math.max(left, viewportPadding), vw - width - viewportPadding)
      : Math.min(Math.max(left, viewportPadding), vw - viewportPadding);

    setPosition({
      placement,
      style: {
        position: "fixed",
        top: placement === "top" ? undefined : rect.bottom + gap,
        bottom: placement === "top" ? vh - rect.top + gap : undefined,
        left,
        width: matchWidth ? rect.width : undefined,
        minWidth: !matchWidth ? minWidth : undefined,
        maxHeight,
      },
    });
  }, [anchorRef, align, gap, viewportPadding, preferredHeight, matchWidth, minWidth]);

  useEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open, measure]);

  return position;
}
