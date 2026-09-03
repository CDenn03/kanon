"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className={cn("code-block overflow-hidden rounded-lg border border-border", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-surface-dark px-3 py-1.5">
        <span className="font-mono text-[11px] text-on-dark/70">{filename ?? "tsx"}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="inline-flex items-center gap-1.5 rounded px-1.5 py-1 text-[11px] font-medium text-on-dark/70 transition-colors hover:bg-white/10 hover:text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
