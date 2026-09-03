"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {

  href: string;

  label: string;

  className?: string;
}

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
