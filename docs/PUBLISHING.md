# Publishing Kanon as an npm package

The kit can be consumed **two ways**: copy-in (see `USING_KANON.md`) or as
a built npm package described here.

## Build

```bash
pnpm build:pkg
```

Runs `tsup` (config in `tsup.config.ts`) and emits to `dist/`:

- One ESM `.js` per component/hook/util plus a barrel `index.js`.
- `.d.mts` type declarations alongside.
- `"use client"` directives are **preserved** per-file (via
  `esbuild-plugin-preserve-directives`), so the package works in React Server
  Component environments (Next.js App Router).
- `react`, `react-dom`, and `lucide-react` are **externalized** (peer deps),
  not bundled.

## Package metadata

`package.json` already declares:

- `exports`:
  - `.` → `dist/index.js` (types: `dist/index.d.mts`)
  - `./styles.css` → the semantic token layer (`src/app/globals.css`)
- `files`: `["dist", "src/app/globals.css"]`
- `peerDependencies`: react ≥19, react-dom ≥19, lucide-react ≥0.5
- `sideEffects`: only CSS (so JS tree-shakes cleanly)

## Consuming

```tsx
import { Button, Dialog, DataTable } from "kanon";
import "kanon/styles.css"; // brings the @theme token layer + dark mode
```

Consumers still need Tailwind v4 configured; the imported `styles.css` supplies
the `@theme` tokens and `[data-theme="dark"]` overrides every component relies on.

## To publish

1. Remove `"private": true` from `package.json` (kept for now to prevent
   accidental publishes).
2. Set a real `version` and (if scoped) a `name`.
3. `pnpm build:pkg`
4. `npm publish` (or `pnpm publish`).

`prepublishOnly` is not wired to avoid surprises; run `build:pkg` yourself
before publishing, or add it when you're ready to ship.
