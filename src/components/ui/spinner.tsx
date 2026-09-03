import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

const SIZE: Record<SpinnerSize, number> = { sm: 14, md: 18, lg: 24 };

interface SpinnerProps {
  size?: SpinnerSize;
  /** Accessible label for screen readers. */
  label?: string;
  className?: string;
}

/**
 * Spinner — an indeterminate loading indicator. Announces a status label to
 * assistive tech; the icon itself is aria-hidden.
 */
export function Spinner({ size = "md", label = "Loading", className }: SpinnerProps) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-2 text-text-secondary", className)}>
      <Loader2 size={SIZE[size]} className="animate-spin text-accent" aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}
