import { cn } from "@/lib/utils";

interface KbdProps {

  keys: string | string[];
  className?: string;
}

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
