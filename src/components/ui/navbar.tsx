"use client";

import * as React from "react";
import { Menu as MenuIcon, Search, Bell, ChevronDown, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator, MenuLabel } from "./menu";

/**
 * Navbar — the top utility bar.
 *
 * Distinct from Sidebar: Sidebar is primary navigation ("where am I in the
 * app"), Navbar is page-level context and utility actions (search,
 * notifications, account). The two shouldn't be merged into one "nav"
 * component just because they're both chrome.
 *
 * Composition:
 *   <Navbar
 *     left={<Breadcrumb items={…} />}
 *     onMenuClick={() => setSidebarOpen(true)}   ← wire to Sidebar mobileOpen
 *     notificationCount={3}
 *     onNotificationsClick={…}
 *     account={{ name: "Amina Wanjiru", email: "amina@…" }}
 *     onAccountSettings={…}
 *     onSignOut={…}
 *   />
 */
export interface NavbarProps {
  /**
   * Left slot — usually a <Breadcrumb> or page title that anchors
   * "where am I" for the current page.
   */
  left?: React.ReactNode;
  /**
   * Renders a hamburger button, visible only below `md`, that calls this —
   * wire it to your Sidebar's onMobileOpenChange(true). Omit entirely on
   * a layout that has no Sidebar.
   */
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  notificationCount?: number;
  onNotificationsClick?: () => void;
  account?: { name: string; email?: string; avatarSrc?: string };
  onAccountSettings?: () => void;
  onSignOut?: () => void;
  className?: string;
}

export function Navbar({
  left, onMenuClick, onSearchClick, notificationCount, onNotificationsClick,
  account, onAccountSettings, onSignOut, className,
}: NavbarProps) {
  const [accountOpen, setAccountOpen] = React.useState(false);

  return (
    <div
      className={cn(
        "flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-4",
        className
      )}
    >
      {/* Left slot */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {onMenuClick && (
          <NavIconButton label="Open menu" onClick={onMenuClick} className="md:hidden">
            <MenuIcon size={18} />
          </NavIconButton>
        )}
        <div className="min-w-0">{left}</div>
      </div>

      {/* Right slot */}
      <div className="flex shrink-0 items-center gap-1">
        {onSearchClick && (
          <NavIconButton label="Search" onClick={onSearchClick}>
            <Search size={17} />
          </NavIconButton>
        )}

        {onNotificationsClick && (
          <NavIconButton label="Notifications" onClick={onNotificationsClick}>
            <span className="relative">
              <Bell size={17} />
              {Boolean(notificationCount) && (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-error text-[9px] font-semibold text-on-error"
                >
                  {notificationCount! > 9 ? "9+" : notificationCount}
                </span>
              )}
            </span>
          </NavIconButton>
        )}

        {account && (
          <Menu open={accountOpen} onOpenChange={setAccountOpen}>
            <MenuTrigger>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-md py-1 pl-1 pr-2 outline-none hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Avatar name={account.name} src={account.avatarSrc} size="sm" />
                <ChevronDown
                  size={14}
                  className={cn("text-text-tertiary transition-transform", accountOpen && "rotate-180")}
                />
              </button>
            </MenuTrigger>
            <MenuContent align="end" minWidth={200}>
              <MenuLabel>{account.email ?? account.name}</MenuLabel>
              {onAccountSettings && (
                <MenuItem icon={<Settings size={15} />} onSelect={onAccountSettings}>
                  Account settings
                </MenuItem>
              )}
              {(onAccountSettings || onSignOut) && <MenuSeparator />}
              {onSignOut && (
                <MenuItem icon={<LogOut size={15} />} destructive onSelect={onSignOut}>
                  Sign out
                </MenuItem>
              )}
            </MenuContent>
          </Menu>
        )}
      </div>
    </div>
  );
}

/* ── Internal icon button ─────────────────────────────────── */
function NavIconButton({
  label, onClick, children, className,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex size-8 items-center justify-center rounded-md text-text-secondary outline-none",
        "transition-colors hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-accent",
        className
      )}
    >
      {children}
    </button>
  );
}
