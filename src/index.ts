/**
 * Package entry for Kanon.
 *
 * Re-exports the public component + hook + util API. Docs-only modules
 * (registry, highlighter, demo wrappers) are intentionally excluded.
 */
export * from "./components/ui";
export { cn, cx } from "./lib/utils";
export {
  enforceInputRule,
  formatOnBlur,
  normalizeForSubmit,
  isValidKenyanPhone,
  normalizeKenyanPhone,
  toKenyanSubscriber,
  isValidDigits,
  isValidKraPin,
  isValidVehiclePlate,
  isValidEmail,
  type InputRule,
  type FieldFormatKind,
  type FieldFormatOptions,
} from "./lib/validation";
export {
  usePopoverPosition,
  useMounted,
  useFocusTrap,
  useOutsideClick,
} from "./hooks";
