import { cn } from "@/lib/utils";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";

  label?: string;
  className?: string;
}

export function Separator({ orientation = "horizontal", label, className }: SeparatorProps) {
  if (orientation === "vertical") {
    return <span role="separator" aria-orientation="vertical" className={cn("inline-block h-4 w-px bg-border", className)} />;
  }

  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wider text-text-tertiary">{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }

  return <hr className={cn("border-0 border-t border-border", className)} />;
}
