"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { KanonLogo } from "@/components/ui/kanon-logo";
import {
  Sidebar,
  SidebarNav,
  SidebarSection,
  SidebarItem,
  Navbar,
  Breadcrumb,
} from "@/components/ui";
import type { BreadcrumbItem } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ComponentSearch, type SearchItem } from "./component-search";
import { ThemeToggle } from "./theme-toggle";

export interface NavGroup {
  category: string;
  items: { slug: string; name: string; href?: string }[];
}

/**
 * LibraryShell — the persistent chrome (Sidebar + Navbar) for the docs
 * site. Navigation is derived from the registry and passed in as plain
 * data so this stays a client component without importing server code.
 */
export function LibraryShell({
  nav,
  children,
}: {
  nav: NavGroup[];
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const searchItems: SearchItem[] = nav.flatMap((group) =>
    group.items.map((it) => ({
      slug: it.slug,
      name: it.name,
      category: group.category,
      href: it.href ?? `/components/${it.slug}`,
    }))
  );

  // Derive breadcrumbs from the current path + nav data.
  const crumbs: BreadcrumbItem[] = (() => {
    if (pathname === "/") return [{ label: "Components" }];
    const match = searchItems.find((s) => s.href === pathname);
    if (match) return [{ label: "Components", href: "/" }, { label: match.name }];
    return [{ label: "Components", href: "/" }];
  })();

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar
        logo={
          <Link href="/" className="flex items-center gap-2">
            <KanonLogo size={20} className="text-accent" />
            <span className="text-sm font-semibold text-text">Kanon</span>
          </Link>
        }
        logoCollapsed={<KanonLogo size={20} className="text-accent" />}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      >
        <SidebarNav>
          <SidebarSection>
            <SidebarItem icon={<LayoutGrid size={18} />} href="/" active={pathname === "/"}>
              Overview
            </SidebarItem>
          </SidebarSection>
          {nav.map((group) => (
            <SidebarSection key={group.category} label={group.category}>
              {group.items.map((it) => {
                const href = it.href ?? `/components/${it.slug}`;
                const active = pathname === href;
                return (
                  <SidebarItem
                    key={it.slug}
                    icon={
                      collapsed ? (
                        <span
                          aria-hidden
                          className={cn(
                            "flex size-5 items-center justify-center rounded text-[11px] font-semibold transition-colors",
                            active ? "text-accent" : "text-text-tertiary"
                          )}
                        >
                          {it.name.charAt(0)}
                        </span>
                      ) : (
                        <span
                          aria-hidden
                          className={cn(
                            "block size-1.5 rounded-full transition-colors",
                            active ? "bg-accent" : "bg-text-tertiary/50"
                          )}
                        />
                      )
                    }
                    href={href}
                    active={active}
                  >
                    {it.name}
                  </SidebarItem>
                );
              })}
            </SidebarSection>
          ))}
        </SidebarNav>
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          left={
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="hidden min-w-0 xl:block">
                <Breadcrumb items={crumbs} />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <ComponentSearch items={searchItems} />
                <ThemeToggle />
              </div>
            </div>
          }
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
