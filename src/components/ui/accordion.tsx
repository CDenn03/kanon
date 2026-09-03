"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];

  multiple?: boolean;

  defaultOpen?: string[];
}

export function Accordion({ items, multiple = false, defaultOpen = [] }: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
      {items.map((item) => {
        const isOpen = open.has(item.id);
        const regionId = `accordion-${item.id}`;
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={regionId}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-text transition-colors hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
            >
              <span className="min-w-0">{item.title}</span>
              <ChevronDown
                size={16}
                className={cn("shrink-0 text-text-tertiary transition-transform duration-200", isOpen && "rotate-180")}
                aria-hidden
              />
            </button>
            {isOpen && (
              <div id={regionId} role="region" className="px-4 pb-4 text-sm leading-relaxed text-text-secondary">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
