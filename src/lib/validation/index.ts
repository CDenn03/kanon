/**
 * Kanon input validation — a three-stage model for text fields:
 *   filter    (keystroke)      → `enforceInputRule` / `InputRule`
 *   format    (blur/display)   → `formatOnBlur`
 *   normalize (submit payload) → `normalizeForSubmit`
 * plus boolean field validators for computing the `error` prop.
 */
export { enforceInputRule, type InputRule } from "./input-rule";
export {
  formatOnBlur,
  normalizeForSubmit,
  type FieldFormatKind,
  type FieldFormatOptions,
} from "./field-format";
export {
  isValidKenyanPhone,
  normalizeKenyanPhone,
  toKenyanSubscriber,
  isValidDigits,
  isValidKraPin,
  isValidVehiclePlate,
  isValidEmail,
} from "./validators";
