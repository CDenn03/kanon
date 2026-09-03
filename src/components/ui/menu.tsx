"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePopoverPosition } from "@/hooks/use-popover-position";
import { useMounted } from "@/hooks/use-mounted";
import { useOutsideClick } from "@/hooks/use-outside-click";

/* ═══════════════════════════════════════════════════════════════
   Menu — compound component

   Anatomy:
     <Menu open={open} onOpenChange={setOpen}>
       <MenuTrigger><button>…</button></MenuTrigger>
       <MenuContent align="end">
         <MenuLabel>Section</MenuLabel>
         <MenuItem icon={<Edit size={15}/>} onSelect={…}>Edit</MenuItem>
         <MenuCheckboxItem checked={v} onCheckedChange={setV}>Show email</MenuCheckboxItem>
         <MenuSeparator />
         <MenuItem destructive onSelect={…}>Delete</MenuItem>
       </MenuContent>
     </Menu>

   The dropdown is portalled to <body> so it escapes any overflow:hidden
   ancestor. Positioning is handled by usePopoverPosition (the same
   hook used by Button's tooltip, SearchCombobox, and DatePicker).
   ═══════════════════════════════════════════════════════════════ */

/* ── Context ──────────────────────────────────────────────── */
interface MenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}
const MenuContext = React.createContext<MenuContextValue | null>(null);

function useMenuContext(): MenuContextValue {
  const ctx = React.useContext(MenuContext);
  if (!ctx) throw new Error("Menu compound components must be used inside <Menu>.");
  return ctx;
}

/* ── Types ────────────────────────────────────────────────── */
export interface MenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export interface MenuContentProps {
  /** Align the dropdown to the start or end of the trigger. Default: "start". */
  align?: "start" | "end" | "center";
  /** Minimum dropdown width in px. Default: 180. */
  minWidth?: number;
  children: React.ReactNode;
}

export interface MenuItemProps {
  icon?: React.ReactNode;
  /** Renders in rose/danger colours. */
  destructive?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  children: React.ReactNode;
}

export interface MenuCheckboxItemProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** When true, renders the item as read-only with an "always on" label. */
  locked?: boolean;
  children: React.ReactNode;
}

/* ── Menu (root) ──────────────────────────────────────────── */
export function Menu({ open, onOpenChange, children }: MenuProps) {
  const triggerRef = React.useRef<HTMLElement | null>(null);
  return (
    <MenuContext.Provider value={{ open, onOpenChange, triggerRef }}>
      <span className="relative inline-flex">{children}</span>
    </MenuContext.Provider>
  );
}

/* ── MenuTrigger ──────────────────────────────────────────── */
/**
 * Wraps the trigger element and forwards the ref to it.
 * Accepts a single React element child.
 */
export function MenuTrigger({ children }: { children: React.ReactElement }) {
  const { open, onOpenChange, triggerRef } = useMenuContext();

  const child = React.cloneElement(children, {
    ref: triggerRef,
    onClick: (e: React.MouseEvent) => {
      (children.props as React.HTMLAttributes<Element>).onClick?.(e as React.MouseEvent<HTMLElement>);
      onOpenChange(!open);
    },
  } as React.HTMLAttributes<HTMLElement> & { ref: React.Ref<HTMLElement> });

  return child;
}

/* ── MenuContent ──────────────────────────────────────────── */
export function MenuContent({ align = "start", minWidth = 180, children }: MenuContentProps) {
  const { open, onOpenChange, triggerRef } = useMenuContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const mounted = useMounted();

  const position = usePopoverPosition(triggerRef as React.RefObject<HTMLElement>, open, {
    align,
    minWidth,
    preferredHeight: 280,
    gap: 4,
  });

  // Close on outside click (shared primitive)
  useOutsideClick(
    [triggerRef, contentRef],
    open,
    React.useCallback(() => onOpenChange(false), [onOpenChange])
  );

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return;
    const items = () =>
      Array.from<HTMLElement>(
        contentRef.current?.querySelectorAll('[role^="menuitem"]:not([disabled])') ?? []
      );
    const t = setTimeout(() => items()[0]?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
        (triggerRef.current as HTMLElement | null)?.focus();
        return;
      }
      if (e.key === "Tab") { onOpenChange(false); return; }
      const list = items();
      if (!list.length) return;
      const i = list.indexOf(document.activeElement as HTMLElement);
      if (e.key === "ArrowDown") { e.preventDefault(); list[(i + 1) % list.length]?.focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); list[(i - 1 + list.length) % list.length]?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); document.removeEventListener("keydown", onKey); };
  }, [open, onOpenChange, triggerRef]);

  if (!open || !position || !mounted) return null;

  return createPortal(
    <div
      ref={contentRef}
      role="menu"
      className="z-50 overflow-auto rounded-lg border border-border bg-surface py-1 shadow-lg"
      style={position.style}
    >
      {children}
    </div>,
    document.body
  );
}

/* ── MenuItem ─────────────────────────────────────────────── */
export function MenuItem({ icon, destructive, disabled, onSelect, children }: MenuItemProps) {
  const { onOpenChange, triggerRef } = useMenuContext();

  const handleClick = () => {
    onSelect?.();
    onOpenChange(false);
    (triggerRef.current as HTMLElement | null)?.focus();
  };

  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
        "disabled:cursor-not-allowed disabled:opacity-45",
        destructive ? "text-error hover:bg-error-light" : "text-text hover:bg-bg-hover"
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
}

/* ── MenuCheckboxItem ─────────────────────────────────────── */
export function MenuCheckboxItem({ checked, onCheckedChange, locked, children }: MenuCheckboxItemProps) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      tabIndex={-1}
      disabled={locked}
      onClick={() => !locked && onCheckedChange(!checked)}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm text-text outline-none transition-colors",
        "hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
        "disabled:cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
          checked ? "border-accent bg-accent" : "border-border bg-transparent"
        )}
      >
        {checked && <Check size={11} strokeWidth={3} className="text-on-accent" />}
      </span>
      <span className="flex-1 truncate">{children}</span>
      {locked && <span className="shrink-0 text-xs text-text-tertiary">always on</span>}
    </button>
  );
}

/* ── MenuSeparator ────────────────────────────────────────── */
export function MenuSeparator() {
  return <div role="separator" className="my-1 h-px bg-border" />;
}

/* ── MenuLabel ────────────────────────────────────────────── */
export function MenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-1 pt-1.5 text-xs font-medium uppercase tracking-wider text-text-tertiary">
      {children}
    </p>
  );
}
