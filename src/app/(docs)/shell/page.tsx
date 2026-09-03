"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  LayoutGrid, Users, Wallet, Settings, Building2, ShieldCheck,
  Plus, Eye, Pencil, Trash2, MoreHorizontal, Bell, X,
  CheckCircle2, AlertCircle, Info, ChevronDown, Mail, User as UserIcon,
} from "lucide-react";
import {
  Avatar, Badge, Switch,
  Card, CardHeader,
  Breadcrumb, PageHeader,
  Pagination, type PaginationMeta,
  Menu, MenuTrigger, MenuContent, MenuItem, MenuCheckboxItem, MenuSeparator, MenuLabel,
  Sidebar, SidebarNav, SidebarSection, SidebarItem, SidebarGroup,
  SidebarFooter, SidebarLogoutButton,
  Navbar,
  Tooltip,
} from "@/components/ui";
import { Toolbar, ButtonGroup } from "@/components/ui/button-group";

/* ═══════════════════════════════════════════════════════════════
   Shell page — composed demo of all the new components working
   together as a real app shell: Sidebar + Navbar + PageHeader +
   Card + Pagination, with Badge / Avatar / Switch / Menu inline.
   ═══════════════════════════════════════════════════════════════ */

/* ── Demo data ─────────────────────────────────────────────── */
const SAMPLE_USERS = [
  { id: "u1", name: "Amina Wanjiru",   email: "amina.w@steward.co.ke",  role: "Controller" as const },
  { id: "u2", name: "Brian Otieno",    email: "b.otieno@steward.co.ke", role: "Approver" as const },
  { id: "u3", name: "Dennis Ndung\u2019u", email: "dennis@steward.co.ke",    role: "Owner" as const },
  { id: "u4", name: "Faith Kamau",     email: "faith.k@steward.co.ke",  role: "Preparer" as const },
];

type Role = "Controller" | "Approver" | "Owner" | "Preparer";
const ROLE_TONE: Record<Role, "pine" | "neutral"> = {
  Owner: "pine", Controller: "pine", Approver: "neutral", Preparer: "neutral",
};

/* ── Permission demo ───────────────────────────────────────── */
const ROLE_PERMISSIONS: Record<string, Set<string>> = {
  Owner:    new Set(["loans:view", "org:manage"]),
  Preparer: new Set([]),
};

/* ── Nav types ─────────────────────────────────────────────── */
type NavLeafItem = {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  permission?: string;
  hideIfDenied?: boolean;
  lockReason?: string;
  locked?: string;
};
type NavGroupItem = {
  type: "group";
  icon: React.ReactNode;
  label: string;
  permission?: string;
  hideIfDenied?: boolean;
  lockReason?: string;
  locked?: string;
  children?: NavLeafItem[];
};
type NavItem = NavLeafItem | NavGroupItem;
type NavSection = { section: string; items: NavItem[] };

const NAV_CONFIG: NavSection[] = [
  {
    section: "Overview",
    items: [
      { icon: <LayoutGrid size={16} />, label: "Dashboard" },
      { icon: <Users size={16} />,      label: "Users",    count: 1284, active: true },
      { icon: <Wallet size={16} />,     label: "Loans",    count: 3,    permission: "loans:view", hideIfDenied: true },
    ],
  },
  {
    section: "Organisation",
    items: [
      {
        icon: <Building2 size={16} />, label: "Branches",
        permission: "org:manage",
        lockReason: "Requires Organisation Manager permission",
      },
      {
        type: "group" as const,
        icon: <Settings size={16} />, label: "Settings",
        children: [
          { icon: <Settings size={16} />, label: "General" },
          { icon: <Settings size={16} />, label: "Team" },
          { icon: <Settings size={16} />, label: "Billing" },
        ],
      },
    ],
  },
];

/* ── Logo slots ─────────────────────────────────────────────── */
const FullLogo = (
  <span className="flex items-center gap-2">
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm font-bold bg-accent text-on-accent"
    >
      K
    </span>
    <span className="truncate text-sm font-semibold text-text">Kanon</span>
  </span>
);
const MarkLogo = (
  <span
    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm font-bold bg-accent text-on-accent"
  >
    K
  </span>
);

/* ── User row ───────────────────────────────────────────────── */
function UserRow({ user, colourful }: { user: typeof SAMPLE_USERS[number]; colourful: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Avatar name={user.name} colourful={colourful} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text">{user.name}</p>
        <p className="truncate text-xs text-text-secondary">{user.email}</p>
      </div>
      <Badge tone={ROLE_TONE[user.role as Role]}>{user.role}</Badge>

      <Menu open={open} onOpenChange={setOpen}>
        <MenuTrigger>
          <button
            type="button"
            aria-label={`Actions for ${user.name}`}
            className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-md hover:bg-bg-hover outline-none focus-visible:ring-2 text-text-secondary"
          >
            <MoreHorizontal size={16} />
          </button>
        </MenuTrigger>
        <MenuContent align="end">
          <MenuItem icon={<Eye size={15} />}>View details</MenuItem>
          <MenuItem icon={<Pencil size={15} />}>Edit profile</MenuItem>
          <MenuSeparator />
          <MenuItem icon={<Trash2 size={15} />} destructive>Suspend access</MenuItem>
        </MenuContent>
      </Menu>
    </div>
  );
}

/* ── Mobile sidebar preview ─────────────────────────────────── */
function MobilePreview() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative mx-auto h-96 w-72 overflow-hidden rounded-2xl border-4 border-border bg-bg"
    >
      <div className="flex h-full flex-col">
        <div
          className="flex h-12 shrink-0 items-center gap-2 border-b px-3 border-border bg-surface"
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded p-1 hover:bg-bg-hover text-text-secondary"
            aria-label="Open menu"
          >
            <LayoutGrid size={16} />
          </button>
          <span className="text-xs font-medium text-text">Users</span>
        </div>
        <div className="flex-1 p-3">
          <p className="text-xs text-text-tertiary">Content area — tap the grid icon.</p>
        </div>
      </div>

      {/* Overlay sidebar rendered inside the preview frame */}
      {open && (
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="absolute inset-0 z-40 bg-overlay"
        />
      )}
      <div
        className="absolute inset-y-0 left-0 z-50 flex w-64 flex-col border-r transition-transform duration-200 border-border bg-surface"
        style={{
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="flex h-14 shrink-0 items-center gap-2 border-b px-4 border-border">
          {FullLogo}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ml-auto rounded p-1 hover:bg-bg-hover text-text-tertiary"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          <div className="flex flex-col gap-1 px-2">
            <a
              href="#"
              className="flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm hover:bg-bg-hover text-text-secondary"
            >
              <LayoutGrid size={16} /> Dashboard
            </a>
            <a
              href="#"
              className="flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm font-medium bg-accent-light text-accent"
            >
              <Users size={16} /> Users
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Notifications popup
   ═══════════════════════════════════════════════════════════════ */
const NOTIFICATIONS = [
  { id: 1, icon: AlertCircle, tone: "amber" as const,  title: "MFA not enrolled",        body: "Faith Kamau has not enrolled MFA. Remind them.", time: "5 min ago",  unread: true  },
  { id: 2, icon: CheckCircle2, tone: "pine" as const,  title: "Role change applied",      body: "Brian Otieno is now Approver.",                   time: "1 hour ago", unread: true  },
  { id: 3, icon: Info,         tone: "neutral" as const, title: "New login from Nairobi", body: "Dennis Ndung\u2019u signed in from a new device.", time: "2 hours ago", unread: false },
];
const NOTIF_ICON_COLOR = { amber: "text-warning", pine: "text-accent", neutral: "text-text-tertiary" };

interface NotificationsPopupProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
}
function NotificationsPopup({ anchorRef, open, onClose }: NotificationsPopupProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border shadow-lg border-border bg-surface"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 border-border">
        <span className="text-sm font-semibold text-text">Notifications</span>
        <button
          type="button" onClick={onClose}
          className="cursor-pointer rounded p-0.5 hover:bg-bg-hover text-text-tertiary"
          aria-label="Close notifications"
        >
          <X size={15} />
        </button>
      </div>

      {/* Items */}
      <div className="divide-y border-border">
        {NOTIFICATIONS.map((n) => (
          <button
            key={n.id}
            type="button"
            className={`cursor-pointer flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-bg-hover transition-colors ${n.unread ? "bg-accent-light" : "bg-transparent"}`}
          >
            <n.icon size={16} className={`mt-0.5 shrink-0 ${NOTIF_ICON_COLOR[n.tone]}`} />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-text">{n.title}</span>
              <span className="block text-xs text-text-secondary">{n.body}</span>
              <span className="mt-1 block text-xs text-text-tertiary">{n.time}</span>
            </span>
            {n.unread && (
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="Unread" />
            )}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-2.5 border-border">
        <button
          type="button"
          className="cursor-pointer text-xs font-medium hover:underline text-accent"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Add User modal
   ═══════════════════════════════════════════════════════════════ */
const ROLES = ["Owner", "Controller", "Approver", "Preparer", "Auditor"] as const;

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
}
function AddUserModal({ open, onClose }: AddUserModalProps) {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole]   = useState<typeof ROLES[number]>("Preparer");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); onClose(); setName(""); setEmail(""); setRole("Preparer"); }, 800);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-overlay"
        aria-hidden="true"
        onClick={onClose}
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-title"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border shadow-xl border-border bg-surface"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 border-border">
          <h2 id="add-user-title" className="text-base font-semibold text-text">
            Add user
          </h2>
          <button
            type="button" onClick={onClose}
            className="cursor-pointer rounded-md p-1 hover:bg-bg-hover text-text-tertiary"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="add-user-name" className="text-sm font-medium text-text">
              Full name
            </label>
            <div className="relative">
              <UserIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                id="add-user-name"
                type="text"
                required
                placeholder="e.g. Amina Wanjiru"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 w-full rounded-md border pl-8 pr-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent border-border text-text"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="add-user-email" className="text-sm font-medium text-text">
              Email address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                id="add-user-email"
                type="email"
                required
                placeholder="amina@example.co.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 w-full rounded-md border pl-8 pr-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent border-border text-text"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="add-user-role" className="text-sm font-medium text-text">
              Role
            </label>
            <select
              id="add-user-role"
              value={role}
              onChange={(e) => setRole(e.target.value as typeof ROLES[number])}
              className="cursor-pointer h-9 w-full rounded-md border px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent border-border text-text bg-surface"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <p className="text-xs text-text-tertiary">
              An invitation email will be sent. They can sign in after accepting.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 border-t pt-4 border-border">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer h-9 rounded-md border px-4 text-sm font-medium border-border text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer inline-flex h-9 items-center gap-1.5 rounded-md px-4 text-sm font-medium bg-accent text-on-accent disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send invite"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Shell page
   ═══════════════════════════════════════════════════════════════ */
export default function ShellPage() {
  const [collapsed, setCollapsed]           = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [colourful, setColourful]           = useState(false);
  const [viewRole, setViewRole]             = useState<"Owner" | "Preparer">("Owner");
  const [colsOpen, setColsOpen]             = useState(false);
  const [showEmail, setShowEmail]           = useState(true);
  const [showRole, setShowRole]             = useState(true);
  const [notifOpen, setNotifOpen]           = useState(false);
  const [addUserOpen, setAddUserOpen]       = useState(false);
  const notifAnchorRef                      = useRef<HTMLElement | null>(null);

  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    page: 3, perPage: 25, totalItems: 214, totalPages: 9, from: 51, to: 75,
  });

  const setPage = (page: number) =>
    setPaginationMeta((m) => ({
      ...m, page,
      from: (page - 1) * m.perPage + 1,
      to:   Math.min(page * m.perPage, m.totalItems),
    }));

  const setPerPage = (perPage: number) =>
    setPaginationMeta((m) => {
      const totalPages = Math.ceil(m.totalItems / perPage);
      return { ...m, perPage, page: 1, totalPages, from: 1, to: Math.min(perPage, m.totalItems) };
    });

  // Build nav with permission filter
  const granted = ROLE_PERMISSIONS[viewRole] ?? new Set();
  const navSections: NavSection[] = NAV_CONFIG.map((sec) => ({
    ...sec,
    items: sec.items
      .filter((it) => !it.permission || granted.has(it.permission) || !it.hideIfDenied)
      .map((it) => ({
        ...it,
        locked: it.permission && !granted.has(it.permission) ? it.lockReason : undefined,
      })) as NavItem[],
  }));

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-6 sm:px-10">
      <PageHeader
        title="App Shell"
        description="A full application shell pattern — Sidebar + Navbar + PageHeader + content, with permission-aware nav, collapse, and a mobile overlay."
      />

      {/* Demo controls — preview the shell as different roles */}
      <Toolbar aria-label="Demo controls" className="mb-6">
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">View as</span>
        <ButtonGroup
          aria-label="View as role"
          value={viewRole}
          onChange={(v) => setViewRole(v as typeof viewRole)}
          options={[
            { value: "Owner", label: "Owner" },
            { value: "Preparer", label: "Preparer" },
          ]}
        />
        <span className="hidden text-xs text-text-tertiary sm:block">
          Preparer: Loans is hidden · Branches is visible-but-locked
        </span>
      </Toolbar>

      {/* ── Framed app-shell preview ─────────────────────────── */}
      <div className="h-[640px] overflow-hidden rounded-xl border border-border bg-bg">
        <div className="flex h-full">

        {/* Sidebar */}
        <Sidebar
          logo={FullLogo}
          logoCollapsed={MarkLogo}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          mobileOpen={mobileOpen}
          onMobileOpenChange={setMobileOpen}
        >
          <SidebarNav>
            {navSections.map((sec) => (
              <SidebarSection key={sec.section} label={sec.section}>
                {sec.items.map((it) =>
                  'type' in it && it.type === "group" ? (
                    <SidebarGroup key={it.label} icon={it.icon} label={it.label}>
                      {it.children?.map((c) => (
                        <SidebarItem key={c.label} icon={c.icon}>{c.label}</SidebarItem>
                      ))}
                    </SidebarGroup>
                  ) : (
                    <SidebarItem
                      key={it.label}
                      icon={it.icon}
                      active={(it as NavLeafItem).active}
                      count={(it as NavLeafItem).count}
                      locked={(it as NavLeafItem).locked}
                    >
                      {it.label}
                    </SidebarItem>
                  )
                )}
              </SidebarSection>
            ))}
          </SidebarNav>

          <SidebarFooter>
            <SidebarLogoutButton onClick={() => {}} />
          </SidebarFooter>
        </Sidebar>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="relative">
            <Navbar
              left={
                <Breadcrumb items={[
                  { label: "Steward", href: "/" },
                  { label: "Users" },
                ]} />
              }
              onMenuClick={() => setMobileOpen(true)}
              notificationCount={notifOpen ? 0 : 3}
              onNotificationsClick={() => setNotifOpen((o) => !o)}
              account={{ name: "Dennis Ndung\u2019u", email: "dennis@steward.co.ke" }}
              onAccountSettings={() => {}}
              onSignOut={() => {}}
            />
            <NotificationsPopup
              anchorRef={notifAnchorRef}
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
            />
          </div>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-4xl px-6 py-8">

              <PageHeader
                title="Users"
                description="People with access to this organisation."
                actions={
                  <button
                    type="button"
                    onClick={() => setAddUserOpen(true)}
                    className="cursor-pointer inline-flex h-9 items-center gap-1.5 rounded-md px-3.5 text-sm font-medium bg-accent text-on-accent shadow-sm hover:opacity-90"
                  >
                    <Plus size={15} strokeWidth={2.5} /> Add user
                  </button>
                }
              />
              <AddUserModal open={addUserOpen} onClose={() => setAddUserOpen(false)} />

              {/* Users card */}
              <Card>
                <CardHeader
                  title="Active users"
                  action={
                    <span className="relative">
                      <Menu open={colsOpen} onOpenChange={setColsOpen}>
                        <MenuTrigger>
                          <button
                            type="button"
                            className="cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium border-border text-text-secondary"
                          >
                            Columns
                          </button>
                        </MenuTrigger>
                        <MenuContent align="end" minWidth={180}>
                          <MenuLabel>Show columns</MenuLabel>
                          <MenuCheckboxItem checked locked onCheckedChange={() => {}}>Name</MenuCheckboxItem>
                          <MenuCheckboxItem checked={showEmail} onCheckedChange={setShowEmail}>Email</MenuCheckboxItem>
                          <MenuCheckboxItem checked={showRole}  onCheckedChange={setShowRole}>Role</MenuCheckboxItem>
                        </MenuContent>
                      </Menu>
                    </span>
                  }
                />

                <div className="divide-y border-border">
                  {SAMPLE_USERS.map((u) => <UserRow key={u.id} user={u} colourful={colourful} />)}
                </div>

                {/* Pagination — using the meta-object API */}
                <Pagination
                  meta={paginationMeta}
                  onPageChange={setPage}
                  onPerPageChange={setPerPage}
                />
              </Card>

              {/* Badge + Switch demos */}
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Card>
                  <CardHeader title="Badge" />
                  <div className="flex flex-wrap gap-2 p-4">
                    <Badge tone="pine">Owner</Badge>
                    <Badge tone="neutral">Preparer</Badge>
                    <Badge tone="amber">3 pending</Badge>
                    <Badge tone="rose">Suspended</Badge>
                  </div>
                </Card>

                <Card>
                  <CardHeader title="Switch" />
                  <div className="flex items-center justify-between p-4">
                    <span className="text-sm text-text-secondary">
                      Colourful avatars
                    </span>
                    <Switch checked={colourful} onChange={setColourful} />
                  </div>
                </Card>
              </div>

              {/* Tooltip demo */}
              <div className="mt-8">
                <Card>
                  <CardHeader title="Tooltip" />
                  <div className="flex flex-wrap items-center gap-4 p-4">
                    <Tooltip content="Hover triggers a tooltip">
                      <button
                        type="button"
                        className="rounded-md border px-3 py-1.5 text-sm border-border text-text-secondary"
                      >
                        Hover me
                      </button>
                    </Tooltip>
                    <Tooltip content="Disabled button still shows a tooltip" delayMs={0}>
                      <button
                        type="button"
                        disabled
                        className="rounded-md border px-3 py-1.5 text-sm opacity-50 cursor-not-allowed border-border text-text-secondary"
                      >
                        Disabled
                      </button>
                    </Tooltip>
                  </div>
                </Card>
              </div>

              {/* Sidebar mobile preview */}
              <div className="mt-8">
                <Card>
                  <CardHeader title="Sidebar — mobile overlay preview" />
                  <div className="p-6">
                    <MobilePreview />
                    <p
                      className="mx-auto mt-4 max-w-xs text-center text-xs leading-relaxed text-text-tertiary"
                    >
                      Tap the icon. The real Sidebar uses Tailwind <code>md:</code> breakpoints
                      for the overlay vs docked split — this frame drives the same props directly
                      so the interaction is demonstrable without a narrow browser window.
                    </p>
                  </div>
                </Card>
              </div>

              <p
                className="mt-8 border-t pb-4 pt-6 text-xs border-border text-text-tertiary"
              >
                Shell components: Avatar · Badge · Switch · Card(+Header/Body/Footer) · Breadcrumb ·
                PageHeader · Tooltip · Pagination(meta API) ·
                Menu(+Trigger/Content/Item/CheckboxItem/Separator/Label) ·
                Sidebar(+Nav/Section/Item/Group/Footer/Account/LogoutButton) · Navbar
                — all in <code>src/components/ui/</code>, exported from <code>index.ts</code>.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
