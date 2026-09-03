# Component Validation Checklist

Every new or changed component in `src/components/ui` must be validated against
this checklist before it's considered done. The rules are derived from the
Mathesis design guidelines (`mathesis/agents/styling.md`, its `@theme` tokens,
and the UI_COMPONENT asset specs) and adapted to the Steward pine-green brand.

Run through every item. If something legitimately deviates, note *why* in the
component's file header comment.

## 1. Tokens & color

- [ ] Uses semantic token utilities only — `bg-*`, `text-*`, `border-*`,
      `bg-accent`, `bg-accent-light`, `text-text-secondary`, etc.
- [ ] No raw hex or `rgb()` in JSX/`className`/inline `style`
      (dynamic-only exceptions: canvas, SVG `stroke`, computed widths — use
      `var(--color-*)` there, never literals).
- [ ] Status meaning is conveyed by **icon + color**, never color alone.
- [ ] No decorative gradients. (Functional fills, e.g. a slider track, are OK.)
- [ ] No rainbow / multi-hue schemes. Stay within brand + status tones.

## 2. Shape & spacing

- [ ] Corner radius is 8–12px: `rounded-lg` (8) or `rounded-xl` (12).
      `rounded-md` (6) only for small controls; `rounded-full` only for genuinely
      circular elements (dots, avatars, pills, tracks).
- [ ] No left-border callout cards (overused anti-pattern). Use full border + icon.
- [ ] Spacing uses 4px multiples (`gap-2`, `p-3`, `px-4`, `py-2.5`, …).
- [ ] Control height is 40px (`h-10`) for text inputs/select/trigger controls;
      buttons follow the Button size scale.

## 3. Typography

- [ ] Titles/headings: `font-semibold` (600).
- [ ] Labels: `font-medium` (500); field labels `text-[13px]`.
- [ ] Body/controls: `text-sm` (0.875rem), weight 400.
- [ ] Uppercase section/table labels: `text-xs font-medium uppercase tracking-wider`.
- [ ] No `font-bold` (700) except where a page-title weight is truly intended.
- [ ] Monospace (`font-mono` / `tabular-nums`) for numbers and code-like labels.

## 4. Elevation

- [ ] Shadows use the token scale utilities: `shadow-sm | shadow-md | shadow-lg |
      shadow-xl | shadow-overlay`. No ad-hoc `shadow-2xl` or inline `rgba()` shadows.
- [ ] Modals, drawers and command palettes use `shadow-overlay`.

## 5. Interaction & states

- [ ] Hover/active/focus are CSS-driven (`hover:`, `active:`, `focus-visible:`),
      not React state, unless behaviour genuinely requires JS.
- [ ] Visible keyboard focus: `focus-visible:ring-2 focus-visible:ring-accent`
      (+ offset where it sits on a surface).
- [ ] Disabled state: reduced opacity + `cursor-not-allowed` + no hover effect.
- [ ] Documented state matrix where relevant (default / hover / active / focus /
      disabled / loading / error / selected).

## 6. Accessibility

- [ ] Real semantic elements (`<button>`, `<a>`, `<label>`, `<fieldset>`), not
      `div`/`span` with `onClick`.
- [ ] Icon-only controls have `aria-label`.
- [ ] Inputs: label associated via `htmlFor`/`id`; errors linked with
      `aria-describedby`; `aria-invalid` when errored.
- [ ] Overlays: `role="dialog"` + `aria-modal`, focus trap, Esc to close,
      focus restored on close (use `useFocusTrap`).
- [ ] Fully keyboard-operable (Tab / Shift+Tab / Enter / Space / Esc / arrows).
- [ ] Touch targets ≥ 44×44px on interactive controls where practical.
- [ ] Lucide icons only — no emoji as indicators.

## 7. Docs integration

- [ ] Exported from `src/components/ui/index.ts` (component + its public types).
- [ ] Demo added to `src/lib/docs/demos.tsx`.
- [ ] Registered in `src/lib/docs/registry.tsx` with `category`, `exports`,
      a code snippet, and accurate `dependsOn` / `requires`.

## 8. Verification

- [ ] `pnpm exec tsc --noEmit` passes.
- [ ] `pnpm build` passes and the component's page prerenders.
- [ ] The docs page shows a working Preview, Code (copy), and Full source.
