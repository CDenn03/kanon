import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ExampleTabs } from "@/components/docs/example-tabs";
import { CodeBlock } from "@/components/docs/code-block";
import { SpecPanel } from "@/components/docs/spec-panel";
import { getEntry, registry } from "@/lib/docs/registry";
import { loadSource, highlight } from "@/lib/docs/highlight";
import type { ComponentEntry } from "@/lib/docs/types";

export function generateStaticParams() {
  return registry.map((e) => ({ slug: e.slug }));
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  // Highlight each example snippet (server-side).
  const examples = await Promise.all(
    entry.examples.map(async (ex) => ({
      ...ex,
      html: await highlight(ex.code, "tsx"),
    }))
  );

  // Load + highlight the full component source from disk.
  const rawSource = await loadSource(entry.sourcePath);
  const sourceHtml = await highlight(rawSource, "tsx");
  const filename = entry.sourcePath.split("/").pop() ?? "source.tsx";

  // Resolve related components (transitively) for the dependencies section.
  const related = (entry.dependsOn ?? [])
    .map((slug) => getEntry(slug))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  // Build a recommended folder tree from this component + its deps.
  const folderTree = buildFolderTree(entry, related);

  return (
    <div className="mx-auto max-w-350 px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-text">{entry.name}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
          {entry.description}
        </p>
        <p className="mt-3 font-mono text-xs text-text-tertiary">
          import {"{ "}
          {entry.exports.join(", ")}
          {" }"} from &quot;@/components/ui&quot;
        </p>
      </header>

      {/* Specification */}
      {entry.spec && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-text">Specification</h2>
          <SpecPanel spec={entry.spec} />
        </section>
      )}

      {/* Examples */}
      <section className="space-y-6">
        {examples.map((ex, i) => (
          <div key={i}>
            <h2 className="mb-1 text-sm font-semibold text-text">{ex.title}</h2>
            {ex.description && (
              <p className="mb-3 text-sm text-text-secondary">{ex.description}</p>
            )}
            <ExampleTabs
              preview={ex.node}
              codeHtml={ex.html}
              codeRaw={ex.code}
              filename={`${entry.slug}-example.tsx`}
              align={ex.center ? "center" : "start"}
            />
          </div>
        ))}
      </section>

      {/* Full source */}
      <section className="mt-10">
        <h2 className="mb-1 text-sm font-semibold text-text">Full source</h2>
        <p className="mb-3 text-sm text-text-secondary">
          The complete component, read from{" "}
          <code className="font-mono text-xs text-text">{entry.sourcePath}</code>.
        </p>
        <CodeBlock html={sourceHtml} raw={rawSource} filename={filename} />
      </section>

      {/* Dependencies */}
      {(related.length > 0 || (entry.requires?.length ?? 0) > 0) && (
        <section className="mt-10">
          <h2 className="mb-1 text-sm font-semibold text-text">Dependencies</h2>
          <p className="mb-4 text-sm text-text-secondary">
            To use <span className="font-medium text-text">{entry.name}</span> you also need the
            following. Copy these into your project alongside it.
          </p>

          {related.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">
                Related components
              </h3>
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/components/${r.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text transition-colors hover:border-border-hover hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                    {r.name}
                    <ArrowRight size={13} className="text-text-tertiary" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">
              Recommended folder structure
            </h3>
            <div className="code-block overflow-hidden rounded-lg border border-border">
              <div className="border-b border-white/10 bg-surface-dark px-3 py-1.5">
                <span className="font-mono text-[11px] text-on-dark/70">project structure</span>
              </div>
              <pre className="overflow-x-auto bg-surface-dark px-4 py-3 font-mono text-[12.5px] leading-relaxed text-on-dark">
{folderTree}
              </pre>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Build a `src/`-rooted folder tree listing every file needed to use this
 * component: its own source, its non-component requires, and (one level of)
 * dependency component sources plus their requires. Deduped and sorted.
 */
function buildFolderTree(entry: ComponentEntry, related: ComponentEntry[]): string {
  const paths = new Set<string>();
  const collect = (e: ComponentEntry) => {
    paths.add(e.sourcePath);
    (e.requires ?? []).forEach((p) => paths.add(p));
  };
  collect(entry);
  related.forEach(collect);

  // Group by directory.
  const byDir = new Map<string, string[]>();
  for (const p of paths) {
    const dir = p.slice(0, p.lastIndexOf("/"));
    const file = p.slice(p.lastIndexOf("/") + 1);
    const list = byDir.get(dir) ?? [];
    list.push(file);
    byDir.set(dir, list);
  }

  const dirs = [...byDir.keys()].sort();
  const lines: string[] = [];
  for (const dir of dirs) {
    lines.push(`${dir}/`);
    const files = byDir.get(dir)!.sort();
    files.forEach((f, i) => {
      const branch = i === files.length - 1 ? "└─" : "├─";
      lines.push(`  ${branch} ${f}`);
    });
  }
  return lines.join("\n");
}
