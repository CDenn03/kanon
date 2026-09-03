"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "kanon-theme";

/**
 * ThemeToggle — flips between light and dark by setting
 * <html data-theme="dark"> and persisting the choice. The initial theme is
 * applied pre-paint by the inline script in layout.tsx (no flash).
 *
 * Pass `onDark` when placing it on a dark surface (e.g. a dark control strip)
 * so its colors read against `--color-on-dark` instead of the light chrome.
 */
export function ThemeToggle({ onDark, className }: { onDark?: boolean; className?: string }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
    setReady(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    if (next) root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      title={dark ? "Light mode" : "Dark mode"}
      className={cn(
        "flex size-8 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        onDark
          ? "text-on-dark/70 hover:bg-on-dark/10 hover:text-on-dark"
          : "text-text-secondary hover:bg-bg-hover hover:text-text",
        className
      )}
    >
      {/* Render nothing until mounted to keep SSR markup stable */}
      {ready && (dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />)}
    </button>
  );
}
