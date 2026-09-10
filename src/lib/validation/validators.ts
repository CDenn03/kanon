/**
 * Boolean field validators — the "is this value acceptable?" predicates that
 * complement the keystroke `filter` (input-rule) and blur/submit `format`
 * (field-format) stages. Use them to compute the `error` prop for a field,
 * typically on blur or submit.
 *
 * These are forgiving readers: they accept the common human formats and trim
 * before testing, so `isValidKenyanPhone("0712 345 678")` is true.
 */

const KRA_PIN = /^[A-Z]\d{9}[A-Z]$/;
const VEHICLE_PLATE = /^[A-Z]{3,4}\d{3}[A-Z]$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KENYA_SUBSCRIBER = /^[17]\d{8}$/;

function stripPlateSeparators(raw: string): string {
  return raw.replace(/[\s.-]/g, "").toUpperCase();
}

/** Reduce any accepted Kenyan phone format to its 9-digit subscriber, or null. */
export function toKenyanSubscriber(raw: string): string | null {
  let value = raw.trim().replace(/[\s().-]/g, "");
  if (value.startsWith("00")) value = `+${value.slice(2)}`;
  if (value.startsWith("+254")) value = value.slice(4);
  else if (value.startsWith("254")) value = value.slice(3);
  else if (value.startsWith("0")) value = value.slice(1);
  return KENYA_SUBSCRIBER.test(value) ? value : null;
}

/** True when `raw` reads as a valid Kenyan mobile number in any common format. */
export function isValidKenyanPhone(raw: string): boolean {
  return toKenyanSubscriber(raw) !== null;
}

/** Normalize any accepted Kenyan format to canonical E.164 (`+254…`), or null. */
export function normalizeKenyanPhone(raw: string): string | null {
  const subscriber = toKenyanSubscriber(raw);
  return subscriber ? `+254${subscriber}` : null;
}

/** True for an integer string of exactly `length` digits (default 8). */
export function isValidDigits(raw: string, length = 8): boolean {
  return new RegExp(`^\\d{${length}}$`).test(raw.trim());
}

/** True for a KRA PIN of the form `A001234567B`. */
export function isValidKraPin(raw: string): boolean {
  return KRA_PIN.test(raw.trim().toUpperCase());
}

/** True for a Kenyan vehicle plate (`KAA123A` / `KAA 123A`). */
export function isValidVehiclePlate(raw: string): boolean {
  return VEHICLE_PLATE.test(stripPlateSeparators(raw.trim()));
}

/** True for a syntactically valid email address. */
export function isValidEmail(raw: string): boolean {
  return EMAIL.test(raw.trim());
}
