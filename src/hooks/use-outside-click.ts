"use client";

import { useEffect, type RefObject } from "react";

/**
 * useOutsideClick — invokes `onOutside` on a mousedown that lands outside
 * *all* the provided refs, while `active`. Shared by Menu, Popover and other
 * dismissible overlays so the detection logic lives in one place.
 */
export function useOutsideClick(
  refs: Array<RefObject<HTMLElement | null>>,
  active: boolean,
  onOutside: () => void
) {
  useEffect(() => {
    if (!active) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const inside = refs.some((r) => r.current?.contains(target));
      if (!inside) onOutside();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [refs, active, onOutside]);
}
