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

---

## Input Component Specifications

This section documents the props of the text-entry components — `Input`,
`Textarea`, and `MoneyInput` — plus the shared **three-stage validation model**
they use. It is intended as an integration reference: for each prop, what it is
for and how it affects behaviour.

All three are **controlled** components: you own the value in state and update it
from `onChange`. They render through the shared `Field` wrapper, so label, hint,
error, required marker, and accessibility wiring (`htmlFor`/`aria-describedby`/
`aria-invalid`) behave identically across them.

### The validation model (filter → format → normalize)

Text validation is layered into three explicit stages so the field can stay
friendly to type in while still producing a clean payload. The stages live in
`@/lib/validation` and are wired into `Input`/`Textarea` through a single `rule`
prop.

| Stage | When | Function | Purpose |
|-------|------|----------|---------|
| **filter** | every keystroke (`onChange`) | `enforceInputRule(raw, rule)` | Strip disallowed characters, apply casing, cap length — *before* your `onChange` sees the value. Invalid characters can never enter state. |
| **format** | on blur (`onBlur`) | `formatOnBlur(kind, raw)` | Pretty-print for display (`+254 712 345 678`, `KES 1,000.50`, Title Case). Display-only. |
| **normalize** | on submit (your code) | `normalizeForSubmit(kind, raw)` | Produce the canonical machine value for the API/store (`+254712345678`, `1000.50`). |

Supporting **validators** (`isValidEmail`, `isValidKenyanPhone`,
`isValidKraPin`, `isValidVehiclePlate`, `isValidDigits`, …) return booleans for
computing the `error` prop, typically on blur or submit.

#### `InputRule` (the `rule` prop)

| Field | Type | Purpose |
|-------|------|---------|
| `maxLength` | `number` | Hard character cap. Also applied to the native `maxLength` and drives the Textarea counter. |
| `filter` | `"digits" \| "phone" \| "kraPin" \| "plate" \| "code" \| "name" \| "registrationNumber" \| "accountNumber" \| "username" \| "slug"` | Named keystroke filter — the character class the field is allowed to hold. |
| `inputMode` | `"text" \| "numeric" \| "tel" \| "email" \| "decimal"` | Virtual-keyboard hint mirrored onto the native `inputMode`. |
| `uppercase` | `boolean` | Force-uppercase every keystroke (codes, plates, KRA PIN). |
| `lowercase` | `boolean` | Force-lowercase every keystroke (usernames, slugs). |
| `format` | `FieldFormatKind` (`"phone" \| "plate" \| "kraPin" \| "code" \| "name" \| "money"`) | Blur-display + submit formatter kind. |

```tsx
import { Input, isValidKenyanPhone, normalizeForSubmit } from "kanon";

<Input
  label="Phone"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  rule={{ filter: "phone", inputMode: "tel", maxLength: 15, format: "phone" }}
  error={touched && !isValidKenyanPhone(phone) ? "Enter a valid mobile number." : undefined}
/>;

// on submit:
const payload = { phone: normalizeForSubmit("phone", phone) }; // "+254712345678"
```

### `Input`

Single-line text field with optional prefix/suffix, password reveal, and the
`rule` validation pipeline.

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `value` | `string` | — | Controlled value. |
| `onChange` | `(e: ChangeEvent<HTMLInputElement>) => void` | — | Fires after the `rule` filter runs, so `e.target.value` is already clean. |
| `onBlur` | `(e: FocusEvent<HTMLInputElement>) => void` | — | Fires after blur formatting; use to trigger validation. |
| `label` | `string` | — | Field label (rendered above via `Field`). |
| `hint` | `string` | — | Helper text below the field. |
| `error` | `string` | — | Error message; sets error styling + `aria-invalid`. Overrides `hint`. |
| `required` | `boolean` | `false` | Shows the required `*` marker. |
| `disabled` | `boolean` | `false` | Disables input; muted styling. |
| `readOnly` | `boolean` | `false` | Read-only; secondary background, editing blocked. |
| `type` | `string` | `"text"` | Native input type. `"password"` adds the reveal toggle. |
| `numeric` | `boolean` | `false` | Right-aligns text with tabular figures (numeric display). |
| `prefix` | `string` | — | Static leading affix inside the field (e.g. `@`, `$`). |
| `suffix` | `string` | — | Static trailing affix (e.g. `.00`, `kg`). |
| `placeholder` | `string` | — | Example input (not instructions). |
| `autoComplete` | `string` | — | Native autocomplete token. |
| `rule` | `InputRule` | — | Validation pipeline (see above). Drives filter, `inputMode`, `maxLength`, blur `format`. |
| `id` | `string` | auto (`useId`) | Explicit id; auto-generated when omitted. |

### `Textarea`

Auto-growing multi-line field (caps at 220px) with an optional character
counter and the same `rule` pipeline.

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `value` | `string` | — | Controlled value. |
| `onChange` | `(e: ChangeEvent<HTMLTextAreaElement>) => void` | — | Fires after the `rule` filter runs. |
| `onBlur` | `(e: FocusEvent<HTMLTextAreaElement>) => void` | — | Fires after blur formatting. |
| `label` / `hint` / `error` / `required` | — | — | Same semantics as `Input`. |
| `maxLength` | `number` | — | Character cap; shows a live `n/max` counter that warns past 90%. Falls back to `rule.maxLength`. |
| `rows` | `number` | `3` | Initial visible rows before auto-grow. |
| `placeholder` | `string` | — | Example input. |
| `rule` | `InputRule` | — | Validation pipeline. Useful filters here: `name`, `code`, `slug`. |
| `id` | `string` | auto (`useId`) | Explicit id; auto-generated when omitted. |

### `MoneyInput`

Specialized numeric field for currency. It already implements the money
`format`/`normalize` behaviour internally (grouped thousands + fixed decimals on
blur, plain `number` in state), so it does **not** take a `rule` — its value is a
`number | null`, not a string.

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `value` | `number \| null` | — | Controlled numeric value; `null` when empty. |
| `onChange` | `(value: number \| null) => void` | — | Receives the parsed number (or `null`), not an event. |
| `currency` | `string` | — | Currency prefix shown inside the field (e.g. `KES`, `$`). |
| `decimals` | `number` | `2` | Fraction digits kept and displayed. `0` for whole units. |
| `allowNegative` | `boolean` | `false` | Permit a leading `-`. |
| `min` | `number` | — | Clamp lower bound on blur. |
| `max` | `number` | — | Clamp upper bound on blur. |
| `locale` | `string` | `"en-KE"` | Locale for thousands grouping. |
| `label` / `hint` / `error` | — | — | Same semantics as `Input`. |
| `disabled` / `readOnly` | `boolean` | `false` | Same semantics as `Input`. |
| `placeholder` | `string` | `"0.00"` | Example input. |
| `id` | `string` | — | Explicit id. |

**Behaviour:** while focused it shows a grouped editable draft (`1,234.5`) and
preserves the caret across re-grouping; on blur it formats to fixed decimals and
clamps to `min`/`max`. Your state always holds a plain `number`, so no separate
normalize step is needed at submit.

### Integration checklist

- Keep the field **controlled**: `value` in state, update from `onChange`.
- Attach a `rule` to get keystroke safety for free; pick the `filter`/`format`
  that matches the field kind.
- Compute `error` from a validator on blur/submit — never rely on the filter
  alone (it prevents bad *characters*, not incomplete *values*).
- At submit, run `normalizeForSubmit(kind, value)` for string fields; read
  `MoneyInput`'s numeric `value` directly.
