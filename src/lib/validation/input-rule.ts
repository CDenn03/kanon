import type { FieldFormatKind } from "./field-format";

/**
 * A declarative description of how an input should behave at the keystroke
 * level (the `filter` stage) plus which blur/submit formatter it uses (the
 * `format` stage, resolved in `field-format.ts`).
 *
 * Attach a rule to an `Input`/`Textarea` via the `rule` prop. The component
 * enforces `filter`/`maxLength`/casing on every change and runs `format` on
 * blur, so invalid characters never reach your `onChange` handler.
 */
export interface InputRule {
  /** Hard cap on characters. Also applied to the native `maxLength`. */
  readonly maxLength?: number;
  /**
   * Named keystroke filter. Strips characters outside the named class on every
   * change so the field physically cannot hold invalid input.
   */
  readonly filter?:
    | "digits"
    | "phone"
    | "kraPin"
    | "plate"
    | "code"
    | "name"
    | "registrationNumber"
    | "accountNumber"
    | "username"
    | "slug";
  /** Virtual-keyboard hint mirrored onto the native `inputMode`. */
  readonly inputMode?: "text" | "numeric" | "tel" | "email" | "decimal";
  /** Force-uppercase on every keystroke (e.g. codes, plates, KRA PIN). */
  readonly uppercase?: boolean;
  /** Force-lowercase on every keystroke (e.g. usernames, slugs). */
  readonly lowercase?: boolean;
  /** Blur-display + submit formatter kind. See {@link FieldFormatKind}. */
  readonly format?: FieldFormatKind;
}

/** Character classes removed by each named filter (the disallowed set). */
const FILTER_PATTERNS: Record<NonNullable<InputRule["filter"]>, RegExp> = {
  digits: /[^0-9]/g,
  phone: /[^0-9+\s().-]/g,
  kraPin: /[^A-Z0-9]/g,
  plate: /[^A-Z0-9]/g,
  code: /[^A-Z0-9_]/g,
  // Forgiving name filter: any Unicode letter/mark plus the punctuation that
  // legitimately appears in names (space, hyphen, apostrophe, period).
  name: /[^\p{L}\p{M}\s'.-]/gu,
  // Registration/certificate numbers: uppercase alphanumerics plus slash/hyphen.
  registrationNumber: /[^A-Z0-9/-]/g,
  // Account numbers vary (numeric or alphanumeric/IBAN-style).
  accountNumber: /[^A-Z0-9]/g,
  // Usernames: lowercase alphanumerics plus dot, underscore, hyphen.
  username: /[^a-z0-9._-]/g,
  // URL slugs: lowercase alphanumerics plus hyphen.
  slug: /[^a-z0-9-]/g,
};

const STRIP_SPACES = /\s+/g;
const COLLAPSE_SPACES = /\s{2,}/g;
const PHONE_ALLOWED = /[^\d+\s().-]/g;

/** Filters that must never carry whitespace. */
const NO_SPACE_FILTERS = new Set(["registrationNumber", "accountNumber", "username", "slug"]);

/**
 * Enforce an {@link InputRule} against a raw string: applies casing, strips
 * disallowed characters, normalizes whitespace, then truncates to `maxLength`.
 * Pure — safe to call during render or inside a change handler.
 */
export function enforceInputRule(raw: string, rule: InputRule): string {
  let value = raw;
  if (rule.uppercase) value = value.toUpperCase();
  if (rule.lowercase) value = value.toLowerCase();

  if (rule.filter) {
    if (rule.filter === "phone") {
      value = filterPhoneInput(value);
      return capLength(value, rule.maxLength);
    }
    if (NO_SPACE_FILTERS.has(rule.filter)) {
      value = value.replace(STRIP_SPACES, "");
    }
    value = value.replace(FILTER_PATTERNS[rule.filter], "");
    if (rule.filter === "name") {
      value = value.replace(COLLAPSE_SPACES, " ");
    }
  }

  return capLength(value, rule.maxLength);
}

function capLength(value: string, maxLength?: number): string {
  return typeof maxLength === "number" && value.length > maxLength
    ? value.slice(0, maxLength)
    : value;
}

/**
 * Lenient phone keystroke filter: keeps digits, a single leading `+`, and the
 * usual separators, so no valid in-progress entry (07…, +254…) is blocked.
 */
function filterPhoneInput(raw: string): string {
  const cleaned = raw.replace(PHONE_ALLOWED, "");
  return cleaned.startsWith("+")
    ? `+${cleaned.slice(1).replace(/\+/g, "")}`
    : cleaned.replace(/\+/g, "");
}
