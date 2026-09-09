"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus, Search, MoreHorizontal, ChevronDown, X, SlidersHorizontal,
  Download, ShieldCheck, ShieldAlert, AlertTriangle, Clock, WifiOff,
  Loader2, Lock, Check as CheckIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SortHeader } from "@/components/ui/sort-header";
import { StatCard } from "@/components/ui/stat-card";
import { ExceptionStrip } from "@/components/ui/exception-strip";
import { Banner } from "@/components/ui/banner";
import { Blank } from "@/components/ui/blank";
import { SkeletonRows } from "@/components/ui/skeleton-rows";
import { Pagination } from "@/components/ui/pagination";
import { Tabs } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { Toolbar, ButtonGroup } from "@/components/ui/button-group";
import { Select } from "@/components/ui/select";

const TABS = [
  { id: "active", label: "Active", count: 1284 },
  { id: "pending", label: "Pending", count: 12, urgent: true },
  { id: "invited", label: "Invited", count: 5 },
  { id: "suspended", label: "Suspended", count: 3, urgent: true },
  { id: "deactivated", label: "Deactivated", count: 41 },
  { id: "all", label: "All", count: 1345 },
];

const TAB_NOUNS: Record<string, string> = {
  active: "Active users", pending: "Pending users", invited: "Invited users",
  suspended: "Suspended users", deactivated: "Deactivated users", all: "All users",
};

const ROWS = [
  { id: 1, name: "Amina Wanjiru", email: "amina.w@steward.co.ke", role: "Controller", mfa: true, last: "4 minutes ago", lastExact: "30 Jul 2026, 09:41 EAT", created: "12 Jan 2025", init: "AW" },
  { id: 2, name: "Brian Otieno", email: "b.otieno@steward.co.ke", role: "Approver", mfa: true, last: "2 hours ago", lastExact: "30 Jul 2026, 07:20 EAT", created: "03 Mar 2025", init: "BO" },
  { id: 3, name: "Dennis Ndung\u2019u", email: "dennis@steward.co.ke", role: "Owner", mfa: true, last: "Just now", lastExact: "30 Jul 2026, 09:45 EAT", created: "02 Jan 2025", init: "DN", self: true },
  { id: 4, name: "Faith Kamau", email: "faith.k@steward.co.ke", role: "Preparer", mfa: false, last: "6 days ago", lastExact: "24 Jul 2026, 16:02 EAT", created: "18 Apr 2025", init: "FK" },
  { id: 5, name: "Grace Mwende", email: "g.mwende@steward.co.ke", role: "Auditor", mfa: true, last: "Yesterday", lastExact: "29 Jul 2026, 11:38 EAT", created: "21 May 2025", init: "GM" },
  { id: 6, name: "Hassan Ali", email: "h.ali@steward.co.ke", role: "Preparer", mfa: false, last: "3 weeks ago", lastExact: "08 Jul 2026, 08:14 EAT", created: "02 Jun 2025", init: "HA" },
  { id: 7, name: "Irene Njoki", email: "i.njoki@steward.co.ke", role: "Approver", mfa: true, last: "5 hours ago", lastExact: "30 Jul 2026, 04:50 EAT", created: "14 Jun 2025", init: "IN" },
  { id: 8, name: "Kevin Mutua", email: "k.mutua@steward.co.ke", role: "Controller", mfa: true, last: "11 minutes ago", lastExact: "30 Jul 2026, 09:34 EAT", created: "27 Jun 2025", init: "KM" },
];

const COLUMNS = [
  { key: "user", label: "User", locked: true },
  { key: "role", label: "Role" },
  { key: "mfa", label: "MFA" },
  { key: "last", label: "Last active" },
  { key: "created", label: "Created" },
];

type ViewState = "normal" | "loading" | "refetching" | "stale" | "empty" | "emptyFiltered" | "searchEmpty" | "error" | "forbidden" | "offline" | "slow" | "rowPending" | "rowError";

const VIEWS: [ViewState, string][] = [
  ["normal", "Normal"],
  ["loading", "Loading \u2014 initial"],
  ["refetching", "Loading \u2014 refetch"],
  ["stale", "Stale \u2014 refresh failed"],
  ["empty", "Empty \u2014 nothing exists"],
  ["emptyFiltered", "Empty \u2014 filters match nothing"],
  ["searchEmpty", "Empty \u2014 search no results"],
  ["error", "Error \u2014 fetch failed"],
  ["forbidden", "Error \u2014 no permission"],
  ["offline", "Offline"],
  ["slow", "Slow \u2014 still loading"],
  ["rowPending", "Row \u2014 action in flight"],
  ["rowError", "Row \u2014 action failed"],
];

const STRIP_ITEMS = [
  { label: "MFA coverage", value: "96%", tone: "pine" as const },
  { label: "Privileged", value: "12", tone: "neutral" as const },
  { label: "Dormant 90d+", value: "4", tone: "amber" as const },
];

export default function UsersTablePage() {
  const [view, setView] = useState<ViewState>("normal");
  const [tab, setTab] = useState("active");
  const [sel, setSel] = useState<number[]>([]);
  const [sort, setSort] = useState({ key: "created", dir: "desc" });
  const [perPage, setPerPage] = useState(25);
  const [page, setPage] = useState(6);
  const [openKebab, setOpenKebab] = useState<number | null>(null);
  const [colsOpen, setColsOpen] = useState(false);
  const [selectAllMatching, setSelectAllMatching] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const kebabRef = useRef<HTMLTableCellElement | null>(null);
  const colsRef = useRef<HTMLDivElement | null>(null);
  const moreRef = useRef<HTMLDivElement | null>(null);
  // Mirror state into refs so the single mousedown handler can read current values
  // without being re-registered on every state change (which caused a listener storm).
  const openKebabRef = useRef(openKebab);
  const colsOpenRef = useRef(colsOpen);
  const moreOpenRef = useRef(moreOpen);
  openKebabRef.current = openKebab;
  colsOpenRef.current = colsOpen;
  moreOpenRef.current = moreOpen;

  // Single persistent outside-click handler — registered once on mount.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (openKebabRef.current !== null && kebabRef.current && !kebabRef.current.contains(e.target as Node)) {
        setOpenKebab(null);
      }
      if (colsOpenRef.current && colsRef.current && !colsRef.current.contains(e.target as Node)) {
        setColsOpen(false);
      }
      if (moreOpenRef.current && moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []); // empty deps — handler reads live values via refs
  const [visible, setVisible] = useState<Record<string, boolean>>({ user: true, role: true, mfa: true, last: true, created: true });
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [cardsMode, setCardsMode] = useState<"off" | "strip" | "compact" | "full">("full");

  const meta = TABS.find((t) => t.id === tab)!;
  const total = meta.count;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const rowPad = "py-3";

  const isBlank = ["empty", "emptyFiltered", "searchEmpty", "error", "forbidden"].includes(view);
  const cardsLoading = view === "loading";
  const cardsErrored = view === "error" || view === "forbidden";
  const dim = view === "refetching";

  const toggleSort = (key: string) =>
    setSort((s) => (s.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : { key: "created", dir: "desc" }));

  const allSel = sel.length === ROWS.length;
  const someSel = sel.length > 0 && !allSel;
  const shownCols = COLUMNS.filter((c) => visible[c.key]);

  const captionSub = () => {
    if (view === "loading") return "Loading\u2026";
    if (view === "error") return "Couldn\u2019t load";
    if (view === "searchEmpty") return `No matches for \u201cotieno\u201d`;
    const bits: string[] = [];
    if (roleFilter) bits.push(`Role: ${roleFilter}`);
    if (query) bits.push(`matching \u201c${query}\u201d`);
    if (bits.length) return `${bits.join(" \u00B7 ")} \u00B7 42 of ${total.toLocaleString()}`;
    return `${total.toLocaleString()} people \u00B7 as of 09:45 EAT`;
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-6 sm:px-10">
      <PageHeader
        title="Data Table"
        description="A users table pattern — sortable columns, selection, pagination, and every loading / empty / error state."
        actions={
          <button className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-medium text-on-accent shadow-sm transition-[transform,box-shadow] hover:shadow-md active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
            <Plus size={15} strokeWidth={2.5} /> Add user
          </button>
        }
      />

      {/* Demo controls — cycle the table through its states */}
      <Toolbar aria-label="Demo controls" className="mb-6">
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">Demo</span>
        <div className="w-56">
          <Select
            value={view}
            onChange={(v) => setView(v as ViewState)}
            options={VIEWS.map(([v, l]) => ({ value: v, label: l }))}
          />
        </div>
        <ButtonGroup
          aria-label="Cards mode"
          value={cardsMode}
          onChange={(v) => setCardsMode(v as typeof cardsMode)}
          options={[
            { value: "off", label: "Off" },
            { value: "strip", label: "Strip" },
            { value: "compact", label: "Compact" },
            { value: "full", label: "Full" },
          ]}
        />
      </Toolbar>

      {/* Framed pattern preview */}
      <div className="overflow-hidden rounded-xl border border-border bg-bg p-4 sm:p-6">
        {/* stat cards */}
        {cardsMode !== "off" && (
          <div className="mb-6">
            <div className={cardsMode === "strip" ? "" : "sm:hidden"}>
              <ExceptionStrip items={STRIP_ITEMS} loading={cardsLoading} errored={cardsErrored} asOf="09:45" />
            </div>
            {cardsMode !== "strip" && (
              <div className="hidden gap-4 sm:grid sm:grid-cols-3">
                <StatCard compact={cardsMode === "compact"} label="MFA coverage" ring={96} value="96%" sub="1,277 of 1,284 enrolled" tone="pine" loading={cardsLoading} errored={cardsErrored} />
                <StatCard compact={cardsMode === "compact"} label="Privileged accounts" value="12" sub="Owner + Approver \u00B7 review quarterly" loading={cardsLoading} errored={cardsErrored} />
                <StatCard compact={cardsMode === "compact"} label="Dormant over 90 days" value="4" sub="1 of them privileged" tone="amber" loading={cardsLoading} errored={cardsErrored} />
              </div>
            )}
          </div>
        )}

        {/* tabs */}
        <Tabs
          value={tab}
          onChange={(id) => { setTab(id); setPage(1); setSel([]); setSelectAllMatching(false); }}
          items={TABS}
        />

        {/* table card */}
        <div className="mt-5 overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
          {/* caption strip */}
          <div className={`flex min-h-[64px] flex-wrap items-center gap-3 border-b border-border px-4 py-3 ${sel.length ? "bg-accent-light" : "bg-surface"}`}>
            {sel.length === 0 ? (
              <>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-text">{TAB_NOUNS[tab]}</h2>
                  <p className={`mt-0.5 truncate text-xs tabular-nums ${view === "error" ? "text-error" : "text-text-secondary"}`}>{captionSub()}</p>
                </div>
                <div className="ml-auto flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or email"
                      className="h-9 w-56 rounded-md border border-border pl-8 pr-3 text-sm text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent" />
                  </div>
                  <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                    className={`cursor-pointer h-9 rounded-md border border-border bg-surface px-2.5 text-sm ${roleFilter ? "text-text" : "text-text-secondary"}`}>
                    <option value="">All roles</option>
                    {["Owner", "Controller", "Approver", "Preparer", "Auditor"].map((r) => <option key={r}>{r}</option>)}
                  </select>
                  {/* columns visibility */}
                  <div className="relative" ref={colsRef}>
                    <button onClick={() => setColsOpen((o) => !o)} aria-expanded={colsOpen}
                      className={`cursor-pointer inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-2.5 text-sm text-text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${colsOpen ? "bg-bg-secondary" : "bg-surface"}`}>
                      <SlidersHorizontal size={14} /> Columns
                      <span className="tabular-nums text-text-tertiary">{shownCols.length}/{COLUMNS.length}</span>
                    </button>
                    {colsOpen && (
                      <div className="absolute right-0 top-full z-30 mt-1 w-60 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-lg">
                        <p className="px-3 pb-1 pt-1.5 text-xs font-medium uppercase tracking-wider text-text-tertiary">Show columns</p>
                        {COLUMNS.map((c) => (
                          <button key={c.key} disabled={c.locked}
                            onClick={() => setVisible((v) => ({ ...v, [c.key]: !v[c.key] }))}
                            className={`cursor-pointer flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm hover:bg-bg-hover disabled:cursor-not-allowed ${c.locked ? "text-text-tertiary" : "text-text"}`}>
                            <Checkbox checked={visible[c.key]} disabled={c.locked} />
                            <span className="flex-1">{c.label}</span>
                            {c.locked && <span className="text-[11px] text-text-tertiary">always on</span>}
                          </button>
                        ))}
                        <div className="my-1 h-px bg-border" />
                        <button onClick={() => setVisible({ user: true, role: true, mfa: true, last: true, created: true })}
                          className="cursor-pointer w-full px-3 py-1.5 text-left text-sm text-accent hover:bg-bg-hover">
                          Reset to default
                        </button>
                      </div>
                    )}
                  </div>
                  <button className="cursor-pointer inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-2.5 text-sm text-text-secondary">
                    <Download size={14} /> Export
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-sm font-semibold tabular-nums text-accent">
                  {(selectAllMatching ? total : sel.length).toLocaleString()} selected
                </span>
                <span className="h-5 w-px bg-border" />
                <button className="cursor-pointer h-8 rounded-md border border-border bg-surface px-2.5 text-sm">Change role</button>
                <button className="cursor-pointer h-8 rounded-md border border-border bg-surface px-2.5 text-sm">Require MFA</button>
                <div className="relative ml-auto" ref={moreRef}>
                  <button onClick={() => setMoreOpen((o) => !o)} aria-expanded={moreOpen}
                    className="cursor-pointer inline-flex h-8 items-center gap-1 rounded-md border border-border bg-surface px-2.5 text-sm">
                    More <ChevronDown size={13} />
                  </button>
                  {moreOpen && (
                    <div className="absolute right-0 top-full z-30 mt-1 w-48 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-lg">
                      <button className="cursor-pointer block w-full px-3 py-1.5 text-left text-sm hover:bg-bg-hover">Export selected</button>
                      <button className="cursor-pointer block w-full px-3 py-1.5 text-left text-sm hover:bg-bg-hover">Revoke sessions</button>
                      <div className="my-1 h-px bg-border" />
                      <button onClick={() => setMoreOpen(false)} className="cursor-pointer block w-full px-3 py-1.5 text-left text-sm text-error hover:bg-bg-hover">Suspend access</button>
                    </div>
                  )}
                </div>
                <button onClick={() => { setSel([]); setSelectAllMatching(false); }}
                  className="cursor-pointer inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm text-text-secondary">
                  <X size={14} /> Clear
                </button>
              </>
            )}
          </div>

          {/* select-all two-step */}
          {!isBlank && allSel && (
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b border-border bg-accent-light px-4 py-2 text-sm text-accent">
              {selectAllMatching ? (
                <>
                  <span>All <span className="font-semibold tabular-nums">{total.toLocaleString()}</span> users matching {TAB_NOUNS[tab].toLowerCase()} are selected.</span>
                  <button onClick={() => setSelectAllMatching(false)} className="cursor-pointer font-medium underline underline-offset-2">Select only this page</button>
                </>
              ) : (
                <>
                  <span>All <span className="font-semibold tabular-nums">{ROWS.length}</span> on this page are selected.</span>
                  <button onClick={() => setSelectAllMatching(true)} className="cursor-pointer font-medium underline underline-offset-2">Select all {total.toLocaleString()} matching</button>
                </>
              )}
            </div>
          )}

          {/* table-level banners */}
          {view === "stale" && <Banner tone="amber" icon={Clock} action="Retry">Showing data from 09:41. Couldn&apos;t refresh \u2014 figures may be out of date.</Banner>}
          {view === "offline" && <Banner tone="amber" icon={WifiOff} action="Retry">You&apos;re offline. Actions are disabled until you reconnect.</Banner>}
          {view === "slow" && <Banner tone="neutral" icon={Loader2}>Still loading. Narrowing the date range usually helps.</Banner>}
          {view === "rowError" && <Banner tone="rose" icon={AlertTriangle} action="Retry">Couldn&apos;t suspend Faith Kamau. Nothing was changed.</Banner>}

          {/* body */}
          {isBlank ? (
            view === "empty" ? (
              <Blank title="No users yet" body="Invite your first teammate to give them access to Steward." />
            ) : view === "emptyFiltered" ? (
              <Blank title="No users match these filters" body={`No ${meta.label.toLowerCase()} users with role ${roleFilter || "Auditor"}. Clear the filter to see all.`} />
            ) : view === "searchEmpty" ? (
              <Blank icon={Search} title={`No ${meta.label.toLowerCase()} users match \u201cotieno\u201d`}
                body="They may have a different status. Searching across every status usually finds them." />
            ) : view === "forbidden" ? (
              <Blank icon={Lock} title="You don\u2019t have access to user management" tone="rose"
                body="This needs the Owner or Controller role. Ask an owner to grant it." />
            ) : (
              <Blank icon={AlertTriangle} tone="rose" title="Couldn\u2019t load users"
                body="The request failed. Your filters are still applied — retrying keeps them."
                mono="ref 7f3a9c21" />
            )
          ) : (
            <div className="relative overflow-x-auto">
              {dim && <span className="absolute inset-x-0 top-0 z-10 h-0.5 animate-pulse bg-accent" />}
              <table className="w-full border-collapse text-left" style={{ opacity: dim ? 0.5 : 1, pointerEvents: dim ? "none" : "auto" }}>
                <caption className="sr-only">{TAB_NOUNS[tab]} \u2014 {captionSub()}</caption>
                <thead>
                  <tr className="bg-bg-secondary">
                    <th scope="col" className="w-10 px-4 py-2.5">
                      <Checkbox checked={allSel} indeterminate={someSel} onChange={() => setSel(allSel ? [] : ROWS.map((r) => r.id))} />
                    </th>
                    {visible.user && <SortHeader label="User" state={sort.key === "name" ? sort.dir as "asc" | "desc" : "none"} onClick={() => toggleSort("name")} />}
                    {visible.role && <th scope="col" className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-text-secondary">Role</th>}
                    {visible.mfa && <th scope="col" className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-text-secondary">MFA</th>}
                    {visible.last && <SortHeader label="Last active" state={sort.key === "last" ? sort.dir as "asc" | "desc" : "none"} onClick={() => toggleSort("last")} />}
                    {visible.created && <SortHeader label="Created" state={sort.key === "created" ? sort.dir as "asc" | "desc" : "none"} onClick={() => toggleSort("created")} />}
                    <th scope="col" className="w-12 px-4 py-2.5"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {view === "loading" || view === "slow" ? (
                    <SkeletonRows n={8} colCount={shownCols.length - 1} />
                  ) : (
                    ROWS.map((r) => {
                      const isSel = sel.includes(r.id);
                      const isPending = view === "rowPending" && r.id === 4;
                      const failed = view === "rowError" && r.id === 4;
                      return (
                        <tr key={r.id} className={`group relative cursor-pointer border-t border-border ${failed ? "bg-error-light" : isSel ? "bg-accent-light" : ""}`}
                          style={{
                            opacity: isPending ? 0.6 : 1,
                          }}
                          onMouseEnter={(e) => { if (!isSel && !failed) e.currentTarget.style.background = "var(--color-bg-secondary)"; }}
                          onMouseLeave={(e) => { if (!isSel && !failed) e.currentTarget.style.background = ""; }}>
                          {(isSel || failed) && <span className={`absolute inset-y-0 left-0 w-0.5 ${failed ? "bg-error" : "bg-accent"}`} />}
                          <td className={`px-4 ${rowPad}`} onClick={(e) => e.stopPropagation()}>
                            <Checkbox checked={isSel} disabled={isPending}
                              onChange={() => setSel((s) => (s.includes(r.id) ? s.filter((x) => x !== r.id) : [...s, r.id]))} />
                          </td>
                          {visible.user && (
                            <td className={`px-4 ${rowPad}`}>
                              <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-secondary text-xs font-medium text-text-secondary">{r.init}</span>
                                <span className="min-w-0">
                                  <span className="block truncate text-sm font-medium text-text">
                                    {r.name}
                                    {r.self && <span className="ml-1.5 text-xs font-normal text-text-tertiary">(you)</span>}
                                  </span>
                                  <span className="block truncate text-xs text-text-secondary">{r.email}</span>
                                </span>
                                {isPending && <Loader2 size={14} className="animate-spin text-text-secondary" />}
                                {failed && <span className="text-xs font-medium text-error">Suspend failed</span>}
                              </div>
                            </td>
                          )}
                          {visible.role && <td className={`px-4 ${rowPad}`}><Badge tone={r.role === "Owner" ? "pine" : "neutral"}>{r.role}</Badge></td>}
                          {visible.mfa && (
                            <td className={`px-4 ${rowPad}`}>
                              {r.mfa ? (
                                <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary"><ShieldCheck size={15} className="text-accent" /> Enrolled</span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-warning"><ShieldAlert size={15} /> Not enrolled</span>
                              )}
                            </td>
                          )}
                          {visible.last && <td className={`px-4 ${rowPad}`}><span className="text-sm tabular-nums text-text-secondary" title={r.lastExact}>{r.last}</span></td>}
                          {visible.created && <td className={`px-4 ${rowPad}`}><span className="text-sm tabular-nums text-text-secondary">{r.created}</span></td>}
                          <td className={`relative px-4 ${rowPad}`} onClick={(e) => e.stopPropagation()}
                            ref={(el) => { if (openKebab === r.id) kebabRef.current = el; }}>
                            {failed ? (
                              <button className="cursor-pointer text-xs font-medium text-error underline underline-offset-2">Retry</button>
                            ) : (
                              <button onClick={() => setOpenKebab(openKebab === r.id ? null : r.id)} disabled={isPending || view === "offline"}
                                aria-label={`Actions for ${r.name}`} aria-expanded={openKebab === r.id}
                                className={`cursor-pointer flex h-7 w-7 items-center justify-center rounded-md text-text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed ${openKebab === r.id ? "bg-bg-secondary" : "bg-transparent"}`}
                                style={{ opacity: view === "offline" ? 0.3 : openKebab === r.id ? 1 : 0.65 }}>
                                <MoreHorizontal size={16} />
                              </button>
                            )}
                            {openKebab === r.id && (
                              <div className="absolute right-4 top-full z-30 w-52 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-lg">
                                {["View details", "Edit profile", "Manage roles", "Reset password", "Revoke sessions"].map((a) => (
                                  <button key={a} className="cursor-pointer block w-full px-3 py-1.5 text-left text-sm text-text hover:bg-bg-hover">{a}</button>
                                ))}
                                <div className="my-1 h-px bg-border" />
                                <button disabled={r.self} className={`cursor-pointer block w-full px-3 py-1.5 text-left text-sm disabled:cursor-not-allowed ${r.self ? "text-text-tertiary" : "text-error"}`}>
                                  Suspend access
                                </button>
                                {r.self && <p className="px-3 pb-1 pt-0.5 text-[11px] text-text-tertiary">Unavailable on your own account</p>}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* pagination */}
          {!isBlank && (
            <Pagination
              page={page}
              pages={pages}
              perPage={perPage}
              total={total}
              onPageChange={setPage}
              onPerPageChange={(n) => { setPerPage(n); setPage(1); }}
              disabled={dim}
            />
          )}
        </div>
      </div>
    </div>
  );
}
