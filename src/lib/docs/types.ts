import type { ReactNode } from "react";

export type ComponentCategory =
  | "Forms"
  | "Buttons & Actions"
  | "Data Display"
  | "Feedback"
  | "Overlays"
  | "Navigation"
  | "Layout"
  | "Patterns";

export interface ComponentExample {
  /** Short title for the example (e.g. "Variants"). */
  title: string;
  /** Optional one-line explanation. */
  description?: string;
  /** Live rendered example. */
  node: ReactNode;
  /** Source snippet shown in the Code tab (kept next to the node). */
  code: string;
  /** Center the preview instead of left-aligning. */
  center?: boolean;
}

/**
 * Reference-grade specification for a component, sourced from / modelled on
 * the Mathesis UI_COMPONENT asset guidelines (anatomy, states, tokens,
 * do/don't, accessibility). Optional — components without a spec just show
 * examples + source.
 */
export interface ComponentSpec {
  /** What it's for / when to use it. */
  purpose?: string;
  /** Visual/structural breakdown. */
  anatomy?: string[];
  /** Interactive states (default / hover / focus / disabled / …). */
  states?: string[];
  /** Sizing/spacing tokens or values. */
  tokens?: { label: string; value: string }[];
  /** Do's and don'ts. */
  guidelines?: { do: string[]; dont: string[] };
  /** Accessibility requirements. */
  accessibility?: string[];
  /** Where this spec came from (e.g. a mathesis asset id). */
  source?: string;
}

export interface ComponentEntry {
  /** URL slug: /components/[slug]. */
  slug: string;
  /** Display name. */
  name: string;
  /** One-line summary for cards and headers. */
  description: string;
  category: ComponentCategory;
  /**
   * Path (relative to repo root) of the component source file, read from
   * disk at build time so the "full source" viewer never drifts.
   */
  sourcePath: string;
  /** Named exports this file provides (shown in the import line). */
  exports: string[];
  /** Usage examples. */
  examples: ComponentExample[];
  /** Optional reference spec (anatomy/states/tokens/guidelines/a11y). */
  spec?: ComponentSpec;
  /**
   * Slugs of other registry components this one depends on / composes.
   * Rendered as links so you know what else to copy.
   */
  dependsOn?: string[];
  /**
   * Repo-relative paths of non-component files this component needs
   * (hooks, utils). Shown in the recommended folder structure.
   */
  requires?: string[];
}
