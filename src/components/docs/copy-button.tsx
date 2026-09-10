"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CopyButton — copies `text` to the clipboard and shows a transient "Copied"
 * state. Reused by CodeBlock and by collapsible section headers so source can
 * be copied without expanding the section.
 */
export function CopyButton({
  text,
  className,
  label = "Copy",
  stopPropagation = false,
}: {
  text: string;
  className?: string;
  /** Idle label (also used for aria-label). */
  label?: string;
  /** Stop the click from bubbling (e.g. so it won't toggle a parent <summary>). */
  stopPropagation?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-1.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2",
        className
      )}
    >
      {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
      {copied ? "Copied" : label}
    </button>
  );
}
