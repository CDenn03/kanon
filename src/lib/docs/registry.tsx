import type { ComponentEntry } from "./types";
import {
  ButtonDemo,
  InputDemo,
  MoneyInputDemo,
  TextareaDemo,
  ComboboxDemo,
  TabsDemo,
  DatePickerDemo,
  ToastDemo,
  ConfirmDemo,
  HoldToConfirmDemo,
  CardDemo,
  BadgeDemo,
  CheckboxDemo,
  SwitchDemo,
  BannerDemo,
  StatCardDemo,
  AvatarDemo,
  BreadcrumbDemo,
  PageHeaderDemo,
  BlankDemo,
  SkeletonRowsDemo,
  ExceptionStripDemo,
  SortHeaderDemo,
  TooltipDemo,
  PaginationDemo,
  MenuDemo,
  DateRangeDemo,
  BackButtonDemo,
  TableOfContentsDemo,
  CommandPaletteDemo,
  DialogDemo,
  DrawerDemo,
  SelectDemo,
  RadioGroupDemo,
  DataTableDemo,
  AlertDemo,
  ProgressDemo,
  AccordionDemo,
  SliderDemo,
  EmptyStateDemo,
  PopoverDemo,
  SeparatorDemo,
  KbdDemo,
  SpinnerDemo,
  ButtonGroupDemo,
  ChipDemo,
  FileUploadDemo,
  FileUploadMultipleDemo,
  PhotoUploadDemo,
  DocumentsTableDemo,
  DocumentRequestListDemo,
  DocumentViewerDemo,
  ImageCropModalDemo,
} from "./demos";

/*
 * Component registry.
 *
 * Each entry supplies metadata, the path to the real source file (read
 * from disk for the "full source" viewer), and one or more examples. Each
 * example carries a live `node` plus the `code` snippet shown in the Code
 * tab. Keep the snippet in step with the node in demos.tsx.
 */
export const registry: ComponentEntry[] = [
  {
    slug: "button",
    name: "Button",
    description: "Primary action trigger with variants, sizes, icons, loading and disabled-with-reason states.",
    category: "Buttons & Actions",
    sourcePath: "src/components/ui/button.tsx",
    exports: ["Button"],
    requires: [
      "src/lib/utils.ts",
      "src/hooks/use-popover-position.ts",
      "src/hooks/use-mounted.ts",
    ],
    spec: {
      source: "mathesis ui-component/primary-button",
      purpose:
        "Triggers the primary action on a screen. One primary button per view — it signals the most important next step.",
      props: [
        { name: "variant", type: '"primary" | "secondary" | "ghost" | "destructive" | "link"', default: '"primary"', description: "Sets the visual weight and intent of the button." },
        { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Controls the button height, padding and icon size." },
        { name: "loading", type: "boolean", description: "Shows a spinner in place of the content and blocks clicks while an async action runs." },
        { name: "disabled", type: "boolean", description: "Disables the button; combine with disabledReason to explain why on hover/focus." },
        { name: "disabledReason", type: "string", description: "Tooltip text shown when the button is disabled, explaining why the action is blocked." },
        { name: "icon", type: "LucideIcon", description: "Leading icon component rendered before the label." },
        { name: "iconRight", type: "LucideIcon", description: "Trailing icon component rendered after the label." },
        { name: "children", type: "ReactNode", description: "The button label; keep it to 1–3 words." },
        { name: "onClick", type: "(e: MouseEvent<HTMLButtonElement>) => void", description: "Handler invoked when the button is activated (suppressed while disabled with a reason)." },
        { name: "title", type: "string", description: "Native title attribute; ignored when a disabledReason tooltip is shown." },
        { name: "type", type: '"button" | "submit" | "reset"', default: '"button"', description: "The native button type; use \"submit\" inside forms." },
        { name: "className", type: "string", description: "Extra classes merged onto the button element." },
        { name: "ariaLabel", type: "string", description: "Accessible label; required when the button is icon-only." },
      ],
      anatomy: [
        "Container: moderate radius (8px / rounded-lg)",
        "Label: 14px medium weight, centered",
        "Optional leading/trailing icon: 15–18px, 8px gap to label",
        "Focus ring: 2px offset outline for keyboard navigation",
      ],
      states: [
        "Default: solid brand background, white label",
        "Hover: darker background (accent-hover)",
        "Active/Pressed: darker still (accent-active)",
        "Disabled: reduced opacity, no pointer events, no hover",
        "Loading: spinner replaces content, same background",
      ],
      tokens: [
        { label: "Height (md)", value: "40px" },
        { label: "Padding X", value: "16px" },
        { label: "Icon gap", value: "8px" },
        { label: "Icon size", value: "16–18px" },
        { label: "Radius", value: "8px" },
        { label: "Min touch target", value: "44×44px" },
      ],
      guidelines: {
        do: [
          "Use for the single most important action per view",
          "Keep the label to 1–3 words",
          "Ensure 4.5:1 label/background contrast",
          "Provide a visible focus state for keyboard users",
        ],
        dont: [
          "Place two primary buttons in the same view",
          "Use for destructive actions — use the destructive variant",
          "Disable without explaining why nearby",
          "Use ALL CAPS unless a brand guideline requires it",
        ],
      },
      accessibility: [
        "Minimum touch target 44×44px on mobile",
        "Visible focus indicator (2px ring, 2px offset)",
        "Uses a real <button> element",
        "aria-label required when icon-only",
        "aria-disabled + visual disabled state when blocked",
      ],
    },
    examples: [
      {
        title: "Variants & states",
        node: <ButtonDemo />,
        code: `import { Button } from "@/components/ui";
import { Plus, Search } from "lucide-react";

<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>
<Button icon={Plus}>New</Button>
<Button icon={Search} variant="secondary">Search</Button>
<Button loading>Saving</Button>
<Button disabled disabledReason="You lack permission">Disabled</Button>`,
      },
    ],
  },
  {
    slug: "input",
    name: "Input",
    description: "Text field with label, hint, prefix/suffix, password reveal, numeric and error states.",
    category: "Forms",
    sourcePath: "src/components/ui/input.tsx",
    exports: ["Input"],
    requires: ["src/components/ui/field.tsx", "src/lib/utils.ts"],
    spec: {
      source: "mathesis ui-component/text-input",
      purpose:
        "Collects a single line of text. Always paired with a visible label — never use the placeholder as the label.",
      props: [
        { name: "id", type: "string", description: "Explicit element id; auto-generated when omitted and wired to the label." },
        { name: "label", type: "string", description: "Visible field label shown above the input." },
        { name: "hint", type: "string", description: "Helper text shown below the field when there is no error." },
        { name: "error", type: "string", description: "Error message; renders the field in the error state and sets aria-invalid." },
        { name: "required", type: "boolean", description: "Marks the field required with a visual asterisk." },
        { name: "disabled", type: "boolean", description: "Disables input and dims the field." },
        { name: "readOnly", type: "boolean", description: "Makes the field read-only while keeping the value visible." },
        { name: "prefix", type: "string", description: "Static text shown inside the field on the left (e.g. a currency code)." },
        { name: "suffix", type: "string", description: "Static text shown inside the field on the right (e.g. a unit)." },
        { name: "type", type: "string", default: '"text"', description: "Native input type; \"password\" adds a reveal toggle." },
        { name: "numeric", type: "boolean", description: "Right-aligns the text with tabular figures for numeric entry." },
        { name: "placeholder", type: "string", description: "Example input shown when empty — not a substitute for the label." },
        { name: "value", type: "string", description: "Controlled input value." },
        { name: "onChange", type: "(e: ChangeEvent<HTMLInputElement>) => void", description: "Change handler; fires after any rule enforcement is applied." },
        { name: "onBlur", type: "(e: FocusEvent<HTMLInputElement>) => void", description: "Blur handler; fires after rule-based formatting on blur." },
        { name: "autoComplete", type: "string", description: "Native autocomplete hint for common fields (email, name, etc.)." },
        { name: "rule", type: "InputRule", description: "Keystroke/blur validation rule that strips disallowed characters, caps length, and pretty-prints on blur." },
      ],
      anatomy: [
        "Label: 13–14px medium, above the field (never inside)",
        "Input container: 1px border, 8px radius",
        "Placeholder: tertiary color (example input, not instructions)",
        "Helper text: 12px below field, secondary color",
        "Error message: 12px below field, error color",
      ],
      states: [
        "Default: border-border",
        "Focus: accent border + focus ring",
        "Filled: content visible, same as default",
        "Error: error border + message below, aria-invalid",
        "Disabled: reduced opacity, secondary background",
        "Read-only: secondary background, default cursor",
      ],
      tokens: [
        { label: "Height", value: "40px" },
        { label: "Padding X", value: "12px" },
        { label: "Radius", value: "8px" },
        { label: "Border width", value: "1px" },
        { label: "Label gap", value: "6px" },
      ],
      guidelines: {
        do: [
          "Always show the label above the field",
          "Show validation errors inline, below the field",
          "Use placeholder for example input, not instructions",
          "Set autocomplete for common fields (email, name)",
        ],
        dont: [
          "Use placeholder text as the only label",
          "Show all errors only on submit",
          "Use a red border with no explanatory message",
          "Stack multiple instructions inside the field",
        ],
      },
      accessibility: [
        "Label associated via htmlFor / id",
        "Error linked with aria-describedby",
        "aria-invalid=\"true\" when in error state",
        "autocomplete attribute for common fields",
      ],
    },
    examples: [
      {
        title: "Field types",
        node: <InputDemo />,
        code: `import { Input } from "@/components/ui";

<Input label="Full name" placeholder="Amina Wanjiru" value={v} onChange={(e) => setV(e.target.value)} />
<Input label="Email" type="email" placeholder="you@company.com" hint="We'll never share it." />
<Input label="Password" type="password" placeholder="••••••••" />
<Input label="Amount" prefix="KES" numeric placeholder="0.00" />
<Input label="Username" error="That username is taken." value="admin" onChange={() => {}} />`,
      },
    ],
  },
  {
    slug: "money-input",
    name: "MoneyInput",
    description: "Currency field that groups thousands live while typing and formats to fixed decimals on blur.",
    category: "Forms",
    sourcePath: "src/components/ui/money-input.tsx",
    exports: ["MoneyInput"],
    requires: ["src/components/ui/field.tsx", "src/lib/utils.ts"],
    spec: {
      purpose:
        "Collects a monetary amount, grouping thousands live as the user types and formatting to fixed decimals on blur.",
      props: [
        { name: "id", type: "string", description: "Explicit element id, wired to the label." },
        { name: "label", type: "string", description: "Visible field label shown above the input." },
        { name: "hint", type: "string", description: "Helper text shown below the field when there is no error." },
        { name: "error", type: "string", description: "Error message; renders the field in the error state." },
        { name: "disabled", type: "boolean", description: "Disables the input." },
        { name: "readOnly", type: "boolean", description: "Makes the field read-only." },
        { name: "placeholder", type: "string", default: '"0.00"', description: "Placeholder shown when the value is empty." },
        { name: "currency", type: "string", description: "Currency code shown as a static prefix inside the field (e.g. \"KES\")." },
        { name: "value", type: "number | null", required: true, description: "Controlled numeric value; null when empty." },
        { name: "onChange", type: "(value: number | null) => void", required: true, description: "Called with the parsed number (or null) as the user types and on blur." },
        { name: "decimals", type: "number", default: "2", description: "Number of decimal places to keep and format to." },
        { name: "allowNegative", type: "boolean", default: "false", description: "Permits a leading minus sign for negative amounts." },
        { name: "max", type: "number", description: "Upper bound clamped on blur." },
        { name: "min", type: "number", description: "Lower bound clamped on blur." },
        { name: "locale", type: "string", default: '"en-KE"', description: "Locale used for thousands grouping and decimal formatting." },
      ],
    },
    examples: [
      {
        title: "Live thousand separators",
        node: <MoneyInputDemo />,
        code: `import { MoneyInput } from "@/components/ui";

const [amount, setAmount] = useState<number | null>(1234567.5);

<MoneyInput label="Invoice total" currency="KES" value={amount} onChange={setAmount} />`,
      },
    ],
  },
  {
    slug: "textarea",
    name: "Textarea",
    description: "Auto-growing multi-line input with an optional character counter.",
    category: "Forms",
    sourcePath: "src/components/ui/textarea.tsx",
    exports: ["Textarea"],
    requires: ["src/components/ui/field.tsx", "src/lib/utils.ts"],
    spec: {
      purpose:
        "Collects multi-line text, growing to fit its content with an optional character counter.",
      props: [
        { name: "id", type: "string", description: "Explicit element id, wired to the label." },
        { name: "label", type: "string", description: "Visible field label shown above the textarea." },
        { name: "hint", type: "string", description: "Helper text shown below the field when there is no error." },
        { name: "error", type: "string", description: "Error message; renders the field in the error state." },
        { name: "required", type: "boolean", description: "Marks the field required with a visual asterisk." },
        { name: "placeholder", type: "string", description: "Example input shown when empty." },
        { name: "maxLength", type: "number", description: "Character limit; drives the counter and native maxLength." },
        { name: "rows", type: "number", default: "3", description: "Initial visible row count before auto-growing." },
        { name: "value", type: "string", description: "Controlled textarea value." },
        { name: "onChange", type: "(e: ChangeEvent<HTMLTextAreaElement>) => void", description: "Change handler; fires after any rule enforcement is applied." },
        { name: "onBlur", type: "(e: FocusEvent<HTMLTextAreaElement>) => void", description: "Blur handler; fires after rule-based formatting on blur." },
        { name: "rule", type: "InputRule", description: "Keystroke/blur validation rule that strips disallowed characters, caps length, and pretty-prints on blur." },
      ],
    },
    examples: [
      {
        title: "With counter",
        node: <TextareaDemo />,
        code: `import { Textarea } from "@/components/ui";

<Textarea label="Notes" placeholder="Add a note…" maxLength={200} value={v} onChange={(e) => setV(e.target.value)} />`,
      },
    ],
  },
  {
    slug: "search-combobox",
    name: "SearchCombobox",
    description: "Single or multi-select combobox with client filtering or async search, keyboard nav and clear.",
    category: "Forms",
    sourcePath: "src/components/ui/search-combobox.tsx",
    exports: ["SearchCombobox", "ComboboxOption"],
    requires: [
      "src/components/ui/field.tsx",
      "src/lib/utils.ts",
      "src/hooks/use-popover-position.ts",
      "src/hooks/use-mounted.ts",
    ],
    spec: {
      purpose:
        "Searches and selects one or many options, with client-side filtering or async remote search, keyboard navigation and clear.",
      props: [
        { name: "id", type: "string", description: "Explicit element id, wired to the label." },
        { name: "label", type: "string", description: "Visible field label shown above the control." },
        { name: "hint", type: "string", description: "Helper text shown below the field when there is no error." },
        { name: "error", type: "string", description: "Error message; renders the field in the error state." },
        { name: "disabled", type: "boolean", description: "Disables the combobox." },
        { name: "required", type: "boolean", description: "Marks the field required with a visual asterisk." },
        { name: "options", type: "T[]", description: "Static options to filter client-side; omit when using onSearch." },
        { name: "onSearch", type: "(query: string, signal: AbortSignal) => Promise<T[]>", description: "Async search callback for remote data; enables debounced remote mode with an abort signal." },
        { name: "multiple", type: "boolean", description: "Allows selecting multiple options rendered as removable chips." },
        { name: "value", type: "T | T[] | null", required: true, description: "Controlled selection — an array in multiple mode, a single option or null otherwise." },
        { name: "onChange", type: "(value: T | T[] | null) => void", required: true, description: "Called with the updated selection." },
        { name: "getOptionValue", type: "(o: T) => string", default: "o.value", description: "Derives the stable value/key from an option." },
        { name: "getOptionLabel", type: "(o: T) => string", default: "o.label", description: "Derives the display label from an option." },
        { name: "getOptionMeta", type: "(o: T) => string | undefined", description: "Derives optional trailing meta text shown per option." },
        { name: "minChars", type: "number", default: "0", description: "Minimum query length before searching/filtering runs." },
        { name: "placeholder", type: "string", default: '"Search…"', description: "Placeholder shown in the search input when nothing is selected." },
      ],
    },
    examples: [
      {
        title: "Single & multiple",
        node: <ComboboxDemo />,
        code: `import { SearchCombobox, type ComboboxOption } from "@/components/ui";

<SearchCombobox label="Role" options={ROLES} value={role} onChange={setRole} placeholder="Select a role…" />
<SearchCombobox label="Team" multiple options={STAFF} value={team} onChange={setTeam} placeholder="Add members…" />`,
      },
    ],
  },
  {
    slug: "tabs",
    name: "Tabs",
    description: "Keyboard-navigable tabs in underline and segmented variants, with optional counts.",
    category: "Navigation",
    sourcePath: "src/components/ui/tabs.tsx",
    exports: ["Tabs"],
    spec: {
      purpose:
        "Switches between sibling views within the same context, with keyboard navigation and optional counts.",
      props: [
        { name: "items", type: "TabItem[]", required: true, description: "Tabs to render; each has id, label and optional count, urgent and disabled flags." },
        { name: "value", type: "string", required: true, description: "The id of the currently active tab." },
        { name: "onChange", type: "(id: string) => void", required: true, description: "Called with the newly selected tab id." },
        { name: "variant", type: '"underline" | "segmented"', default: '"underline"', description: "Chooses the underline tab bar or a compact segmented control." },
      ],
    },
    examples: [
      {
        title: "Underline & segmented",
        node: <TabsDemo />,
        code: `import { Tabs } from "@/components/ui";

const items = [
  { id: "all", label: "All", count: 1284 },
  { id: "pending", label: "Pending", count: 12, urgent: true },
  { id: "archived", label: "Archived" },
];

<Tabs items={items} value={tab} onChange={setTab} />
<Tabs items={items} value={tab} onChange={setTab} variant="segmented" />`,
      },
    ],
  },
  {
    slug: "date-picker",
    name: "DatePicker & DateRangePicker",
    description: "Popover calendar for single dates and ranges, with presets and month navigation.",
    category: "Forms",
    sourcePath: "src/components/ui/calendar.tsx",
    exports: ["DatePicker", "MonthGrid", "DateRangePicker"],
    requires: [
      "src/components/ui/field.tsx",
      "src/lib/utils.ts",
      "src/hooks/use-popover-position.ts",
      "src/hooks/use-mounted.ts",
    ],
    spec: {
      purpose:
        "Selects a single date from a popover calendar with month/year navigation; DateRangePicker selects a start/end range with presets.",
      props: [
        { name: "id", type: "string", description: "Explicit element id, wired to the label (DatePicker)." },
        { name: "label", type: "string", description: "Visible field label shown above the trigger." },
        { name: "hint", type: "string", description: "Helper text shown below the field." },
        { name: "value", type: "Date | null", required: true, description: "Controlled selected date (DatePicker); null when unset." },
        { name: "onChange", type: "(d: Date | null) => void", required: true, description: "Called with the chosen date, or null when cleared (DatePicker)." },
        { name: "min", type: "Date", description: "Earliest selectable date; earlier days are disabled." },
        { name: "max", type: "Date", description: "Latest selectable date; later days are disabled." },
      ],
    },
    examples: [
      {
        title: "Single date & range",
        node: <DatePickerDemo />,
        code: `import { DatePicker, DateRangePicker } from "@/components/ui";

<DatePicker label="Start date" value={date} onChange={setDate} />
<DateRangePicker label="Reporting period" value={range} onChange={setRange} />`,
      },
    ],
  },
  {
    slug: "toast",
    name: "Toast",
    description: "Transient notifications with tones, auto-dismiss with pause-on-hover, and actions.",
    category: "Feedback",
    sourcePath: "src/components/ui/toast.tsx",
    exports: ["Toast", "useToasts", "ToastData"],
    spec: {
      purpose:
        "Shows a transient notification with a tone, auto-dismiss (paused on hover/focus) and an optional action; drive the queue with the useToasts hook.",
      props: [
        { name: "t", type: "ToastData", required: true, description: "The toast to render (id, tone, title, optional body/action/duration/sticky)." },
        { name: "onClose", type: "() => void", required: true, description: "Called when the toast is dismissed or its timer elapses." },
        { name: "ToastData.tone", type: '"success" | "error" | "warning" | "info"', required: true, description: "Semantic tone; error toasts are sticky and use role=\"alert\" (ToastData)." },
        { name: "ToastData.title", type: "string", required: true, description: "The primary toast headline (ToastData)." },
        { name: "ToastData.body", type: "string", description: "Optional secondary message under the title (ToastData)." },
        { name: "ToastData.duration", type: "number", required: true, description: "Auto-dismiss time in ms; defaulted to 5000 by useToasts (ToastData)." },
        { name: "ToastData.sticky", type: "boolean", description: "Prevents auto-dismiss so the toast stays until closed (ToastData)." },
        { name: "ToastData.action", type: "{ label: string; run?: () => void }", description: "Optional inline action button shown in the toast (ToastData)." },
      ],
    },
    examples: [
      {
        title: "Tones",
        node: <ToastDemo />,
        code: `import { Toast, useToasts } from "@/components/ui";

const { list, push, close } = useToasts();

<Button onClick={() => push({ tone: "success", title: "Saved", body: "Your changes were saved." })}>Success</Button>

{list.map((t) => <Toast key={t.id} t={t} onClose={() => close(t.id)} />)}`,
      },
    ],
  },
  {
    slug: "confirm-dialog",
    name: "ConfirmDialog",
    description: "Modal confirmation with simple, type-to-confirm and hold-to-confirm modes.",
    category: "Overlays",
    sourcePath: "src/components/ui/confirm-dialog.tsx",
    exports: ["ConfirmDialog"],
    dependsOn: ["button", "hold-to-confirm"],
    requires: ["src/components/ui/field.tsx", "src/lib/utils.ts"],
    spec: {
      purpose:
        "Modal confirmation for consequential actions, supporting simple, type-to-confirm and press-and-hold modes.",
      props: [
        { name: "open", type: "boolean", required: true, description: "Controls whether the dialog is rendered." },
        { name: "tone", type: '"default" | "destructive"', default: '"default"', description: "Sets the visual emphasis; destructive uses error styling for dangerous actions." },
        { name: "title", type: "string", required: true, description: "Heading question shown at the top of the dialog." },
        { name: "body", type: "string", description: "Optional supporting text explaining the action." },
        { name: "consequences", type: "string[]", default: "[]", description: "Bulleted list of side effects shown to the user." },
        { name: "confirmLabel", type: "string", required: true, description: "Label for the confirm button." },
        { name: "mode", type: '"simple" | "type" | "hold"', default: '"simple"', description: "Confirmation strategy: a plain button, type-to-match, or press-and-hold." },
        { name: "typeToMatch", type: "string", description: "The exact string the user must type when mode is \"type\"." },
        { name: "onConfirm", type: "() => void", required: true, description: "Called when the user confirms the action." },
        { name: "onCancel", type: "() => void", required: true, description: "Called when the user cancels or dismisses the dialog." },
        { name: "loading", type: "boolean", description: "Shows a pending state on the confirm button while the action runs." },
      ],
    },
    examples: [
      {
        title: "Hold & type to confirm",
        node: <ConfirmDemo />,
        code: `import { ConfirmDialog } from "@/components/ui";

<ConfirmDialog
  open={open}
  tone="destructive"
  title="Delete this user?"
  body="They will immediately lose access."
  consequences={["Removes all sessions", "Revokes API keys"]}
  confirmLabel="Delete user"
  mode="hold"
  onConfirm={() => setOpen(false)}
  onCancel={() => setOpen(false)}
/>`,
      },
    ],
  },
  {
    slug: "hold-to-confirm",
    name: "HoldToConfirm",
    description: "Press-and-hold destructive action button with a keyboard fallback.",
    category: "Buttons & Actions",
    sourcePath: "src/components/ui/hold-to-confirm.tsx",
    exports: ["HoldToConfirm"],
    spec: {
      purpose:
        "Requires a deliberate press-and-hold to trigger a destructive action, with a keyboard fallback to a confirmation dialog.",
      props: [
        { name: "label", type: "string", default: '"Hold to delete"', description: "Idle button label describing the action." },
        { name: "duration", type: "number", default: "1200", description: "Milliseconds the user must hold before the action fires." },
        { name: "onConfirm", type: "() => void", required: true, description: "Called once the hold completes and the progress bar fills." },
        { name: "onKeyboardFallback", type: "() => void", required: true, description: "Called on Enter/Space so keyboard users get a confirmation dialog instead of holding." },
        { name: "disabled", type: "boolean", description: "Disables the button and prevents holding." },
      ],
    },
    examples: [
      {
        title: "Hold to delete",
        node: <HoldToConfirmDemo />,
        code: `import { HoldToConfirm } from "@/components/ui";

<HoldToConfirm
  label="Hold to delete"
  onConfirm={handleDelete}
  onKeyboardFallback={openConfirmDialog}
/>`,
      },
    ],
  },
  {
    slug: "card",
    name: "Card",
    description: "Bordered surface with optional header, body and footer; interactive and selected states.",
    category: "Layout",
    sourcePath: "src/components/ui/card.tsx",
    exports: ["Card", "CardHeader", "CardBody", "CardFooter"],
    spec: {
      source: "mathesis ui-component/content-card",
      purpose:
        "Groups related content into a scannable unit. Name a card by its function (Summary, Profile) — not its appearance.",
      props: [
        { name: "children", type: "ReactNode", required: true, description: "The card's content, typically CardHeader / CardBody / CardFooter." },
        { name: "interactive", type: "boolean", description: "Adds hover elevation and focus affordances for clickable cards." },
        { name: "selected", type: "boolean", description: "Applies the selected state with an accent border and tinted background." },
        { name: "className", type: "string", description: "Extra classes merged onto the card container." },
        { name: "CardHeader.title", type: "ReactNode", required: true, description: "The header title text (CardHeader)." },
        { name: "CardHeader.action", type: "ReactNode", description: "Optional trailing action or status shown in the header (CardHeader)." },
        { name: "CardBody.children", type: "ReactNode", required: true, description: "The padded main content of the card (CardBody)." },
        { name: "CardFooter.children", type: "ReactNode", required: true, description: "Footer metadata or actions divided from the body (CardFooter)." },
      ],
      anatomy: [
        "Container: surface background, 1px border, 12px radius",
        "Header: title + optional action, divided from body",
        "Body: 16px padding content area",
        "Footer: metadata or actions, divided from body",
      ],
      states: [
        "Default: surface background, 1px border",
        "Hover (interactive): border-hover + elevation",
        "Selected: accent border + accent-light tint",
        "Loading: skeleton placeholder per content zone",
      ],
      tokens: [
        { label: "Radius", value: "12px" },
        { label: "Border width", value: "1px" },
        { label: "Padding", value: "16px" },
        { label: "Content gap", value: "8px" },
        { label: "Footer gap", value: "12px" },
      ],
      guidelines: {
        do: [
          "Name the card by what it does, not how it looks",
          "Keep consistent padding regardless of content length",
          "Clamp long text to preserve grid alignment",
          "Make the whole card clickable when it links to detail",
        ],
        dont: [
          "Nest cards within cards",
          "Mix card variants of different loudness at one level",
          "Let variable content break the grid",
          "Use cards for every block — sometimes a list suffices",
        ],
      },
      accessibility: [
        "If the card is a link, wrap it in <a> (not a div with onClick)",
        "Ensure hover treatment is also visible on keyboard focus",
        "Provide sr-only context if the title is ambiguous out of context",
      ],
    },
    examples: [
      {
        title: "Composed card",
        node: <CardDemo />,
        code: `import { Card, CardHeader, CardBody, CardFooter, Badge, Button } from "@/components/ui";

<Card>
  <CardHeader title="Active users" action={<Badge tone="pine">Live</Badge>} />
  <CardBody>1,284 people accessed this org in the last 30 days.</CardBody>
  <CardFooter><Button size="sm" variant="secondary">View report</Button></CardFooter>
</Card>`,
      },
    ],
  },
  {
    slug: "badge",
    name: "Badge",
    description: "Compact status label in pine, amber, rose and neutral tones.",
    category: "Data Display",
    sourcePath: "src/components/ui/badge.tsx",
    exports: ["Badge"],
    spec: {
      purpose:
        "Labels the status or category of an item in a compact, color-toned pill.",
      props: [
        { name: "tone", type: '"pine" | "amber" | "rose" | "neutral"', default: '"neutral"', description: "Sets the semantic color of the badge (e.g. pine for positive, rose for errors)." },
        { name: "children", type: "ReactNode", required: true, description: "The badge label; keep it to one or two words." },
        { name: "className", type: "string", description: "Extra classes merged onto the badge element." },
      ],
    },
    examples: [
      {
        title: "Tones",
        node: <BadgeDemo />,
        code: `import { Badge } from "@/components/ui";

<Badge tone="pine">Active</Badge>
<Badge tone="amber">Pending</Badge>
<Badge tone="rose">Overdue</Badge>
<Badge tone="neutral">Draft</Badge>`,
      },
    ],
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    description: "Accessible checkbox with checked, indeterminate and disabled states.",
    category: "Forms",
    sourcePath: "src/components/ui/checkbox.tsx",
    exports: ["Checkbox"],
    spec: {
      purpose:
        "Toggles a single boolean option, supporting checked, indeterminate and disabled states.",
      props: [
        { name: "checked", type: "boolean", description: "Whether the checkbox is checked." },
        { name: "indeterminate", type: "boolean", description: "Shows the mixed/dash state, typically for a partially-selected group." },
        { name: "disabled", type: "boolean", description: "Disables the checkbox." },
        { name: "onChange", type: "() => void", description: "Called when the checkbox is toggled; update state yourself." },
        { name: "ariaLabel", type: "string", description: "Accessible label; required since the control renders no visible text." },
      ],
    },
    examples: [
      {
        title: "States",
        node: <CheckboxDemo />,
        code: `import { Checkbox } from "@/components/ui";

<Checkbox checked={a} onChange={() => setA(v => !v)} ariaLabel="Option A" />
<Checkbox indeterminate ariaLabel="Some selected" />
<Checkbox checked disabled ariaLabel="Locked" />`,
      },
    ],
  },
  {
    slug: "switch",
    name: "Switch",
    description: "Toggle switch, standalone or as a labelled row.",
    category: "Forms",
    sourcePath: "src/components/ui/switch.tsx",
    exports: ["Switch", "SwitchRow"],
    spec: {
      purpose:
        "Toggles a setting on or off with immediate effect, standalone or wrapped in a labelled SwitchRow.",
      props: [
        { name: "checked", type: "boolean", required: true, description: "Whether the switch is on (Switch)." },
        { name: "onChange", type: "(checked: boolean) => void", required: true, description: "Called with the next on/off value (Switch)." },
        { name: "size", type: '"sm" | "md"', default: '"md"', description: "Switch track size." },
        { name: "disabled", type: "boolean", description: "Disables the switch." },
        { name: "label", type: "string", description: "Accessible label used for the standalone switch's aria-label." },
        { name: "SwitchRow.label", type: "ReactNode", required: true, description: "Primary row label displayed beside the control (SwitchRow)." },
        { name: "SwitchRow.hint", type: "string", description: "Secondary helper text under the row label (SwitchRow)." },
        { name: "SwitchRow.children", type: "ReactNode", required: true, description: "The Switch (or other control) to render in the row (SwitchRow)." },
        { name: "SwitchRow.labelRight", type: "boolean", description: "Places the label to the right of the control instead of the left (SwitchRow)." },
      ],
    },
    examples: [
      {
        title: "Standalone & row",
        node: <SwitchDemo />,
        code: `import { Switch, SwitchRow } from "@/components/ui";

<Switch checked={on} onChange={setOn} label="Toggle" />

<SwitchRow label="Email notifications" hint="Daily digest only">
  <Switch checked={on} onChange={setOn} />
</SwitchRow>`,
      },
    ],
  },
  {
    slug: "banner",
    name: "Banner",
    description: "Inline status message pairing a Lucide icon with tone (icon + colour, never colour alone).",
    category: "Feedback",
    sourcePath: "src/components/ui/banner.tsx",
    exports: ["Banner"],
    spec: {
      purpose:
        "Shows an inline, page-spanning status message pairing a Lucide icon with a tone and an optional action.",
      props: [
        { name: "tone", type: '"amber" | "rose" | "neutral"', required: true, description: "Sets the semantic color of the banner (never rely on color alone — always pair with an icon)." },
        { name: "icon", type: "LucideIcon", required: true, description: "Leading icon that reinforces the message's meaning." },
        { name: "children", type: "ReactNode", required: true, description: "The banner message content." },
        { name: "action", type: "string", description: "Label for an optional inline action button." },
        { name: "onAction", type: "() => void", description: "Handler invoked when the action button is clicked." },
      ],
    },
    examples: [
      {
        title: "Tones with action",
        node: <BannerDemo />,
        code: `import { Banner } from "@/components/ui";
import { AlertTriangle, Info } from "lucide-react";

<Banner tone="amber" icon={AlertTriangle} action="Review">3 invoices need your approval.</Banner>
<Banner tone="neutral" icon={Info}>Showing results from the last 30 days.</Banner>`,
      },
    ],
  },
  {
    slug: "stat-card",
    name: "StatCard",
    description: "Metric card with optional progress ring, loading and errored states.",
    category: "Data Display",
    sourcePath: "src/components/ui/stat-card.tsx",
    exports: ["StatCard"],
    spec: {
      purpose:
        "Displays a single key metric with a label, optional trend sub-line and progress ring, and loading/errored states.",
      props: [
        { name: "label", type: "string", required: true, description: "Short uppercase caption naming the metric." },
        { name: "value", type: "string", required: true, description: "The formatted metric value shown prominently." },
        { name: "sub", type: "string", description: "Secondary line beneath the value, e.g. a trend or target." },
        { name: "tone", type: '"pine" | "amber" | "rose" | "neutral"', default: '"neutral"', description: "Colors the value and ring to signal sentiment." },
        { name: "ring", type: "number", description: "Renders a 0–100 progress ring beside the value when provided." },
        { name: "loading", type: "boolean", description: "Shows a skeleton placeholder while the metric loads." },
        { name: "errored", type: "boolean", description: "Shows an error/retry state with a dash instead of the value." },
        { name: "onClick", type: "() => void", description: "Makes the card actionable; called when clicked (disabled while loading or errored)." },
        { name: "compact", type: "boolean", description: "Uses tighter spacing and hides the sub-line for dense layouts." },
      ],
    },
    examples: [
      {
        title: "With & without ring",
        node: <StatCardDemo />,
        code: `import { StatCard } from "@/components/ui";

<StatCard label="Overdue" value="12" sub="+3 since yesterday" tone="rose" />
<StatCard label="Approval rate" value="94%" sub="Target 90%" tone="pine" ring={94} />`,
      },
    ],
  },
  {
    slug: "avatar",
    name: "Avatar",
    description: "Initials or image avatar with stable colour hashing and size variants.",
    category: "Data Display",
    sourcePath: "src/components/ui/avatar.tsx",
    exports: ["Avatar", "AvatarProps"],
    spec: {
      purpose:
        "Represents a person or entity with an image, or initials with stable color hashing when no image is available.",
      props: [
        { name: "name", type: "string", required: true, description: "Full name used to derive the initials and (when colourful) the hashed color." },
        { name: "src", type: "string", description: "Optional image URL; falls back to initials if it fails to load." },
        { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Avatar diameter and font size." },
        { name: "colourful", type: "boolean", description: "Assigns a stable color from the palette based on the name instead of a neutral tone." },
      ],
    },
    examples: [
      {
        title: "Sizes & colours",
        node: <AvatarDemo />,
        code: `import { Avatar } from "@/components/ui";

<Avatar name="Amina Wanjiru" size="sm" />
<Avatar name="Brian Otieno" />
<Avatar name="Dennis Ndung'u" size="lg" colourful />`,
      },
    ],
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    description: "Chevron-separated navigation trail; last item is the current page.",
    category: "Navigation",
    sourcePath: "src/components/ui/breadcrumb.tsx",
    exports: ["Breadcrumb", "BreadcrumbItem"],
    spec: {
      purpose:
        "Renders a chevron-separated navigation trail where the final item marks the current page.",
      props: [
        { name: "items", type: "BreadcrumbItem[]", required: true, description: "Ordered trail of crumbs; the last item is rendered as the current page (aria-current)." },
        { name: "BreadcrumbItem.label", type: "string", required: true, description: "Visible text for a crumb." },
        { name: "BreadcrumbItem.href", type: "string", description: "Link target for the crumb; omit on the final (current) item." },
      ],
    },
    examples: [
      {
        title: "Trail",
        node: <BreadcrumbDemo />,
        code: `import { Breadcrumb } from "@/components/ui";

<Breadcrumb items={[
  { label: "Home", href: "/" },
  { label: "Users", href: "/users" },
  { label: "Amina Wanjiru" },
]} />`,
      },
    ],
  },
  {
    slug: "page-header",
    name: "PageHeader",
    description: "Consistent H1 + description + actions row above page content.",
    category: "Layout",
    sourcePath: "src/components/ui/page-header.tsx",
    exports: ["PageHeader"],
    spec: {
      purpose:
        "Provides a consistent page heading row with an H1 title, optional description and right-aligned actions.",
      props: [
        { name: "title", type: "ReactNode", required: true, description: "Primary page title rendered as an H1." },
        { name: "description", type: "ReactNode", description: "Optional supporting text shown beneath the title." },
        { name: "actions", type: "ReactNode", description: "Right-aligned action controls, typically buttons." },
      ],
    },
    examples: [
      {
        title: "Title, description, actions",
        node: <PageHeaderDemo />,
        code: `import { PageHeader, Button } from "@/components/ui";
import { Plus } from "lucide-react";

<PageHeader
  title="Users"
  description="People with access to this organisation."
  actions={<Button icon={Plus}>Add user</Button>}
/>`,
      },
    ],
  },
  {
    slug: "blank",
    name: "Blank",
    description: "Designed empty/error state for tables and lists, with optional actions.",
    category: "Feedback",
    sourcePath: "src/components/ui/blank.tsx",
    exports: ["Blank"],
    spec: {
      purpose:
        "Renders a designed empty or error state inside tables and lists, with an optional action button and mono detail line.",
      props: [
        { name: "icon", type: "LucideIcon", description: "Optional icon shown above the title, colored by tone." },
        { name: "title", type: "string", required: true, description: "Short heading describing the empty or error state." },
        { name: "body", type: "string", required: true, description: "Explanatory text below the title." },
        { name: "action", type: "string", description: "Label for an optional primary action button." },
        { name: "onAction", type: "() => void", description: "Handler invoked when the action button is clicked." },
        { name: "mono", type: "string", description: "Optional monospace detail line (e.g. an error code) shown at the bottom." },
        { name: "tone", type: '"rose" | "amber" | "neutral"', default: '"neutral"', description: "Colors the icon to signal the nature of the state." },
      ],
    },
    examples: [
      {
        title: "Empty state",
        node: <BlankDemo />,
        code: `import { Blank } from "@/components/ui";
import { Users } from "lucide-react";

<Blank
  icon={Users}
  title="No users yet"
  body="Invite your first teammate to get started."
  primary="Invite user"
/>`,
      },
    ],
  },
  {
    slug: "skeleton-rows",
    name: "SkeletonRows",
    description: "Animated placeholder rows for loading tables.",
    category: "Feedback",
    sourcePath: "src/components/ui/skeleton-rows.tsx",
    exports: ["SkeletonRows"],
    spec: {
      purpose:
        "Renders animated placeholder table rows while a table's data loads.",
      props: [
        { name: "n", type: "number", default: "8", description: "Number of skeleton rows to render." },
        { name: "colCount", type: "number", default: "3", description: "Number of extra placeholder columns rendered after the leading avatar/text columns." },
      ],
    },
    examples: [
      {
        title: "Loading table",
        node: <SkeletonRowsDemo />,
        code: `import { SkeletonRows } from "@/components/ui";

<table>
  <tbody>
    <SkeletonRows n={4} colCount={2} />
  </tbody>
</table>`,
      },
    ],
  },
  {
    slug: "exception-strip",
    name: "ExceptionStrip",
    description: "Single-line compact stat bar for dense table headers.",
    category: "Data Display",
    sourcePath: "src/components/ui/exception-strip.tsx",
    exports: ["ExceptionStrip"],
    spec: {
      purpose:
        "Shows a compact single-line row of labelled metrics for dense table headers, with loading, errored and as-of states.",
      props: [
        { name: "items", type: "{ label: string; value: string; tone?: \"pine\" | \"amber\" | \"neutral\" }[]", required: true, description: "The metrics to display; each has a label, value and optional tone." },
        { name: "loading", type: "boolean", description: "Shows shimmering placeholders in place of values." },
        { name: "errored", type: "boolean", description: "Shows a dash for each value to signal a load failure." },
        { name: "asOf", type: "string", description: "Optional timestamp text shown at the end (e.g. \"09:24\")." },
      ],
    },
    examples: [
      {
        title: "Compact metrics",
        node: <ExceptionStripDemo />,
        code: `import { ExceptionStrip } from "@/components/ui";

<ExceptionStrip
  items={[
    { label: "Overdue", value: "12", tone: "amber" },
    { label: "Rejected", value: "3", tone: "pine" },
    { label: "Total", value: "1,284" },
  ]}
  asOf="09:24"
/>`,
      },
    ],
  },
  {
    slug: "sort-header",
    name: "SortHeader",
    description: "Sortable table column header with direction indicator and hover affordance.",
    category: "Data Display",
    sourcePath: "src/components/ui/sort-header.tsx",
    exports: ["SortHeader"],
    spec: {
      purpose:
        "Renders a sortable table column header (a <th>) with a direction indicator and a hover affordance.",
      props: [
        { name: "label", type: "string", required: true, description: "The column heading text." },
        { name: "state", type: '"asc" | "desc" | "none"', required: true, description: "Current sort direction for this column." },
        { name: "onClick", type: "() => void", required: true, description: "Called when the header is clicked to cycle the sort." },
        { name: "style", type: "CSSProperties", description: "Inline styles applied to the <th> (e.g. a fixed width)." },
        { name: "className", type: "string", description: "Extra classes merged onto the <th>." },
      ],
    },
    examples: [
      {
        title: "Sortable columns",
        node: <SortHeaderDemo />,
        code: `import { SortHeader } from "@/components/ui";

<thead>
  <tr>
    <SortHeader label="Name" state={sort} onClick={cycle} />
    <SortHeader label="Role" state="none" onClick={() => {}} />
  </tr>
</thead>`,
      },
    ],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    description: "Auto-flipping dark tooltip that wraps any element, shown on hover and focus.",
    category: "Overlays",
    sourcePath: "src/components/ui/tooltip.tsx",
    exports: ["Tooltip", "TooltipProps"],
    requires: [
      "src/lib/utils.ts",
      "src/hooks/use-popover-position.ts",
      "src/hooks/use-mounted.ts",
    ],
    spec: {
      purpose:
        "Wraps any element and shows an auto-flipping dark tooltip on hover and keyboard focus.",
      props: [
        { name: "content", type: "ReactNode", required: true, description: "The tooltip content shown on hover/focus." },
        { name: "children", type: "ReactElement", required: true, description: "The single element that anchors and triggers the tooltip." },
        { name: "delayMs", type: "number", default: "400", description: "Delay before the tooltip appears after hover/focus, in milliseconds." },
      ],
    },
    examples: [
      {
        title: "On a button",
        node: <TooltipDemo />,
        center: true,
        code: `import { Tooltip, Button } from "@/components/ui";
import { Trash2 } from "lucide-react";

<Tooltip content="Remove this item">
  <Button variant="secondary" icon={Trash2}>Hover me</Button>
</Tooltip>`,
      },
    ],
  },
  {
    slug: "pagination",
    name: "Pagination",
    description: "Two-zone pagination with rows-per-page, numbered pages and go-to-page.",
    category: "Navigation",
    sourcePath: "src/components/ui/pagination.tsx",
    exports: ["Pagination", "PaginationProps", "PaginationMeta"],
    spec: {
      purpose:
        "Provides two-zone pagination with a rows-per-page selector, numbered pages and a go-to-page input; supply either a meta object or the individual page/pages/perPage/total props.",
      props: [
        { name: "meta", type: "PaginationMeta", description: "Bundled pagination state (page, perPage, totalItems, totalPages, from, to); overrides the individual props when provided." },
        { name: "page", type: "number", default: "1", description: "Current 1-based page number (used when meta is omitted)." },
        { name: "pages", type: "number", default: "1", description: "Total number of pages (used when meta is omitted)." },
        { name: "perPage", type: "number", default: "25", description: "Rows shown per page (used when meta is omitted)." },
        { name: "total", type: "number", default: "0", description: "Total number of items across all pages (used when meta is omitted)." },
        { name: "onPageChange", type: "(page: number) => void", required: true, description: "Called with the requested page number." },
        { name: "onPerPageChange", type: "(perPage: number) => void", required: true, description: "Called with the newly selected rows-per-page value." },
        { name: "perPageOptions", type: "number[]", default: "[10, 25, 50, 100]", description: "Options offered in the rows-per-page selector." },
        { name: "disabled", type: "boolean", description: "Dims and disables the pager, e.g. while loading." },
        { name: "className", type: "string", description: "Extra classes merged onto the container." },
      ],
    },
    examples: [
      {
        title: "Full pager",
        node: <PaginationDemo />,
        code: `import { Pagination } from "@/components/ui";

<Pagination
  page={page}
  pages={52}
  perPage={perPage}
  total={1284}
  onPageChange={setPage}
  onPerPageChange={setPerPage}
/>`,
      },
    ],
  },
  {
    slug: "menu",
    name: "Menu",
    description: "Portalled dropdown menu with items, checkbox items, separators and labels.",
    category: "Overlays",
    sourcePath: "src/components/ui/menu.tsx",
    exports: ["Menu", "MenuTrigger", "MenuContent", "MenuItem", "MenuCheckboxItem", "MenuSeparator", "MenuLabel"],
    requires: [
      "src/lib/utils.ts",
      "src/hooks/use-popover-position.ts",
      "src/hooks/use-mounted.ts",
    ],
    spec: {
      purpose:
        "A portalled dropdown menu composed of a trigger and content containing items, checkbox items, separators and labels.",
      props: [
        { name: "open", type: "boolean", required: true, description: "Controls whether the menu content is shown (Menu)." },
        { name: "onOpenChange", type: "(open: boolean) => void", required: true, description: "Called when the menu requests to open or close (Menu)." },
        { name: "children", type: "ReactNode", required: true, description: "The MenuTrigger and MenuContent subtree (Menu)." },
        { name: "MenuContent.align", type: '"start" | "end" | "center"', default: '"start"', description: "Horizontal alignment of the content relative to the trigger." },
        { name: "MenuContent.minWidth", type: "number", default: "180", description: "Minimum width in pixels for the menu content." },
        { name: "MenuItem.icon", type: "ReactNode", description: "Optional leading icon for a menu item." },
        { name: "MenuItem.destructive", type: "boolean", description: "Styles the item as a destructive action." },
        { name: "MenuItem.disabled", type: "boolean", description: "Disables the item and skips it during keyboard navigation." },
        { name: "MenuItem.onSelect", type: "() => void", description: "Called when the item is chosen." },
        { name: "MenuCheckboxItem.checked", type: "boolean", required: true, description: "Current checked state of the checkbox item." },
        { name: "MenuCheckboxItem.onCheckedChange", type: "(checked: boolean) => void", required: true, description: "Called with the next checked state when toggled." },
        { name: "MenuCheckboxItem.locked", type: "boolean", description: "Prevents the checkbox item from being toggled." },
      ],
    },
    examples: [
      {
        title: "Actions menu",
        node: <MenuDemo />,
        code: `import { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator, MenuLabel, Button } from "@/components/ui";
import { MoreHorizontal, Edit, Home, Trash2 } from "lucide-react";

<Menu open={open} onOpenChange={setOpen}>
  <MenuTrigger><Button variant="secondary" icon={MoreHorizontal}>Actions</Button></MenuTrigger>
  <MenuContent align="start">
    <MenuLabel>Manage</MenuLabel>
    <MenuItem icon={<Edit size={15} />} onSelect={editItem}>Edit</MenuItem>
    <MenuSeparator />
    <MenuItem icon={<Trash2 size={15} />} destructive onSelect={deleteItem}>Delete</MenuItem>
  </MenuContent>
</Menu>`,
      },
    ],
  },
  {
    slug: "date-range-picker",
    name: "DateRangePicker",
    description: "Two-month range calendar with presets, night count and apply/clear.",
    category: "Forms",
    sourcePath: "src/components/ui/date-range-picker.tsx",
    exports: ["DateRangePicker"],
    dependsOn: ["date-picker", "button"],
    requires: [
      "src/components/ui/field.tsx",
      "src/lib/utils.ts",
      "src/hooks/use-popover-position.ts",
      "src/hooks/use-mounted.ts",
    ],
    spec: {
      purpose:
        "Selects a start/end date range from a two-month calendar with quick presets, a night/day count and apply/clear actions.",
      props: [
        { name: "id", type: "string", description: "Explicit element id, wired to the label." },
        { name: "label", type: "string", description: "Visible field label shown above the trigger." },
        { name: "hint", type: "string", description: "Helper text shown below the field." },
        { name: "value", type: "[Date, Date] | null", required: true, description: "Controlled [start, end] range; null when unset." },
        { name: "onChange", type: "(range: [Date, Date]) => void", required: true, description: "Called with the applied [start, end] range." },
      ],
    },
    examples: [
      {
        title: "Range with presets",
        node: <DateRangeDemo />,
        code: `import { DateRangePicker } from "@/components/ui";

<DateRangePicker label="Reporting period" value={range} onChange={setRange} />`,
      },
    ],
  },
  {
    slug: "back-button",
    name: "BackButton",
    description: "Discoverable bordered back-navigation pill with an adequate touch target.",
    category: "Navigation",
    sourcePath: "src/components/ui/back-button.tsx",
    exports: ["BackButton"],
    requires: ["src/lib/utils.ts"],
    spec: {
      purpose:
        "A discoverable bordered pill that links back to a previous page with an adequate touch target.",
      props: [
        { name: "href", type: "string", required: true, description: "Destination the back link navigates to." },
        { name: "label", type: "string", required: true, description: "Visible text describing where the link goes." },
        { name: "className", type: "string", description: "Additional CSS classes merged onto the link." },
      ],
    },
    examples: [
      {
        title: "Basic",
        node: <BackButtonDemo />,
        code: `import { BackButton } from "@/components/ui";

<BackButton href="/users" label="Back to users" />`,
      },
    ],
  },
  {
    slug: "table-of-contents",
    name: "TableOfContents",
    description: "In-page scroll-spy contents list that highlights the section currently in view.",
    category: "Navigation",
    sourcePath: "src/components/ui/table-of-contents.tsx",
    exports: ["TableOfContents", "TocItem"],
    requires: ["src/lib/utils.ts"],
    spec: {
      purpose:
        "An in-page scroll-spy contents list that highlights the section currently in the viewport and smooth-scrolls to sections on click.",
      props: [
        { name: "items", type: "TocItem[]", required: true, description: "Sections to list; each id must match an element id in the page." },
        { name: "title", type: "string", default: '"On this page"', description: "Heading label shown above the list (also used as the nav aria-label)." },
        { name: "className", type: "string", description: "Additional CSS classes merged onto the nav." },
        { name: "TocItem.id", type: "string", required: true, description: "Id of the target section element to observe and scroll to." },
        { name: "TocItem.label", type: "string", required: true, description: "Visible link text for the section." },
        { name: "TocItem.level", type: "2 | 3", description: "Heading depth used to indent nested (level 3) items." },
      ],
    },
    examples: [
      {
        title: "Scroll-spy",
        node: <TableOfContentsDemo />,
        code: `import { TableOfContents } from "@/components/ui";

const items = [
  { id: "overview", label: "Overview", level: 2 },
  { id: "usage", label: "Usage", level: 2 },
  { id: "props", label: "Props", level: 3 },
  { id: "a11y", label: "Accessibility", level: 2 },
];

<TableOfContents items={items} />`,
      },
    ],
  },
  {
    slug: "command-palette",
    name: "CommandPalette",
    description: "Generic ⌘K overlay: filter items by title/subtitle/keywords and act on selection.",
    category: "Overlays",
    sourcePath: "src/components/ui/command-palette.tsx",
    exports: ["CommandPalette", "useCommandPalette", "CommandItem"],
    requires: ["src/lib/utils.ts", "src/hooks/use-mounted.ts"],
    spec: {
      purpose:
        "A generic ⌘K overlay that filters a list of items by title, subtitle, tag or keywords and invokes a handler on selection.",
      props: [
        { name: "open", type: "boolean", required: true, description: "Controls whether the palette overlay is shown." },
        { name: "onClose", type: "() => void", required: true, description: "Called when the palette should close (Esc, backdrop, or after a selection)." },
        { name: "items", type: "CommandItem[]", required: true, description: "Commands to search and display." },
        { name: "onSelect", type: "(id: string) => void", required: true, description: "Called with the chosen item's id." },
        { name: "placeholder", type: "string", default: '"Search, or type a command…"', description: "Placeholder text for the search input." },
        { name: "emptyHeading", type: "string", default: '"Suggestions"', description: "Section heading shown above results before the user types." },
        { name: "CommandItem.id", type: "string", required: true, description: "Stable identifier passed to onSelect." },
        { name: "CommandItem.title", type: "string", required: true, description: "Primary label for the command." },
        { name: "CommandItem.subtitle", type: "string", description: "Secondary descriptive text." },
        { name: "CommandItem.tag", type: "string", description: "Short category tag shown alongside the item." },
        { name: "CommandItem.icon", type: "ReactNode", description: "Optional leading icon." },
        { name: "CommandItem.keywords", type: "string", description: "Extra searchable terms not shown in the UI." },
      ],
    },
    examples: [
      {
        title: "⌘K launcher",
        center: true,
        node: <CommandPaletteDemo />,
        code: `import { CommandPalette, useCommandPalette, Button } from "@/components/ui";

const { isOpen, openPalette, closePalette } = useCommandPalette();

const items = [
  { id: "users", title: "Users", subtitle: "Manage team members", tag: "page" },
  { id: "invoices", title: "Invoices", subtitle: "Billing & payments", tag: "page" },
  { id: "new-user", title: "Invite user", subtitle: "Send an invitation", tag: "action" },
];

<Button variant="secondary" onClick={openPalette}>Open (⌘K)</Button>

<CommandPalette
  open={isOpen}
  onClose={closePalette}
  items={items}
  onSelect={(id) => router.push(\`/\${id}\`)}
/>`,
      },
    ],
  },
  {
    slug: "dialog",
    name: "Dialog",
    description: "Generic modal with header/body/footer, focus trap, Esc + backdrop close, and a portal.",
    category: "Overlays",
    sourcePath: "src/components/ui/dialog.tsx",
    exports: ["Dialog"],
    dependsOn: ["button", "input"],
    requires: ["src/lib/utils.ts", "src/hooks/use-mounted.ts", "src/hooks/use-focus-trap.ts"],
    spec: {
      purpose:
        "A generic portalled modal with optional header/body/footer, focus trapping, and Esc + backdrop dismissal.",
      props: [
        { name: "open", type: "boolean", required: true, description: "Controls whether the dialog is rendered." },
        { name: "onClose", type: "() => void", required: true, description: "Called when the dialog requests to close (Esc, backdrop, or close button)." },
        { name: "title", type: "ReactNode", description: "Optional heading; also wires up aria-labelledby." },
        { name: "description", type: "ReactNode", description: "Optional supporting text; also wires up aria-describedby." },
        { name: "footer", type: "ReactNode", description: "Footer content, typically action buttons." },
        { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Maximum width of the dialog panel." },
        { name: "closeOnBackdrop", type: "boolean", default: "true", description: "Whether clicking the backdrop closes the dialog." },
        { name: "children", type: "ReactNode", description: "Main body content of the dialog." },
      ],
    },
    examples: [
      {
        title: "With form + actions",
        node: <DialogDemo />,
        code: `import { Dialog, Button, Input } from "@/components/ui";

<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Invite a teammate"
  description="They'll receive an email with a link to join."
  footer={<>
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
    <Button onClick={() => setOpen(false)}>Send invite</Button>
  </>}
>
  <Input label="Email address" type="email" placeholder="teammate@company.com" />
</Dialog>`,
      },
    ],
  },
  {
    slug: "drawer",
    name: "Drawer",
    description: "Slide-in panel anchored right/left/bottom for filters, detail views or forms.",
    category: "Overlays",
    sourcePath: "src/components/ui/drawer.tsx",
    exports: ["Drawer"],
    dependsOn: ["button"],
    requires: ["src/lib/utils.ts", "src/hooks/use-mounted.ts", "src/hooks/use-focus-trap.ts"],
    spec: {
      purpose:
        "A slide-in panel anchored to the right, left or bottom for filters, detail views or forms, with focus trapping and backdrop dismissal.",
      props: [
        { name: "open", type: "boolean", required: true, description: "Controls whether the drawer is rendered." },
        { name: "onClose", type: "() => void", required: true, description: "Called when the drawer requests to close (Esc, backdrop, or close button)." },
        { name: "side", type: '"right" | "left" | "bottom"', default: '"right"', description: "Edge the drawer slides in from." },
        { name: "title", type: "ReactNode", description: "Optional heading; also wires up aria-labelledby." },
        { name: "footer", type: "ReactNode", description: "Footer content, typically action buttons." },
        { name: "closeOnBackdrop", type: "boolean", default: "true", description: "Whether clicking the backdrop closes the drawer." },
        { name: "children", type: "ReactNode", description: "Main body content of the drawer." },
      ],
    },
    examples: [
      {
        title: "Right sheet",
        node: <DrawerDemo />,
        code: `import { Drawer, Button } from "@/components/ui";

<Drawer open={open} onClose={() => setOpen(false)} side="right" title="Filters"
  footer={<Button onClick={() => setOpen(false)}>Apply</Button>}>
  {/* filter controls */}
</Drawer>`,
      },
    ],
  },
  {
    slug: "select",
    name: "Select",
    description: "Single-select dropdown built on Field, with keyboard navigation.",
    category: "Forms",
    sourcePath: "src/components/ui/select.tsx",
    exports: ["Select", "SelectOption"],
    requires: [
      "src/components/ui/field.tsx",
      "src/lib/utils.ts",
      "src/hooks/use-popover-position.ts",
      "src/hooks/use-mounted.ts",
    ],
    spec: {
      purpose:
        "Selects one option from a short, fixed list via a keyboard-navigable dropdown built on Field.",
      props: [
        { name: "id", type: "string", description: "Explicit element id, wired to the label." },
        { name: "label", type: "string", description: "Visible field label shown above the control." },
        { name: "hint", type: "string", description: "Helper text shown below the field when there is no error." },
        { name: "error", type: "string", description: "Error message; renders the field in the error state." },
        { name: "disabled", type: "boolean", description: "Disables the select." },
        { name: "options", type: "SelectOption[]", required: true, description: "Options to choose from; each has value, label and optional disabled." },
        { name: "value", type: "string | null", required: true, description: "The value of the currently selected option, or null." },
        { name: "onChange", type: "(value: string) => void", required: true, description: "Called with the selected option's value." },
        { name: "placeholder", type: "string", default: '"Select…"', description: "Text shown when no option is selected." },
      ],
    },
    examples: [
      {
        title: "Roles",
        node: <SelectDemo />,
        code: `import { Select, type SelectOption } from "@/components/ui";

const options: SelectOption[] = [
  { value: "owner", label: "Owner" },
  { value: "approver", label: "Approver" },
  { value: "viewer", label: "Viewer", disabled: true },
];

<Select label="Role" options={options} value={value} onChange={setValue} placeholder="Select a role…" />`,
      },
    ],
  },
  {
    slug: "radio-group",
    name: "RadioGroup",
    description: "Accessible radio fieldset with a simple list and a card variant.",
    category: "Forms",
    sourcePath: "src/components/ui/radio-group.tsx",
    exports: ["RadioGroup", "RadioOption"],
    requires: ["src/lib/utils.ts"],
    spec: {
      purpose:
        "Selects exactly one option from a small mutually-exclusive set, as a simple list or as selectable cards.",
      props: [
        { name: "name", type: "string", required: true, description: "Radio group name shared by all inputs so only one can be selected." },
        { name: "label", type: "string", description: "Optional fieldset legend shown above the options." },
        { name: "options", type: "RadioOption[]", required: true, description: "Options to render; each has value, label and optional description and disabled." },
        { name: "value", type: "string | null", required: true, description: "The value of the currently selected option, or null." },
        { name: "onChange", type: "(value: string) => void", required: true, description: "Called with the selected option's value." },
        { name: "variant", type: '"list" | "card"', default: '"list"', description: "Renders a compact radio list or larger selectable cards with descriptions." },
        { name: "disabled", type: "boolean", description: "Disables the whole group." },
      ],
    },
    examples: [
      {
        title: "List & cards",
        node: <RadioGroupDemo />,
        code: `import { RadioGroup } from "@/components/ui";

<RadioGroup name="size" label="Size" value={size} onChange={setSize}
  options={[{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }]} />

<RadioGroup name="plan" label="Plan" variant="card" value={plan} onChange={setPlan}
  options={[{ value: "pro", label: "Pro", description: "For growing teams." }]} />`,
      },
    ],
  },
  {
    slug: "data-table",
    name: "DataTable",
    description: "Column-driven table composing SortHeader, SkeletonRows, Pagination and an empty state.",
    category: "Data Display",
    sourcePath: "src/components/ui/data-table.tsx",
    exports: ["DataTable", "DataTableColumn"],
    dependsOn: ["sort-header", "skeleton-rows", "pagination", "blank"],
    requires: ["src/lib/utils.ts"],
    spec: {
      purpose:
        "Renders a column-driven data table that composes SortHeader, SkeletonRows, Pagination and an empty state, with per-row status styling.",
      props: [
        { name: "columns", type: "DataTableColumn<T>[]", required: true, description: "Column definitions (key, header, cell renderer and optional sortable/align/numeric/width/className)." },
        { name: "rows", type: "T[]", required: true, description: "The row data to render." },
        { name: "rowKey", type: "(row: T) => string", required: true, description: "Returns a stable unique key for each row." },
        { name: "loading", type: "boolean", description: "Shows skeleton rows and a top progress bar while data loads." },
        { name: "sort", type: "{ key: string; dir: \"asc\" | \"desc\" | \"none\" }", description: "Current sort column and direction." },
        { name: "onSortChange", type: "(key: string) => void", description: "Called with a column key when a sortable header is clicked." },
        { name: "empty", type: "{ title: string; body: string }", description: "Custom title/body for the empty state when there are no rows." },
        { name: "pagination", type: "PaginationProps", description: "When provided, renders a Pagination footer with these props." },
        { name: "onRowClick", type: "(row: T) => void", description: "Makes rows clickable; called with the clicked row." },
        { name: "rowStatus", type: '(row: T) => "default" | "selected" | "error" | "pending"', description: "Returns a per-row status that drives its background and accent bar." },
        { name: "zebra", type: "boolean", description: "Applies alternating row backgrounds for readability." },
        { name: "title", type: "string", description: "Optional table title shown in the header bar." },
        { name: "subtitle", type: "string", description: "Optional subtitle (e.g. a count) shown under the title." },
        { name: "caption", type: "string", description: "Screen-reader-only <caption> describing the table." },
      ],
    },
    examples: [
      {
        title: "Sortable columns",
        node: <DataTableDemo />,
        code: `import { DataTable, type DataTableColumn, Badge } from "@/components/ui";

const columns: DataTableColumn<Row>[] = [
  { key: "name", header: "Name", sortable: true, cell: (r) => r.name },
  { key: "role", header: "Role", cell: (r) => r.role },
  { key: "status", header: "Status", cell: (r) => <Badge tone="pine">{r.status}</Badge> },
  { key: "balance", header: "Balance", numeric: true, cell: (r) => \`KES \${r.balance.toLocaleString()}\` },
];

<DataTable
  title="Team members"
  subtitle="3 of 3"
  columns={columns}
  rows={rows}
  rowKey={(r) => r.id}
  sort={sort}
  onSortChange={cycle}
  zebra
  rowStatus={(r) => (r.invited ? "pending" : r.selected ? "selected" : "default")}
/>`,
      },
    ],
  },
  {
    slug: "alert",
    name: "Alert",
    description: "Static inline message block with tones + icon (icon paired with colour, never colour alone).",
    category: "Feedback",
    sourcePath: "src/components/ui/alert.tsx",
    exports: ["Alert"],
    requires: ["src/lib/utils.ts"],
    spec: {
      purpose:
        "Displays a static, inline callout with a tone, icon and optional title, dismiss button and action.",
      props: [
        { name: "tone", type: '"info" | "success" | "warning" | "error"', default: '"info"', description: "Sets the icon, colors and ARIA role (error uses role=\"alert\")." },
        { name: "title", type: "ReactNode", description: "Optional bold heading shown above the body." },
        { name: "children", type: "ReactNode", description: "The alert body message." },
        { name: "dismissible", type: "boolean", description: "Shows a close button that hides the alert." },
        { name: "onDismiss", type: "() => void", description: "Called after the user dismisses the alert." },
        { name: "action", type: "ReactNode", description: "Optional action element (e.g. a button) rendered below the body." },
      ],
    },
    examples: [
      {
        title: "Tones",
        node: <AlertDemo />,
        code: `import { Alert } from "@/components/ui";

<Alert tone="info" title="Heads up">This is an informational callout.</Alert>
<Alert tone="success" title="Saved">Your changes have been saved.</Alert>
<Alert tone="error" title="Payment failed" dismissible>We couldn't process your card.</Alert>`,
      },
    ],
  },
  {
    slug: "progress",
    name: "Progress",
    description: "Linear progress bar — determinate (0–100) or indeterminate loop.",
    category: "Feedback",
    sourcePath: "src/components/ui/progress.tsx",
    exports: ["Progress"],
    requires: ["src/lib/utils.ts"],
    spec: {
      purpose:
        "Shows a linear progress bar — determinate for a known 0–100 value, or an indeterminate loop when the value is null.",
      props: [
        { name: "value", type: "number | null", description: "Completion percentage (0–100); pass null or omit for an indeterminate loop." },
        { name: "tone", type: '"accent" | "warning" | "error"', default: '"accent"', description: "Colors the progress fill." },
        { name: "showValue", type: "boolean", description: "Displays the rounded percentage beside the label (determinate only)." },
        { name: "label", type: "string", description: "Text label shown above the bar and used as its aria-label." },
        { name: "className", type: "string", description: "Extra classes merged onto the wrapper." },
      ],
    },
    examples: [
      {
        title: "Determinate & indeterminate",
        node: <ProgressDemo />,
        code: `import { Progress } from "@/components/ui";

<Progress value={68} label="Upload" showValue />
<Progress value={30} tone="warning" />
<Progress value={null} label="Processing…" />`,
      },
    ],
  },
  {
    slug: "accordion",
    name: "Accordion",
    description: "Expandable sections; single-open by default or multiple.",
    category: "Layout",
    sourcePath: "src/components/ui/accordion.tsx",
    exports: ["Accordion", "AccordionItem"],
    requires: ["src/lib/utils.ts"],
    spec: {
      purpose:
        "Shows a list of expandable sections, single-open by default or multiple-open, with keyboard-accessible triggers.",
      props: [
        { name: "items", type: "AccordionItem[]", required: true, description: "Sections to render; each has an id, title and content." },
        { name: "multiple", type: "boolean", default: "false", description: "Allows more than one section to be open at once." },
        { name: "defaultOpen", type: "string[]", default: "[]", description: "Ids of the sections open on first render." },
      ],
    },
    examples: [
      {
        title: "FAQ",
        node: <AccordionDemo />,
        code: `import { Accordion } from "@/components/ui";

<Accordion
  defaultOpen={["a"]}
  items={[
    { id: "a", title: "What is included?", content: "Everything in the free tier plus support." },
    { id: "b", title: "Can I cancel anytime?", content: "Yes — cancel from settings." },
  ]}
/>`,
      },
    ],
  },
  {
    slug: "slider",
    name: "Slider",
    description: "Range input styled to the tokens, with an optional value label and formatter.",
    category: "Forms",
    sourcePath: "src/components/ui/slider.tsx",
    exports: ["Slider"],
    requires: ["src/lib/utils.ts"],
    spec: {
      purpose:
        "Selects a numeric value from a continuous range, with an optional live value label and custom formatter.",
      props: [
        { name: "label", type: "string", description: "Visible label shown above the track and used as the aria-label." },
        { name: "value", type: "number", required: true, description: "Controlled current value." },
        { name: "onChange", type: "(value: number) => void", required: true, description: "Called with the new value as the slider moves." },
        { name: "min", type: "number", default: "0", description: "Minimum selectable value." },
        { name: "max", type: "number", default: "100", description: "Maximum selectable value." },
        { name: "step", type: "number", default: "1", description: "Increment between selectable values." },
        { name: "disabled", type: "boolean", description: "Disables the slider." },
        { name: "showValue", type: "boolean", description: "Displays the current value beside the label." },
        { name: "format", type: "(value: number) => string", default: "String(v)", description: "Formats the displayed value (e.g. append a % or unit)." },
        { name: "className", type: "string", description: "Extra classes merged onto the wrapper." },
      ],
    },
    examples: [
      {
        title: "Volume & threshold",
        node: <SliderDemo />,
        code: `import { Slider } from "@/components/ui";

<Slider label="Volume" value={vol} onChange={setVol} showValue format={(v) => \`\${v}%\`} />
<Slider label="Threshold" value={threshold} onChange={setThreshold} min={0} max={50} showValue />`,
      },
    ],
  },
  {
    slug: "empty-state",
    name: "EmptyState",
    description: "General page-level empty/zero state with icon, title, body and actions.",
    category: "Feedback",
    sourcePath: "src/components/ui/empty-state.tsx",
    exports: ["EmptyState"],
    dependsOn: ["button"],
    requires: ["src/lib/utils.ts"],
    spec: {
      purpose:
        "Fills a page-level zero state with an icon, title, explanatory body and optional actions.",
      props: [
        { name: "icon", type: "LucideIcon", description: "Optional icon shown in a circle above the title." },
        { name: "title", type: "string", required: true, description: "Short heading describing the empty state." },
        { name: "body", type: "string", description: "Explanatory text guiding the user on what to do next." },
        { name: "actions", type: "ReactNode", description: "Optional action buttons rendered below the body." },
        { name: "compact", type: "boolean", description: "Reduces vertical padding for tighter contexts." },
        { name: "className", type: "string", description: "Extra classes merged onto the container." },
      ],
    },
    examples: [
      {
        title: "Zero state",
        node: <EmptyStateDemo />,
        code: `import { EmptyState } from "@/components/ui";
import { Inbox } from "lucide-react";

<EmptyState
  icon={Inbox}
  title="No messages yet"
  body="When someone sends you a message, it'll show up here."
/>`,
      },
    ],
  },
  {
    slug: "popover",
    name: "Popover",
    description: "Generic anchored floating panel — auto-positioned, outside-click + Esc to close.",
    category: "Overlays",
    sourcePath: "src/components/ui/popover.tsx",
    exports: ["Popover"],
    requires: ["src/lib/utils.ts", "src/hooks/use-popover-position.ts", "src/hooks/use-mounted.ts"],
    spec: {
      purpose:
        "A generic anchored floating panel that auto-positions relative to a trigger and closes on outside-click or Esc.",
      props: [
        { name: "open", type: "boolean", required: true, description: "Controls whether the floating panel is shown." },
        { name: "onOpenChange", type: "(open: boolean) => void", required: true, description: "Called when the popover requests to open or close." },
        { name: "trigger", type: "ReactNode", required: true, description: "Element that anchors and toggles the popover." },
        { name: "children", type: "ReactNode", required: true, description: "Content rendered inside the floating panel." },
        { name: "align", type: '"start" | "center" | "end"', default: '"start"', description: "Horizontal alignment of the panel relative to the trigger." },
        { name: "minWidth", type: "number", default: "200", description: "Minimum width in pixels for the panel." },
        { name: "matchWidth", type: "boolean", description: "When true, sizes the panel to match the trigger's width." },
        { name: "className", type: "string", description: "Additional CSS classes merged onto the panel." },
      ],
    },
    examples: [
      {
        title: "Trigger + panel",
        center: true,
        node: <PopoverDemo />,
        code: `import { Popover, Button } from "@/components/ui";

<Popover open={open} onOpenChange={setOpen} trigger={<Button variant="secondary">Open popover</Button>}>
  {/* any content: filters, a form, a small menu */}
</Popover>`,
      },
    ],
  },
  {
    slug: "separator",
    name: "Separator",
    description: "Thin divider line — horizontal, vertical, or with a centered label.",
    category: "Layout",
    sourcePath: "src/components/ui/separator.tsx",
    exports: ["Separator"],
    requires: ["src/lib/utils.ts"],
    spec: {
      purpose:
        "Draws a thin divider line — horizontal, vertical, or horizontal with a centered label.",
      props: [
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Chooses a horizontal rule or a vertical divider." },
        { name: "label", type: "string", description: "Optional centered label rendered between two horizontal rules (horizontal only)." },
        { name: "className", type: "string", description: "Extra classes merged onto the separator." },
      ],
    },
    examples: [
      {
        title: "Variants",
        node: <SeparatorDemo />,
        code: `import { Separator } from "@/components/ui";

<Separator />
<Separator label="or" />
<Separator orientation="vertical" />`,
      },
    ],
  },
  {
    slug: "kbd",
    name: "Kbd",
    description: "Keyboard shortcut key caps.",
    category: "Data Display",
    sourcePath: "src/components/ui/kbd.tsx",
    exports: ["Kbd"],
    requires: ["src/lib/utils.ts"],
    spec: {
      purpose:
        "Renders one or more keyboard shortcut key caps.",
      props: [
        { name: "keys", type: "string | string[]", required: true, description: "A single key or an array of keys to render as separate caps (e.g. [\"⌘\", \"K\"])." },
        { name: "className", type: "string", description: "Extra classes merged onto the wrapper." },
      ],
    },
    examples: [
      {
        title: "Shortcuts",
        node: <KbdDemo />,
        code: `import { Kbd } from "@/components/ui";

<Kbd keys={["⌘", "K"]} />
<Kbd keys="Esc" />`,
      },
    ],
  },
  {
    slug: "spinner",
    name: "Spinner",
    description: "Indeterminate loading indicator with an accessible status label.",
    category: "Feedback",
    sourcePath: "src/components/ui/spinner.tsx",
    exports: ["Spinner"],
    requires: ["src/lib/utils.ts"],
    spec: {
      purpose:
        "Indicates an indeterminate loading state with a spinning icon and an accessible status label.",
      props: [
        { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Icon size of the spinner." },
        { name: "label", type: "string", default: '"Loading"', description: "Screen-reader status text announced while loading." },
        { name: "className", type: "string", description: "Extra classes merged onto the wrapper." },
      ],
    },
    examples: [
      {
        title: "Sizes",
        node: <SpinnerDemo />,
        center: true,
        code: `import { Spinner } from "@/components/ui";

<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`,
      },
    ],
  },
  {
    slug: "button-group",
    name: "ButtonGroup & Toolbar",
    description: "Segmented single-choice button set, and a Toolbar container for grouped actions.",
    category: "Buttons & Actions",
    sourcePath: "src/components/ui/button-group.tsx",
    exports: ["ButtonGroup", "Toolbar", "ButtonGroupOption"],
    dependsOn: ["button", "separator"],
    requires: ["src/lib/utils.ts"],
    spec: {
      purpose:
        "Presents a segmented single-choice set of buttons; Toolbar groups related action controls in a bordered container.",
      props: [
        { name: "options", type: "ButtonGroupOption[]", required: true, description: "Segments to render; each has value, label and optional disabled (ButtonGroup)." },
        { name: "value", type: "string", required: true, description: "The value of the currently active segment (ButtonGroup)." },
        { name: "onChange", type: "(value: string) => void", required: true, description: "Called with the newly selected segment's value (ButtonGroup)." },
        { name: "aria-label", type: "string", description: "Accessible label for the group; describe what the choice controls (ButtonGroup)." },
        { name: "className", type: "string", description: "Extra classes merged onto the group container (ButtonGroup)." },
        { name: "Toolbar.children", type: "ReactNode", required: true, description: "The controls to lay out inside the toolbar (Toolbar)." },
        { name: "Toolbar.aria-label", type: "string", description: "Accessible label for the toolbar region (Toolbar)." },
        { name: "Toolbar.className", type: "string", description: "Extra classes merged onto the toolbar container (Toolbar)." },
      ],
    },
    examples: [
      {
        title: "Segmented + toolbar",
        node: <ButtonGroupDemo />,
        code: `import { ButtonGroup, Toolbar, Separator, Button } from "@/components/ui";

<ButtonGroup aria-label="View" value={view} onChange={setView}
  options={[{ value: "list", label: "List" }, { value: "grid", label: "Grid" }]} />

<Toolbar aria-label="Formatting">
  <ButtonGroup aria-label="Align" value={align} onChange={setAlign} options={aligns} />
  <Separator orientation="vertical" />
  <Button size="sm" variant="ghost" icon={Plus}>Add</Button>
</Toolbar>`,
      },
    ],
  },
  {
    slug: "chip",
    name: "Chip & TagInput",
    description: "Compact removable tokens, and a tag input that adds chips on Enter/comma.",
    category: "Forms",
    sourcePath: "src/components/ui/chip.tsx",
    exports: ["Chip", "TagInput"],
    requires: ["src/components/ui/field.tsx", "src/lib/utils.ts"],
    spec: {
      purpose:
        "Displays a compact, optionally-removable token; TagInput lets users build a list of chips by typing and pressing Enter or comma.",
      props: [
        { name: "children", type: "ReactNode", required: true, description: "The chip's content/label (Chip)." },
        { name: "onRemove", type: "() => void", description: "When provided, shows a remove (×) button and is called on click (Chip)." },
        { name: "className", type: "string", description: "Extra classes merged onto the chip (Chip)." },
        { name: "id", type: "string", description: "Explicit element id, wired to the label (TagInput)." },
        { name: "label", type: "string", description: "Visible field label shown above the input (TagInput)." },
        { name: "hint", type: "string", description: "Helper text shown below the field (TagInput)." },
        { name: "error", type: "string", description: "Error message; renders the field in the error state (TagInput)." },
        { name: "value", type: "string[]", required: true, description: "The current list of tags (TagInput)." },
        { name: "onChange", type: "(tags: string[]) => void", required: true, description: "Called with the updated tag list when tags are added or removed (TagInput)." },
        { name: "placeholder", type: "string", default: '"Add tag…"', description: "Placeholder shown when there are no tags (TagInput)." },
        { name: "disabled", type: "boolean", description: "Disables adding and removing tags (TagInput)." },
      ],
    },
    examples: [
      {
        title: "Chips + tag input",
        node: <ChipDemo />,
        code: `import { Chip, TagInput } from "@/components/ui";

<Chip onRemove={() => {}}>Removable</Chip>

<TagInput label="Tags" value={tags} onChange={setTags} hint="Enter or comma to add." />`,
      },
    ],
  },
  {
    slug: "file-upload",
    name: "FileUpload",
    description: "Single-file drag-and-drop + click picker with a type-aware preview, validation, progress and error states.",
    category: "Forms",
    sourcePath: "src/components/ui/file-upload.tsx",
    exports: ["FileUpload"],
    dependsOn: ["progress"],
    requires: ["src/lib/utils.ts", "src/lib/upload.ts", "src/components/ui/field.tsx"],
    spec: {
      source: "mathesis ui-component/file-upload",
      purpose:
        "Lets a user attach one file by drag-and-drop or click. Shows accepted types and max size upfront, validates on select, and previews the file (image thumbnail or type icon + name/size). Presentational — wire the upload via onSelect and drive status/progress.",
      props: [
        { name: "value", type: "File | null", description: "The selected file (controlled). Pass null for empty." },
        { name: "onSelect", type: "(file: File | null) => void", description: "Called with a valid file, or null when removed." },
        { name: "onError", type: "(message: string) => void", description: "Called when a dropped/picked file fails validation." },
        { name: "accept", type: "string", description: "Accepted types — extensions, MIME types, or wildcards (e.g. .pdf,image/*). Shown as a constraint and enforced." },
        { name: "maxSize", type: "number", description: "Max size per file in bytes; shown upfront and enforced on select." },
        { name: "status", type: '"idle" | "uploading" | "complete" | "error"', default: '"idle"', description: "Upload lifecycle, driven by the parent's upload logic." },
        { name: "progress", type: "number", default: "0", description: "Upload progress 0–100 while status is \"uploading\"." },
        { name: "label", type: "string", description: "Field label shown above the zone." },
        { name: "hint", type: "string", description: "Helper text below the field." },
        { name: "error", type: "string", description: "External error (e.g. server rejection); overrides internal validation error." },
        { name: "required", type: "boolean", description: "Shows the required marker." },
        { name: "disabled", type: "boolean", description: "Disables the picker and drop zone." },
      ],
      anatomy: [
        "Drop zone: dashed border, upload icon, click/drag instruction",
        "Constraints line: accepted types + max size (13px tertiary)",
        "Preview: image thumbnail or file-type icon + name/size",
        "Progress bar while uploading; remove button when idle/complete",
      ],
      states: [
        "Idle: dashed border, grey icon",
        "Drag over: accent border + light accent background",
        "Selected: preview row replaces the zone",
        "Uploading: progress bar + percentage",
        "Complete: check icon; Error: red border + message",
      ],
      accessibility: [
        "Hidden but focusable <input type=file>",
        "Drop zone is role=button, tabindex=0, keyboard-activated (Enter/Space)",
        "Progress announced via aria-live",
        "Errors shown as text + icon, never color alone",
      ],
    },
    examples: [
      {
        title: "Single document",
        description: "Accepts PDF/Word up to 10 MB; previews the selected file.",
        node: <FileUploadDemo />,
        code: `import { FileUpload } from "@/components/ui";

const [file, setFile] = useState<File | null>(null);

<FileUpload
  label="Attach document"
  hint="PDF or Word, up to 10 MB"
  accept=".pdf,.doc,.docx"
  maxSize={10 * 1024 * 1024}
  value={file}
  onSelect={setFile}
/>`,
      },
    ],
  },
  {
    slug: "file-upload-multiple",
    name: "FileUploadMultiple",
    description: "Drag-and-drop + click picker for many files, each with a type-aware preview, per-file progress and per-file error.",
    category: "Forms",
    sourcePath: "src/components/ui/file-upload-multiple.tsx",
    exports: ["FileUploadMultiple"],
    dependsOn: ["file-upload", "progress"],
    requires: ["src/lib/utils.ts", "src/lib/upload.ts", "src/components/ui/field.tsx"],
    spec: {
      source: "mathesis ui-component/file-upload",
      purpose:
        "Uploads multiple files. Each file gets its own row with a preview, progress, and error. The drop zone stays visible so users can keep adding files. The parent owns the items list and drives per-file status/progress.",
      props: [
        { name: "items", type: "UploadItem[]", required: true, description: "Current files (controlled). Each item carries file, status, progress, error." },
        { name: "onAdd", type: "(files: File[]) => void", description: "Called with newly accepted files to append." },
        { name: "onRemove", type: "(id: string) => void", description: "Called to remove an item by id." },
        { name: "onReject", type: "(rejections: { file: File; reason: string }[]) => void", description: "Called with files that failed validation and why." },
        { name: "maxFiles", type: "number", description: "Cap on total files; extra dropped files are rejected." },
        { name: "accept", type: "string", description: "Accepted types (extensions/MIME/wildcards)." },
        { name: "maxSize", type: "number", description: "Max size per file in bytes." },
        { name: "label", type: "string", description: "Field label." },
        { name: "hint", type: "string", description: "Helper text below the field." },
        { name: "error", type: "string", description: "Field-level error." },
        { name: "disabled", type: "boolean", description: "Disables the picker and drop zone." },
      ],
      anatomy: [
        "Persistent drop zone with count (e.g. 2/5 files)",
        "One row per file: preview, name, size, per-file progress/error, remove",
      ],
      states: [
        "Idle / drag over (accent border)",
        "At limit: zone disabled once maxFiles reached",
        "Per-file: uploading (progress), complete (check), error (red row + reason)",
      ],
      accessibility: [
        "Hidden multiple <input type=file>",
        "Drop zone role=button, tabindex=0, keyboard-activated",
        "Per-file progress and errors announced via aria-live",
      ],
    },
    examples: [
      {
        title: "Multiple attachments",
        description: "Up to 5 files; each row has its own remove control.",
        node: <FileUploadMultipleDemo />,
        code: `import { FileUploadMultiple, type UploadItem } from "@/components/ui";

const [items, setItems] = useState<UploadItem[]>([]);

<FileUploadMultiple
  label="Attachments"
  accept=".pdf,.png,.jpg,.csv,.xlsx"
  maxSize={10 * 1024 * 1024}
  maxFiles={5}
  items={items}
  onAdd={(files) =>
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({ id: crypto.randomUUID(), file, status: "complete" as const })),
    ])
  }
  onRemove={(id) => setItems((prev) => prev.filter((it) => it.id !== id))}
/>`,
      },
    ],
  },
  {
    slug: "photo-upload",
    name: "PhotoUpload",
    description: "Image-only picker with a live thumbnail preview in a square, circular avatar, or wide cover frame, and an optional crop step.",
    category: "Forms",
    sourcePath: "src/components/ui/photo-upload.tsx",
    exports: ["PhotoUpload"],
    dependsOn: ["image-crop-modal"],
    requires: ["src/lib/utils.ts", "src/lib/upload.ts", "src/components/ui/field.tsx"],
    spec: {
      source: "mathesis ui-component/photo-upload",
      purpose:
        "Uploads a single image with an immediate preview. Use the avatar variant for profile photos, square for thumbnails, cover for banners. Validates image type + size, offers an optional crop step, and shows an uploading overlay.",
      props: [
        { name: "value", type: "File | null", description: "Selected image file (controlled), or null." },
        { name: "previewUrl", type: "string", description: "Existing image URL to show when there is no freshly-selected file (e.g. a saved avatar)." },
        { name: "variant", type: '"square" | "avatar" | "cover"', default: '"square"', description: "Preview frame shape." },
        { name: "onSelect", type: "(file: File | null) => void", description: "Called with a valid image (cropped, if crop is enabled), or null when removed." },
        { name: "onError", type: "(message: string) => void", description: "Called when a file fails image/size validation." },
        { name: "accept", type: "string", default: '"image/*"', description: "Accepted image types." },
        { name: "maxSize", type: "number", description: "Max size in bytes." },
        { name: "crop", type: "boolean", default: "false", description: "Enable an optional crop step after selecting an image; onSelect then receives the cropped image." },
        { name: "cropAspect", type: "number", description: "Override the crop aspect (width / height). Defaults from variant (avatar/square = 1, cover = 3)." },
        { name: "cropMinWidth", type: "number", description: "Minimum cropped width in source pixels; blocks tiny crops." },
        { name: "status", type: '"idle" | "uploading" | "complete" | "error"', default: '"idle"', description: "Upload lifecycle; shows an overlay while uploading." },
        { name: "progress", type: "number", default: "0", description: "Upload progress 0–100." },
        { name: "label", type: "string", description: "Field label." },
        { name: "hint", type: "string", description: "Helper text below the field." },
        { name: "error", type: "string", description: "External error; overrides internal validation error." },
        { name: "disabled", type: "boolean", description: "Disables the picker." },
      ],
      anatomy: [
        "Preview frame (square / circular / cover) with the image or a placeholder icon",
        "Hover overlay with a camera icon to replace",
        "Upload / Replace + Remove buttons and a constraints line",
        "Optional crop modal (canvas cropper) shown after selection when crop is enabled",
      ],
      states: [
        "Empty (placeholder icon), drag over (accent), preview (image fills frame)",
        "Cropping: crop modal open (when crop enabled)",
        "Uploading: spinner overlay; error: red frame + message",
      ],
      accessibility: [
        "Hidden <input type=file accept=image/*>",
        "Frame is role=button, tabindex=0, keyboard-activated",
        "Crop step is pointer + keyboard operable (see ImageCropModal)",
        "Uploading state announced via aria-live",
      ],
    },
    examples: [
      {
        title: "Avatar & cover, with crop",
        description: "Circular avatar and wide cover variants. Selecting an image opens the optional cropper.",
        node: <PhotoUploadDemo />,
        code: `import { PhotoUpload } from "@/components/ui";

const [avatar, setAvatar] = useState<File | null>(null);

// crop enabled — avatar locks the crop to 1:1 and previews as a circle
<PhotoUpload label="Profile photo" variant="avatar" value={avatar} onSelect={setAvatar} maxSize={5 * 1024 * 1024} crop />
<PhotoUpload label="Cover image" variant="cover" value={cover} onSelect={setCover} crop />`,
      },
    ],
  },
  {
    slug: "documents-table",
    name: "DocumentsTable",
    description: "A DataTable preset for stored files: type icon + name, type, size, uploader/date, an accessible status badge, and row actions.",
    category: "Data Display",
    sourcePath: "src/components/ui/documents-table.tsx",
    exports: ["DocumentsTable"],
    dependsOn: ["data-table"],
    requires: ["src/lib/utils.ts", "src/lib/upload.ts"],
    spec: {
      source: "mathesis ui-component/data-table",
      purpose:
        "Displays a list of documents with sensible defaults for files: a type icon + name, extension, human-readable size, uploader and date, and a status shown as icon + label (never color alone). Presentational — pass documents and wire the row callbacks.",
      props: [
        { name: "documents", type: "DocumentRow[]", required: true, description: "The files to display; each has id, name, size, optional mimeType/uploadedBy/uploadedAt/status." },
        { name: "onOpen", type: "(doc: DocumentRow) => void", description: "Row click, e.g. to open/preview the document." },
        { name: "onDownload", type: "(doc: DocumentRow) => void", description: "Download action per row; omit to hide the download button." },
        { name: "onActions", type: "(doc: DocumentRow) => void", description: "Row actions trigger; omit to hide the actions button." },
        { name: "showStatus", type: "boolean", default: "true", description: "Show the status column." },
        { name: "loading", type: "boolean", description: "Shows skeleton rows." },
        { name: "title", type: "string", description: "Table title." },
        { name: "subtitle", type: "string", description: "Table subtitle (e.g. a count)." },
        { name: "pagination", type: "PaginationProps", description: "Pagination config, forwarded to DataTable." },
        { name: "empty", type: "{ title: string; body: string }", description: "Empty-state copy when there are no documents." },
      ],
      anatomy: [
        "Columns: Name (icon + filename), Type, Size, Uploaded (date + by), Status, Actions",
        "Status: icon + label (Ready / Processing / Uploading / Failed)",
        "Row actions: download and a more-actions button",
      ],
      states: [
        "Loading (skeleton rows), empty (blank state)",
        "Per-row status conveyed by icon + text + color",
      ],
      accessibility: [
        "Status uses icon + label, not color alone",
        "Action buttons have descriptive aria-labels and stop row-click propagation",
        "Table caption for screen readers",
      ],
    },
    examples: [
      {
        title: "Documents list",
        description: "Type icons, sizes, dates, status, and per-row actions.",
        node: <DocumentsTableDemo />,
        code: `import { DocumentsTable, type DocumentRow } from "@/components/ui";

const docs: DocumentRow[] = [
  { id: "1", name: "Loan-agreement.pdf", size: 248000, uploadedBy: "Amina", uploadedAt: new Date(), status: "ready" },
  { id: "2", name: "Roster.xlsx", size: 1240000, uploadedBy: "Brian", uploadedAt: new Date(), status: "processing" },
];

<DocumentsTable
  title="Documents"
  subtitle={\`\${docs.length} files\`}
  documents={docs}
  onDownload={(d) => download(d.id)}
  onActions={(d) => openMenu(d)}
/>`,
      },
    ],
  },
  {
    slug: "document-request-list",
    name: "DocumentRequestList",
    description: "A predefined checklist of required documents with a per-row upload control, status, and preview — for onboarding / KYC flows.",
    category: "Forms",
    sourcePath: "src/components/ui/document-request-list.tsx",
    exports: ["DocumentRequestList"],
    dependsOn: ["file-upload"],
    requires: ["src/lib/utils.ts", "src/lib/upload.ts"],
    spec: {
      source: "mathesis ui-component/file-upload",
      purpose:
        "Presents a known set of documents the user must provide (e.g. KYC/onboarding), each row with its own upload button, status (Not uploaded / Uploading / Uploaded / Needs attention), and optional preview. Rows stack responsively on mobile. Presentational — the parent owns the requests and drives per-row state via callbacks.",
      props: [
        { name: "requests", type: "DocumentRequest[]", required: true, description: "The predefined documents to collect; each has id, name, optional description/required/accept/maxSize, and controlled state/file/progress/error." },
        { name: "onUpload", type: "(requestId: string, file: File) => void", description: "Called with a valid file for a row." },
        { name: "onRemove", type: "(requestId: string) => void", description: "Called to clear an uploaded file for a row." },
        { name: "onView", type: "(request: DocumentRequest) => void", description: "Called to preview an uploaded file; omit to hide the View button." },
        { name: "onError", type: "(requestId: string, message: string) => void", description: "Called when a file fails validation for a row." },
        { name: "title", type: "string", description: "Optional header title; a uploaded/total counter is always shown." },
        { name: "disabled", type: "boolean", description: "Disables all row controls." },
      ],
      anatomy: [
        "Header: title + uploaded/total counter",
        "One row per required document: name + required badge + description",
        "Uploaded file line (icon + name + size); status pill; row actions",
        "Actions: Upload, or View / Replace / Remove once uploaded",
      ],
      states: [
        "Per row: missing (Not uploaded), uploading (progress), uploaded (check), rejected (red row + reason)",
        "Responsive: label / status / actions stack on small screens",
      ],
      accessibility: [
        "Each row has its own labelled <input type=file>",
        "Status conveyed by icon + label, not color alone",
        "Progress and rejection reasons announced via aria-live",
      ],
    },
    examples: [
      {
        title: "Required documents",
        description: "A KYC-style checklist: uploaded, missing, and rejected rows.",
        node: <DocumentRequestListDemo />,
        code: `import { DocumentRequestList, type DocumentRequest } from "@/components/ui";

const [requests, setRequests] = useState<DocumentRequest[]>([
  { id: "id", name: "National ID", required: true, accept: ".pdf,image/*", state: "missing" },
  { id: "kra", name: "KRA PIN certificate", required: true, accept: ".pdf", state: "missing" },
]);

const set = (id, patch) =>
  setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

<DocumentRequestList
  title="Required documents"
  requests={requests}
  onUpload={(id, file) => set(id, { state: "uploaded", file })}
  onRemove={(id) => set(id, { state: "missing", file: null })}
  onView={(req) => preview(req.file)}
/>`,
      },
    ],
  },
  {
    slug: "document-viewer",
    name: "DocumentViewer",
    description: "Responsive, type-aware preview: images, PDFs, CSV/Excel (bordered table), Markdown & Word (formatted), JSON, text, and media — with a download fallback.",
    category: "Data Display",
    sourcePath: "src/components/ui/document-viewer.tsx",
    exports: ["DocumentViewer"],
    requires: ["src/lib/utils.ts", "src/lib/upload.ts"],
    spec: {
      source: "mathesis ui-component/document-viewer",
      purpose:
        "Previews a single document by type — image, PDF, CSV/Excel spreadsheet (a bordered table with a tinted header and row-number gutter), Markdown and Word (.docx) as formatted prose, JSON pretty-printed, plain text, and video/audio — and falls back to a download card for anything else. Works with a client File or a stored src URL and is mobile-responsive via a capped, scrollable frame. Heavy parsers (Excel, Word, Markdown) are lazy-loaded only when their type is previewed; Word/Markdown HTML is sanitized.",
      props: [
        { name: "file", type: "File | null", description: "A File to preview (client-side). Takes precedence over src." },
        { name: "src", type: "string", description: "A URL to preview (e.g. a stored document)." },
        { name: "name", type: "string", description: "File name; drives the type when previewing by src." },
        { name: "type", type: "string", description: "MIME type hint (inferred from name/File otherwise)." },
        { name: "downloadUrl", type: "string", description: "Download URL for the toolbar/fallback; defaults to src/file." },
        { name: "maxHeight", type: "number | string", default: '"min(70vh, 640px)"', description: "Caps the preview height; the frame scrolls within it (mobile-friendly)." },
        { name: "className", type: "string", description: "Extra classes on the wrapper." },
      ],
      anatomy: [
        "Toolbar: type icon + name + size + download",
        "Body (capped, scrollable): image / PDF frame / bordered spreadsheet table / formatted prose (md, docx) / text / media / fallback",
        "Spreadsheet: cell borders, tinted header (X axis) and row-number gutter (Y axis)",
      ],
      states: [
        "Loading (spinner) while content is read/parsed",
        "Rendered by type: image, PDF, CSV/Excel table, Markdown/Word prose, JSON, text, video, audio",
        "Too large (>8MB) or unsupported: file card with a download action",
      ],
      accessibility: [
        "Image has descriptive alt; PDF iframe is titled",
        "Spreadsheets render as a real <table> with row headers + sticky header",
        "Markdown/Word HTML is sanitized (DOMPurify) before rendering",
        "Video/audio use native controls; download is a real <a download>",
      ],
    },
    examples: [
      {
        title: "All document types",
        description: "Switch between an image, PDF, spreadsheet, Markdown, Word, and text — each rendered by type. Word/Markdown show as formatted prose; spreadsheets get a bordered, axis-tinted table.",
        node: <DocumentViewerDemo />,
        code: `import { DocumentViewer } from "@/components/ui";

<DocumentViewer src="/photo.jpg" name="photo.jpg" />       // image
<DocumentViewer src="/agreement.pdf" name="a.pdf" />        // PDF (frame)
<DocumentViewer file={csvOrXlsxFile} />                     // spreadsheet → table
<DocumentViewer file={markdownFile} />                      // .md → formatted
<DocumentViewer src="/contract.docx" name="contract.docx" />// Word → formatted
<DocumentViewer file={textOrJsonFile} />                    // text / JSON`,
      },
    ],
  },
  {
    slug: "image-crop-modal",
    name: "ImageCropModal",
    description: "An accessible, aspect-aware image cropper: pointer + keyboard, optional circular preview, returns the cropped image as a File.",
    category: "Overlays",
    sourcePath: "src/components/ui/image-crop-modal.tsx",
    exports: ["ImageCropModal"],
    dependsOn: ["dialog", "button"],
    requires: ["src/lib/utils.ts"],
    spec: {
      source: "mathesis ui-component/photo-upload",
      purpose:
        "Crops an image before use. Drag inside the box to reposition and drag the handle to resize; the crop can be locked to an aspect ratio and previewed as a circle. Used by PhotoUpload's optional crop step, but standalone too. Returns the cropped image as a File.",
      props: [
        { name: "open", type: "boolean", required: true, description: "Whether the modal is open." },
        { name: "imageSrc", type: "string", required: true, description: "URL/object URL of the image to crop (caller owns revoking object URLs)." },
        { name: "aspect", type: "number", description: "Lock the crop to width / height (e.g. 1 for square, 16/9). Omit for free-form." },
        { name: "circular", type: "boolean", description: "Preview the crop as a circle (avatars). Visual only." },
        { name: "minWidth", type: "number", description: "Minimum exported width in source pixels; smaller crops are blocked." },
        { name: "outputType", type: "string", default: '"image/png"', description: "Output MIME type." },
        { name: "outputName", type: "string", default: '"cropped.png"', description: "Output file name." },
        { name: "onConfirm", type: "(file: File) => void", required: true, description: "Called with the cropped image as a File." },
        { name: "onCancel", type: "() => void", required: true, description: "Called when the user cancels or dismisses the modal." },
      ],
      anatomy: [
        "Dialog with title + short instructions",
        "Canvas: image with a dimmed overlay, crop border, rule-of-thirds grid, and a resize handle",
        "Live dimension/validity readout; Cancel / Use image actions",
      ],
      states: [
        "Idle (crop centered), dragging (move), resizing (handle)",
        "Invalid: crop below minWidth — confirm disabled, reason shown",
      ],
      accessibility: [
        "Pointer Events unify mouse + touch; the canvas is a keyboard-operable slider (arrows move, Alt+arrows resize)",
        "The resize handle is a large, visible target (Fitts's Law)",
        "Dimensions + validity announced via aria-live with an icon + text (not color alone)",
      ],
    },
    examples: [
      {
        title: "Crop to a circle (1:1)",
        description: "Opens a cropper locked to 1:1 with a circular preview; returns a File.",
        center: true,
        node: <ImageCropModalDemo />,
        code: `import { ImageCropModal } from "@/components/ui";

const [open, setOpen] = useState(false);

<ImageCropModal
  open={open}
  imageSrc={objectUrl}
  aspect={1}
  circular
  onConfirm={(file) => { save(file); setOpen(false); }}
  onCancel={() => setOpen(false)}
/>`,
      },
    ],
  },
];

export function getEntry(slug: string): ComponentEntry | undefined {
  return registry.find((e) => e.slug === slug);
}

/** Nav data (plain, serialisable) for the client LibraryShell. */
export function buildNav(): { category: string; items: { slug: string; name: string; href?: string }[] }[] {
  const groups = getCategories().map(({ category, entries }) => ({
    category,
    items: entries.map((e) => ({ slug: e.slug, name: e.name, href: `/components/${e.slug}` })),
  }));
  // Patterns are full-page compositions living at their own routes.
  groups.push({
    category: "Patterns",
    items: [
      { slug: "shell", name: "App Shell", href: "/shell" },
      { slug: "table", name: "Data Table", href: "/table" },
    ],
  });
  return groups;
}

export function getCategories(): { category: string; entries: ComponentEntry[] }[] {
  const order = [
    "Buttons & Actions",
    "Forms",
    "Data Display",
    "Feedback",
    "Overlays",
    "Navigation",
    "Layout",
    "Patterns",
  ];
  const map = new Map<string, ComponentEntry[]>();
  for (const e of registry) {
    const list = map.get(e.category) ?? [];
    list.push(e);
    map.set(e.category, list);
  }
  return order
    .filter((c) => map.has(c))
    .map((category) => ({ category, entries: map.get(category)! }));
}
