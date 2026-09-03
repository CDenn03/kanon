import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with clsx semantics + Tailwind conflict resolution.
 * Prefer this in all components.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Concatenate class names, filtering out falsy values.
 * @deprecated Prefer {@link cn} — it also resolves Tailwind class conflicts.
 */
export function cx(...args: (string | false | null | undefined)[]): string {
  return args.filter(Boolean).join(" ");
}

/**
 * Focus ring style helper.
 * @deprecated Focus rings are now handled globally via the
 * `:focus-visible` rule in `globals.css` and the `focus-visible:*`
 * utilities. This remains only for backwards compatibility.
 */
export function ring(color: string = "var(--color-accent)") {
  return { outlineColor: color };
}
