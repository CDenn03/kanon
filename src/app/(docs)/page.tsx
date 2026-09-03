import Link from "next/link";
import { getCategories, registry, buildNav } from "@/lib/docs/registry";
import { HeroSearch, type HeroSearchItem } from "@/components/docs/hero-search";

export default function OverviewPage() {
  const categories = getCategories();

  const searchItems: HeroSearchItem[] = buildNav().flatMap((g) =>
    g.items.map((it) => ({
      slug: it.slug,
      name: it.name,
      category: g.category,
      href: it.href ?? `/components/${it.slug}`,
    }))
  );

  return (
    <div className="mx-auto max-w-350 px-8 py-6">
      {/* Hero — one clear primary element to land on */}
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-text">Kanon</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
          A personal component library. Browse a component to see live examples, copy the usage
          snippet, and read the full source.
        </p>
        <HeroSearch items={searchItems} />
        <div className="mt-4 flex items-center gap-6">
          <span className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold tabular-nums text-text">{registry.length}</span>
            <span className="text-sm text-text-tertiary">components</span>
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold tabular-nums text-text">{categories.length}</span>
            <span className="text-sm text-text-tertiary">categories</span>
          </span>
        </div>
      </header>

      {categories.map(({ category, entries }) => (
        <section key={category} className="mb-8">
          <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            {category}
          </h2>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((e) => (
              <Link
                key={e.slug}
                href={`/components/${e.slug}`}
                className="group flex flex-col rounded-lg border border-border bg-surface p-3.5 transition-shadow hover:border-border-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="flex size-6 shrink-0 items-center justify-center rounded-md bg-bg-secondary text-[11px] font-semibold text-text-secondary transition-colors group-hover:bg-accent-light group-hover:text-accent"
                  >
                    {e.name.charAt(0)}
                  </span>
                  <span className="text-sm font-semibold text-text">{e.name}</span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                  {e.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
