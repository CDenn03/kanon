import { useState } from "react";
import {
  Plus, Search, ChevronDown, ChevronUp, ChevronsUpDown, MoreHorizontal,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ShieldCheck,
  ShieldAlert, X, SlidersHorizontal, Download, Ruler, AlertTriangle,
  RefreshCw, WifiOff, Lock, Check as CheckIcon, Loader2, Clock,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Tokens — mapped to shadcn CSS-variable names so these drop
   into Steward's existing token layer.
   Status semantics drive the palette: pine = healthy/approved,
   amber = awaiting a human, rose = revoked/failed. Neutrals stay
   cold so those three are the only saturation on the page.
   ───────────────────────────────────────────────────────────── */
const T = {
  bg: "#FBFBFC", surface: "#FFFFFF", hairline: "#E7E8EC", muted: "#F4F5F7",
  ink: "#15171C", ink2: "#5B6070", ink3: "#8A90A0",
  accent: "#0B5D4E", accentSoft: "#E6F0ED",
  amber: "#8A5A00", amberSoft: "#FDF3E0",
  rose: "#8C2F39", roseSoft: "#FBEBEC",
};

const TABS = [
  { id: "active", label: "Active", noun: "Active users", count: 1284 },
  { id: "pending", label: "Pending", noun: "Pending users", count: 12, urgent: true },
  { id: "invited", label: "Invited", noun: "Invited users", count: 5 },
  { id: "suspended", label: "Suspended", noun: "Suspended users", count: 3, urgent: true },
  { id: "deactivated", label: "Deactivated", noun: "Deactivated users", count: 41 },
  { id: "all", label: "All", noun: "All users", count: 1345 },
];

const ROWS = [
  { id: 1, name: "Amina Wanjiru", email: "amina.w@steward.co.ke", role: "Controller", mfa: true, last: "4 minutes ago", lastExact: "30 Jul 2026, 09:41 EAT", created: "12 Jan 2025", init: "AW" },
  { id: 2, name: "Brian Otieno", email: "b.otieno@steward.co.ke", role: "Approver", mfa: true, last: "2 hours ago", lastExact: "30 Jul 2026, 07:20 EAT", created: "03 Mar 2025", init: "BO" },
  { id: 3, name: "Dennis Ndung'u", email: "dennis@steward.co.ke", role: "Owner", mfa: true, last: "Just now", lastExact: "30 Jul 2026, 09:45 EAT", created: "02 Jan 2025", init: "DN", self: true },
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

const VIEWS = [
  ["normal", "Normal"],
  ["loading", "Loading — initial"],
  ["refetching", "Loading — refetch / page change"],
  ["stale", "Stale — refresh failed"],
  ["empty", "Empty — nothing exists"],
  ["emptyFiltered", "Empty — filters match nothing"],
  ["searchEmpty", "Empty — search no results"],
  ["error", "Error — fetch failed"],
  ["forbidden", "Error — no permission"],
  ["offline", "Offline"],
  ["slow", "Slow — still loading"],
  ["tooMany", "Too many results"],
  ["rowPending", "Row — action in flight"],
  ["rowError", "Row — action failed"],
];

/* ── primitives ─────────────────────────────────────────────── */

function Spec({ children, side = "right" }) {
  return (
    <span className={`pointer-events-none absolute top-0 z-20 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[10px] leading-tight ${side === "right" ? "left-full ml-2" : "right-full mr-2"}`}
      style={{ background: T.ink, color: "#fff" }}>{children}</span>
  );
}

function Badge({ tone = "neutral", children }) {
  const m = { pine: [T.accentSoft, T.accent], amber: [T.amberSoft, T.amber], rose: [T.roseSoft, T.rose], neutral: [T.muted, T.ink2] }[tone];
  return <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: m[0], color: m[1] }}>{children}</span>;
}

function Check({ checked, indeterminate, disabled, onChange }) {
  return (
    <button type="button" disabled={disabled} onClick={onChange} role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      className="flex h-4 w-4 items-center justify-center rounded-sm border transition-colors focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed"
      style={{ borderColor: checked || indeterminate ? T.accent : T.hairline, background: checked || indeterminate ? T.accent : disabled ? T.muted : "#fff", opacity: disabled ? 0.5 : 1, outlineColor: T.accent }}>
      {indeterminate ? <span className="h-0.5 w-2 rounded-full" style={{ background: "#fff" }} />
        : checked ? <CheckIcon size={11} strokeWidth={3} color="#fff" /> : null}
    </button>
  );
}

function SortHeader({ label, state, onClick }) {
  const [hover, setHover] = useState(false);
  const active = state === "asc" || state === "desc";
  return (
    <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider" style={{ color: active ? T.ink : T.ink2 }}>
      <button type="button" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        className="inline-flex items-center gap-1.5 rounded uppercase tracking-wider focus:outline-none focus-visible:ring-2"
        style={{ color: "inherit", outlineColor: T.accent }}>
        {label}
        {state === "asc" ? <ChevronUp size={13} strokeWidth={2.5} />
          : state === "desc" ? <ChevronDown size={13} strokeWidth={2.5} />
          : <ChevronsUpDown size={13} style={{ color: T.ink3, opacity: hover ? 1 : 0 }} />}
      </button>
    </th>
  );
}

/* Stat card. Ring variant ONLY for metrics with a real ceiling. */
function StatCard({ label, value, sub, tone = "neutral", ring, loading, errored, onClick, compact }) {
  const fg = { pine: T.accent, amber: T.amber, rose: T.rose, neutral: T.ink }[tone];
  return (
    <button onClick={onClick} disabled={loading || errored}
      className={`relative flex items-center rounded-lg border text-left transition-colors disabled:cursor-default ${compact ? "gap-3 p-3" : "gap-4 p-4"}`}
      style={{ borderColor: T.hairline, background: T.surface }}>
      {ring !== undefined && (
        <span className={`relative flex shrink-0 items-center justify-center ${compact ? "h-8 w-8" : "h-11 w-11"}`}>
          <svg viewBox="0 0 40 40" className={`-rotate-90 ${compact ? "h-8 w-8" : "h-11 w-11"}`}>
            <circle cx="20" cy="20" r="16" fill="none" stroke={T.muted} strokeWidth="4" />
            {!loading && !errored && (
              <circle cx="20" cy="20" r="16" fill="none" stroke={fg} strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${(ring / 100) * 100.5} 100.5`} />
            )}
          </svg>
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium uppercase tracking-wider" style={{ color: T.ink2 }}>{label}</span>
        {loading ? (
          <span className={`block animate-pulse rounded ${compact ? "mt-1 h-5 w-16" : "mt-1.5 h-6 w-20"}`} style={{ background: T.muted }} />
        ) : (
          <span className={`mt-0.5 block font-semibold tabular-nums ${compact ? "text-xl" : "text-2xl"}`}
            style={{ color: errored ? T.ink3 : fg }}>{errored ? "—" : value}</span>
        )}
        {/* compact drops the sub-line — it moves to the title attribute */}
        {!compact && (
          <span className="mt-0.5 block truncate text-xs" style={{ color: errored ? T.rose : T.ink2 }}>
            {loading ? "\u00A0" : errored ? "Couldn't load · Retry" : sub}
          </span>
        )}
      </span>
    </button>
  );
}

/* Single-line variant. 44px instead of 118px — and the only form that
   should ever render below sm, where three stacked cards would push
   the table entirely off-screen. */
function ExceptionStrip({ loading, errored }) {
  const items = [
    { label: "MFA coverage", value: "96%", tone: "pine" },
    { label: "Privileged", value: "12", tone: "neutral" },
    { label: "Dormant 90d+", value: "4", tone: "amber" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1 rounded-lg border px-2 py-1.5"
      style={{ borderColor: T.hairline, background: T.surface }}>
      {items.map((it, i) => {
        const fg = { pine: T.accent, amber: T.amber, neutral: T.ink }[it.tone];
        return (
          <span key={it.label} className="flex items-center">
            {i > 0 && <span className="mx-1 h-4 w-px" style={{ background: T.hairline }} />}
            <button disabled={loading || errored}
              className="flex items-center gap-1.5 rounded px-2 py-1 text-sm disabled:cursor-default">
              <span style={{ color: T.ink2 }}>{it.label}</span>
              {loading ? (
                <span className="block h-3.5 w-8 animate-pulse rounded" style={{ background: T.muted }} />
              ) : (
                <span className="font-semibold tabular-nums" style={{ color: errored ? T.ink3 : fg }}>
                  {errored ? "—" : it.value}
                </span>
              )}
            </button>
          </span>
        );
      })}
      <span className="ml-auto pr-1 font-mono text-[10px]" style={{ color: T.ink3 }}>as of 09:45</span>
    </div>
  );
}

function Banner({ tone, icon: Icon, children, action }) {
  const m = { amber: [T.amberSoft, T.amber], rose: [T.roseSoft, T.rose], neutral: [T.muted, T.ink2] }[tone];
  return (
    <div className="flex flex-wrap items-center gap-2 border-b px-4 py-2.5 text-sm" style={{ background: m[0], color: m[1], borderColor: T.hairline }}>
      <Icon size={15} className="shrink-0" />
      <span className="flex-1">{children}</span>
      {action && <button className="rounded px-2 py-0.5 text-sm font-medium underline underline-offset-2">{action}</button>}
    </div>
  );
}

function Blank({ icon: Icon, title, body, primary, secondary, mono, tone = "neutral" }) {
  const fg = { rose: T.rose, amber: T.amber, neutral: T.ink3 }[tone];
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      {Icon && <Icon size={22} style={{ color: fg }} />}
      <p className="mt-3 text-base font-medium" style={{ color: T.ink }}>{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed" style={{ color: T.ink2 }}>{body}</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {primary && (
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md px-3.5 text-sm font-medium text-white" style={{ background: T.accent }}>
            {primary}
          </button>
        )}
        {secondary && (
          <button className="h-9 rounded-md border px-3.5 text-sm font-medium" style={{ borderColor: T.hairline, color: T.ink }}>{secondary}</button>
        )}
      </div>
      {mono && <p className="mt-5 font-mono text-[11px]" style={{ color: T.ink3 }}>{mono}</p>}
    </div>
  );
}

function SkeletonRows({ n, colCount }) {
  return Array.from({ length: n }).map((_, i) => (
    <tr key={i} className="border-t" style={{ borderColor: T.hairline }}>
      <td className="px-4 py-3"><span className="block h-4 w-4 rounded-sm" style={{ background: T.muted }} /></td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-3">
          <span className="h-8 w-8 shrink-0 animate-pulse rounded-full" style={{ background: T.muted }} />
          <span className="flex-1">
            <span className="block h-3 animate-pulse rounded" style={{ background: T.muted, width: `${55 + ((i * 7) % 30)}%` }} />
            <span className="mt-1.5 block h-2.5 animate-pulse rounded" style={{ background: T.muted, width: `${40 + ((i * 11) % 25)}%` }} />
          </span>
        </span>
      </td>
      {Array.from({ length: colCount }).map((_, c) => (
        <td key={c} className="px-4 py-3"><span className="block h-3 animate-pulse rounded" style={{ background: T.muted, width: `${45 + ((c * 13 + i * 5) % 35)}%` }} /></td>
      ))}
      <td className="px-4 py-3" />
    </tr>
  ));
}

/* ── main ───────────────────────────────────────────────────── */

export default function UsersPageWireframe() {
  const [cardsMode, setCardsMode] = useState("full"); // off | strip | compact | full
  const [annotate, setAnnotate] = useState(false);
  const [density, setDensity] = useState("comfortable");
  const [view, setView] = useState("normal");

  const [tab, setTab] = useState("active");
  const [sel, setSel] = useState([]);
  const [sort, setSort] = useState({ key: "created", dir: "desc" });
  const [perPage, setPerPage] = useState(25);
  const [page, setPage] = useState(6);
  const [openKebab, setOpenKebab] = useState(null);
  const [colsOpen, setColsOpen] = useState(false);
  const [jumpAt, setJumpAt] = useState(null); // which ellipsis is acting as the jump input
  const [selectAllMatching, setSelectAllMatching] = useState(false); // page-selection vs query-selection
  const [moreOpen, setMoreOpen] = useState(false);
  const [pending, setPending] = useState(null);   // { action } — pre-flight open
  const [confirmText, setConfirmText] = useState("");
  const [result, setResult] = useState(null);     // partial-failure report
  const [visible, setVisible] = useState({ user: true, role: true, mfa: true, last: true, created: true });
  const [query, setQuery] = useState(view === "searchEmpty" ? "otieno" : "");
  const [roleFilter, setRoleFilter] = useState("");

  const meta = TABS.find((t) => t.id === tab);
  const total = meta.count;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const rowPad = density === "compact" ? "py-2" : "py-3";

  const isBlank = ["empty", "emptyFiltered", "searchEmpty", "error", "forbidden"].includes(view);
  const cardsLoading = view === "loading";
  const cardsErrored = view === "error" || view === "forbidden";
  const dim = view === "refetching";
  const filtersActive = Boolean(roleFilter) || Boolean(query) || view === "searchEmpty" || view === "emptyFiltered";
  const shownCols = COLUMNS.filter((c) => visible[c.key]);

  const toggleSort = (key) =>
    setSort((s) => (s.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : { key: "created", dir: "desc" }));

  const allSel = sel.length === ROWS.length;
  const someSel = sel.length > 0 && !allSel;

  /* Pre-flight: what a bulk action would actually do. Computed BEFORE
     execution so heterogeneous selections are disclosed, not discovered
     as errors afterwards. */
  const preflight = () => {
    const n = selectAllMatching ? total : sel.length;
    const skipSelf = selectAllMatching ? 1 : sel.includes(3) ? 1 : 0;
    const skipAlready = selectAllMatching ? 2 : 0;
    const skipped = skipSelf + skipAlready;
    return { n, eligible: n - skipped, skipSelf, skipAlready, skipped };
  };

  /* Friction scales with blast radius, not with destructiveness alone. */
  const frictionFor = (eligible) => (eligible >= 200 ? "type" : eligible >= 10 ? "count" : "simple");

  const runBulk = () => {
    const t = preflight();
    const failed = t.eligible >= 10 ? Math.max(1, Math.round(t.eligible * 0.015)) : 0;
    setResult({ ...t, ok: t.eligible - failed, failed, batch: "b-4f19ac" });
    setPending(null);
    setConfirmText("");
  };

  const pageList = () => {
    const out = [1];
    if (page > 4) out.push("…");
    for (let p = Math.max(2, page - 1); p <= Math.min(pages - 1, page + 1); p++) out.push(p);
    if (page < pages - 3) out.push("…");
    if (pages > 1) out.push(pages);
    return out;
  };

  /* caption sub-line: states the EFFECTIVE query in words. This is the
     part that isn't redundant with the H1 or the tab. */
  const captionSub = () => {
    if (view === "loading") return "Loading…";
    if (view === "error") return "Couldn't load";
    if (view === "searchEmpty") return `No matches for “${query || "otieno"}”`;
    const bits = [];
    if (roleFilter) bits.push(`Role: ${roleFilter}`);
    if (query) bits.push(`matching “${query}”`);
    if (bits.length) return `${bits.join(" · ")} · ${(42).toLocaleString()} of ${total.toLocaleString()}`;
    return `${total.toLocaleString()} ${total === 1 ? "person" : "people"} · as of 09:45 EAT`;
  };

  return (
    <div className="min-h-screen w-full pb-24" style={{ background: T.bg, color: T.ink }}>
      {/* wireframe controls — not part of the design */}
      <div className="sticky top-0 z-40 flex flex-wrap items-center gap-2 border-b px-4 py-2 text-xs" style={{ background: T.ink, borderColor: T.ink, color: "#C9CDD8" }}>
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#8A90A0" }}>controls</span>
        <button
          onClick={() => setCardsMode((m) => ({ off: "strip", strip: "compact", compact: "full", full: "off" }[m]))}
          className="rounded px-2 py-1 font-medium"
          style={{ background: cardsMode === "off" ? "#2A2D36" : T.accent, color: "#fff" }}>
          Cards: {cardsMode}
        </button>
        <span className="hidden font-mono text-[10px] lg:block" style={{ color: "#6E7482" }}>
          {{ off: "0px · 10 rows above the fold", strip: "44px · 9 rows", compact: "72px · 9 rows", full: "118px · 8 rows" }[cardsMode]}
        </span>
        <button onClick={() => setAnnotate((v) => !v)} className="inline-flex items-center gap-1 rounded px-2 py-1 font-medium" style={{ background: annotate ? T.accent : "#2A2D36", color: "#fff" }}>
          <Ruler size={12} /> Specs {annotate ? "on" : "off"}
        </button>
        <button onClick={() => setDensity((d) => (d === "compact" ? "comfortable" : "compact"))} className="rounded px-2 py-1 font-medium" style={{ background: "#2A2D36", color: "#fff" }}>
          {density}
        </button>
        <label className="ml-auto flex items-center gap-2">
          <span style={{ color: "#8A90A0" }}>State</span>
          <select value={view} onChange={(e) => setView(e.target.value)} className="rounded px-2 py-1 font-medium" style={{ background: "#2A2D36", color: "#fff" }}>
            {VIEWS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pt-8 sm:px-10">
        {/* page header */}
        <div className="mb-6 flex items-start justify-between gap-6">
          <div className="relative">
            {annotate && <Spec>text-2xl · 600 · tracking-tight</Spec>}
            <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
            <p className="mt-1 max-w-xl text-sm" style={{ color: T.ink2 }}>
              People with access to this organisation. Role changes take effect on their next sign-in.
            </p>
          </div>
          <div className="relative shrink-0">
            {annotate && <Spec side="left">h-9 · page-level · fixed position</Spec>}
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md px-3.5 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ background: T.accent, outlineColor: T.accent }}>
              <Plus size={15} strokeWidth={2.5} /> Add user
            </button>
          </div>
        </div>

        {/* cards — exception counts only, each one a saved query */}
        {cardsMode !== "off" && (
          <div className="relative mb-6">
            {annotate && (
              <span className="absolute -top-5 left-0 z-20 rounded px-1.5 py-0.5 font-mono text-[10px]" style={{ background: T.ink, color: "#fff" }}>
                label text-xs/500/uppercase · value text-2xl/600/tabular-nums · each card is a filter link
              </span>
            )}
            {/* Below sm the strip is the ONLY form — vertically stacked cards
                would cost ~220px and push the table off the first screen. */}
            <div className={cardsMode === "strip" ? "" : "sm:hidden"}>
              <ExceptionStrip loading={cardsLoading} errored={cardsErrored} />
            </div>
            {cardsMode !== "strip" && (
              <div className="hidden gap-4 sm:grid sm:grid-cols-3">
                <StatCard compact={cardsMode === "compact"} label="MFA coverage" ring={96} value="96%" sub="1,277 of 1,284 enrolled" tone="pine" loading={cardsLoading} errored={cardsErrored} />
                <StatCard compact={cardsMode === "compact"} label="Privileged accounts" value="12" sub="Owner + Approver · review quarterly" loading={cardsLoading} errored={cardsErrored} />
                <StatCard compact={cardsMode === "compact"} label="Dormant over 90 days" value="4" sub="1 of them privileged" tone="amber" loading={cardsLoading} errored={cardsErrored} />
              </div>
            )}
            {cardsLoading && (
              <p className="mt-2 font-mono text-[11px]" style={{ color: T.ink3 }}>
                Loading shows a skeleton, never 0 — a placeholder zero on a financial figure gets read as fact.
              </p>
            )}
            {cardsErrored && (
              <p className="mt-2 font-mono text-[11px]" style={{ color: T.rose }}>
                Failed aggregates show “—”, never 0.
              </p>
            )}
          </div>
        )}

        {/* status tabs */}
        <div className="relative">
          {annotate && (
            <span className="absolute -top-5 left-0 z-20 rounded px-1.5 py-0.5 font-mono text-[10px]" style={{ background: T.ink, color: "#fff" }}>
              text-sm/500 · h-10 · 2px underline · counts tabular-nums
            </span>
          )}
          <div className="flex items-end gap-1 overflow-x-auto border-b" style={{ borderColor: T.hairline }}>
            {TABS.map((t) => {
              const on = t.id === tab;
              return (
                <button key={t.id} onClick={() => { setTab(t.id); setPage(1); setSel([]); setSelectAllMatching(false); }}
                  className="relative flex h-10 shrink-0 items-center gap-2 px-3 text-sm font-medium focus:outline-none focus-visible:ring-2"
                  style={{ color: on ? T.ink : T.ink2, outlineColor: T.accent }}>
                  {t.label}
                  <span className="rounded px-1.5 py-0.5 text-xs tabular-nums"
                    style={{ background: on ? T.accentSoft : T.muted, color: t.urgent && !on ? T.amber : on ? T.accent : T.ink2, fontWeight: t.urgent ? 600 : 500 }}>
                    {t.count.toLocaleString()}
                  </span>
                  {on && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full" style={{ background: T.accent }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* table card */}
        <div className="mt-5 overflow-hidden rounded-lg border shadow-sm" style={{ borderColor: T.hairline, background: T.surface }}>
          {/* caption strip: dynamic name left, view controls right */}
          <div className="relative flex min-h-[64px] flex-wrap items-center gap-3 border-b px-4 py-3" style={{ borderColor: T.hairline, background: sel.length ? T.accentSoft : T.surface }}>
            {annotate && (
              <span className="absolute -top-5 left-0 z-20 rounded px-1.5 py-0.5 font-mono text-[10px]" style={{ background: T.ink, color: "#fff" }}>
                caption text-sm/600 · sub text-xs · renders as &lt;caption&gt; for screen readers
              </span>
            )}

            {sel.length === 0 ? (
              <>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold" style={{ color: T.ink }}>{meta.noun}</h2>
                  <p className="mt-0.5 truncate text-xs tabular-nums" style={{ color: view === "error" ? T.rose : T.ink2 }}>
                    {captionSub()}
                  </p>
                </div>
                <div className="ml-auto flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: T.ink3 }} />
                    <input value={view === "searchEmpty" ? "otieno" : query} onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search name or email"
                      className="h-9 w-56 rounded-md border pl-8 pr-3 text-sm focus:outline-none focus-visible:ring-2"
                      style={{ borderColor: T.hairline, color: T.ink, outlineColor: T.accent }} />
                  </div>
                  <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                    className="h-9 rounded-md border px-2.5 text-sm" style={{ borderColor: T.hairline, color: roleFilter ? T.ink : T.ink2, background: T.surface }}>
                    <option value="">All roles</option>
                    {["Owner", "Controller", "Approver", "Preparer", "Auditor"].map((r) => <option key={r}>{r}</option>)}
                  </select>

                  {/* COLUMNS — visibility control */}
                  <div className="relative">
                    <button onClick={() => setColsOpen((o) => !o)} aria-expanded={colsOpen}
                      className="inline-flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-sm focus:outline-none focus-visible:ring-2"
                      style={{ borderColor: T.hairline, color: T.ink2, background: colsOpen ? T.muted : T.surface, outlineColor: T.accent }}>
                      <SlidersHorizontal size={14} /> Columns
                      <span className="tabular-nums" style={{ color: T.ink3 }}>{shownCols.length}/{COLUMNS.length}</span>
                    </button>
                    {colsOpen && (
                      <div className="absolute right-0 top-full z-30 mt-1 w-60 overflow-hidden rounded-md border bg-white py-1 shadow-lg" style={{ borderColor: T.hairline }}>
                        <p className="px-3 pb-1 pt-1.5 text-xs font-medium uppercase tracking-wider" style={{ color: T.ink3 }}>Show columns</p>
                        {COLUMNS.map((c) => (
                          <button key={c.key} disabled={c.locked}
                            onClick={() => setVisible((v) => ({ ...v, [c.key]: !v[c.key] }))}
                            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm hover:bg-slate-50 disabled:cursor-not-allowed"
                            style={{ color: c.locked ? T.ink3 : T.ink }}>
                            <Check checked={visible[c.key]} disabled={c.locked} />
                            <span className="flex-1">{c.label}</span>
                            {c.locked && <span className="text-[11px]" style={{ color: T.ink3 }}>always on</span>}
                          </button>
                        ))}
                        <div className="my-1 h-px" style={{ background: T.hairline }} />
                        <button onClick={() => setVisible({ user: true, role: true, mfa: true, last: true, created: true })}
                          className="w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50" style={{ color: T.accent }}>
                          Reset to default
                        </button>
                        <p className="px-3 pb-1.5 pt-1 text-[11px] leading-snug" style={{ color: T.ink3 }}>
                          Saved to your account, so it follows you across devices.
                        </p>
                      </div>
                    )}
                  </div>

                  <button className="inline-flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-sm" style={{ borderColor: T.hairline, color: T.ink2 }}>
                    <Download size={14} /> Export
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-sm font-semibold tabular-nums" style={{ color: T.accent }}>
                  {(selectAllMatching ? total : sel.length).toLocaleString()} selected
                </span>
                <span className="h-5 w-px" style={{ background: T.hairline }} />
                {/* benign actions only */}
                <button onClick={() => setPending("role")} className="h-8 rounded-md border bg-white px-2.5 text-sm" style={{ borderColor: T.hairline }}>Change role</button>
                <button onClick={() => setPending("mfa")} className="h-8 rounded-md border bg-white px-2.5 text-sm" style={{ borderColor: T.hairline }}>Require MFA</button>

                {/* destructive is NOT adjacent to benign at equal weight —
                    muscle memory for the 2nd button must not reach it */}
                <div className="relative ml-auto">
                  <button onClick={() => setMoreOpen((o) => !o)} aria-expanded={moreOpen}
                    className="inline-flex h-8 items-center gap-1 rounded-md border bg-white px-2.5 text-sm" style={{ borderColor: T.hairline }}>
                    More <ChevronDown size={13} />
                  </button>
                  {moreOpen && (
                    <div className="absolute right-0 top-full z-30 mt-1 w-48 overflow-hidden rounded-md border bg-white py-1 shadow-lg" style={{ borderColor: T.hairline }}>
                      <button className="block w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50">Export selected</button>
                      <button className="block w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50">Revoke sessions</button>
                      <div className="my-1 h-px" style={{ background: T.hairline }} />
                      <button onClick={() => { setMoreOpen(false); setPending("suspend"); }}
                        className="block w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50" style={{ color: T.rose }}>
                        Suspend access
                      </button>
                    </div>
                  )}
                </div>
                <button onClick={() => { setSel([]); setSelectAllMatching(false); }}
                  className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm" style={{ color: T.ink2 }}>
                  <X size={14} /> Clear
                </button>
              </>
            )}
          </div>

          {/* SELECT-ALL TWO-STEP — page-selection and query-selection are
              different things and must never be conflated. Both states are
              stated numerically. */}
          {!isBlank && allSel && (
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b px-4 py-2 text-sm"
              style={{ background: T.accentSoft, borderColor: T.hairline, color: T.accent }}>
              {selectAllMatching ? (
                <>
                  <span>
                    All <span className="font-semibold tabular-nums">{total.toLocaleString()}</span> users matching{" "}
                    <span className="font-medium">{meta.noun.toLowerCase()}</span> are selected — including{" "}
                    {(total - ROWS.length).toLocaleString()} not shown on this page.
                  </span>
                  <button onClick={() => setSelectAllMatching(false)} className="font-medium underline underline-offset-2">
                    Select only this page
                  </button>
                </>
              ) : (
                <>
                  <span>All <span className="font-semibold tabular-nums">{ROWS.length}</span> on this page are selected.</span>
                  <button onClick={() => setSelectAllMatching(true)} className="font-medium underline underline-offset-2">
                    Select all {total.toLocaleString()} matching
                  </button>
                </>
              )}
            </div>
          )}

          {/* table-level banners */}
          {view === "stale" && <Banner tone="amber" icon={Clock} action="Retry">Showing data from 09:41. Couldn't refresh just now — figures may be out of date.</Banner>}
          {view === "offline" && <Banner tone="amber" icon={WifiOff} action="Retry">You're offline. This is the last loaded page; actions are disabled until you reconnect.</Banner>}
          {view === "slow" && <Banner tone="neutral" icon={Loader2}>Still loading. This filter covers a large range — narrowing the date range usually helps.</Banner>}
          {view === "tooMany" && <Banner tone="amber" icon={AlertTriangle} action="Add a filter">Your filter matches 84,213 records. Export is capped at 10,000 rows — narrow it first.</Banner>}
          {view === "rowError" && <Banner tone="rose" icon={AlertTriangle} action="Retry">Couldn't suspend Faith Kamau. Nothing was changed.</Banner>}

          {/* body */}
          {isBlank ? (
            view === "empty" ? (
              <Blank title="No users yet" body="Invite your first teammate to give them access to Steward." primary="Add user"
                mono="Empty — the dataset is genuinely empty, so the create CTA belongs here." />
            ) : view === "emptyFiltered" ? (
              <Blank title="No users match these filters" body={`No ${meta.label.toLowerCase()} users with role ${roleFilter || "Auditor"}. Clearing the role filter shows all ${total.toLocaleString()}.`}
                secondary="Clear filters" mono="Empty-filtered — data exists, so never offer “Add user” here." />
            ) : view === "searchEmpty" ? (
              <Blank icon={Search} title={`No ${meta.label.toLowerCase()} users match “otieno”`}
                body="They may have a different status. Searching across every status usually finds them."
                primary="Search all statuses" secondary="Clear search"
                mono="Search-empty — offers the cross-tab escape hatch, because scoped search is the usual reason a search fails." />
            ) : view === "forbidden" ? (
              <Blank icon={Lock} title="You don't have access to user management" tone="rose"
                body="This needs the Owner or Controller role. Ask an owner to grant it, or switch to an organisation where you have access."
                secondary="Request access" mono="403 — no Retry button. Retrying a permission error just fails again." />
            ) : (
              <Blank icon={AlertTriangle} tone="rose" title="Couldn't load users"
                body="The request failed before any data came back. Your filters are still applied — retrying keeps them."
                primary="Retry" secondary="Reload page"
                mono="Error · ref 7f3a9c21 — quote this to support" />
            )
          ) : (
            <div className="relative overflow-x-auto">
              {dim && <span className="absolute inset-x-0 top-0 z-10 h-0.5 animate-pulse" style={{ background: T.accent }} />}
              <table className="w-full border-collapse text-left" style={{ opacity: dim ? 0.5 : 1, pointerEvents: dim ? "none" : "auto" }}>
                <caption className="sr-only">{meta.noun} — {captionSub()}</caption>
                <thead>
                  <tr style={{ background: T.muted }}>
                    <th scope="col" className="w-10 px-4 py-2.5">
                      <Check checked={allSel} indeterminate={someSel} onChange={() => setSel(allSel ? [] : ROWS.map((r) => r.id))} />
                    </th>
                    {visible.user && <SortHeader label="User" state={sort.key === "name" ? sort.dir : "none"} onClick={() => toggleSort("name")} />}
                    {visible.role && <th scope="col" className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider" style={{ color: T.ink2 }}>Role</th>}
                    {visible.mfa && <th scope="col" className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider" style={{ color: T.ink2 }}>MFA</th>}
                    {visible.last && <SortHeader label="Last active" state={sort.key === "last" ? sort.dir : "none"} onClick={() => toggleSort("last")} />}
                    {visible.created && <SortHeader label="Created" state={sort.key === "created" ? sort.dir : "none"} onClick={() => toggleSort("created")} />}
                    <th scope="col" className="w-12 px-4 py-2.5"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {view === "loading" || view === "slow" ? (
                    <SkeletonRows n={8} colCount={shownCols.length - 1} />
                  ) : (
                    ROWS.map((r) => {
                      const isSel = sel.includes(r.id);
                      const pending = view === "rowPending" && r.id === 4;
                      const failed = view === "rowError" && r.id === 4;
                      return (
                        <tr key={r.id} className="group relative cursor-pointer border-t"
                          style={{ borderColor: T.hairline, background: failed ? T.roseSoft : isSel ? T.accentSoft : undefined, opacity: pending ? 0.6 : 1 }}
                          onMouseEnter={(e) => { if (!isSel && !failed) e.currentTarget.style.background = T.muted; }}
                          onMouseLeave={(e) => { if (!isSel && !failed) e.currentTarget.style.background = ""; }}>
                          {(isSel || failed) && <span className="absolute inset-y-0 left-0 w-0.5" style={{ background: failed ? T.rose : T.accent }} />}
                          <td className={`px-4 ${rowPad}`} onClick={(e) => e.stopPropagation()}>
                            <Check checked={isSel} disabled={pending}
                              onChange={() => setSel((s) => (s.includes(r.id) ? s.filter((x) => x !== r.id) : [...s, r.id]))} />
                          </td>
                          {visible.user && (
                            <td className={`px-4 ${rowPad}`}>
                              <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium" style={{ background: T.muted, color: T.ink2 }}>{r.init}</span>
                                <span className="min-w-0">
                                  {/* real anchor — keyboard + cmd-click. Row click layers on top. */}
                                  <a href="#" className="block truncate text-sm font-medium underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2" style={{ color: T.ink, outlineColor: T.accent }}>
                                    {r.name}
                                    {r.self && <span className="ml-1.5 text-xs font-normal" style={{ color: T.ink3 }}>(you)</span>}
                                  </a>
                                  <span className="block truncate text-xs" style={{ color: T.ink2 }}>{r.email}</span>
                                </span>
                                {pending && <Loader2 size={14} className="animate-spin" style={{ color: T.ink2 }} />}
                                {failed && <span className="text-xs font-medium" style={{ color: T.rose }}>Suspend failed</span>}
                              </div>
                            </td>
                          )}
                          {visible.role && <td className={`px-4 ${rowPad}`}><Badge tone={r.role === "Owner" ? "pine" : "neutral"}>{r.role}</Badge></td>}
                          {visible.mfa && (
                            <td className={`px-4 ${rowPad}`}>
                              {r.mfa ? (
                                <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: T.ink2 }}><ShieldCheck size={15} style={{ color: T.accent }} /> Enrolled</span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: T.amber }}><ShieldAlert size={15} /> Not enrolled</span>
                              )}
                            </td>
                          )}
                          {visible.last && <td className={`px-4 ${rowPad}`}><span className="text-sm tabular-nums" style={{ color: T.ink2 }} title={r.lastExact}>{r.last}</span></td>}
                          {visible.created && <td className={`px-4 ${rowPad}`}><span className="text-sm tabular-nums" style={{ color: T.ink2 }}>{r.created}</span></td>}
                          <td className={`relative px-4 ${rowPad}`} onClick={(e) => e.stopPropagation()}>
                            {failed ? (
                              <button className="text-xs font-medium underline underline-offset-2" style={{ color: T.rose }}>Retry</button>
                            ) : (
                              <button onClick={() => setOpenKebab(openKebab === r.id ? null : r.id)} disabled={pending || view === "offline"}
                                aria-label={`Actions for ${r.name}`} aria-expanded={openKebab === r.id}
                                className="flex h-7 w-7 items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed"
                                style={{ color: T.ink2, background: openKebab === r.id ? T.muted : "transparent", opacity: view === "offline" ? 0.3 : openKebab === r.id ? 1 : 0.65, outlineColor: T.accent }}>
                                <MoreHorizontal size={16} />
                              </button>
                            )}
                            {openKebab === r.id && (
                              <div className="absolute right-4 top-full z-30 w-52 overflow-hidden rounded-md border bg-white py-1 shadow-lg" style={{ borderColor: T.hairline }}>
                                {["View details", "Edit profile", "Manage roles", "Reset password", "Revoke sessions"].map((a) => (
                                  <button key={a} className="block w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50" style={{ color: T.ink }}>{a}</button>
                                ))}
                                <div className="my-1 h-px" style={{ background: T.hairline }} />
                                <button disabled={r.self} className="block w-full px-3 py-1.5 text-left text-sm disabled:cursor-not-allowed" style={{ color: r.self ? T.ink3 : T.rose }}>
                                  Suspend access
                                </button>
                                {r.self && <p className="px-3 pb-1 pt-0.5 text-[11px]" style={{ color: T.ink3 }}>Unavailable on your own account</p>}
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

          {/* ── PAGINATION ─────────────────────────────────────
              Two zones with a real boundary, and it DEGRADES by dropping
              controls at breakpoints rather than wrapping into an orphan row.
              Redundancy removed: the highlighted button already says "page 6",
              so the "Page 6 of 52" text only appears at widths where the
              numbered buttons are gone. "Go to" is no longer permanent — the
              ellipsis becomes the jump input on click.                      */}
          {!isBlank && (
            <div className="flex flex-col gap-3 border-t px-4 py-3 lg:flex-row lg:items-center lg:justify-between"
              style={{ borderColor: T.hairline, opacity: dim ? 0.5 : 1 }}>

              {/* zone 1 — where am I in the data */}
              <div className="flex items-center gap-3 text-sm" style={{ color: T.ink2 }}>
                <span className="tabular-nums">
                  <span style={{ color: T.ink, fontWeight: 500 }}>{from.toLocaleString()}–{to.toLocaleString()}</span>
                  {" of "}
                  <span style={{ color: T.ink, fontWeight: 500 }}>{total.toLocaleString()}</span>
                </span>
                <span className="h-4 w-px shrink-0" style={{ background: T.hairline }} />
                <label className="flex items-center gap-1.5">
                  <span className="hidden sm:inline">Rows</span>
                  <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                    aria-label="Rows per page"
                    className="h-8 rounded-md border px-2 text-sm tabular-nums focus:outline-none focus-visible:ring-2"
                    style={{ borderColor: T.hairline, color: T.ink, background: T.surface, outlineColor: T.accent }}>
                    {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </label>
              </div>

              {/* zone 2 — navigation. Full width and justify-between when
                  stacked, so first/last hug the edges instead of floating. */}
              <nav aria-label="Pagination" className="flex items-center justify-between gap-1 lg:justify-end">
                <span className="flex items-center gap-1">
                  {/* first/last drop out below sm — lowest-frequency controls go first */}
                  <button onClick={() => setPage(1)} disabled={page === 1} aria-label="First page"
                    className="hidden h-8 w-8 items-center justify-center rounded-md border disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 sm:flex"
                    style={{ borderColor: T.hairline, color: page === 1 ? T.ink3 : T.ink2, opacity: page === 1 ? 0.5 : 1, outlineColor: T.accent }}>
                    <ChevronsLeft size={15} />
                  </button>
                  <button onClick={() => page > 1 && setPage(page - 1)} disabled={page === 1} aria-label="Previous page"
                    className="flex h-8 w-8 items-center justify-center rounded-md border disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2"
                    style={{ borderColor: T.hairline, color: page === 1 ? T.ink3 : T.ink2, opacity: page === 1 ? 0.5 : 1, outlineColor: T.accent }}>
                    <ChevronLeft size={15} />
                  </button>
                </span>

                {/* numbered buttons — md and up. Fixed 32px cells so the row
                    keeps a regular rhythm as digit counts change. */}
                <span className="hidden items-center gap-1 md:flex">
                  {pageList().map((p, i) =>
                    p === "…" ? (
                      jumpAt === i ? (
                        <input key={`j${i}`} autoFocus type="number" min={1} max={pages} defaultValue={page}
                          aria-label="Go to page"
                          onBlur={() => setJumpAt(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const v = Number(e.currentTarget.value);
                              if (v >= 1 && v <= pages) setPage(v);
                              setJumpAt(null);
                            }
                            if (e.key === "Escape") setJumpAt(null);
                          }}
                          className="h-8 w-14 rounded-md border px-1.5 text-center text-sm tabular-nums focus:outline-none focus-visible:ring-2"
                          style={{ borderColor: T.accent, color: T.ink, outlineColor: T.accent }} />
                      ) : (
                        <button key={`e${i}`} onClick={() => setJumpAt(i)} aria-label="Jump to a page"
                          className="h-8 w-8 rounded-md text-sm hover:bg-slate-100 focus:outline-none focus-visible:ring-2"
                          style={{ color: T.ink3, outlineColor: T.accent }} title="Jump to page">…</button>
                      )
                    ) : (
                      <button key={p} onClick={() => setPage(p)} aria-current={p === page ? "page" : undefined}
                        className="h-8 min-w-8 rounded-md border px-1.5 text-sm tabular-nums focus:outline-none focus-visible:ring-2"
                        style={p === page
                          ? { background: T.accent, borderColor: T.accent, color: "#fff", fontWeight: 500, outlineColor: T.accent }
                          : { borderColor: T.hairline, color: T.ink2, outlineColor: T.accent }}>
                        {p}
                      </button>
                    )
                  )}
                </span>

                {/* below md the numbered row is gone, so the indicator appears
                    here instead — never both at once */}
                <span className="text-sm tabular-nums md:hidden" style={{ color: T.ink2 }}>
                  Page <span style={{ color: T.ink, fontWeight: 500 }}>{page}</span> of {pages}
                </span>

                <span className="flex items-center gap-1">
                  <button onClick={() => page < pages && setPage(page + 1)} disabled={page === pages} aria-label="Next page"
                    className="flex h-8 w-8 items-center justify-center rounded-md border disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2"
                    style={{ borderColor: T.hairline, color: page === pages ? T.ink3 : T.ink2, opacity: page === pages ? 0.5 : 1, outlineColor: T.accent }}>
                    <ChevronRight size={15} />
                  </button>
                  <button onClick={() => setPage(pages)} disabled={page === pages} aria-label="Last page"
                    className="hidden h-8 w-8 items-center justify-center rounded-md border disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 sm:flex"
                    style={{ borderColor: T.hairline, color: page === pages ? T.ink3 : T.ink2, opacity: page === pages ? 0.5 : 1, outlineColor: T.accent }}>
                    <ChevronsRight size={15} />
                  </button>
                </span>
              </nav>
            </div>
          )}
        </div>

        {/* ── reference panels ────────────────────────────────── */}
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <div className="rounded-lg border p-5" style={{ borderColor: T.hairline, background: T.surface }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: T.ink2 }}>Row & control states</h2>
            <div className="mt-4 space-y-px overflow-hidden rounded-md border" style={{ borderColor: T.hairline }}>
              {[
                ["Row · default", "#fff", "cursor-pointer"],
                ["Row · hover", T.muted, "bg-muted · 120ms"],
                ["Row · focus-visible", "#fff", "inset ring-2 (outline clips)"],
                ["Row · selected", T.accentSoft, "+ 2px left bar"],
                ["Row · selected + hover", "#DCEAE6", "must stay distinct"],
                ["Row · in flight", "#fff", "opacity-60 · spinner · controls off"],
                ["Row · failed", T.roseSoft, "rose bar · inline Retry"],
                ["Row · deactivated", "#fff", "muted · limited kebab"],
                ["Row · refetching", "#fff", "opacity-50 · height kept"],
              ].map(([l, bg, note]) => (
                <div key={l} className="flex items-center justify-between gap-3 px-3 py-2 text-sm" style={{ background: bg }}>
                  <span className="font-medium" style={{ color: T.ink }}>{l}</span>
                  <span className="font-mono text-[10px]" style={{ color: T.ink2 }}>{note}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed" style={{ color: T.ink2 }}>
              Also needed on every interactive: hover, focus-visible, active, disabled, loading.
              Buttons keep their label and width while loading — a resizing button shifts the row.
            </p>
          </div>

          <div className="rounded-lg border p-5" style={{ borderColor: T.hairline, background: T.surface }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: T.ink2 }}>Table states</h2>
            <ol className="mt-4 space-y-2.5 text-xs leading-relaxed" style={{ color: T.ink2 }}>
              {[
                ["Loading — initial", "Skeleton rows matching per-page. Chrome stays. No spinner, no collapse."],
                ["Loading — refetch", "Existing rows dim, height preserved, 2px top progress bar."],
                ["Stale", "Data shown + banner. Never blank good data because a refresh failed."],
                ["Empty", "Nothing exists. Create CTA belongs here."],
                ["Empty — filtered", "Data exists. Clear-filters only; no create CTA."],
                ["Empty — search", "Shows the query + cross-status escape hatch."],
                ["Error — fetch", "Retry + reference code. Filters survive the retry."],
                ["Error — 403", "No Retry. Route to request access instead."],
                ["Offline", "Last-loaded data, actions disabled."],
                ["Slow", "After ~10s, explain and suggest narrowing."],
                ["Too many results", "Cap named up front, before Export fails."],
                ["Row — in flight", "Optimistic, scoped to the row, rest stays usable."],
                ["Row — failed", "Row-level error + what did NOT happen."],
              ].map(([t, d]) => (
                <li key={t}>
                  <span className="font-medium" style={{ color: T.ink }}>{t}</span> — {d}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg border p-5" style={{ borderColor: T.hairline, background: T.surface }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: T.ink2 }}>Type scale</h2>
            <div className="mt-4 divide-y" style={{ borderColor: T.hairline }}>
              {[
                ["Page title", "text-2xl / 600", "24"],
                ["Card value", "text-2xl / 600 / tabular", "24"],
                ["Table caption", "text-sm / 600", "14"],
                ["Caption sub-line", "text-xs / 400", "12"],
                ["Tab label", "text-sm / 500", "14"],
                ["Column header", "text-xs / 500 / uppercase", "12"],
                ["Cell — primary", "text-sm / 500", "14"],
                ["Cell — secondary", "text-xs / 400", "12"],
                ["Cell — numeric", "text-sm / tabular-nums", "14"],
                ["Card label", "text-xs / 500 / uppercase", "12"],
                ["Badge", "text-xs / 500", "12"],
                ["Pagination", "text-sm / tabular-nums", "14"],
                ["Empty heading", "text-base / 500", "16"],
                ["Spec / ref codes", "font-mono / 11px", "11"],
              ].map(([role, spec, px]) => (
                <div key={role} className="flex items-baseline justify-between gap-2 py-1.5">
                  <span className="text-xs font-medium" style={{ color: T.ink }}>{role}</span>
                  <span className="flex-1 border-b border-dotted" style={{ borderColor: T.hairline }} />
                  <span className="font-mono text-[10px]" style={{ color: T.ink2 }}>{spec}</span>
                  <span className="w-5 text-right font-mono text-[10px] tabular-nums" style={{ color: T.ink3 }}>{px}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PRE-FLIGHT DIALOG ──────────────────────────────────
          States what WILL happen, not "are you sure". Discloses skips
          before execution. Friction scales with the number affected. */}
      {pending && (() => {
        const t = preflight();
        const mode = frictionFor(t.eligible);
        const verb = { suspend: "Suspend", role: "Change role for", mfa: "Require MFA for" }[pending];
        const destructive = pending === "suspend";
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(21,23,28,.45)" }}
            onClick={() => { setPending(null); setConfirmText(""); }}>
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
              <div className="px-5 pb-4 pt-5">
                <h3 className="text-base font-semibold" style={{ color: T.ink }}>
                  {verb} {t.eligible.toLocaleString()} {t.eligible === 1 ? "user" : "users"}?
                </h3>

                <ul className="mt-3 space-y-1.5 text-sm" style={{ color: T.ink2 }}>
                  <li className="flex gap-2">
                    <CheckIcon size={15} className="mt-0.5 shrink-0" style={{ color: T.accent }} />
                    <span>
                      <span className="font-medium tabular-nums" style={{ color: T.ink }}>{t.eligible.toLocaleString()}</span>{" "}
                      {destructive ? "will lose access immediately and be signed out of all sessions." : "will be updated on their next sign-in."}
                    </span>
                  </li>
                  {t.skipSelf > 0 && (
                    <li className="flex gap-2">
                      <X size={15} className="mt-0.5 shrink-0" style={{ color: T.ink3 }} />
                      <span><span className="font-medium" style={{ color: T.ink }}>1 skipped</span> — you can't {destructive ? "suspend" : "modify"} your own account.</span>
                    </li>
                  )}
                  {t.skipAlready > 0 && (
                    <li className="flex gap-2">
                      <X size={15} className="mt-0.5 shrink-0" style={{ color: T.ink3 }} />
                      <span><span className="font-medium tabular-nums" style={{ color: T.ink }}>{t.skipAlready} skipped</span> — already suspended.</span>
                    </li>
                  )}
                  {destructive && (
                    <li className="flex gap-2">
                      <AlertTriangle size={15} className="mt-0.5 shrink-0" style={{ color: T.amber }} />
                      <span>Pending approvals authored by these users will be returned to their originators.</span>
                    </li>
                  )}
                </ul>

                <p className="mt-3 rounded-md px-3 py-2 font-mono text-[11px] leading-relaxed" style={{ background: T.muted, color: T.ink2 }}>
                  Writes {t.eligible.toLocaleString()} audit entries under one batch reference — not a single
                  "bulk update" record. Reversible from the Deactivated tab.
                </p>

                {mode === "type" && (
                  <label className="mt-4 block text-sm" style={{ color: T.ink2 }}>
                    This affects more than 200 accounts. Type <span className="font-semibold tabular-nums" style={{ color: T.ink }}>{t.eligible.toLocaleString()}</span> to confirm.
                    <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} autoFocus
                      className="mt-1.5 h-9 w-full rounded-md border px-2.5 text-sm tabular-nums focus:outline-none focus-visible:ring-2"
                      style={{ borderColor: T.hairline, color: T.ink, outlineColor: T.accent }} />
                  </label>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t px-5 py-3" style={{ borderColor: T.hairline, background: T.bg }}>
                <button onClick={() => { setPending(null); setConfirmText(""); }}
                  className="h-9 rounded-md border bg-white px-3.5 text-sm font-medium" style={{ borderColor: T.hairline, color: T.ink }}>
                  Cancel
                </button>
                <button onClick={runBulk}
                  disabled={mode === "type" && confirmText.replace(/,/g, "") !== String(t.eligible)}
                  className="h-9 rounded-md px-3.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ background: destructive ? T.rose : T.accent }}>
                  {/* the button states the outcome and the count — never just "Confirm" */}
                  {verb} {t.eligible.toLocaleString()}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── PARTIAL-FAILURE REPORT ─────────────────────────────
          Bulk work is not atomic. Never a success toast for a mixed result. */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(21,23,28,.45)" }}
          onClick={() => setResult(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="px-5 pb-4 pt-5">
              <h3 className="text-base font-semibold" style={{ color: T.ink }}>
                {result.failed > 0 ? "Finished with errors" : "Done"}
              </h3>
              <div className="mt-3 space-y-1.5 text-sm">
                <p className="flex items-center gap-2" style={{ color: T.ink2 }}>
                  <CheckIcon size={15} style={{ color: T.accent }} />
                  <span><span className="font-medium tabular-nums" style={{ color: T.ink }}>{result.ok.toLocaleString()}</span> succeeded</span>
                </p>
                {result.failed > 0 && (
                  <p className="flex items-center gap-2" style={{ color: T.rose }}>
                    <AlertTriangle size={15} />
                    <span><span className="font-medium tabular-nums">{result.failed.toLocaleString()}</span> failed — left selected so you can retry</span>
                  </p>
                )}
                {result.skipped > 0 && (
                  <p className="flex items-center gap-2" style={{ color: T.ink3 }}>
                    <X size={15} />
                    <span><span className="font-medium tabular-nums">{result.skipped}</span> skipped as listed</span>
                  </p>
                )}
              </div>
              <p className="mt-3 font-mono text-[11px]" style={{ color: T.ink3 }}>
                Batch {result.batch} · {result.ok.toLocaleString()} audit entries written
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t px-5 py-3" style={{ borderColor: T.hairline, background: T.bg }}>
              {result.failed > 0 && (
                <button className="h-9 rounded-md border bg-white px-3.5 text-sm font-medium" style={{ borderColor: T.hairline, color: T.ink }}>
                  Retry {result.failed.toLocaleString()} failed
                </button>
              )}
              <button onClick={() => setResult(null)} className="h-9 rounded-md px-3.5 text-sm font-medium text-white" style={{ background: T.accent }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
