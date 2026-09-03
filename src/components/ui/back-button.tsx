"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  /** Destination URL. */
  href: string;
  /** Visible label, e.g. "Users", "Dashboard". */
  label: string;
  /** Optional extra classes for layout (e.g. margin). */
  className?: string;
}

/**
 * BackButton — a clear, discoverable back-navigation affordance.
 *
 * Rendered as a bordered pill (not a faint text link) so it reads as a
 * tappable control — recognition over recall, with an adequate target size
 * (min-h-9 ≈ 36px) per Fitts's Law.
 */
export function BackButton({ href, label, className }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-9 items-center gap-2 rounded-lg border border-border bg-bg px-3 text-sm font-medium text-text-secondary no-underline shadow-sm transition-colors",
        "hover:border-accent hover:bg-accent-light hover:text-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        className
      )}
    >
      <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" aria-hidden />
      <span>{label}</span>
    </Link>
  );
}
