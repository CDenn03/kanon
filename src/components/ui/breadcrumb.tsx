import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;

  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRight size={14} aria-hidden="true" className="text-text-tertiary" />
            )}
            {isLast ? (
              <span aria-current="page" className="font-medium text-text">
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                className="text-text-secondary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              >
                {item.label}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}
