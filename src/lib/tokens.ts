/**
 * Design tokens for Kanon.
 *
 * The single source of truth is the semantic `@theme` layer in
 * `src/app/globals.css`. Components should prefer Tailwind utility
 * classes backed by those tokens (e.g. `bg-accent`, `text-text-secondary`,
 * `border-border`).
 *
 * This object exists only for the rare case where a raw CSS value is
 * needed in JS/inline styles (e.g. canvas, dynamic SVG fills). Each entry
 * resolves to the corresponding semantic CSS variable rather than a
 * hardcoded hex, so there is exactly one place to change a color.
 */
export const tokens = {
  bg: "var(--color-bg)",
  bgSecondary: "var(--color-bg-secondary)",
  surface: "var(--color-surface)",
  border: "var(--color-border)",
  borderHover: "var(--color-border-hover)",

  text: "var(--color-text)",
  textSecondary: "var(--color-text-secondary)",
  textTertiary: "var(--color-text-tertiary)",

  accent: "var(--color-accent)",
  accentHover: "var(--color-accent-hover)",
  accentLight: "var(--color-accent-light)",
  onAccent: "var(--color-on-accent)",

  warning: "var(--color-warning)",
  warningLight: "var(--color-warning-light)",

  error: "var(--color-error)",
  errorHover: "var(--color-error-hover)",
  errorLight: "var(--color-error-light)",

  surfaceDark: "var(--color-surface-dark)",
  onDark: "var(--color-on-dark)",

  /* ── Legacy aliases ───────────────────────────────────────────
   * Kept so components migrated incrementally keep compiling. These
   * map onto the same semantic CSS variables. Prefer utility classes
   * (bg-accent, text-text-secondary, …) in new/updated code.
   */
  ink: "var(--color-text)",
  ink2: "var(--color-text-secondary)",
  ink3: "var(--color-text-tertiary)",
  hairline: "var(--color-border)",
  muted: "var(--color-bg-secondary)",
  accentSoft: "var(--color-accent-light)",
  amber: "var(--color-warning)",
  amberSoft: "var(--color-warning-light)",
  rose: "var(--color-error)",
  roseHover: "var(--color-error-hover)",
  roseSoft: "var(--color-error-light)",
} as const;

export type Tokens = typeof tokens;
