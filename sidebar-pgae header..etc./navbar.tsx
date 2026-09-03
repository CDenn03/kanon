"use client";

import * as React from "react";
import { Menu as MenuIcon, Search, Bell, ChevronDown, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator, MenuLabel } from "./menu";

/**
 * The top utility bar — breadcrumb/context on the left, global actions
 * on the right. Distinct from Sidebar: Sidebar is primary navigation
 * (where am I in the app), Navbar is page-level context and utility
 * actions (search, notifications, account) — the two shouldn't be
 * merged into one "nav" component just because they're both chrome.
 */
export interface NavbarProps {
  /** Usually a <Breadcrumb> or a page title — whatever anchors "where
   *  am I" for the current page. */
  left?: React.ReactNode;
  /** Renders a hamburger button, visible only below `md`, that calls
   *  this — wire it to your Sidebar's onMobileOpenChange(true). Omit
   *  entirely on a layout that has no Sidebar. */
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
    <div className={cn("flex h-14 shrink-0 items-center justify-between gap-4 border-b border-(--border) bg-(--surface) px-4", className)}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {onMenuClick && (
          <IconButton label="Open menu" onClick={onMenuClick} className="md:hidden">
            <MenuIcon size={18} />
          </IconButton>
        )}
        <div className="min-w-0">{left}</div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {onSearchClick && (
          <IconButton label="Search" onClick={onSearchClick}><Search size={17} /></IconButton>
        )}

        {onNotificationsClick && (
          <IconButton label="Notifications" onClick={onNotificationsClick}>
            <span className="relative">
              <Bell size={17} />
              {Boolean(notificationCount) && (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-(--danger) text-[9px] font-semibold text-white"
                >
                  {notificationCount! > 9 ? "9+" : notificationCount}
                </span>
              )}
            </span>
          </IconButton>
        )}

        {account && (
          <Menu open={accountOpen} onOpenChange={setAccountOpen}>
            <MenuTrigger>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-(--r-btn) py-1 pl-1 pr-2 outline-none hover:bg-(--muted-bg) focus-visible:ring-2 focus-visible:ring-(--ring)"
              >
                <Avatar name={account.name} src={account.avatarSrc} size="sm" />
                <ChevronDown size={14} className={cn("text-(--subtle) transition-transform", accountOpen && "rotate-180")} />
              </button>
            </MenuTrigger>
            <MenuContent align="end" minWidth={200}>
              <MenuLabel>{account.email ?? account.name}</MenuLabel>
              {onAccountSettings && (
                <MenuItem icon={<Settings size={15} />} onSelect={onAccountSettings}>Account settings</MenuItem>
              )}
              {(onAccountSettings || onSignOut) && <MenuSeparator />}
              {onSignOut && (
                <MenuItem icon={<LogOut size={15} />} destructive onSelect={onSignOut}>Sign out</MenuItem>
              )}
            </MenuContent>
          </Menu>
        )}
      </div>
    </div>
  );
}

function IconButton({
  label, onClick, children, className,
}: { label: string; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button" onClick={onClick} aria-label={label}
      className={cn(
        "flex size-8 items-center justify-center rounded-(--r-btn) text-(--muted) outline-none hover:bg-(--muted-bg) hover:text-(--text) focus-visible:ring-2 focus-visible:ring-(--ring)",
        className
      )}
    >
      {children}
    </button>
  );
}
