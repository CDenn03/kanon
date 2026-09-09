# Kanon Component Specifications

Design tokens and patterns derived from the Mathesis design system.

## Form Field Pattern

All form inputs (Input, Textarea, Select, SearchCombobox, DatePicker) share this anatomy:

### Anatomy

| Element | Specification |
|---------|---------------|
| **Label** | 13px medium, above the field (never inside) |
| **Input container** | 1px border, 8px radius |
| **Placeholder** | Tertiary color (example input, not instructions) |
| **Helper text** | 12px below field, secondary color |
| **Error message** | 12px below field, error color |

### Dimensions & Tokens

| Token | Value | Tailwind |
|-------|-------|----------|
| Height | 40px | `h-10` |
| Padding X | 12px | `px-3` |
| Radius | 8px | `rounded-lg` |
| Border width | 1px | `border` |
| Label gap | 6px | `gap-1.5` |
| Label size | 13px | `text-[13px]` |
| Helper text | 12px | `text-xs` |

### States

| State | Visual Treatment |
|-------|-----------------|
| **Default** | `border-border` |
| **Focus** | Accent border + focus ring (`focus-visible:border-accent focus-visible:ring-2`) |
| **Filled** | Content visible, same border as default |
| **Error** | Error border + message below, `aria-invalid="true"` |
| **Disabled** | Reduced opacity (60%), secondary background |
| **Read-only** | Secondary background, default cursor |

### Accessibility Requirements

- Label associated via `htmlFor` / `id`
- Error/hint linked with `aria-describedby`
- `aria-invalid="true"` when in error state
- `autocomplete` attribute for common fields

### Do

- Always show the label above the field
- Show validation errors inline, below the field
- Use placeholder for example input, not instructions
- Set autocomplete for common fields (email, name)

### Don't

- Use placeholder text as the only label
- Show all errors only on submit
- Use a red border with no explanatory message
- Stack multiple instructions inside the field

---

## Animation Durations

Based on Doherty Threshold research — stay under 400ms to maintain user flow state.

| Token | Duration | Use Case |
|-------|----------|----------|
| `--duration-instant` | 75ms | Micro-interactions (checkbox tick) |
| `--duration-fast` | 150ms | Hovers, focus states |
| `--duration-normal` | 200ms | Dropdowns, tooltips |
| `--duration-emphasis` | 250ms | Modals, drawers |
| `--duration-slow` | 300ms | Page transitions |

### Easing Curves

| Token | Curve | Use Case |
|-------|-------|----------|
| `--ease-out` | `cubic-bezier(0.33, 1, 0.68, 1)` | Elements entering |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | State changes |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy/playful feedback |

---

## Color Semantic Tokens

All components use semantic color tokens, not raw hex values.

### Text

| Token | Purpose |
|-------|---------|
| `text-text` | Primary text (ink) |
| `text-text-secondary` | Secondary text |
| `text-text-tertiary` | Tertiary/placeholder text |

### Surfaces

| Token | Purpose |
|-------|---------|
| `bg-surface` | Card/panel backgrounds |
| `bg-bg` | Page background |
| `bg-bg-secondary` | Disabled/read-only backgrounds |
| `bg-bg-hover` | Hover state |

### Borders

| Token | Purpose |
|-------|---------|
| `border-border` | Default borders |
| `border-border-hover` | Hover borders |

### Status

| Token | Purpose |
|-------|---------|
| `text-accent` / `bg-accent` | Primary brand actions |
| `text-error` / `bg-error-light` | Error states |
| `text-warning` / `bg-warning-light` | Warning states |
| `text-success` / `bg-success-light` | Success states |

---

*Spec sourced from Mathesis ui-components and ux-psychology guidelines.*
