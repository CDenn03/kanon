"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CommandPalette, useCommandPalette, Kbd, type CommandItem } from "@/components/ui";

export interface HeroSearchItem {
  slug: string;
  name: string;
  category: string;
  href: string;
}

/**
 * HeroSearch — the home page's primary entry point. A prominent launcher
 * button (with a ⌘K hint) that opens the CommandPalette over the full
 * component list and navigates to the chosen component.
 */
export function HeroSearch({ items }: { items: HeroSearchItem[] }) {
  const router = useRouter();
  const { isOpen, openPalette, closePalette } = useCommandPalette();

  const commandItems: CommandItem[] = items.map((it) => ({
    id: it.href,
    title: it.name,
    subtitle: it.category,
    tag: "component",
    keywords: `${it.name} ${it.category}`,
  }));

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        className="mt-6 flex w-full max-w-md items-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 text-left text-sm text-text-tertiary shadow-sm transition-colors hover:border-border-hover hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Search size={16} className="shrink-0" aria-hidden />
        <span className="flex-1">Search components…</span>
        <Kbd keys={["⌘", "K"]} />
      </button>

      <CommandPalette
        open={isOpen}
        onClose={closePalette}
        items={commandItems}
        onSelect={(id) => router.push(id)}
        placeholder="Search components…"
        emptyHeading="All components"
      />
    </>
  );
}
