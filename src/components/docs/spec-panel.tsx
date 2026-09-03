import { Check, X, Ruler, Layers, Activity, Accessibility } from "lucide-react";
import type { ComponentSpec } from "@/lib/docs/types";

/**
 * SpecPanel — renders a component's reference spec (anatomy, states, tokens,
 * do/don't, accessibility). Purely presentational; server-rendered.
 */
export function SpecPanel({ spec }: { spec: ComponentSpec }) {
  return (
    <div className="space-y-6">
      {spec.purpose && (
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">{spec.purpose}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {spec.anatomy && spec.anatomy.length > 0 && (
          <SpecCard icon={<Layers size={15} />} title="Anatomy">
            <ul className="space-y-1.5">
              {spec.anatomy.map((a, i) => (
                <li key={i} className="flex gap-2 text-sm text-text-secondary">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-text-tertiary" aria-hidden />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </SpecCard>
        )}

        {spec.states && spec.states.length > 0 && (
          <SpecCard icon={<Activity size={15} />} title="States">
            <ul className="space-y-1.5">
              {spec.states.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-text-secondary">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-text-tertiary" aria-hidden />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </SpecCard>
        )}
      </div>

      {spec.tokens && spec.tokens.length > 0 && (
        <SpecCard icon={<Ruler size={15} />} title="Dimensions & tokens">
          <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {spec.tokens.map((t, i) => (
              <div key={i} className="flex items-baseline justify-between gap-3 border-b border-border pb-1.5">
                <span className="text-sm text-text-secondary">{t.label}</span>
                <span className="font-mono text-xs tabular-nums text-text">{t.value}</span>
              </div>
            ))}
          </div>
        </SpecCard>
      )}

      {spec.guidelines && (
        <div className="grid gap-4 sm:grid-cols-2">
          <SpecCard icon={<Check size={15} className="text-accent" />} title="Do">
            <ul className="space-y-1.5">
              {spec.guidelines.do.map((d, i) => (
                <li key={i} className="flex gap-2 text-sm text-text-secondary">
                  <Check size={14} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </SpecCard>
          <SpecCard icon={<X size={15} className="text-error" />} title="Don't">
            <ul className="space-y-1.5">
              {spec.guidelines.dont.map((d, i) => (
                <li key={i} className="flex gap-2 text-sm text-text-secondary">
                  <X size={14} className="mt-0.5 shrink-0 text-error" aria-hidden />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </SpecCard>
        </div>
      )}

      {spec.accessibility && spec.accessibility.length > 0 && (
        <SpecCard icon={<Accessibility size={15} />} title="Accessibility">
          <ul className="space-y-1.5">
            {spec.accessibility.map((a, i) => (
              <li key={i} className="flex gap-2 text-sm text-text-secondary">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-text-tertiary" aria-hidden />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </SpecCard>
      )}

      {spec.source && (
        <p className="text-xs text-text-tertiary">
          Spec sourced from <code className="font-mono">{spec.source}</code>
        </p>
      )}
    </div>
  );
}

function SpecCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
        <span className="text-text-secondary">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}
