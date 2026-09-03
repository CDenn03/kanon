"use client";

import * as React from "react";
import { ChevronsLeft, ChevronsRight, ChevronDown, Lock, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "./tooltip";
import { Badge } from "./badge";
import { Avatar } from "./avatar";

/* ═══════════════════════════════════════════════════════════════
   Sidebar

   Five things this version adds over the first pass, each because
   it was missing something a real app shell needs:

   1. Collapse toggle lives directly under the logo, not at the
      bottom. Two reasons: it's the first thing scanned on load, and
      — now that the footer holds account info and a logout button —
      keeping a structural "how much room does the nav take" control
      down there would mix it with session controls that answer a
      completely different question. Different category of action,
      different part of the sidebar.

   2. Mobile is a real overlay, not a smaller version of the docked
      column. Below `md`, the sidebar is `fixed`, slides in over the
      content with a backdrop, and is ALWAYS full width when open —
      the icon-only collapsed rail is a desktop density affordance;
      nobody who just tapped a hamburger wants a 64px sliver of icons.
      `collapsed` only affects width at `md` and above.

   3. Permission filtering is NOT a prop here. Which nav items a role
      can see varies per app and usually depends on more than one
      flag — baking a `permission` prop into a generic UI component
      would either be too narrow (one flag) or turn this into a
      partial auth system. Filter the nav array in the code that
      builds it, before it reaches SidebarSection. What IS supported
      here is the "visible but locked" pattern (SidebarItem's `locked`
      prop) for the cases where a product wants to advertise a
      feature exists rather than hide it outright.

   4. SidebarGroup for nested/expandable items. Collapsed-rail
      behavior: clicking a group's icon expands the whole sidebar
      rather than opening a flyout submenu. A flyout is the more
      "native" pattern but is real added complexity (another
      portalled, positioned popover) for a secondary path; expanding
      first keeps one mental model for "how do I reach a nested item."

   5. Logo is two slots, not a hardcoded mark — `logo` (full lockup)
      and `logoCollapsed` (icon-only, falls back to `logo` if
      omitted). Different products have very different logo
      proportions (square mark vs. wide wordmark); the header gives a
      fixed HEIGHT (56px) and lets width be whatever the logo needs.
   ─────────────────────────────────────────────────────────────── */

interface SidebarContextValue {
  collapsed: boolean;
  /** Called by a collapsed SidebarGroup when its icon is clicked —
   *  see point 4 above. */
  requestExpand: () => void;
}
const SidebarContext = React.createContext<SidebarContextValue>({
  collapsed: false,
  requestExpand: () => {},
});

export interface SidebarProps {
  logo: React.ReactNode;
  logoCollapsed?: React.ReactNode;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  /** Mobile overlay open/closed — separate from `collapsed`, which is
   *  a desktop-only concept. Toggle this from a hamburger button in
   *  your Navbar (see Navbar's `onMenuClick`). */
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  className?: string;
  children: React.ReactNode;
}

export function Sidebar({
  logo, logoCollapsed, collapsed, onCollapsedChange, mobileOpen, onMobileOpenChange, className, children,
}: SidebarProps) {
  // Close on Escape, and on navigating away — the latter isn't wired
  // here since this component doesn't know about routing; call
  // onMobileOpenChange(false) from your route-change handler.
  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onMobileOpenChange(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen, onMobileOpenChange]);

  return (
    <SidebarContext.Provider value={{ collapsed, requestExpand: () => onCollapsedChange(false) }}>
      {mobileOpen && (
        <div
          aria-hidden="true"
          onClick={() => onMobileOpenChange(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-(--border) bg-(--surface)",
          "transition-transform duration-200 md:static md:z-auto md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          // Mobile overlay is always full width — collapsed-to-icons
          // only applies at md+, see point 2 in the docblock above.
          "w-64",
          collapsed ? "md:w-16" : "md:w-64",
          className
        )}
      >
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-(--border) px-4">
          <span className="flex min-w-0 flex-1 items-center overflow-hidden">
            {collapsed ? (logoCollapsed ?? logo) : logo}
          </span>
          <button
            type="button" onClick={() => onMobileOpenChange(false)} aria-label="Close menu"
            className="shrink-0 rounded-(--r-btn) p-1 text-(--subtle) outline-none hover:bg-(--muted-bg) focus-visible:ring-2 focus-visible:ring-(--ring) md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Collapse toggle — under the logo, desktop only. An icon
            rail is a density choice for a docked sidebar; it isn't a
            thing a mobile overlay drawer does. */}
        <button
          type="button" onClick={() => onCollapsedChange(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden h-9 shrink-0 items-center justify-center gap-1.5 border-b border-(--border) text-(--subtle) outline-none transition-colors hover:bg-(--muted-bg) hover:text-(--muted) focus-visible:ring-2 focus-visible:ring-(--ring) md:flex"
        >
          {collapsed ? (
            <ChevronsRight size={15} />
          ) : (
            <>
              <ChevronsLeft size={15} />
              <span className="text-[length:var(--fs-xs)] font-medium">Collapse</span>
            </>
          )}
        </button>

        {children}
      </aside>
    </SidebarContext.Provider>
  );
}

export function SidebarNav({ children }: { children: React.ReactNode }) {
  return <nav className="flex-1 overflow-y-auto py-2">{children}</nav>;
}

export function SidebarSection({ label, children }: { label?: string; children: React.ReactNode }) {
  const { collapsed } = React.useContext(SidebarContext);
  return (
    <div className="px-2 py-2">
      {label && !collapsed && (
        <p className="px-2.5 pb-1.5 text-[length:var(--fs-xs)] font-medium uppercase tracking-wider text-(--subtle)">{label}</p>
      )}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

export interface SidebarItemProps {
  icon: React.ReactNode;
  active?: boolean;
  count?: number;
  href?: string;
  onClick?: () => void;
  /** Renders the item visibly but unclickable, with a lock icon and
   *  this reason in a tooltip. Omit the prop to hide the item
   *  entirely instead — the usual choice for an internal tool with
   *  no upsell motive. See point 3 in the module docblock. */
  locked?: string;
  children: React.ReactNode;
}

/** Row height and type size here are deliberately a notch more
 *  generous than a maximally-dense admin sidebar (py-2.5 not py-2,
 *  16px icons not 15px) — this is scanned dozens of times a day, and
 *  a small amount of breathing room per row meaningfully cuts
 *  misclicks and visual fatigue over a full day. Still short of a
 *  consumer-app's spacious sidebar, on purpose: an admin tool also
 *  benefits from fitting a full nav without scrolling. */
export function SidebarItem({ icon, active, count, href, onClick, locked, children }: SidebarItemProps) {
  const { collapsed } = React.useContext(SidebarContext);

  if (locked) {
    const row = (
      <span
        className={cn(
          "flex cursor-not-allowed items-center gap-2.5 rounded-(--r-btn) px-2.5 py-2.5 text-[length:var(--fs-md)] text-(--subtle)",
          collapsed && "justify-center"
        )}
      >
        <span className="shrink-0">{icon}</span>
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{children}</span>
            <Lock size={13} className="shrink-0" />
          </>
        )}
      </span>
    );
    return <Tooltip content={locked}>{row}</Tooltip>;
  }

  const content = (
    <a
      href={href} onClick={onClick} aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-2.5 rounded-(--r-btn) px-2.5 py-2.5 text-[length:var(--fs-md)] outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-(--ring)",
        collapsed && "justify-center",
        active ? "bg-(--primary-soft) font-medium text-(--primary)" : "text-(--muted) hover:bg-(--muted-bg) hover:text-(--text)"
      )}
    >
      {active && !collapsed && <span aria-hidden="true" className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-(--primary)" />}
      <span className="shrink-0">{icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{children}</span>
          {count !== undefined && <Badge tone={active ? "pine" : "neutral"}>{count}</Badge>}
        </>
      )}
    </a>
  );

  return collapsed ? <Tooltip content={children}>{content}</Tooltip> : content;
}

export interface SidebarGroupProps {
  icon: React.ReactNode;
  label: string;
  defaultOpen?: boolean;
  /** True when a descendant item is the active route — auto-opens
   *  the group so navigating deep-links here doesn't leave the
   *  active item hidden inside a collapsed group. */
  hasActiveChild?: boolean;
  children: React.ReactNode;
}

export function SidebarGroup({ icon, label, defaultOpen, hasActiveChild, children }: SidebarGroupProps) {
  const { collapsed, requestExpand } = React.useContext(SidebarContext);
  const [open, setOpen] = React.useState(Boolean(defaultOpen || hasActiveChild));

  React.useEffect(() => { if (hasActiveChild) setOpen(true); }, [hasActiveChild]);

  if (collapsed) {
    return (
      <Tooltip content={label}>
        <button
          type="button" onClick={requestExpand}
          className="flex w-full items-center justify-center rounded-(--r-btn) px-2.5 py-2.5 text-(--muted) outline-none hover:bg-(--muted-bg) hover:text-(--text) focus-visible:ring-2 focus-visible:ring-(--ring)"
        >
          {icon}
        </button>
      </Tooltip>
    );
  }

  return (
    <div>
      <button
        type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-(--r-btn) px-2.5 py-2.5 text-[length:var(--fs-md)] text-(--muted) outline-none transition-colors hover:bg-(--muted-bg) hover:text-(--text) focus-visible:ring-2 focus-visible:ring-(--ring)"
      >
        <span className="shrink-0">{icon}</span>
        <span className="flex-1 truncate text-left">{label}</span>
        <ChevronDown size={14} className={cn("shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="ml-[13px] mt-0.5 flex flex-col gap-1 border-l border-(--border) py-0.5 pl-3">
          {children}
        </div>
      )}
    </div>
  );
}

export function SidebarFooter({ children }: { children: React.ReactNode }) {
  return <div className="shrink-0 border-t border-(--border) p-2">{children}</div>;
}

export function SidebarAccount({
  name, email, avatarSrc,
}: { name: string; email?: string; avatarSrc?: string }) {
  const { collapsed } = React.useContext(SidebarContext);
  const row = (
    <div className={cn("flex items-center gap-2.5 rounded-(--r-btn) px-2 py-2", collapsed && "justify-center")}>
      <Avatar name={name} src={avatarSrc} size="sm" />
      {!collapsed && (
        <span className="min-w-0 flex-1">
          <p className="truncate text-[length:var(--fs-sm)] font-medium text-(--text)">{name}</p>
          {email && <p className="truncate text-[length:var(--fs-xs)] text-(--subtle)">{email}</p>}
        </span>
      )}
    </div>
  );
  return collapsed ? <Tooltip content={email ? `${name} · ${email}` : name}>{row}</Tooltip> : row;
}

/**
 * A dedicated, always-visible action — not folded into an account
 * dropdown. Muted at rest, not danger-toned: signing out is a routine,
 * frequent action, not a mistake to be warned away from the way
 * suspending an account is, so it shouldn't visually shout at every
 * glance. The rose tint only appears on hover/focus, as a hint of
 * finality right when it's about to matter.
 */
export function SidebarLogoutButton({ onClick }: { onClick: () => void }) {
  const { collapsed } = React.useContext(SidebarContext);
  const btn = (
    <button
      type="button" onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-(--r-btn) px-2 py-2 text-[length:var(--fs-md)] text-(--muted) outline-none transition-colors",
        "hover:bg-(--danger-soft) hover:text-(--danger) focus-visible:ring-2 focus-visible:ring-(--ring)",
        collapsed && "justify-center"
      )}
    >
      <LogOut size={16} className="shrink-0" />
      {!collapsed && <span>Log out</span>}
    </button>
  );
  return collapsed ? <Tooltip content="Log out">{btn}</Tooltip> : btn;
}
