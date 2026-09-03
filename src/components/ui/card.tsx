import { cn } from "@/lib/utils";

/**
 * Card family — a rounded, bordered surface with optional sub-sections.
 *
 * Per Mathesis "Content Card" guideline:
 *   sizing: 12px radius (rounded-xl), 1px border, 16px padding
 *   states: default / hover (accent border + elevation, interactive only) /
 *           selected (accent border + light tint) / loading (skeleton)
 *   a11y:   interactive cards render as <a>/<button> and expose the same
 *           visual treatment on keyboard focus as on hover.
 *
 * Composition:
 *   <Card>
 *     <CardHeader title="Active users" action={<Button>Add</Button>} />
 *     <CardBody>…</CardBody>
 *     <CardFooter>…</CardFooter>
 *   </Card>
 */

interface CardProps {
  className?: string;
  children: React.ReactNode;
  /** Adds hover elevation + focus treatment; card should also be a link/button. */
  interactive?: boolean;
  /** Selected/active visual state (accent border + light tint). */
  selected?: boolean;
}

export function Card({ className, children, interactive, selected }: CardProps) {
  return (
    <div
      data-selected={selected || undefined}
      className={cn(
        "rounded-xl border border-border bg-surface",
        interactive &&
          "transition-shadow transition-colors hover:border-border-hover hover:shadow-md focus-within:border-accent",
        selected && "border-accent bg-accent-light",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  title: React.ReactNode;
  /** Optional right-side slot — a Button, a menu trigger, a badge, etc. */
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, action, className }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-border px-4 py-3",
        className
      )}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        {title}
      </h3>
      {action}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-4", className)}>{children}</div>;
}

export function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("border-t border-border px-4 py-3", className)}>{children}</div>;
}
