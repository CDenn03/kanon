"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem {

  id: string;

  label: string;

  level?: 2 | 3;
}

interface TableOfContentsProps {
  items: TocItem[];

  title?: string;
  className?: string;
}

export function TableOfContents({ items, title = "On this page", className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    const els = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => Boolean(el));
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const onClick = (e: React.MouseEvent, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
    history.replaceState(null, "", `#${id}`);
  };

  if (items.length === 0) return null;

  return (
    <nav aria-label={title} className={cn("text-sm", className)}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">{title}</p>
      <ul className="space-y-0.5 border-l border-border">
        {items.map((it) => {
          const active = it.id === activeId;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={(e) => onClick(e, it.id)}
                className={cn(
                  "-ml-px block border-l py-1 transition-colors",
                  it.level === 3 ? "pl-6" : "pl-3",
                  active
                    ? "border-accent font-medium text-accent"
                    : "border-transparent text-text-secondary hover:border-border-hover hover:text-text"
                )}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
