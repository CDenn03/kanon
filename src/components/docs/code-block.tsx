"use client";

import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

interface CodeBlockProps {
  /** Pre-rendered shiki HTML (from the server highlighter). */
  html: string;
  /** Raw source, used for the copy-to-clipboard action. */
  raw: string;
  /** Optional filename/label shown in the header. */
  filename?: string;
  className?: string;
}

/**
 * CodeBlock — renders shiki-highlighted HTML with a copy button.
 * The highlighted HTML is produced server-side; this component only adds
 * the interactive copy affordance.
 */
export function CodeBlock({ html, raw, filename, className }: CodeBlockProps) {
  return (
    <div className={cn("code-block overflow-hidden rounded-lg border border-border", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-surface-dark px-3 py-1.5">
        <span className="font-mono text-[11px] text-on-dark/70">{filename ?? "tsx"}</span>
        <CopyButton
          text={raw}
          className="text-on-dark/70 hover:bg-white/10 hover:text-on-dark focus-visible:ring-white/40"
        />
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
