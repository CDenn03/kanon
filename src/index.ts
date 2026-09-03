/**
 * Package entry for Kanon.
 *
 * Re-exports the public component + hook + util API. Docs-only modules
 * (registry, highlighter, demo wrappers) are intentionally excluded.
 */
export * from "./components/ui";
export { cn, cx } from "./lib/utils";
export {
  usePopoverPosition,
  useMounted,
  useFocusTrap,
  useOutsideClick,
} from "./hooks";
