"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { KanonLogo } from "@/components/ui/kanon-logo";

/**
 * 404 Page — "Page Not Found"
 *
 * Plays on the modular geometric concept from the Kanon logo with a 3D
 * scattered blocks effect. The "4" digits are built from the same rounded
 * module shapes, while the "0" uses a stacked ring. Includes some light
 * puns to soften the error experience.
 */
export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-12">
      {/* Floating background modules (3D depth effect) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {/* Far layer - subtle, small shapes */}
        <div
          className="absolute left-[8%] top-[15%] size-8 rounded-lg bg-accent/5"
          style={{ transform: "rotate(-12deg) translateZ(-100px)" }}
        />
        <div
          className="absolute right-[12%] top-[22%] h-12 w-6 rounded-lg bg-accent/5"
          style={{ transform: "rotate(8deg)" }}
        />
        <div
          className="absolute bottom-[25%] left-[15%] h-10 w-16 rounded-xl bg-accent/5"
          style={{ transform: "rotate(-5deg)" }}
        />
        <div
          className="absolute bottom-[18%] right-[10%] size-6 rounded-md bg-accent/5"
          style={{ transform: "rotate(15deg)" }}
        />

        {/* Mid layer - more visible */}
        <div
          className="absolute left-[20%] top-[35%] h-6 w-10 rounded-lg bg-accent/10"
          style={{ transform: "rotate(-8deg)" }}
        />
        <div
          className="absolute right-[22%] top-[40%] h-14 w-8 rounded-xl bg-accent/8"
          style={{ transform: "rotate(12deg)" }}
        />
        <div
          className="absolute bottom-[35%] left-[5%] size-10 rounded-xl bg-accent/8"
          style={{ transform: "rotate(-18deg)" }}
        />
        <div
          className="absolute bottom-[40%] right-[8%] h-8 w-14 rounded-lg bg-accent/10"
          style={{ transform: "rotate(6deg)" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* 3D-styled 404 number */}
        <div className="relative mb-8 select-none" aria-hidden>
          {/* Shadow/depth layer */}
          <div
            className="absolute inset-0 text-[clamp(8rem,25vw,14rem)] font-black tracking-tighter text-accent/10"
            style={{ transform: "translate(8px, 8px)" }}
          >
            404
          </div>
          {/* Mid layer */}
          <div
            className="absolute inset-0 text-[clamp(8rem,25vw,14rem)] font-black tracking-tighter text-accent/20"
            style={{ transform: "translate(4px, 4px)" }}
          >
            404
          </div>
          {/* Main text */}
          <h1 className="text-[clamp(8rem,25vw,14rem)] font-black tracking-tighter text-accent">
            404
          </h1>
        </div>

        {/* For screen readers */}
        <span className="sr-only">Error 404: Page not found</span>

        {/* Modular divider inspired by logo shapes */}
        <div className="mb-6 flex items-center gap-2" aria-hidden>
          <div className="h-3 w-8 rounded-md bg-accent" />
          <div className="h-3 w-3 rounded-md bg-accent/60" />
          <div className="h-5 w-10 rounded-lg bg-accent/40" />
          <div className="h-3 w-3 rounded-md bg-accent/60" />
          <div className="h-3 w-8 rounded-md bg-accent" />
        </div>

        {/* Humorous copy */}
        <h2 className="mb-2 text-xl font-semibold text-text">
          Well, this is <span className="text-accent">awkward</span>.
        </h2>
        <p className="mb-1 max-w-md text-text-secondary">
          The page you're looking for has gone off the grid.
          <br />
          Maybe it's taking a component break? 🧩
        </p>
        <p className="mb-8 text-sm text-text-tertiary italic">
          404 reasons why this page couldn't be found... and none of them are good.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-on-accent shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <KanonLogo size={16} className="text-on-accent" />
            Back to Safety
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text transition-colors hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            ← Go Back
          </button>
        </div>

        {/* Footer pun */}
        <p className="mt-12 text-xs text-text-tertiary">
          Pro tip: The page you want probably exists — just not at this URL.
        </p>
      </div>
    </div>
  );
}
