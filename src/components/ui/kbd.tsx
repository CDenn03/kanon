import { cn } from "@/lib/utils";

interface KbdProps {
  /** Keys to render; a string is shown as-is, an array renders each key. */
  keys: string | string[];
  className?: string;
}

/**
 * Kbd — renders keyboard shortcut keys as small caps-style key caps.
 * e.g. <Kbd keys={["⌘", "K"]} /> or <Kbd keys="Esc" />.
 */
export function Kbd({ keys, className }: KbdProps) {
  const list = Array.isArray(keys) ? keys : [keys];
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {list.map((k, i) => (
        <kbd
          key={i}
          className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-bg-secondary px-1.5 font-mono text-[11px] font-medium text-text-secondary"
        >
          {k}
        </kbd>
      ))}
    </span>
  );
}
