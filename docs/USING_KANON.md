# Using Kanon in another project

Kanon is distributed **copy-in** (shadcn-style): you copy the component
source into your project and own it. There is no runtime package to install —
components are plain React + Tailwind v4 files that depend only on
`lucide-react`, `clsx`, `tailwind-merge` and (a few) `class-variance-authority`.

## 1. Prerequisites in the target project

- React 19, Tailwind CSS v4
- Install peers: `pnpm add lucide-react clsx tailwind-merge class-variance-authority`
- Copy the semantic token layer: bring the `@theme` block and the
  `[data-theme="dark"]` overrides from `src/app/globals.css` into your global CSS.
  Every component references these tokens (`bg-accent`, `text-text-secondary`, …).

## 2. The registry

`pnpm generate:registry` (also runs automatically on `prebuild`) emits a
copy-in registry to `public/registry/`:

- `registry.json` — index of all components (slug, name, category, deps, file count)
- `<slug>.json` — one per component, containing **every file you need**:
  the component source, its non-component `requires` (hooks/utils), and the
  source of any components it `dependsOn` — each with full file `content`.

Because the file contents are read from disk at generation time, the registry
always matches the current source.

## 3. Adding a component

Pick a component (e.g. `confirm-dialog`) and copy its files into the matching
paths in your project:

```bash
# Example: inspect what a component needs
cat public/registry/confirm-dialog.json | jq '.files[].path'
# → src/components/ui/confirm-dialog.tsx
#   src/components/ui/field.tsx
#   src/lib/utils.ts
#   src/components/ui/button.tsx
#   src/hooks/use-popover-position.ts
#   src/hooks/use-mounted.ts
#   src/components/ui/hold-to-confirm.tsx
```

Write each `files[i].content` to `files[i].path`. That's the whole install —
the component and its dependency graph land in one step.

## 4. Importing

Within this repo, everything is re-exported from the barrel:

```tsx
import { Button, Dialog, DataTable, useCommandPalette } from "@/components/ui";
```

In a consuming project, import from wherever you copied the files (typically
the same `@/components/ui` path).

## 5. Dark mode

The token layer already supports dark mode. Toggle it by setting
`document.documentElement.setAttribute("data-theme", "dark")` (see
`src/components/docs/theme-toggle.tsx` for a ready-made toggle + no-flash
init script pattern in `src/app/layout.tsx`).
