"use client";

import { useState, useEffect } from "react";

/**
 * Returns true once the component has mounted on the client.
 * Useful for portals and anything that needs `document` to exist.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
