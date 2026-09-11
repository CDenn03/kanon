import { type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * CollapsibleSection — a native <details>/<summary> disclosure styled to match
 * the docs, collapsed by default unless `defaultOpen` is set.
 *
 * Server-renderable (no client JS). Closed content is genuinely hidden by the
 * native <details> (display:none), so a collapsed — or expanded — section can
 * never add page height or a second scrollbar, regardless of how tall its
 * content is. When opened, the panel plays a short reveal animation (fade +
 * slide, ~200ms ease-out, the disclosure "sweet spot"); the chevron rotates.
 * Motion is disabled under prefers-reduced-motion (handled in globals.css).
 */
export function CollapsibleSection({
  title,
  subtitle,
  defaultOpen = false,
  action,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  defaultOpen?: boolean;
  /** Optional control rendered on the right of the header (e.g. a copy button).
   *  Stays reachable while the section is collapsed. */
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <details open={defaultOpen || undefined} className="collapsible group">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md py-1 text-sm font-semibold text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
        <ChevronDown
          size={16}
          className="shrink-0 text-text-tertiary transition-transform duration-200 ease-[cubic-bezier(0.33,1,0.68,1)] group-open:rotate-180"
          aria-hidden
        />
        <span>{title}</span>
        {action && <span className="ml-auto">{action}</span>}
      </summary>

      <div className="collapsible-panel">
        {subtitle && <div className="mb-3 mt-2 text-sm text-text-secondary">{subtitle}</div>}
        <div className="mt-3">{children}</div>
      </div>
    </details>
  );
}
