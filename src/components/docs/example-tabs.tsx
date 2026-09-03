"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";

interface ExampleTabsProps {
  /** Live rendered example. */
  preview: React.ReactNode;
  /** Pre-highlighted shiki HTML for the snippet. */
  codeHtml: string;
  /** Raw snippet source (for copy). */
  codeRaw: string;
  filename?: string;
  /** Alignment of the preview content. */
  align?: "start" | "center";
}

/**
 * ExampleTabs — a Preview ↔ Code toggle for a single usage example.
 * Preview shows the live component; Code shows the copyable snippet.
 */
export function ExampleTabs({ preview, codeHtml, codeRaw, filename, align = "start" }: ExampleTabsProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview");

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div role="tablist" className="flex items-center gap-1 border-b border-border bg-bg-secondary px-2 py-1.5">
        {(["preview", "code"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              tab === t ? "bg-surface text-text shadow-sm" : "text-text-secondary hover:text-text"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "preview" ? (
        <div
          className={cn(
            "flex min-h-28 flex-wrap items-center gap-4 bg-surface p-6",
            align === "center" && "justify-center"
          )}
        >
          {preview}
        </div>
      ) : (
        <CodeBlock html={codeHtml} raw={codeRaw} filename={filename} className="rounded-none border-0" />
      )}
    </div>
  );
}
