"use client";

import { useState } from "react";
import { Plus, Trash2, Search, Info, AlertTriangle, Users, MoreHorizontal, Edit, Home, Inbox } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  MoneyInput,
  SearchCombobox,
  Tabs,
  DatePicker,
  DateRangePicker,
  Toast,
  useToasts,
  ConfirmDialog,
  HoldToConfirm,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Checkbox,
  Switch,
  SwitchRow,
  Banner,
  StatCard,
  Avatar,
  Breadcrumb,
  PageHeader,
  Blank,
  SkeletonRows,
  ExceptionStrip,
  SortHeader,
  Tooltip,
  Pagination,
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuLabel,
  BackButton,
  TableOfContents,
  CommandPalette,
  useCommandPalette,
  Dialog,
  Drawer,
  Select,
  RadioGroup,
  DataTable,
  Alert,
  Progress,
  Accordion,
  Slider,
  EmptyState,
  Popover,
  Separator,
  Kbd,
  Spinner,
  ButtonGroup,
  Toolbar,
  Chip,
  TagInput,
  FileUpload,
  FileUploadMultiple,
  PhotoUpload,
  DocumentsTable,
  DocumentRequestList,
  DocumentViewer,
  ImageCropModal,
  MultiStepForm,
  type UploadItem,
  type DocumentRow,
  type DocumentRequest,
  type Step,
  type ComboboxOption,
  type SelectOption,
  type DataTableColumn,
} from "@/components/ui";

/* Shared demo data */
const STAFF: ComboboxOption[] = [
  { value: "u1", label: "Amina Wanjiru", meta: "amina.w@steward.co.ke" },
  { value: "u2", label: "Brian Otieno", meta: "b.otieno@steward.co.ke" },
  { value: "u3", label: "Dennis Ndung'u", meta: "dennis@steward.co.ke" },
  { value: "u4", label: "Faith Kamau", meta: "faith.k@steward.co.ke" },
];

const ROLES: ComboboxOption[] = [
  { value: "owner", label: "Owner" },
  { value: "approver", label: "Approver" },
  { value: "preparer", label: "Preparer" },
  { value: "viewer", label: "Viewer" },
];

/* ── Input ────────────────────────────────────────────────── */
export function InputDemo() {
  const [v, setV] = useState("");
  return (
    <div className="w-72 space-y-4">
      <Input label="Full name" placeholder="Amina Wanjiru" value={v} onChange={(e) => setV(e.target.value)} />
      <Input label="Email" type="email" placeholder="you@company.com" hint="We'll never share it." />
      <Input label="Password" type="password" placeholder="••••••••" />
      <Input label="Amount" prefix="KES" numeric placeholder="0.00" />
      <Input label="Username" error="That username is taken." value="admin" onChange={() => {}} />
    </div>
  );
}

/* ── MoneyInput ───────────────────────────────────────────── */
export function MoneyInputDemo() {
  const [amount, setAmount] = useState<number | null>(1234567.5);
  return (
    <div className="w-72">
      <MoneyInput label="Invoice total" currency="KES" value={amount} onChange={setAmount} />
    </div>
  );
}

/* ── Textarea ─────────────────────────────────────────────── */
export function TextareaDemo() {
  const [v, setV] = useState("");
  return (
    <div className="w-80">
      <Textarea label="Notes" placeholder="Add a note…" maxLength={200} value={v} onChange={(e) => setV(e.target.value)} />
    </div>
  );
}

/* ── SearchCombobox ───────────────────────────────────────── */
export function ComboboxDemo() {
  const [role, setRole] = useState<ComboboxOption | null>(null);
  const [team, setTeam] = useState<ComboboxOption[]>([]);
  return (
    <div className="w-80 space-y-4">
      <SearchCombobox label="Role" options={ROLES} value={role} onChange={(v) => setRole(v as ComboboxOption | null)} placeholder="Select a role…" />
      <SearchCombobox label="Team" multiple options={STAFF} value={team} onChange={(v) => setTeam(v as ComboboxOption[])} placeholder="Add members…" />
    </div>
  );
}

/* ── Tabs ─────────────────────────────────────────────────── */
export function TabsDemo() {
  const [tab, setTab] = useState("all");
  const items = [
    { id: "all", label: "All", count: 1284 },
    { id: "pending", label: "Pending", count: 12, urgent: true },
    { id: "archived", label: "Archived" },
  ];
  return (
    <div className="w-full max-w-md space-y-4">
      <Tabs items={items} value={tab} onChange={setTab} />
      <Tabs items={items} value={tab} onChange={setTab} variant="segmented" />
    </div>
  );
}

/* ── DatePicker ───────────────────────────────────────────── */
export function DatePickerDemo() {
  const [date, setDate] = useState<Date | null>(null);
  const [range, setRange] = useState<[Date, Date] | null>(null);
  return (
    <div className="w-72 space-y-4">
      <DatePicker label="Start date" value={date} onChange={setDate} />
      <DateRangePicker label="Reporting period" value={range} onChange={setRange} />
    </div>
  );
}

/* ── Toast ────────────────────────────────────────────────── */
export function ToastDemo() {
  const { list, push, close } = useToasts();
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => push({ tone: "success", title: "Saved", body: "Your changes were saved." })}>Success</Button>
        <Button size="sm" variant="secondary" onClick={() => push({ tone: "error", title: "Failed", body: "Something went wrong." })}>Error</Button>
        <Button size="sm" variant="secondary" onClick={() => push({ tone: "warning", title: "Heads up", body: "Check your input." })}>Warning</Button>
        <Button size="sm" variant="ghost" onClick={() => push({ tone: "info", title: "FYI", body: "New update available." })}>Info</Button>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-2">
        {list.map((t) => <Toast key={t.id} t={t} onClose={() => close(t.id)} />)}
      </div>
    </div>
  );
}

/* ── ConfirmDialog ────────────────────────────────────────── */
export function ConfirmDemo() {
  const [open, setOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="destructive" icon={Trash2} onClick={() => setOpen(true)}>Delete user</Button>
      <Button variant="secondary" onClick={() => setHoldOpen(true)}>Type to confirm</Button>
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
      />
      <ConfirmDialog
        open={holdOpen}
        title="Rename organisation?"
        body="Type the org name to confirm."
        confirmLabel="Rename"
        mode="type"
        typeToMatch="Kanon"
        onConfirm={() => setHoldOpen(false)}
        onCancel={() => setHoldOpen(false)}
      />
    </div>
  );
}

/* ── HoldToConfirm (standalone) ───────────────────────────── */
export function HoldToConfirmDemo() {
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <HoldToConfirm label="Hold to delete" onConfirm={() => setDone(true)} onKeyboardFallback={() => setDone(true)} />
      {done && <span className="text-sm text-text-secondary">Confirmed ✓</span>}
    </div>
  );
}

/* ── Button (icons need the demo file to import them) ─────── */
export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
      <Button icon={Plus}>New</Button>
      <Button icon={Search} variant="secondary">Search</Button>
      <Button loading>Saving</Button>
      <Button disabled disabledReason="You lack permission">Disabled</Button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Remaining components
   ═══════════════════════════════════════════════════════════ */

/* ── Card ─────────────────────────────────────────────────── */
export function CardDemo() {
  return (
    <div className="w-80">
      <Card>
        <CardHeader title="Active users" action={<Badge tone="pine">Live</Badge>} />
        <CardBody>
          <p className="text-sm text-text-secondary">
            1,284 people have accessed this organisation in the last 30 days.
          </p>
        </CardBody>
        <CardFooter>
          <Button size="sm" variant="secondary">View report</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

/* ── Badge ────────────────────────────────────────────────── */
export function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone="pine">Active</Badge>
      <Badge tone="amber">Pending</Badge>
      <Badge tone="rose">Overdue</Badge>
      <Badge tone="neutral">Draft</Badge>
    </div>
  );
}

/* ── Checkbox ─────────────────────────────────────────────── */
export function CheckboxDemo() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <Checkbox checked={a} onChange={() => setA((v) => !v)} ariaLabel="Option A" />
      <Checkbox checked={b} onChange={() => setB((v) => !v)} ariaLabel="Option B" />
      <Checkbox indeterminate ariaLabel="Some selected" />
      <Checkbox checked disabled ariaLabel="Locked" />
    </div>
  );
}

/* ── Switch ───────────────────────────────────────────────── */
export function SwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <div className="w-72 space-y-4">
      <Switch checked={on} onChange={setOn} label="Toggle" />
      <SwitchRow label="Email notifications" hint="Daily digest only">
        <Switch checked={on} onChange={setOn} />
      </SwitchRow>
    </div>
  );
}

/* ── Banner ───────────────────────────────────────────────── */
export function BannerDemo() {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-lg border border-border">
      <Banner tone="amber" icon={AlertTriangle} action="Review">
        3 invoices need your approval.
      </Banner>
      <Banner tone="neutral" icon={Info}>
        Showing results from the last 30 days.
      </Banner>
    </div>
  );
}

/* ── StatCard ─────────────────────────────────────────────── */
export function StatCardDemo() {
  return (
    <div className="grid w-full max-w-lg grid-cols-2 gap-3">
      <StatCard label="Overdue" value="12" sub="+3 since yesterday" tone="rose" />
      <StatCard label="Approval rate" value="94%" sub="Target 90%" tone="pine" ring={94} />
    </div>
  );
}

/* ── Avatar ───────────────────────────────────────────────── */
export function AvatarDemo() {
  return (
    <div className="flex items-center gap-3">
      <Avatar name="Amina Wanjiru" size="sm" />
      <Avatar name="Brian Otieno" />
      <Avatar name="Dennis Ndung'u" size="lg" colourful />
      <Avatar name="Faith Kamau" colourful />
    </div>
  );
}

/* ── Breadcrumb ───────────────────────────────────────────── */
export function BreadcrumbDemo() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "#" },
        { label: "Users", href: "#" },
        { label: "Amina Wanjiru" },
      ]}
    />
  );
}

/* ── PageHeader ───────────────────────────────────────────── */
export function PageHeaderDemo() {
  return (
    <div className="w-full max-w-lg">
      <PageHeader
        title="Users"
        description="People with access to this organisation."
        actions={<Button icon={Plus}>Add user</Button>}
      />
    </div>
  );
}

/* ── Blank ────────────────────────────────────────────────── */
export function BlankDemo() {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-surface">
      <Blank
        icon={Users}
        title="No users yet"
        body="Invite your first teammate to get started."
      />
    </div>
  );
}

/* ── SkeletonRows ─────────────────────────────────────────── */
export function SkeletonRowsDemo() {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-surface">
      <table className="w-full">
        <tbody>
          <SkeletonRows n={4} colCount={2} />
        </tbody>
      </table>
    </div>
  );
}

/* ── ExceptionStrip ───────────────────────────────────────── */
export function ExceptionStripDemo() {
  return (
    <div className="w-full max-w-lg">
      <ExceptionStrip
        items={[
          { label: "Overdue", value: "12", tone: "amber" },
          { label: "Rejected", value: "3", tone: "pine" },
          { label: "Total", value: "1,284" },
        ]}
        asOf="09:24"
      />
    </div>
  );
}

/* ── SortHeader ───────────────────────────────────────────── */
export function SortHeaderDemo() {
  const [sort, setSort] = useState<"asc" | "desc" | "none">("asc");
  const cycle = () => setSort((s) => (s === "asc" ? "desc" : s === "desc" ? "none" : "asc"));
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-surface">
      <table className="w-full">
        <thead>
          <tr>
            <SortHeader label="Name" state={sort} onClick={cycle} />
            <SortHeader label="Role" state="none" onClick={() => {}} />
          </tr>
        </thead>
      </table>
    </div>
  );
}

/* ── Tooltip ──────────────────────────────────────────────── */
export function TooltipDemo() {
  return (
    <Tooltip content="Remove this item">
      <Button variant="secondary" icon={Trash2}>Hover me</Button>
    </Tooltip>
  );
}

/* ── Pagination ───────────────────────────────────────────── */
export function PaginationDemo() {
  const [page, setPage] = useState(6);
  const [perPage, setPerPage] = useState(25);
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-surface">
      <Pagination
        page={page}
        pages={52}
        perPage={perPage}
        total={1284}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
      />
    </div>
  );
}

/* ── Menu ─────────────────────────────────────────────────── */
export function MenuDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Menu open={open} onOpenChange={setOpen}>
      <MenuTrigger>
        <Button variant="secondary" icon={MoreHorizontal}>Actions</Button>
      </MenuTrigger>
      <MenuContent align="start">
        <MenuLabel>Manage</MenuLabel>
        <MenuItem icon={<Edit size={15} />} onSelect={() => {}}>Edit</MenuItem>
        <MenuItem icon={<Home size={15} />} onSelect={() => {}}>Set as home</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Trash2 size={15} />} destructive onSelect={() => {}}>Delete</MenuItem>
      </MenuContent>
    </Menu>
  );
}

/* ── DateRangePicker (standalone) ─────────────────────────── */
export function DateRangeDemo() {
  const [range, setRange] = useState<[Date, Date] | null>(null);
  return (
    <div className="w-72">
      <DateRangePicker label="Reporting period" value={range} onChange={setRange} />
    </div>
  );
}

/* ── BackButton ───────────────────────────────────────────── */
export function BackButtonDemo() {
  return <BackButton href="#" label="Back to users" />;
}

/* ── TableOfContents ──────────────────────────────────────── */
export function TableOfContentsDemo() {
  const items = [
    { id: "toc-demo-overview", label: "Overview", level: 2 as const },
    { id: "toc-demo-usage", label: "Usage", level: 2 as const },
    { id: "toc-demo-props", label: "Props", level: 3 as const },
    { id: "toc-demo-a11y", label: "Accessibility", level: 2 as const },
  ];
  return (
    <div className="w-56">
      <TableOfContents items={items} />
    </div>
  );
}

/* ── CommandPalette ───────────────────────────────────────── */
export function CommandPaletteDemo() {
  const { isOpen, openPalette, closePalette } = useCommandPalette();
  const items = [
    { id: "dashboard", title: "Go to Dashboard", subtitle: "Overview & metrics", tag: "page" },
    { id: "users", title: "Users", subtitle: "Manage team members", tag: "page" },
    { id: "invoices", title: "Invoices", subtitle: "Billing & payments", tag: "page" },
    { id: "settings", title: "Settings", subtitle: "Organisation preferences", tag: "page" },
    { id: "new-user", title: "Invite user", subtitle: "Send an invitation", tag: "action" },
  ];
  return (
    <div className="flex flex-col items-start gap-2">
      <Button variant="secondary" icon={Search} onClick={openPalette}>
        Open command palette
      </Button>
      <span className="text-xs text-text-tertiary">…or press ⌘K / Ctrl+K</span>
      <CommandPalette
        open={isOpen}
        onClose={closePalette}
        items={items}
        onSelect={() => {}}
        emptyHeading="Quick actions"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Tier 1 + Tier 2 components
   ═══════════════════════════════════════════════════════════ */

/* ── Dialog ───────────────────────────────────────────────── */
export function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Invite a teammate"
        description="They'll receive an email with a link to join."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Send invite</Button>
          </>
        }
      >
        <Input label="Email address" type="email" placeholder="teammate@company.com" />
      </Dialog>
    </>
  );
}

/* ── Drawer ───────────────────────────────────────────────── */
export function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        title="Filters"
        footer={<Button onClick={() => setOpen(false)}>Apply</Button>}
      >
        <p className="text-text-secondary">Put filter controls, a detail view, or a form here.</p>
      </Drawer>
    </>
  );
}

/* ── Select ───────────────────────────────────────────────── */
export function SelectDemo() {
  const [value, setValue] = useState<string | null>(null);
  const options: SelectOption[] = [
    { value: "owner", label: "Owner" },
    { value: "approver", label: "Approver" },
    { value: "preparer", label: "Preparer" },
    { value: "viewer", label: "Viewer", disabled: true },
  ];
  return (
    <div className="w-72">
      <Select label="Role" options={options} value={value} onChange={setValue} placeholder="Select a role…" />
    </div>
  );
}

/* ── RadioGroup ───────────────────────────────────────────── */
export function RadioGroupDemo() {
  const [plan, setPlan] = useState("pro");
  const [size, setSize] = useState("md");
  return (
    <div className="w-80 space-y-6">
      <RadioGroup
        name="size"
        label="Size"
        value={size}
        onChange={setSize}
        options={[
          { value: "sm", label: "Small" },
          { value: "md", label: "Medium" },
          { value: "lg", label: "Large" },
        ]}
      />
      <RadioGroup
        name="plan"
        label="Plan"
        variant="card"
        value={plan}
        onChange={setPlan}
        options={[
          { value: "starter", label: "Starter", description: "For individuals getting started." },
          { value: "pro", label: "Pro", description: "For growing teams that need more." },
        ]}
      />
    </div>
  );
}

/* ── DataTable ────────────────────────────────────────────── */
type DemoRow = { id: string; name: string; role: string; status: string; balance: number };
const DEMO_ROWS: DemoRow[] = [
  { id: "1", name: "Amina Wanjiru", role: "Owner", status: "Active", balance: 128400 },
  { id: "2", name: "Brian Otieno", role: "Approver", status: "Active", balance: 54200 },
  { id: "3", name: "Dennis Ndung'u", role: "Preparer", status: "Invited", balance: 0 },
];
export function DataTableDemo() {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" | "none" }>({ key: "name", dir: "asc" });
  const columns: DataTableColumn<DemoRow>[] = [
    { key: "name", header: "Name", sortable: true, cell: (r) => <span className="font-medium">{r.name}</span> },
    { key: "role", header: "Role", cell: (r) => r.role },
    { key: "status", header: "Status", cell: (r) => <Badge tone={r.status === "Active" ? "pine" : "amber"}>{r.status}</Badge> },
    { key: "balance", header: "Balance", numeric: true, cell: (r) => `KES ${r.balance.toLocaleString()}` },
  ];
  const cycle = (key: string) =>
    setSort((s) => ({ key, dir: s.key !== key ? "asc" : s.dir === "asc" ? "desc" : s.dir === "desc" ? "none" : "asc" }));
  return (
    <div className="w-full max-w-2xl">
      <DataTable
        title="Team members"
        subtitle="3 of 3"
        columns={columns}
        rows={DEMO_ROWS}
        rowKey={(r) => r.id}
        sort={sort}
        onSortChange={cycle}
        zebra
        rowStatus={(r) => (r.status === "Invited" ? "pending" : r.id === "1" ? "selected" : "default")}
      />
    </div>
  );
}

/* ── Alert ────────────────────────────────────────────────── */
export function AlertDemo() {
  return (
    <div className="w-full max-w-lg space-y-3">
      <Alert tone="info" title="Heads up">This is an informational callout.</Alert>
      <Alert tone="success" title="Saved">Your changes have been saved.</Alert>
      <Alert tone="warning" title="Almost out of space">You&rsquo;ve used 90% of your quota.</Alert>
      <Alert tone="error" title="Payment failed" dismissible>We couldn&rsquo;t process your card.</Alert>
    </div>
  );
}

/* ── Progress ─────────────────────────────────────────────── */
export function ProgressDemo() {
  return (
    <div className="w-full max-w-md space-y-5">
      <Progress value={68} label="Upload" showValue />
      <Progress value={30} tone="warning" />
      <Progress value={null} label="Processing…" />
    </div>
  );
}

/* ── Accordion ────────────────────────────────────────────── */
export function AccordionDemo() {
  return (
    <div className="w-full max-w-lg">
      <Accordion
        defaultOpen={["a"]}
        items={[
          { id: "a", title: "What is included?", content: "Everything in the free tier plus priority support." },
          { id: "b", title: "Can I cancel anytime?", content: "Yes — cancel from settings, no questions asked." },
          { id: "c", title: "Do you offer refunds?", content: "We offer a 30-day money-back guarantee." },
        ]}
      />
    </div>
  );
}

/* ── Slider ───────────────────────────────────────────────── */
export function SliderDemo() {
  const [vol, setVol] = useState(60);
  const [threshold, setThreshold] = useState(25);
  return (
    <div className="w-72 space-y-6">
      <Slider label="Volume" value={vol} onChange={setVol} showValue format={(v) => `${v}%`} />
      <Slider label="Threshold" value={threshold} onChange={setThreshold} min={0} max={50} showValue />
    </div>
  );
}

/* ── EmptyState ───────────────────────────────────────────── */
export function EmptyStateDemo() {
  return (
    <div className="w-full max-w-lg">
      <EmptyState
        icon={Inbox}
        title="No messages yet"
        body="When someone sends you a message, it'll show up here."
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Tier 3 primitives
   ═══════════════════════════════════════════════════════════ */

/* ── Popover ──────────────────────────────────────────────── */
export function PopoverDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={<Button variant="secondary">Open popover</Button>}
      minWidth={240}
    >
      <p className="text-sm font-medium text-text">Quick settings</p>
      <p className="mt-1 text-sm text-text-secondary">
        Put any content here — filters, a form, or a small menu.
      </p>
    </Popover>
  );
}

/* ── Separator ────────────────────────────────────────────── */
export function SeparatorDemo() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <p className="text-sm text-text-secondary">Above</p>
      <Separator />
      <p className="text-sm text-text-secondary">Below</p>
      <Separator label="or" />
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  );
}

/* ── Kbd ──────────────────────────────────────────────────── */
export function KbdDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
      <span>Open search <Kbd keys={["⌘", "K"]} /></span>
      <span>Close <Kbd keys="Esc" /></span>
      <span>Save <Kbd keys={["⌘", "S"]} /></span>
    </div>
  );
}

/* ── Spinner ──────────────────────────────────────────────── */
export function SpinnerDemo() {
  return (
    <div className="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  );
}

/* ── ButtonGroup + Toolbar ────────────────────────────────── */
export function ButtonGroupDemo() {
  const [view, setView] = useState("list");
  const [align, setAlign] = useState("left");
  return (
    <div className="space-y-4">
      <ButtonGroup
        aria-label="View"
        value={view}
        onChange={setView}
        options={[
          { value: "list", label: "List" },
          { value: "grid", label: "Grid" },
          { value: "board", label: "Board" },
        ]}
      />
      <Toolbar aria-label="Formatting">
        <ButtonGroup
          aria-label="Align"
          value={align}
          onChange={setAlign}
          options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ]}
        />
        <Separator orientation="vertical" />
        <Button size="sm" variant="ghost" icon={Plus}>Add</Button>
      </Toolbar>
    </div>
  );
}

/* ── Chip + TagInput ──────────────────────────────────────── */
export function ChipDemo() {
  const [tags, setTags] = useState<string[]>(["design", "frontend"]);
  return (
    <div className="w-80 space-y-4">
      <div className="flex flex-wrap gap-2">
        <Chip>Read-only</Chip>
        <Chip onRemove={() => {}}>Removable</Chip>
      </div>
      <TagInput label="Tags" value={tags} onChange={setTags} hint="Enter or comma to add." />
    </div>
  );
}


/* ── FileUpload (single) ──────────────────────────────────── */
export function FileUploadDemo() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="w-full max-w-md">
      <FileUpload
        label="Attach document"
        hint="PDF or Word, up to 10 MB"
        accept=".pdf,.doc,.docx"
        maxSize={10 * 1024 * 1024}
        value={file}
        onSelect={setFile}
      />
    </div>
  );
}

/* ── FileUploadMultiple ───────────────────────────────────── */
export function FileUploadMultipleDemo() {
  const [items, setItems] = useState<UploadItem[]>([]);
  return (
    <div className="w-full max-w-md">
      <FileUploadMultiple
        label="Attachments"
        accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx"
        maxSize={10 * 1024 * 1024}
        maxFiles={5}
        items={items}
        onAdd={(files) =>
          setItems((prev) => [
            ...prev,
            ...files.map((file) => ({ id: `${file.name}-${Date.now()}-${Math.random()}`, file, status: "complete" as const })),
          ])
        }
        onRemove={(id) => setItems((prev) => prev.filter((it) => it.id !== id))}
      />
    </div>
  );
}

/* ── PhotoUpload ──────────────────────────────────────────── */
export function PhotoUploadDemo() {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  return (
    <div className="w-full max-w-md space-y-6">
      <PhotoUpload label="Profile photo" variant="avatar" value={avatar} onSelect={setAvatar} maxSize={5 * 1024 * 1024} crop />
      <PhotoUpload label="Cover image" variant="cover" value={cover} onSelect={setCover} maxSize={5 * 1024 * 1024} crop />
    </div>
  );
}

/* ── DocumentsTable ───────────────────────────────────────── */
const DEMO_DOCS: DocumentRow[] = [
  { id: "1", name: "Loan-agreement.pdf", size: 248_000, uploadedBy: "Amina Wanjiru", uploadedAt: new Date(2026, 1, 12), status: "ready" },
  { id: "2", name: "Member-roster.xlsx", size: 1_240_000, uploadedBy: "Brian Otieno", uploadedAt: new Date(2026, 1, 10), status: "processing" },
  { id: "3", name: "ID-scan.jpg", size: 820_000, uploadedBy: "Faith Kamau", uploadedAt: new Date(2026, 1, 9), status: "ready" },
  { id: "4", name: "Statement-Q1.csv", size: 44_000, uploadedBy: "Dennis Ndung'u", uploadedAt: new Date(2026, 1, 8), status: "failed" },
];

export function DocumentsTableDemo() {
  return (
    <div className="w-full max-w-2xl">
      <DocumentsTable
        title="Documents"
        subtitle="4 files"
        documents={DEMO_DOCS}
        onView={() => {}}
        onDownload={() => {}}
        onActions={() => {}}
      />
    </div>
  );
}


/* ── DocumentRequestList ──────────────────────────────────── */
export function DocumentRequestListDemo() {
  const [requests, setRequests] = useState<DocumentRequest[]>([
    { id: "id", name: "National ID (front & back)", description: "Clear photo or scan, both sides.", required: true, accept: ".pdf,image/*", state: "uploaded", file: new File([""], "national-id.pdf") },
    { id: "kra", name: "KRA PIN certificate", description: "PDF from the iTax portal.", required: true, accept: ".pdf", state: "missing" },
    { id: "photo", name: "Passport photo", description: "Recent, plain background.", required: true, accept: "image/*", state: "missing" },
    { id: "bank", name: "Bank statement", description: "Last 3 months (optional).", required: false, accept: ".pdf", state: "rejected", error: "File was unreadable — please re-scan and upload again." },
  ]);
  const set = (id: string, patch: Partial<DocumentRequest>) =>
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  return (
    <div className="w-full max-w-2xl">
      <DocumentRequestList
        title="Required documents"
        requests={requests}
        onUpload={(id, file) => set(id, { state: "uploaded", file, error: undefined })}
        onRemove={(id) => set(id, { state: "missing", file: null })}
        onView={() => {}}
      />
    </div>
  );
}

/* ── DocumentViewer ───────────────────────────────────────── */
const SAMPLE_CSV = `Name,Role,Balance
Amina Wanjiru,Owner,12500
Brian Otieno,Approver,4300
Faith Kamau,Member,980`;

const SAMPLE_TEXT = `# Meeting notes — Q1 review

- Onboarding flow shipped (KYC docs + photo)
- DocumentViewer now previews images, PDFs, CSV/Excel, text
- Next: bulk export

Owner: Dennis
Status: Final`;

const SAMPLE_MD = `# Project brief

A **DocumentViewer** now previews many formats inline.

## Highlights
- Images, PDF, video & audio
- CSV & Excel → a bordered table
- Markdown & Word → *formatted* prose
- JSON → pretty-printed

> Everything else falls back to a clean download card.

\`\`\`ts
const preview = <DocumentViewer file={file} />;
\`\`\`
`;

export function DocumentViewerDemo() {
  const [tab, setTab] = useState("image");

  // Build sample files/URLs once.
  const csvFile = useState(() => new File([SAMPLE_CSV], "members.csv", { type: "text/csv" }))[0];
  const mdFile = useState(() => new File([SAMPLE_MD], "brief.md", { type: "text/markdown" }))[0];
  const txtFile = useState(() => new File([SAMPLE_TEXT], "notes.txt", { type: "text/plain" }))[0];

  const tabs = [
    { id: "image", label: "Image" },
    { id: "pdf", label: "PDF" },
    { id: "spreadsheet", label: "Spreadsheet" },
    { id: "workbook", label: "Workbook" },
    { id: "markdown", label: "Markdown" },
    { id: "word", label: "Word" },
    { id: "text", label: "Text" },
  ];

  return (
    <div className="w-full max-w-2xl space-y-3">
      <Tabs items={tabs} value={tab} onChange={setTab} variant="segmented" />
      {tab === "image" && <DocumentViewer src="/samples/sample.jpg.svg" name="photo.svg" type="image/svg+xml" maxHeight={320} />}
      {tab === "pdf" && <DocumentViewer src="/samples/sample.pdf" name="sample.pdf" type="application/pdf" maxHeight={360} />}
      {tab === "spreadsheet" && <DocumentViewer file={csvFile} maxHeight={280} />}
      {tab === "workbook" && <DocumentViewer src="/samples/workbook.xlsx" name="report.xlsx" maxHeight={320} />}
      {tab === "markdown" && <DocumentViewer file={mdFile} maxHeight={340} />}
      {tab === "word" && <DocumentViewer src="/samples/sample.docx" name="contract.docx" maxHeight={340} />}
      {tab === "text" && <DocumentViewer file={txtFile} maxHeight={280} />}
    </div>
  );
}


/* ── ImageCropModal ───────────────────────────────────────── */
// A small sample image (data URL) so the demo works with no assets.
const SAMPLE_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6FD0B4"/><stop offset="1" stop-color="#3B6E7D"/></linearGradient></defs><rect width="480" height="360" fill="url(#g)"/><circle cx="150" cy="140" r="70" fill="#fff" opacity="0.9"/><rect x="60" y="250" width="360" height="60" rx="12" fill="#fff" opacity="0.8"/></svg>`
  );

export function ImageCropModalDemo() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => setOpen(true)}>Open cropper</Button>
      {result && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={result} alt="Cropped result" className="size-24 rounded-full border border-border object-cover" />
      )}
      <ImageCropModal
        open={open}
        imageSrc={SAMPLE_IMG}
        aspect={1}
        circular
        onConfirm={(file) => {
          setResult(URL.createObjectURL(file));
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}


/* ── MultiStepForm ────────────────────────────────────────── */
export function MultiStepFormDemo() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Build validation reasons for the first step
  const accountReasons: string[] = [];
  if (name.trim().length <= 1) accountReasons.push("Enter your full name");
  if (!/.+@.+\..+/.test(email)) accountReasons.push("Enter a valid email address");
  const accountValid = accountReasons.length === 0;

  const steps: Step[] = [
    {
      id: "account",
      title: "Account",
      description: "Tell us who you are.",
      canProceed: accountValid,
      disabledReason: accountReasons.join("\n") || undefined,
      content: (
        <div className="space-y-4">
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Amina Wanjiru" required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="amina@example.com" required />
        </div>
      ),
    },
    {
      id: "plan",
      title: "Plan",
      description: "Pick a plan to continue.",
      canProceed: plan !== null,
      disabledReason: plan === null ? "Select a plan to continue" : undefined,
      content: (
        <Select
          label="Plan"
          value={plan}
          onChange={setPlan}
          placeholder="Choose a plan…"
          options={[
            { value: "starter", label: "Starter" },
            { value: "team", label: "Team" },
            { value: "enterprise", label: "Enterprise" },
          ]}
        />
      ),
    },
    {
      id: "review",
      title: "Review",
      description: "Confirm your details.",
      content: (
        <div className="rounded-lg border border-border bg-bg-secondary p-4 text-sm">
          <dl className="space-y-1.5">
            <div className="flex justify-between gap-4"><dt className="text-text-secondary">Name</dt><dd className="font-medium text-text">{name || "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-text-secondary">Email</dt><dd className="font-medium text-text">{email || "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-text-secondary">Plan</dt><dd className="font-medium text-text capitalize">{plan ?? "—"}</dd></div>
          </dl>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-xl">
      {done ? (
        <div className="rounded-xl border border-accent-muted bg-accent-light p-6 text-center">
          <p className="text-sm font-semibold text-accent">All set! 🎉</p>
          <p className="mt-1 text-sm text-text-secondary">Welcome aboard, {name || "friend"}.</p>
          <button
            className="mt-3 text-xs font-medium text-accent underline"
            onClick={() => { setDone(false); setStep(0); }}
          >
            Start over
          </button>
        </div>
      ) : (
        <MultiStepForm steps={steps} current={step} onStepChange={setStep} onComplete={() => setDone(true)} />
      )}
    </div>
  );
}
