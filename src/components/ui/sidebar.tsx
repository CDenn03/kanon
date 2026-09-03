"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronDown, Lock, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "./tooltip";
import { Badge } from "./badge";
import { Avatar } from "./avatar";

/* ═══════════════════════════════════════════════════════════════
   Sidebar

   Key design decisions:

   1. Collapse toggle is a small floating icon pinned to the top-right
      edge of the sidebar — not a full-width bar. It sits at the logo
      row height so it's always findable without scrolling, and is small
      enough not to compete with the logo or nav items visually.

   2. Logo slot is flexible: pass any ReactNode. The component constrains
      height (56 px header) and clips overflow, but imposes no width —
      wide wordmarks and square marks both work. Pass `logoCollapsed` for
      the icon-only rail view; it falls back to `logo` if omitted.

   3. Mobile is a full-width overlay. The collapsed icon-rail is
      a desktop-only density affordance; mobile users get the full
      sidebar or nothing.

   4. SidebarFooter no longer contains user account info — that belongs
      in the Navbar's account dropdown where session controls live.
      The footer is kept for logout or any other persistent action you
      want anchored at the bottom.

   5. SidebarGroup supports collapsible children with animated chevron.
      In collapsed-rail mode clicking the icon expands the sidebar
      rather than spawning a flyout submenu. Groups auto-expand when
      they contain the active route.

   6. Permission-based visibility: Items can specify `permissions` array
      and use the `hasPermission` prop on Sidebar to filter visibility.
      Items can also use `hidden` prop for conditional rendering.
   ═══════════════════════════════════════════════════════════════ */

/* ── Context ──────────────────────────────────────────────── */
interface SidebarContextValue {
  collapsed: boolean;
  requestExpand: () => void;
  hasPermission?: (permissions: string[]) => boolean;
}
const SidebarContext = React.createContext<SidebarContextValue>({
  collapsed: false,
  requestExpand: () => {},
});

/* ── Sidebar ──────────────────────────────────────────────── */
export interface SidebarProps {
  /**
   * Full logo — shown when expanded. Any ReactNode: image, SVG, styled
   * span. The header row is 56 px tall; width is unconstrained.
   */
  logo: React.ReactNode;
  /**
   * Icon-only version for the collapsed 64 px rail. Falls back to `logo`
   * if omitted — useful when your logo is already a square mark.
   */
  logoCollapsed?: React.ReactNode;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  /**
   * Optional permission checker. If provided, items with `permissions`
   * prop will only render if this returns true.
   */
  hasPermission?: (permissions: string[]) => boolean;
  className?: string;
  children: React.ReactNode;
}

export function Sidebar({
  logo, logoCollapsed, collapsed, onCollapsedChange,
  mobileOpen, onMobileOpenChange, hasPermission, className, children,
}: SidebarProps) {
  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onMobileOpenChange(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen, onMobileOpenChange]);

  return (
    <SidebarContext.Provider value={{ collapsed, requestExpand: () => onCollapsedChange(false), hasPermission }}>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => onMobileOpenChange(false)}
          className="fixed inset-0 z-40 cursor-pointer border-0 bg-overlay p-0 md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-surface",
          "transition-[width,transform] duration-200 md:static md:z-auto md:translate-x-0",
          "w-64",
          collapsed ? "md:w-16" : "md:w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* ── Logo row with floating collapse pin ─────────── */}
        <div className="relative flex h-14 shrink-0 items-center border-b border-border px-3">
          {/* Logo — clipped to available width */}
          <span className={cn(
            "flex min-w-0 flex-1 items-center overflow-hidden",
            collapsed ? "justify-center" : "px-1"
          )}>
            {collapsed ? (logoCollapsed ?? logo) : logo}
          </span>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => onMobileOpenChange(false)}
            aria-label="Close menu"
            className="shrink-0 rounded-md p-1 text-text-tertiary outline-none hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-accent md:hidden"
          >
            <X size={18} aria-hidden />
          </button>

          {/* Desktop collapse pin — floats at right edge of logo row */}
          <Tooltip content={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <button
              type="button"
              onClick={() => onCollapsedChange(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(
                "hidden md:flex",
                "absolute -right-3 top-1/2 z-10 -translate-y-1/2",
                "h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-text-tertiary shadow-sm",
                "outline-none transition-colors hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-accent"
              )}
            >
              {collapsed ? <ChevronRight size={12} aria-hidden /> : <ChevronLeft size={12} aria-hidden />}
            </button>
          </Tooltip>
        </div>

        {children}
      </aside>
    </SidebarContext.Provider>
  );
}

/* ── SidebarNav ───────────────────────────────────────────── */
export function SidebarNav({ children }: { children: React.ReactNode }) {
  return <nav className="flex-1 overflow-y-auto py-2">{children}</nav>;
}

/* ── SidebarSection ───────────────────────────────────────── */
export interface SidebarSectionProps {
  label?: string;
  /** Hide this section entirely */
  hidden?: boolean;
  children: React.ReactNode;
}

export function SidebarSection({ label, hidden, children }: SidebarSectionProps) {
  const { collapsed } = React.useContext(SidebarContext);

  if (hidden) return null;

  return (
    <div className="px-2 py-2">
      {label && !collapsed && (
        <p className="px-2.5 pb-1.5 text-xs font-medium uppercase tracking-wider text-text-tertiary">
          {label}
        </p>
      )}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

/* ── SidebarItem ──────────────────────────────────────────── */
export interface SidebarItemProps {
  icon: React.ReactNode;
  active?: boolean;
  count?: number;
  href?: string;
  onClick?: () => void;
  /** Tooltip shown when item is locked/disabled */
  locked?: string;
  /** Hide this item entirely */
  hidden?: boolean;
  /** Required permissions — checked against Sidebar's hasPermission */
  permissions?: string[];
  children: React.ReactNode;
}

export function SidebarItem({
  icon, active, count, href, onClick, locked, hidden, permissions, children,
}: SidebarItemProps) {
  const { collapsed, hasPermission } = React.useContext(SidebarContext);

  // Permission check
  if (permissions?.length && hasPermission && !hasPermission(permissions)) {
    return null;
  }

  if (hidden) return null;

  if (locked) {
    const row = (
      <span
        className={cn(
          "flex cursor-not-allowed items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm text-text-tertiary",
          collapsed && "justify-center"
        )}
      >
        <span className="shrink-0">{icon}</span>
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{children}</span>
            <Lock size={13} className="shrink-0" aria-hidden />
          </>
        )}
      </span>
    );
    return <Tooltip content={locked}>{row}</Tooltip>;
  }

  const content = (
    <Link
      href={href ?? "#"}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-accent",
        collapsed && "justify-center",
        active
          ? "bg-accent-light font-medium text-accent"
          : "text-text-secondary hover:bg-bg-hover"
      )}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{children}</span>
          {count !== undefined && (
            <Badge tone={active ? "pine" : "neutral"}>{count}</Badge>
          )}
        </>
      )}
    </Link>
  );

  return collapsed ? <Tooltip content={children}>{content}</Tooltip> : content;
}

/* ── SidebarGroup ─────────────────────────────────────────── */
export interface SidebarGroupProps {
  icon: React.ReactNode;
  label: string;
  defaultOpen?: boolean;
  /** When true, group auto-expands (e.g., when a child route is active) */
  hasActiveChild?: boolean;
  /** Hide this group entirely */
  hidden?: boolean;
  /** Required permissions — checked against Sidebar's hasPermission */
  permissions?: string[];
  children: React.ReactNode;
}

export function SidebarGroup({
  icon, label, defaultOpen, hasActiveChild, hidden, permissions, children,
}: SidebarGroupProps) {
  const { collapsed, requestExpand, hasPermission } = React.useContext(SidebarContext);

  // Permission check
  if (permissions?.length && hasPermission && !hasPermission(permissions)) {
    return null;
  }

  if (hidden) return null;

  // Derive open state: open if defaultOpen, hasActiveChild, or user toggled
  const [userToggled, setUserToggled] = React.useState<boolean | null>(null);

  const effectiveOpen = userToggled !== null ? userToggled : (defaultOpen || hasActiveChild || false);

  if (collapsed) {
    return (
      <Tooltip content={label}>
        <button
          type="button"
          onClick={requestExpand}
          className={cn(
            "flex w-full items-center justify-center rounded-md px-2.5 py-2.5 outline-none transition-colors hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-accent",
            hasActiveChild ? "text-accent" : "text-text-secondary"
          )}
        >
          {icon}
        </button>
      </Tooltip>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setUserToggled((prev) => prev === null ? !effectiveOpen : !prev)}
        aria-expanded={effectiveOpen}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-accent",
          hasActiveChild ? "bg-accent-light text-accent" : "text-text-secondary hover:bg-bg-hover"
        )}
      >
        <span className="shrink-0">{icon}</span>
        <span className={cn("flex-1 truncate text-left", hasActiveChild && "font-medium")}>{label}</span>
        <ChevronDown
          size={14}
          className={cn("shrink-0 transition-transform duration-200", effectiveOpen && "rotate-180")}
          aria-hidden
        />
      </button>
      {effectiveOpen && (
        <div className="ml-[13px] mt-0.5 flex flex-col gap-0.5 border-l border-border py-0.5 pl-3">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── SidebarSubItem ───────────────────────────────────────── */
export interface SidebarSubItemProps {
  /** Optional icon for the sub-item (smaller than parent items) */
  icon?: React.ReactNode;
  active?: boolean;
  count?: number;
  href?: string;
  onClick?: () => void;
  /** Tooltip shown when item is locked/disabled */
  locked?: string;
  /** Hide this item entirely */
  hidden?: boolean;
  /** Required permissions — checked against Sidebar's hasPermission */
  permissions?: string[];
  /** Label shown next to item (e.g., "soon" for upcoming features) */
  badge?: string;
  children: React.ReactNode;
}

export function SidebarSubItem({
  icon, active, count, href, onClick, locked, hidden, permissions, badge, children,
}: SidebarSubItemProps) {
  const { hasPermission } = React.useContext(SidebarContext);

  // Permission check
  if (permissions?.length && hasPermission && !hasPermission(permissions)) {
    return null;
  }

  if (hidden) return null;

  if (locked) {
    return (
      <Tooltip content={locked}>
        <span className="flex cursor-not-allowed items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-tertiary">
          {icon && <span className="shrink-0">{icon}</span>}
          <span className="flex-1 truncate">{children}</span>
          <Lock size={12} className="shrink-0" aria-hidden />
        </span>
      </Tooltip>
    );
  }

  const isDisabled = !href;

  return (
    <Link
      href={href ?? "#"}
      onClick={(e) => {
        if (isDisabled) e.preventDefault();
        onClick?.();
      }}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-accent",
        isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        active
          ? "bg-accent-light font-medium text-accent"
          : !isDisabled ? "text-text-secondary hover:bg-bg-hover" : "text-text-secondary"
      )}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute inset-y-1 -left-3 w-0.5 rounded-full bg-accent"
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {badge && (
        <span className="shrink-0 text-xs text-text-tertiary">({badge})</span>
      )}
      {count !== undefined && (
        <Badge tone={active ? "pine" : "neutral"}>{count}</Badge>
      )}
    </Link>
  );
}

/* ── SidebarFooter ────────────────────────────────────────── */
export function SidebarFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="shrink-0 border-t border-border p-2">
      {children}
    </div>
  );
}

/* ── SidebarAccount ───────────────────────────────────────── */
/** @deprecated User account info belongs in the Navbar. Kept for backward compat. */
export function SidebarAccount({
  name, email, avatarSrc,
}: { name: string; email?: string; avatarSrc?: string }) {
  const { collapsed } = React.useContext(SidebarContext);
  const row = (
    <div className={cn("flex items-center gap-2.5 rounded-md px-2 py-2", collapsed && "justify-center")}>
      <Avatar name={name} src={avatarSrc} size="sm" />
      {!collapsed && (
        <span className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text">{name}</p>
          {email && <p className="truncate text-xs text-text-tertiary">{email}</p>}
        </span>
      )}
    </div>
  );
  return collapsed
    ? <Tooltip content={email ? `${name} · ${email}` : name}>{row}</Tooltip>
    : row;
}

/* ── SidebarLogoutButton ──────────────────────────────────── */
export function SidebarLogoutButton({ onClick }: { onClick: () => void }) {
  const { collapsed } = React.useContext(SidebarContext);
  const btn = (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-text-secondary outline-none transition-colors",
        "hover:bg-error-light hover:text-error",
        "focus-visible:ring-2 focus-visible:ring-accent",
        collapsed && "justify-center"
      )}
    >
      <LogOut size={16} className="shrink-0" aria-hidden />
      {!collapsed && <span>Log out</span>}
    </button>
  );
  return collapsed ? <Tooltip content="Log out">{btn}</Tooltip> : btn;
}
