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
