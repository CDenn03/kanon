/**
 * Field-level display formatting (applied on blur) and submit normalization,
 * layered on top of the keystroke `filter` in `input-rule.ts`.
 *
 * The validation model has three explicit stages per field:
 *   filter    (keystroke)     — live-strip disallowed characters, cap length.
 *   format    (blur/display)  — pretty, human-friendly presentation.
 *   normalize (submit payload)— the canonical value an API/store should receive.
 *
 * `format` is display-only and is never the value you submit; `normalize`
 * produces the payload. Keeping them separate lets the field look friendly
 * (e.g. `KES 1,000.50`, `+254 712 345 678`) while the submitted value stays
 * machine-clean (`1000.50`, `+254712345678`).
 */

/** The built-in formatter kinds shared by display (blur) and submit stages. */
export type FieldFormatKind = "phone" | "plate" | "kraPin" | "code" | "name" | "money";

/** Options that tune specific formatters (currency symbol, grouping locale). */
export interface FieldFormatOptions {
  /** Currency prefix for the `money` display formatter. Defaults to none. */
  readonly currency?: string;
  /** Locale used for `money` thousands grouping. Defaults to `en-US`. */
  readonly locale?: string;
}

/**
 * Blur display: returns a pretty, human-friendly rendering of `raw`.
 * Pure and side-effect free — safe to call in a blur handler or during render.
 * Never use the result as a submit payload; use {@link normalizeForSubmit}.
 */
export function formatOnBlur(
  kind: FieldFormatKind,
  raw: string,
  options: FieldFormatOptions = {}
): string {
  const value = raw.trim();
  if (!value) return "";
  switch (kind) {
    case "phone":
      return formatPhoneDisplay(value);
    case "plate":
      return formatPlateDisplay(value);
    case "kraPin":
      return value.toUpperCase();
    case "code":
      return normalizeCode(value);
    case "name":
      return toTitleCase(collapseSpaces(value));
    case "money":
      return formatMoneyDisplay(value, options.currency, options.locale);
    default:
      return value;
  }
}

/**
 * Submit payload: returns the canonical machine value for `raw` — the exact
 * form an API or store should receive (no display separators, grouping, or
 * currency symbols). Pure and side-effect free.
 */
export function normalizeForSubmit(kind: FieldFormatKind, raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  switch (kind) {
    case "phone":
      return normalizePhoneSubmit(value);
    case "plate":
      return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    case "kraPin":
      return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    case "code":
      return normalizeCode(value);
    case "name":
      return collapseSpaces(value);
    case "money":
      return normalizeMoneySubmit(value);
    default:
      return value;
  }
}

// ── Internal helpers ────────────────────────────────────────────

function collapseSpaces(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function toTitleCase(value: string): string {
  return value.replace(/\b\p{L}[\p{L}'-]*/gu, (word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

const KENYA_SUBSCRIBER = /^[17]\d{8}$/;

/** Reduce a phone string to its 9-digit Kenyan subscriber number, or null. */
function toKenyanSubscriber(raw: string): string | null {
  let value = raw.trim().replace(/[\s().-]/g, "");
  if (value.startsWith("00")) value = `+${value.slice(2)}`;
  if (value.startsWith("+254")) value = value.slice(4);
  else if (value.startsWith("254")) value = value.slice(3);
  else if (value.startsWith("0")) value = value.slice(1);
  return KENYA_SUBSCRIBER.test(value) ? value : null;
}

function formatPhoneDisplay(value: string): string {
  const subscriber = toKenyanSubscriber(value);
  if (!subscriber) return value;
  const a = subscriber.slice(0, 3);
  const b = subscriber.slice(3, 6);
  const c = subscriber.slice(6);
  return `+254 ${a} ${b} ${c}`.trim();
}

function normalizePhoneSubmit(value: string): string {
  const subscriber = toKenyanSubscriber(value);
  return subscriber ? `+254${subscriber}` : value;
}

function formatPlateDisplay(value: string): string {
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const firstDigit = clean.search(/\d/);
  if (firstDigit <= 0) return clean;
  return `${clean.slice(0, firstDigit)} ${clean.slice(firstDigit)}`;
}

/** Reference codes are `[A-Z0-9_]`: uppercase, spaces/hyphens become `_`. */
function normalizeCode(value: string): string {
  return value
    .toUpperCase()
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/[^A-Z0-9_]/g, "");
}

function parseMoney(value: string): number | null {
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const num = Number.parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
}

function formatMoneyDisplay(value: string, currency?: string, locale = "en-US"): string {
  const num = parseMoney(value);
  if (num === null) return value;
  const grouped = num.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency ? `${currency} ${grouped}` : grouped;
}

function normalizeMoneySubmit(value: string): string {
  const num = parseMoney(value);
  return num === null ? "" : num.toFixed(2);
}
